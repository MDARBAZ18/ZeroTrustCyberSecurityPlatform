// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract ZeroTrustIAM {
    // Structs
    struct Event {
        string eventType;
        address addr;
        uint256 timestamp;
        string data;
        string severity;
    }

    struct Anomaly {
        uint256 id;
        address addr;
        uint256 timestamp;
        string anomalyType;
        string severity;
        string description;
        bool mitigated;
    }

    struct AuditLog {
        uint256 id;
        address addr;
        string action;
        uint256 timestamp;
        string details;
    }

    struct User {
        address addr;
        string role;
        bool registered;
        uint256 lastActivity;
        bool mfaVerified;
    }

    // State variables
    mapping(address => User) public users;
    mapping(address => bool) public admins;
    Event[] public events;
    Anomaly[] public anomalies;
    AuditLog[] public auditLogs;
    address[] public userAddresses;

    // Events
    event UserRegistered(address indexed user, string role);
    event RoleAssigned(address indexed user, string oldRole, string newRole);
    event MFAVerified(address indexed user, bool success);
    event AnomalyDetected(uint256 indexed id, address indexed user, string anomalyType);

    constructor() {
        admins[msg.sender] = true;
        userAddresses.push(msg.sender);
        users[msg.sender] = User(msg.sender, "Admin", true, block.timestamp, true);
    }

    // Modifiers
    modifier onlyAdmin() {
        require(admins[msg.sender], "Only admin can call this function");
        _;
    }

    // User Management Functions
    function registerUser(address _user, string memory _role) public onlyAdmin {
        require(!users[_user].registered, "User already registered");
        users[_user] = User(_user, _role, true, block.timestamp, false);
        userAddresses.push(_user);
        
        events.push(Event(
            "UserRegistered",
            _user,
            block.timestamp,
            string(abi.encodePacked('{"role":"', _role, '"}')),
            "low"
        ));
        
        emit UserRegistered(_user, _role);
    }

    function assignRole(address _user, string memory _newRole) public onlyAdmin {
        require(users[_user].registered, "User not registered");
        string memory oldRole = users[_user].role;
        users[_user].role = _newRole;
        users[_user].lastActivity = block.timestamp;
        
        events.push(Event(
            "RoleAssigned",
            _user,
            block.timestamp,
            string(abi.encodePacked('{"oldRole":"', oldRole, '","newRole":"', _newRole, '"}')),
            "medium"
        ));
        
        emit RoleAssigned(_user, oldRole, _newRole);
    }

    function verifyMFA(address _user) public {
        require(users[_user].registered, "User not registered");
        bool success = true; // In real implementation, this would verify MFA
        users[_user].mfaVerified = success;
        users[_user].lastActivity = block.timestamp;
        
        events.push(Event(
            "MFAVerified",
            _user,
            block.timestamp,
            string(abi.encodePacked('{"success":', success ? "true" : "false", "}")),
            success ? "low" : "high"
        ));
        
        emit MFAVerified(_user, success);
    }

    // Data Access Functions
    function getEvents() public view returns (Event[] memory) {
        return events;
    }

    function getAnomalies() public view returns (Anomaly[] memory) {
        return anomalies;
    }

    function getAuditLogs() public view returns (AuditLog[] memory) {
        return auditLogs;
    }

    function getUsers() public view returns (User[] memory) {
        User[] memory allUsers = new User[](userAddresses.length);
        for (uint i = 0; i < userAddresses.length; i++) {
            allUsers[i] = users[userAddresses[i]];
        }
        return allUsers;
    }

    // Anomaly Management
    function reportAnomaly(
        address _user,
        string memory _anomalyType,
        string memory _severity,
        string memory _description
    ) public onlyAdmin {
        uint256 anomalyId = anomalies.length;
        anomalies.push(Anomaly(
            anomalyId,
            _user,
            block.timestamp,
            _anomalyType,
            _severity,
            _description,
            false
        ));
        
        emit AnomalyDetected(anomalyId, _user, _anomalyType);
    }

    function mitigateAnomaly(uint256 _anomalyId) public onlyAdmin {
        require(_anomalyId < anomalies.length, "Invalid anomaly ID");
        anomalies[_anomalyId].mitigated = true;
        
        auditLogs.push(AuditLog(
            auditLogs.length,
            msg.sender,
            "Anomaly Mitigated",
            block.timestamp,
            string(abi.encodePacked('{"anomalyId":', _anomalyId, '}'))
        ));
    }

    // Audit Logging
    function logAction(string memory _action, string memory _details) public {
        require(users[msg.sender].registered, "User not registered");
        auditLogs.push(AuditLog(
            auditLogs.length,
            msg.sender,
            _action,
            block.timestamp,
            _details
        ));
    }
}