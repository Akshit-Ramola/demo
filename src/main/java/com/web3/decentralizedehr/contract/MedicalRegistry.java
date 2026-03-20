package com.web3.decentralizedehr.contract;

import org.web3j.abi.TypeReference;
import org.web3j.abi.datatypes.Address;
import org.web3j.abi.datatypes.DynamicArray;
import org.web3j.abi.datatypes.Function;
import org.web3j.abi.datatypes.Type;
import org.web3j.abi.datatypes.Utf8String;
import org.web3j.crypto.Credentials;
import org.web3j.protocol.Web3j;
import org.web3j.protocol.core.RemoteFunctionCall;
import org.web3j.protocol.core.methods.response.TransactionReceipt;
import org.web3j.tx.Contract;
import org.web3j.tx.gas.ContractGasProvider;

import java.math.BigInteger;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;

/**
 * Auto-generated style Web3j wrapper for MedicalRegistry.
 * Note: For production, it's recommended to compile the .sol file to .bin and
 * .abi,
 * and use the Web3j CLI: `web3j generate solidity -b MedicalRegistry.bin -a
 * MedicalRegistry.abi -o . -p com.web3.decentralizedehr.contract`
 */
public class MedicalRegistry extends Contract {
    public static final String BINARY = "0x..."; // Replace with actual compiled bytecode
    public static final String FUNC_ADDRECORD = "addRecord";
    public static final String FUNC_GETRECORDS = "getRecords";

    protected MedicalRegistry(String contractAddress, Web3j web3j, Credentials credentials,
            ContractGasProvider contractGasProvider) {
        super(BINARY, contractAddress, web3j, credentials, contractGasProvider);
    }

    public RemoteFunctionCall<TransactionReceipt> addRecord(String _patient, String _ipfsHash, String _recordType) {
        final Function function = new Function(
                FUNC_ADDRECORD,
                Arrays.<Type>asList(new Address(160, _patient),
                        new Utf8String(_ipfsHash),
                        new Utf8String(_recordType)),
                Collections.<TypeReference<?>>emptyList());
        return executeRemoteCallTransaction(function);
    }

    @SuppressWarnings("unchecked")
    public RemoteFunctionCall<List<RecordStruct>> getRecords(String _patient) {
        final Function function = new Function(FUNC_GETRECORDS,
                Arrays.<Type>asList(new Address(160, _patient)),
                Arrays.<TypeReference<?>>asList(new TypeReference<DynamicArray<RecordStruct>>() {
                }));
        return new RemoteFunctionCall<List<RecordStruct>>(function,
                () -> (List<RecordStruct>) executeRemoteCallSingleValueReturn(function, List.class));
    }

    public static MedicalRegistry load(String contractAddress, Web3j web3j, Credentials credentials,
            ContractGasProvider contractGasProvider) {
        return new MedicalRegistry(contractAddress, web3j, credentials, contractGasProvider);
    }

    public static class RecordStruct extends org.web3j.abi.datatypes.StaticStruct {
        public String ipfsHash;
        public BigInteger timestamp;
        public String recordType;

        public RecordStruct(String ipfsHash, BigInteger timestamp, String recordType) {
            super(new Utf8String(ipfsHash), new org.web3j.abi.datatypes.generated.Uint256(timestamp),
                    new Utf8String(recordType));
            this.ipfsHash = ipfsHash;
            this.timestamp = timestamp;
            this.recordType = recordType;
        }
    }
}
