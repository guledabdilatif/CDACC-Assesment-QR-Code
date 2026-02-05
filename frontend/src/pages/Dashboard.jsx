import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
const ApiUrl = import.meta.env.VITE_API_URL; 

const Dashboard = () => {
    const [view, setView] = useState('welcome');
    const [newPassword, setNewPassword] = useState('');
    const navigate = useNavigate();
    
    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    const handleUpdatePassword = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        
        try {
            // Using the ApiUrl variable and removed /auth
            const response = await axios.post(
                `${ApiUrl}/update-password`, 
                { newPassword: newPassword }, 
                { 
                    headers: { 
                        'Authorization': `Bearer ${token}` 
                    } 
                }
            );

            alert(response.data.message || "Password updated successfully!");
            setNewPassword('');
            setView('welcome');
        } catch (err) {
            const errorMessage = err.response?.data?.message || "Connection Error";
            alert("Error: " + errorMessage);
        }
    };

    return (
        <div>
            {/* Navbar */}
            <nav style={{ background: '#333', color: '#fff', padding: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ fontWeight: 'bold' }}>My App</div>
                <div style={{ display: 'flex', gap: '15px' }}>
                    <button onClick={() => setView('welcome')}>Home</button>
                    <button onClick={() => setView('settings')}>Settings</button>
                    <button onClick={handleLogout} style={{ background: '#ff4d4d', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer' }}>Logout</button>
                </div>
            </nav>

            {/* Main Content */}
            <div style={{ padding: '2rem' }}>
                {view === 'welcome' ? (
                    <div>
                        <h1>Dashboard</h1>
                        <p>Welcome back! You are securely logged in.</p>
                    </div>
                ) : (
                    <div style={{ maxWidth: '400px', border: '1px solid #ddd', padding: '20px', borderRadius: '8px' }}>
                        <h3>User Settings</h3>
                        <form onSubmit={handleUpdatePassword}>
                            <div style={{ marginBottom: '15px' }}>
                                <label style={{ display: 'block', marginBottom: '5px' }}>New Password:</label>
                                <input 
                                    type="password" 
                                    value={newPassword} 
                                    onChange={(e) => setNewPassword(e.target.value)} 
                                    style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
                                    required 
                                />
                            </div>
                            <button type="submit" style={{ padding: '10px 20px', background: '#007bff', color: 'white', border: 'none', borderRadius: '4px' }}>
                                Update Password
                            </button>
                        </form>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Dashboard;