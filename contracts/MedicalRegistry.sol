// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract MedicalRegistry {
    
    struct RecordStruct {
        string ipfsHash;
        uint256 timestamp;
        string recordType;
    }
    
    // Mapping from patient address to their list of records
    mapping(address => RecordStruct[]) private patientRecords;
    
    // Access Control List: patient => doctor => hasAccess
    mapping(address => mapping(address => bool)) private doctorAccess;
    
    address public owner;

    constructor() {
        owner = msg.sender;
    }

    // Events
    event RecordAdded(address indexed patient, string ipfsHash, string recordType);
    event AccessGranted(address indexed patient, address indexed doctor);
    event AccessRevoked(address indexed patient, address indexed doctor);
    
    // Modifier to check if caller is the patient or an authorized doctor or the backend owner
    modifier onlyAuthorized(address _patient) {
        require(
            msg.sender == _patient || doctorAccess[_patient][msg.sender] || msg.sender == owner,
            "Not authorized to view these records"
        );
        _;
    }
    
    // Add a new record
    function addRecord(address _patient, string memory _ipfsHash, string memory _recordType) public onlyAuthorized(_patient) {
        patientRecords[_patient].push(RecordStruct({
            ipfsHash: _ipfsHash,
            timestamp: block.timestamp,
            recordType: _recordType
        }));
        emit RecordAdded(_patient, _ipfsHash, _recordType);
    }
    
    // Grant access to a doctor (only the caller/patient can grant access to their own records)
    function grantAccess(address _doctor) public {
        require(_doctor != address(0), "Invalid doctor address");
        doctorAccess[msg.sender][_doctor] = true;
        emit AccessGranted(msg.sender, _doctor);
    }
    
    // Revoke access from a doctor
    function revokeAccess(address _doctor) public {
        doctorAccess[msg.sender][_doctor] = false;
        emit AccessRevoked(msg.sender, _doctor);
    }
    
    // Get records for a patient
    function getRecords(address _patient) public view onlyAuthorized(_patient) returns (RecordStruct[] memory) {
        return patientRecords[_patient];
    }
    
    // Check if a doctor has access to a patient's records
    function checkAccess(address _patient, address _doctor) public view returns (bool) {
        return doctorAccess[_patient][_doctor];
    }
}
