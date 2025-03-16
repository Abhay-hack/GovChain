// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import "./TenderContract.sol";

contract PaymentContract {
    address public admin;
    mapping(uint32 tenderId => uint32) public tenderFunds;
    uint256 public penaltyRate = 5;
    bool private _locked;

    event TenderFunded(uint32 indexed tenderId, uint32 amount);
    event PaymentReleased(uint32 indexed tenderId, address indexed vendor, uint32 amount);
    event PenaltyApplied(uint32 indexed tenderId, uint8 indexed milestoneId, uint32 amount);
    event AdminChanged(address indexed previousAdmin, address indexed newAdmin);
    event PenaltyRateChanged(uint256 indexed previousRate, uint256 indexed newRate);

    constructor() payable {
        admin = msg.sender;
        if (msg.value != 0) {
            tenderFunds[0] += uint32(msg.value);
            emit TenderFunded(0, uint32(msg.value));
        }
    }

    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin");
        _;
    }

    modifier nonReentrant() {
        require(!_locked, "Reentrant call");
        _locked = true;
        _;
        _locked = false;
    }

    function fundTender(uint32 _tenderId) external payable {
        require(msg.value != 0, "No funds sent");
        uint32 amount = uint32(msg.value);
        unchecked {
            tenderFunds[_tenderId] += amount;
        }
        emit TenderFunded(_tenderId, amount);
    }

    function releasePartialPayment(uint32 _tenderId, address payable _vendor, uint32 _amount)
        external
        nonReentrant
        onlyAdmin
    {
        require(_vendor != address(0), "Invalid vendor address");
        require(_amount != 0, "Amount must be nonzero");
        uint32 funds = tenderFunds[_tenderId];
        require(funds > _amount, "Insufficient funds");
        unchecked {
            tenderFunds[_tenderId] = funds - _amount;
        }
        (bool success, ) = _vendor.call{value: _amount}("");
        require(success, "Payment failed");
        emit PaymentReleased(_tenderId, _vendor, _amount);
    }

    function applyPenalty(uint32 _tenderId, uint8 _milestoneId, address payable _tenderContract)
        external
        onlyAdmin
    {
        require(_tenderContract.code.length > 0, "Invalid TenderContract address");
        TenderContract tc = TenderContract(_tenderContract);
        TenderContract.Milestone memory m = tc.getMilestone(_tenderId, _milestoneId);
        require(block.timestamp > m.deadline, "Deadline not passed");
        require(!m.completed, "Milestone already completed");
        uint32 penalty = uint32((m.amount * penaltyRate) / 100);
        require(penalty != 0, "Penalty too small");
        uint32 funds = tenderFunds[_tenderId];
        require(funds > penalty, "Insufficient funds");
        unchecked {
            tenderFunds[_tenderId] = funds - penalty;
        }
        emit PenaltyApplied(_tenderId, _milestoneId, penalty);
    }

    function getTenderFunds(uint32 _tenderId) external view returns (uint32) {
        return tenderFunds[_tenderId];
    }

    function changeAdmin(address _newAdmin) external onlyAdmin {
        require(_newAdmin != address(0), "Invalid admin address");
        address currentAdmin = admin;
        if (currentAdmin != _newAdmin) {
            admin = _newAdmin;
            emit AdminChanged(currentAdmin, _newAdmin);
        }
    }

    function changePenaltyRate(uint256 _newRate) external onlyAdmin {
        require(_newRate < 101, "Rate exceeds 100%");
        uint256 currentRate = penaltyRate;
        if (currentRate != _newRate) {
            penaltyRate = _newRate;
            emit PenaltyRateChanged(currentRate, _newRate);
        }
    }

    receive() external payable {
        if (msg.value != 0) {
            tenderFunds[0] += uint32(msg.value);
            emit TenderFunded(0, uint32(msg.value));
        }
    }

    fallback() external payable {
        if (msg.value != 0) {
            tenderFunds[0] += uint32(msg.value);
            emit TenderFunded(0, uint32(msg.value));
        }
    }
}