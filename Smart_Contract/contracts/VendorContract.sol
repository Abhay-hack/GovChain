// SPDX-License-Identifier: MIT
pragma solidity 0.8.20; // Specific version as requested

contract VendorContract {
    struct Vendor {
        address vendorAddr;
        string legalCertHash; // IPFS hash
        string[] certHashes;  // IPFS hashes for other certs
        uint16 workload;      // Hours/week
        bool isBlacklisted;
    }

    // Mapping of vendor addresses to their data
    mapping(address => Vendor) public vendors; // vendorAddress => Vendor
    address public admin;

    event VendorRegistered(address indexed vendor, string legalCertHash);
    event VendorWorkloadUpdated(address indexed vendor, uint16 workload);
    event VendorBlacklisted(address vendor, address indexed caller);
    event VendorUnblacklisted(address vendor, address indexed caller);
    event AdminChanged(address indexed previousAdmin, address indexed newAdmin);

    constructor() payable {
        admin = msg.sender;
    }

    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin"); // Explicit access control for sensitive functions
        _;
    }

    function registerVendor(string calldata _legalCertHash, string[] calldata _certHashes) external {
        Vendor storage vendor = vendors[msg.sender];
        require(vendor.vendorAddr == address(0), "Regd");
        require(_certHashes.length < 11, "Too many certs"); // Explicit cap to limit gas usage
        vendor.vendorAddr = msg.sender;
        vendor.legalCertHash = _legalCertHash;
        uint256 len = _certHashes.length; // Cache array length
        for (uint256 i; i < len; ) { // Optimized loop
            vendor.certHashes.push(_certHashes[i]);
            unchecked { ++i; } // Unchecked pre-increment
        }
        vendor.workload = 0;
        vendor.isBlacklisted = false;
        emit VendorRegistered(msg.sender, _legalCertHash);
    }

    function updateWorkload(uint16 _workload) external {
        Vendor storage vendor = vendors[msg.sender];
        require(vendor.vendorAddr != address(0), "Not regd");
        require(_workload < 169, "Too much");
        vendor.workload = _workload;
        emit VendorWorkloadUpdated(msg.sender, _workload);
    }

    function blacklistVendor(address _vendor) external onlyAdmin {
        Vendor storage vendor = vendors[_vendor];
        require(vendor.vendorAddr != address(0), "Not regd");
        require(!vendor.isBlacklisted, "Already bl");
        vendor.isBlacklisted = true;
        emit VendorBlacklisted(_vendor, msg.sender);
    }

    function unblacklistVendor(address _vendor) external onlyAdmin {
        Vendor storage vendor = vendors[_vendor];
        require(vendor.vendorAddr != address(0), "Not regd");
        require(vendor.isBlacklisted, "Not bl");
        vendor.isBlacklisted = false;
        emit VendorUnblacklisted(_vendor, msg.sender);
    }

    function getVendor(address _vendorAddress) external view returns (Vendor memory) {
        return vendors[_vendorAddress];
    }

    function changeAdmin(address _newAdmin) external onlyAdmin {
        require(_newAdmin != address(0), "Inv admin");
        address oldAdmin = admin; // Cache admin to avoid multiple SLOADs
        if (oldAdmin != _newAdmin) { // Check before storing to avoid redundant writes
            admin = _newAdmin;
            emit AdminChanged(oldAdmin, _newAdmin);
        }
    }
}