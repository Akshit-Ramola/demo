import React, { useContext, useState, useEffect } from 'react';
import { Web3Context } from './Web3Context';
import axios from 'axios';

const PatientDashboard = () => {
    const { account, contract } = useContext(Web3Context);
    const [records, setRecords] = useState([]);

    // In a real dApp, access requests might be stored in a traditional DB or via off-chain IPFS notifications.
    const [requests, setRequests] = useState([
        { id: 1, doctorAddress: "0x123DoctorMockAddress456def789" }
    ]);

    useEffect(() => {
        if (account) {
            fetchRecords();
        }
    }, [account]);

    const fetchRecords = async () => {
        try {
            const res = await axios.get(`http://localhost:8080/api/records/${account}`);
            setRecords(res.data);
        } catch (error) {
            console.error("Error fetching patient records:", error);
        }
    };

    const handleGrantAccess = async (doctorAddr) => {
        if (!contract) return alert("Contract not loaded");
        try {
            await contract.methods.grantAccess(doctorAddr).send({ from: account });
            alert(`Smart Contract Tx Success: Access Granted to ${doctorAddr}`);
            setRequests(requests.filter(req => req.doctorAddress !== doctorAddr));
        } catch (error) {
            console.error(error);
            alert("Transaction failed or was rejected.");
        }
    };

    const handleRejectAccess = (doctorAddr) => {
        setRequests(requests.filter(req => req.doctorAddress !== doctorAddr));
        alert("Access request discarded.");
    };

    return (
        <div className="bg-white shadow rounded-lg p-6 mt-6">
            <h2 className="text-2xl font-bold mb-2">Patient Dashboard</h2>
            <p className="text-gray-600 mb-6 font-mono text-sm">Account: {account}</p>

            <div className="mb-8">
                <h3 className="text-xl font-semibold mb-3 border-b pb-2">My Health Records</h3>
                {records.length > 0 ? (
                    <ul className="space-y-3">
                        {records.map((rec, i) => (
                            <li key={i} className="bg-blue-50 p-4 rounded border border-blue-100">
                                <span className="font-bold text-blue-900">{rec.recordType}</span>
                                <div className="text-sm font-mono mt-1 break-all">IPFS: {rec.ipfsHash}</div>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-gray-500 italic">No records found on the blockchain.</p>
                )}
            </div>

            <div>
                <h3 className="text-xl font-semibold mb-3 border-b pb-2 text-orange-600">Doctor Access Requests</h3>
                {requests.length > 0 ? (
                    <ul className="space-y-3">
                        {requests.map((req) => (
                            <li key={req.id} className="flex justify-between items-center bg-orange-50 p-4 rounded border border-orange-100">
                                <span className="text-sm font-mono truncate mr-4">{req.doctorAddress}</span>
                                <div className="flex gap-2">
                                    <button onClick={() => handleGrantAccess(req.doctorAddress)}
                                        className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition font-medium">
                                        Approve
                                    </button>
                                    <button onClick={() => handleRejectAccess(req.doctorAddress)}
                                        className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition font-medium">
                                        Reject
                                    </button>
                                </div>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-gray-500 italic">No pending requests.</p>
                )}
            </div>
        </div>
    );
};

export default PatientDashboard;
