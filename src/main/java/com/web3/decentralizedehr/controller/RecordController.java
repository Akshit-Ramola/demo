package com.web3.decentralizedehr.controller;

import com.web3.decentralizedehr.service.BlockchainService;
import com.web3.decentralizedehr.service.IPFSService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.Map;

@RestController
@RequestMapping("/api/records")
@RequiredArgsConstructor
public class RecordController {

    private final BlockchainService blockchainService;
    private final IPFSService ipfsService;

    @PostMapping("/upload")
    public ResponseEntity<?> uploadRecord(
            @RequestParam("file") MultipartFile file,
            @RequestParam("patientAddress") String patientAddress,
            @RequestParam("recordType") String recordType) {
        try {
            // 1. Encrypt file (AES-256) and Upload to IPFS via Pinata
            String ipfsHash = ipfsService.encryptAndUpload(file);
            
            // 2. Add Hash & Metadata to the Polygon/Local Blockchain
            String txHash = blockchainService.addRecord(patientAddress, ipfsHash, recordType);
            
            return ResponseEntity.ok(Map.of(
                    "message", "EHR Record encrypted and saved successfully",
                    "ipfsHash", ipfsHash,
                    "transactionHash", txHash
            ));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/{patientAddress}")
    public ResponseEntity<?> getRecords(@PathVariable String patientAddress) {
        try {
            // Permission check happens inherently inside BlockchainService/Smart Contract
            var records = blockchainService.getPatientRecords(patientAddress);
            return ResponseEntity.ok(records);
        } catch (Exception e) {
            // Web3j typically wraps contract revert errors
            return ResponseEntity.status(403).body(Map.of(
                    "error", "Access Denied or Not Authorized",
                    "details", e.getMessage()
            ));
        }
    }
}
