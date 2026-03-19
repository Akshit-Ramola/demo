import React, { createContext, useState } from 'react';
import Web3 from 'web3';

export const Web3Context = createContext();

export const Web3Provider = ({ children }) => {
    const [account, setAccount] = useState('');
    const [web3, setWeb3] = useState(null);
    const [contract, setContract] = useState(null);

    const connectWallet = async () => {
        if (window.ethereum) {
            try {
                const web3Instance = new Web3(window.ethereum);
                await window.ethereum.request({ method: 'eth_requestAccounts' });
                const accounts = await web3Instance.eth.getAccounts();
                setAccount(accounts[0]);
                setWeb3(web3Instance);
                
                // Boilerplate Smart Contract setup
                const contractABI = [
                    {
                        "inputs": [
                            {"internalType": "address","name": "_doctor","type": "address"}
                        ],
                        "name": "grantAccess",
                        "outputs": [],
                        "stateMutability": "nonpayable",
                        "type": "function"
                    },
                    {
                        "inputs": [
                            {"internalType": "address","name": "_doctor","type": "address"}
                        ],
                        "name": "revokeAccess",
                        "outputs": [],
                        "stateMutability": "nonpayable",
                        "type": "function"
                    }
                ];
                
                // Address from Hardhat deployment
                const contractAddress = "0xYOUR_SMART_CONTRACT_ADDRESS_HERE";
                const contractInstance = new web3Instance.eth.Contract(contractABI, contractAddress);
                setContract(contractInstance);
            } catch (error) {
                console.error("User denied account access", error);
            }
        } else {
            alert("No Web3 Provider detected. Please install MetaMask!");
        }
    };

    return (
        <Web3Context.Provider value={{ account, web3, contract, connectWallet }}>
            {children}
        </Web3Context.Provider>
    );
};
