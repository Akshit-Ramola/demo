import React, { useContext, useState } from 'react';
import { Web3Provider, Web3Context } from './Web3Context';
import PatientDashboard from './PatientDashboard';
import DoctorDashboard from './DoctorDashboard';
import './index.css';

const MainApp = () => {
    const { account, connectWallet } = useContext(Web3Context);
    const [role, setRole] = useState('patient');

    return (
        <div className="min-h-screen bg-gray-50 text-gray-800 font-sans p-4 md:p-10">
            <div className="max-w-4xl mx-auto">
                <header className="text-center mb-10">
                    <h1 className="text-4xl font-extrabold text-blue-900 tracking-tight">Decentralized EHR System</h1>
                    <p className="text-gray-500 mt-2">Powered by Polygon, IPFS, & Spring Boot</p>
                </header>

                {!account ? (
                    <div className="bg-white shadow-xl rounded-2xl p-10 text-center max-w-lg mx-auto">
                        <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <span className="text-4xl">🦊</span>
                        </div>
                        <h2 className="text-2xl font-bold mb-4">Web3 Wallet Required</h2>
                        <p className="text-gray-600 mb-8">Please connect your MetaMask wallet to interact with the blockchain and authenticate your role.</p>

                        <button
                            onClick={connectWallet}
                            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-4 rounded-xl font-bold text-lg hover:shadow-lg hover:from-blue-700 hover:to-indigo-700 transition transform hover:-translate-y-1">
                            Connect MetaMask
                        </button>
                    </div>
                ) : (
                    <div>
                        <div className="flex justify-center bg-white rounded-lg shadow-sm p-2 mb-6 max-w-sm mx-auto">
                            <button
                                onClick={() => setRole('patient')}
                                className={`flex-1 py-2 text-center rounded-md transition font-semibold ${role === 'patient' ? 'bg-blue-600 text-white shadow' : 'text-gray-600 hover:bg-gray-100'}`}>
                                Patient
                            </button>
                            <button
                                onClick={() => setRole('doctor')}
                                className={`flex-1 py-2 text-center rounded-md transition font-semibold ${role === 'doctor' ? 'bg-blue-600 text-white shadow' : 'text-gray-600 hover:bg-gray-100'}`}>
                                Doctor
                            </button>
                        </div>

                        {role === 'patient' ? <PatientDashboard /> : <DoctorDashboard />}
                    </div>
                )}
            </div>
        </div>
    );
};

const App = () => (
    <Web3Provider>
        <MainApp />
    </Web3Provider>
);

export default App;
