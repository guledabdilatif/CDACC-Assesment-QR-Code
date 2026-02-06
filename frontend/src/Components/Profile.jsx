import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ShieldCheck, User, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ApiUrl = import.meta.env.VITE_API_URL;

const Profile = () => {
    const [userData, setUserData] = useState(null);
    const [newPassword, setNewPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);
    const navigate = useNavigate()

    const token = localStorage.getItem('token');

    // Fetch user details on mount
    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await axios.get(`${ApiUrl}/me`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                console.log("Data from backend:", response.data); // <--- CHECK THIS IN BROWSER CONSOLE
                setUserData(response.data);
            } catch (err) {
                console.error("Failed to fetch user data", err);
                // If it fails, check if the token is null
                if (!token) console.warn("No token found in localStorage!");
            } finally {
                setFetching(false);
            }
        };

        if (token) {
            fetchUserData();
        } else {
            setFetching(false);
        }
    }, [token]);

    const handleUpdatePassword = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await axios.post(
                `${ApiUrl}/update-password`,
                { newPassword },
                { headers: { 'Authorization': `Bearer ${token}` } }
            );

            alert(response.data.message || "Password updated successfully!");
            setNewPassword('');
            navigate('/dashboard')
        } catch (err) {
            const errorMessage = err.response?.data?.message || "Connection Error";
            alert("Error: " + errorMessage);
        } finally {
            setLoading(false);
        }
    };

    if (fetching) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '50px' }}>
                <Loader2 className="animate-spin" size={32} />
            </div>
        );
    }

    return (
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
            <h2 style={{ marginBottom: '1.5rem' }}>Account Settings</h2>

            {/* Real User Details Section */}
            <div style={{
                background: '#f9f9f9',
                padding: '20px',
                borderRadius: '8px',
                marginBottom: '20px',
                display: 'flex',
                alignItems: 'center',
                gap: '15px',
                border: '1px solid #eee'
            }}>
                <div style={{ background: '#007bff22', color: '#007bff', padding: '15px', borderRadius: '50%' }}>
                    <User size={30} />
                </div>
                 {/* inside Profile.jsx return statement */}
                <div>
                    <h4 style={{ margin: 0, textTransform: 'capitalize' }}>
                        {userData?.name ? userData.name : "Loading Name..."}
                    </h4>
                    <p style={{ margin: 0, color: '#666', fontSize: '0.9rem' }}>
                        {userData?.email ? userData.email : "Loading Email..."}
                    </p>
                </div>
            </div>

            {/* Update Password Form */}
            <div style={{ border: '1px solid #ddd', padding: '25px', borderRadius: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px' }}>
                    <ShieldCheck size={20} color="#007bff" />
                    <h3 style={{ margin: 0 }}>Change Password</h3>
                </div>

                <form onSubmit={handleUpdatePassword}>
                    <div style={{ marginBottom: '15px' }}>
                        <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.85rem', fontWeight: 'bold' }}>
                            New Password
                        </label>
                        <input
                            type="password"
                            placeholder="Enter new password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            style={{
                                width: '100%',
                                padding: '10px',
                                borderRadius: '4px',
                                border: '1px solid #ccc',
                                boxSizing: 'border-box'
                            }}
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        style={{
                            width: '100%',
                            padding: '12px',
                            background: loading ? '#ccc' : '#007bff',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: loading ? 'not-allowed' : 'pointer',
                            fontWeight: '600'
                        }}
                    >
                        {loading ? 'Updating...' : 'Update Password'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Profile;