package com.web3.decentralizedehr.service;

import com.web3.decentralizedehr.contract.MedicalRegistry;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.web3j.crypto.Credentials;
import org.web3j.protocol.Web3j;
import org.web3j.protocol.core.methods.response.TransactionReceipt;
import org.web3j.protocol.http.HttpService;
import org.web3j.tx.gas.DefaultGasProvider;

import jakarta.annotation.PostConstruct;
import java.util.List;

@Service
public class BlockchainService {
    
    @Value("${web3j.client-address:http://127.0.0.1:8545}") // Default Ganache/Hardhat RPC URL
    private String rpcUrl;
    
    @Value("${contract.address}")
    private String contractAddress;
    
    @Value("${wallet.private-key}")
    private String privateKey;
    
    private Web3j web3j;
    private MedicalRegistry medicalRegistry;
    
    @PostConstruct
    public void init() {
        // Connect to the local Hardhat/Ganache provider
        this.web3j = Web3j.build(new HttpService(rpcUrl));
        
        // Load the caller's wallet (Backend wallet handling the transactions)
        Credentials credentials = Credentials.create(privateKey);
        
        // Load the Smart Contract Wrapper
        this.medicalRegistry = MedicalRegistry.load(contractAddress, web3j, credentials, new DefaultGasProvider());
    }
    
    public String addRecord(String patientAddress, String ipfsHash, String recordType) throws Exception {
        // Call the addRecord function on the blockchain
        TransactionReceipt receipt = medicalRegistry.addRecord(patientAddress, ipfsHash, recordType).send();
        return receipt.getTransactionHash();
    }
    
    public List<MedicalRegistry.RecordStruct> getPatientRecords(String patientAddress) throws Exception {
        // The contract's onlyAuthorized modifier automatically throws an exception if the
        // caller (msg.sender - our configured privateKey wallet) lacks permission.
        return medicalRegistry.getRecords(patientAddress).send();
    }
}
