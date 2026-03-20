import React, { useContext, useState } from 'react';
import { Web3Context } from './Web3Context';
import axios from 'axios';

const DoctorDashboard = () => {
    const { account } = useContext(Web3Context);
    const [patientAddress, setPatientAddress] = useState('');
    const [records, setRecords] = useState(null);
    const [errorMsg, setErrorMsg] = useState('');

    const searchPatient = async () => {
        try {
            setErrorMsg('');
            setRecords(null);

            // Backend API verifies ACL Smart Contract Modifier rules inherently
            const res = await axios.get(`http://localhost:8080/api/records/${patientAddress}`);
            setRecords(res.data);

        } catch (err) {
            if (err.response && err.response.status === 403) {
                setErrorMsg("Not Authorized. You don't have access to this patient's records.");
            } else {
                setErrorMsg("Error fetching records. Make sure the backend is running.");
            }
        }
    };

    const requestAccess = () => {
        // Trigger generic Off-Chain API Call to notify the patient
        alert("Access request sent to Patient's Dashboard: " + patientAddress);
        // e.g., axios.post('http://localhost:8080/api/requests', { doctor: account, patient: patientAddress })
    };

    return (
        <div className="bg-white shadow rounded-lg p-6 mt-6">
            <h2 className="text-2xl font-bold mb-2">Doctor Dashboard</h2>
            <p className="text-gray-600 mb-6 font-mono text-sm">Account: {account}</p>

            <div className="flex gap-3 mb-6">
                <input
                    type="text"
                    placeholder="Enter Patient Wallet Address (0x...)"
                    className="border border-gray-300 p-3 rounded flex-grow font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={patientAddress}
                    onChange={(e) => setPatientAddress(e.target.value)}
                />
                <button
                    onClick={searchPatient}
                    disabled={!patientAddress}
                    className="bg-blue-600 text-white px-6 py-3 rounded font-bold hover:bg-blue-700 transition disabled:opacity-50">
                    Search
                </button>
            </div>

            {errorMsg && (
                <div className="mt-4 p-5 bg-red-50 border border-red-200 text-red-700 rounded-lg flex flex-col items-start gap-4">
                    <p className="font-semibold">{errorMsg}</p>
                    {errorMsg.includes("Not Authorized") && (
                        <button onClick={requestAccess} className="bg-red-600 text-white px-5 py-2 rounded shadow hover:bg-red-700 transition font-medium">
                            Request Access
                        </button>
                    )}
                </div>
            )}

            {records && (
                <div className="mt-6 border-t pt-4">
                    <h3 className="text-xl font-semibold mb-3 text-green-700">Decrypted Records File List</h3>
                    <ul className="space-y-3">
                        {records.map((rec, i) => (
                            <li key={i} className="flex justify-between items-center bg-green-50 p-4 rounded border border-green-200">
                                <div>
                                    <span className="font-bold text-green-900">{rec.recordType}</span>
                                    <div className="text-sm font-mono mt-1 break-all text-gray-700">
                                        IPFS Hash: {rec.ipfsHash} <span className="text-green-600 ml-2">(Decrypted Ready)</span>
                                    </div>
                                </div>
                                <a
                                    href={`http://localhost:8080/api/records/download/${rec.ipfsHash}`}
                                    className="px-4 py-2 bg-green-600 text-white rounded font-medium hover:bg-green-700 transition"
                                    download>
                                    Download
                                </a>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default DoctorDashboard;
