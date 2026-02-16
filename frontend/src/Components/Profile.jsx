import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ShieldCheck, User, Loader2, ArrowLeft, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ApiUrl = import.meta.env.VITE_API_URL;

const Profile = () => {
    const [userData, setUserData] = useState(null);
    const [newPassword, setNewPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);
    const [errorMsg, setErrorMsg] = useState('');
    const navigate = useNavigate();

    const token = localStorage.getItem('token');

    // Fetch user details on mount
    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await axios.get(`${ApiUrl}/me`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                setUserData(response.data);
            } catch (err) {
                console.error("Failed to fetch user data", err);
                setErrorMsg("Could not load user profile.");
            } finally {
                setFetching(false);
            }
        };

        if (token) {
            fetchUserData();
        } else {
            setFetching(false);
            navigate('/login'); // Redirect if no token
        }
    }, [token, navigate]);

    const handleUpdatePassword = async (e) => {
        e.preventDefault();
        setLoading(true);
        setErrorMsg('');

        try {
            // Verify ApiUrl is correct
            console.log("Attempting request to:", `${ApiUrl}/update-password`);

            const response = await axios.post(
                `${ApiUrl}/update-password`,
                { newPassword }, // Key matches your backend: const { newPassword } = req.body;
                { headers: { 'Authorization': `Bearer ${token}` } }
            );

            alert(response.data.message || "Password updated successfully!");
            setNewPassword('');
            navigate('/dashboard');
        } catch (err) {
            if (!err.response) {
                // Network Error / Connection Refused
                setErrorMsg("Server unreachable. Check if backend is running at " + ApiUrl);
            } else {
                // Backend responded with error (400, 401, 500, etc)
                setErrorMsg(err.response.data.message || "Failed to update password.");
            }
        } finally {
            setLoading(false);
        }
    };

    if (fetching) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <Loader2 className="animate-spin" size={40} color="#007bff" />
            </div>
        );
    }

    return (
        <div style={{ maxWidth: '600px', margin: '40px auto', padding: '0 20px', fontFamily: 'sans-serif' }}>
            
            {/* GO BACK BUTTON */}
            <button 
                onClick={() => navigate(-1)}
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    background: 'none',
                    border: 'none',
                    color: '#666',
                    cursor: 'pointer',
                    marginBottom: '20px',
                    fontSize: '1rem',
                    padding: '0'
                }}
            >
                <ArrowLeft size={18} /> Back to Dashboard
            </button>

            <h2 style={{ marginBottom: '1.5rem', color: '#1a365d' }}>Account Settings</h2>

            {/* ERROR ALERT */}
            {errorMsg && (
                <div style={{ 
                    backgroundColor: '#fee2e2', 
                    color: '#dc2626', 
                    padding: '12px', 
                    borderRadius: '8px', 
                    marginBottom: '20px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    fontSize: '0.9rem',
                    border: '1px solid #fecaca'
                }}>
                    <AlertCircle size={18} /> {errorMsg}
                </div>
            )}

            {/* User Info Card */}
            <div style={{
                background: '#fff',
                padding: '20px',
                borderRadius: '12px',
                marginBottom: '25px',
                display: 'flex',
                alignItems: 'center',
                gap: '15px',
                border: '1px solid #e2e8f0',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
            }}>
                <div style={{ background: '#007bff22', color: '#007bff', padding: '15px', borderRadius: '50%' }}>
                    <User size={30} />
                </div>
                <div>
                    <h4 style={{ margin: 0, textTransform: 'capitalize', fontSize: '1.2rem', color: '#1e293b' }}>
                        {userData?.name || "User Name"}
                    </h4>
                    <p style={{ margin: 0, color: '#64748b', fontSize: '0.95rem' }}>
                        {userData?.email || "Email not available"}
                    </p>
                </div>
            </div>

            {/* Password Change Section */}
            <div style={{ 
                background: '#fff', 
                border: '1px solid #e2e8f0', 
                padding: '30px', 
                borderRadius: '12px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' 
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
                    <ShieldCheck size={22} color="#007bff" />
                    <h3 style={{ margin: 0, color: '#1e293b' }}>Security</h3>
                </div>

                <form onSubmit={handleUpdatePassword}>
                    <div style={{ marginBottom: '20px' }}>
                        <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', fontWeight: '600', color: '#475569' }}>
                            New Password
                        </label>
                        <input
                            type="password"
                            placeholder="Minimum 6 characters"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            style={{
                                width: '100%',
                                padding: '12px',
                                borderRadius: '8px',
                                border: '1px solid #cbd5e1',
                                boxSizing: 'border-box',
                                fontSize: '1rem',
                                outline: 'none',
                                transition: 'border-color 0.2s'
                            }}
                            onFocus={(e) => e.target.style.borderColor = '#007bff'}
                            onBlur={(e) => e.target.style.borderColor = '#cbd5e1'}
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        style={{
                            width: '100%',
                            padding: '14px',
                            background: loading ? '#94a3b8' : '#1a365d',
                            color: 'white',
                            border: 'none',
                            borderRadius: '8px',
                            cursor: loading ? 'not-allowed' : 'pointer',
                            fontWeight: '600',
                            fontSize: '1rem',
                            transition: 'opacity 0.2s'
                        }}
                    >
                        {loading ? 'Processing...' : 'Update Password'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Profile;