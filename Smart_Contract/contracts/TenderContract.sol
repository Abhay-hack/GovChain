// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

contract TenderContract {
    struct Tender {
        uint32 id;
        uint32 budget;
        uint32 deadline;
        address employer;
        address winner;
        string descriptionHash;
        string[] requiredCerts;
        bool isOpen;
        uint8 milestoneCount;
    }

    struct Milestone {
        uint32 deadline;
        uint32 amount;
        string description;
        string proofHash;
        bool completed;
        bool penaltyApplied;
    }

    struct TenderWithoutMilestones {
        uint32 id;
        uint32 budget;
        uint32 deadline;
        address employer;
        address winner;
        string descriptionHash;
        string[] requiredCerts;
        bool isOpen;
        uint8 milestoneCount;
    }

    mapping(uint32 tenderId => Tender) public tenders;
    mapping(uint32 tenderId => mapping(uint32 milestoneId => Milestone)) public milestones;
    uint32 public tenderCount;

    event TenderCreated(uint32 indexed tenderId, address indexed employer);
    event BidSubmitted(uint32 indexed tenderId, address indexed vendor, uint32 amount);
    event MilestoneReported(uint32 indexed tenderId, uint8 indexed milestoneId, string proofHash);
    event TenderUpdated(uint32 indexed tenderId);
    event TenderAwarded(uint32 indexed tenderId, address indexed winner);
    event MilestoneCompleted(uint32 indexed tenderId, uint8 indexed milestoneId);
    event TenderClosed(uint32 indexed tenderId);
    event MilestoneAdded(uint32 indexed tenderId, uint8 indexed milestoneId);

    modifier onlyEmployer(uint32 _tenderId) {
        require(tenders[_tenderId].employer == msg.sender, "Only employer");
        _;
    }

    function createTender(
        string calldata _descriptionHash,
        uint32 _budget,
        uint32 _deadline,
        string[] calldata _requiredCerts
    ) external {
        require(_budget != 0, "Budget must be > 0");
        tenderCount++;
        Tender storage t = tenders[tenderCount];
        t.id = tenderCount;
        t.employer = msg.sender;
        t.descriptionHash = _descriptionHash;
        t.budget = _budget;
        t.deadline = _deadline;
        uint256 len = _requiredCerts.length;
        require(len < 11, "Too many certs");
        unchecked {
            for (uint256 i = 0; i < len; ++i) {
                t.requiredCerts.push(_requiredCerts[i]);
            }
        }
        t.isOpen = true;
        emit TenderCreated(tenderCount, msg.sender);
    }

    function submitBid(uint32 _tenderId, uint32 _amount) external {
        Tender storage t = tenders[_tenderId];
        require(t.id == _tenderId, "Tender not found");
        require(t.isOpen, "Tender closed");
        require(_amount != 0, "Bid must be > 0");
        emit BidSubmitted(_tenderId, msg.sender, _amount);
    }

    function awardTender(uint32 _tenderId, address _winner) external onlyEmployer(_tenderId) {
        Tender storage t = tenders[_tenderId];
        require(t.isOpen, "Tender closed");
        t.winner = _winner;
        t.isOpen = false;
        emit TenderAwarded(_tenderId, _winner);
    }

    function addMilestone(
        uint32 _tenderId,
        string calldata _description,
        uint32 _deadline,
        uint32 _amount
    ) external onlyEmployer(_tenderId) {
        Tender storage t = tenders[_tenderId];
        require(t.budget > _amount, "Exceeds budget");
        t.milestoneCount++;
        Milestone storage m = milestones[_tenderId][t.milestoneCount];
        m.description = _description;
        m.proofHash = "";
        m.deadline = _deadline;
        m.amount = _amount;
        m.completed = false;
        m.penaltyApplied = false;
        emit MilestoneAdded(_tenderId, t.milestoneCount);
    }

    function reportProgress(uint32 _tenderId, uint8 _milestoneId, string calldata _proofHash) external {
        Tender storage t = tenders[_tenderId];
        require(t.winner == msg.sender, "Only winner");
        require(_milestoneId < t.milestoneCount + 1, "Invalid milestone ID");
        require(_milestoneId != 0, "Invalid milestone ID");
        Milestone storage m = milestones[_tenderId][_milestoneId];
        require(!m.completed, "Already completed");
        m.proofHash = _proofHash;
        emit MilestoneReported(_tenderId, _milestoneId, _proofHash);
    }

    function completeMilestone(uint32 _tenderId, uint8 _milestoneId) external onlyEmployer(_tenderId) {
        Tender storage t = tenders[_tenderId];
        require(_milestoneId < t.milestoneCount + 1, "Invalid milestone ID");
        require(_milestoneId != 0, "Invalid milestone ID");
        Milestone storage m = milestones[_tenderId][_milestoneId];
        require(!m.completed, "Already completed");
        m.completed = true;
        emit MilestoneCompleted(_tenderId, _milestoneId);
    }

    function updateTender(
        uint32 _tenderId,
        string calldata _descriptionHash,
        uint32 _deadline,
        string[] calldata _requiredCerts
    ) external onlyEmployer(_tenderId) {
        Tender storage t = tenders[_tenderId];
        t.descriptionHash = _descriptionHash;
        t.deadline = _deadline;
        uint256 len = _requiredCerts.length;
        require(len < 11, "Too many certs");
        t.requiredCerts = new string[](len);
        unchecked {
            for (uint256 i = 0; i < len; ++i) {
                t.requiredCerts[i] = _requiredCerts[i];
            }
        }
        emit TenderUpdated(_tenderId);
    }

    function closeTender(uint32 _tenderId) external onlyEmployer(_tenderId) {
        Tender storage t = tenders[_tenderId];
        require(t.isOpen, "Already closed");
        t.isOpen = false;
        emit TenderClosed(_tenderId);
    }

    function getTender(uint32 _tenderId) external view returns (TenderWithoutMilestones memory result) {
        Tender storage t = tenders[_tenderId];
        result.id = t.id;
        result.employer = t.employer;
        result.descriptionHash = t.descriptionHash;
        result.budget = t.budget;
        result.deadline = t.deadline;
        result.requiredCerts = t.requiredCerts;
        result.winner = t.winner;
        result.isOpen = t.isOpen;
        result.milestoneCount = t.milestoneCount;
    }

    function getMilestone(uint32 _tenderId, uint8 _milestoneId) external view returns (Milestone memory) {
        require(_milestoneId < tenders[_tenderId].milestoneCount + 1, "Invalid milestone ID");
        require(_milestoneId != 0, "Invalid milestone ID");
        return milestones[_tenderId][_milestoneId];
    }

    function getTenderCount() external view returns (uint32) {
        return tenderCount;
    }

    receive() external payable {}
    fallback() external payable {}
}