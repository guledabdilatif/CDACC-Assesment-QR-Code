import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Lock, Mail, LogIn, ShieldAlert } from 'lucide-react';

const ApiUrl = import.meta.env.VITE_API_URL;

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const colors = {
        navy: '#1a365d',
        orange: '#f58220',
        lightBg: '#f1f5f9',
        white: '#ffffff'
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        
        try {
            const response = await axios.post(`${ApiUrl}/login`, { email, password });
            
            if (response.data.token) {
                localStorage.setItem('token', response.data.token);
                const role = response.data.user.role;

                role != "admin" ? navigate("/qrs") : navigate('/dashboard');
            }
        } catch (err) {
            console.error("Login error:", err);
            setError(err.response?.data?.message || "Invalid credentials. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: colors.lightBg,
            fontFamily: 'system-ui, sans-serif'
        }}>
            <div style={{
                width: '100%',
                maxWidth: '400px',
                padding: '40px',
                backgroundColor: colors.white,
                borderRadius: '16px',
                boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
                textAlign: 'center'
            }}>
                {/* Logo Area */}
                <div style={{ marginBottom: '30px' }}>
                    <img src="/logo.png" alt="CDACC Logo" style={{ height: '60px', marginBottom: '15px' }} />
                    <h2 style={{ color: colors.navy, margin: 0, fontSize: '1.5rem', fontWeight: '800' }}>
                        Portal <span style={{ color: colors.orange }}>Login</span>
                    </h2>
                    <p style={{ color: '#64748b', fontSize: '0.9rem', marginTop: '5px' }}>
                        Competence Certification System
                    </p>
                </div>

                {error && (
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        backgroundColor: '#fff1f2',
                        color: '#e11d48',
                        padding: '12px',
                        borderRadius: '8px',
                        fontSize: '0.85rem',
                        marginBottom: '20px',
                        border: '1px solid #ffe4e6'
                    }}>
                        <ShieldAlert size={18} />
                        {error}
                    </div>
                )}

                <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    {/* Email Input */}
                    <div style={{ textAlign: 'left' }}>
                        <label style={{ fontSize: '0.85rem', fontWeight: '600', color: colors.navy, marginBottom: '8px', display: 'block' }}>
                            Email Address
                        </label>
                        <div style={{ position: 'relative' }}>
                            <Mail size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                            <input 
                                type="email" 
                                placeholder="name@company.com" 
                                value={email} 
                                onChange={e => setEmail(e.target.value)} 
                                required 
                                style={{
                                    width: '100%',
                                    padding: '12px 12px 12px 40px',
                                    borderRadius: '8px',
                                    border: '1px solid #e2e8f0',
                                    outline: 'none',
                                    boxSizing: 'border-box',
                                    fontSize: '1rem'
                                }}
                            />
                        </div>
                    </div>

                    <div style={{ textAlign: 'left' }}>
                        <label style={{ fontSize: '0.85rem', fontWeight: '600', color: colors.navy, marginBottom: '8px', display: 'block' }}>
                            Password
                        </label>
                        <div style={{ position: 'relative' }}>
                            <Lock size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                            <input 
                                type="password" 
                                placeholder="••••••••" 
                                value={password} 
                                onChange={e => setPassword(e.target.value)} 
                                required 
                                style={{
                                    width: '100%',
                                    padding: '12px 12px 12px 40px',
                                    borderRadius: '8px',
                                    border: '1px solid #e2e8f0',
                                    outline: 'none',
                                    boxSizing: 'border-box',
                                    fontSize: '1rem'
                                }}
                            />
                        </div>
                    </div>

                    <button 
                        type="submit" 
                        disabled={loading}
                        style={{ 
                            padding: '14px', 
                            cursor: loading ? 'not-allowed' : 'pointer',
                            backgroundColor: colors.navy,
                            color: 'white',
                            border: 'none',
                            borderRadius: '8px',
                            fontWeight: '700',
                            fontSize: '1rem',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '10px',
                            transition: 'background 0.3s',
                            opacity: loading ? 0.7 : 1
                        }}
                        onMouseEnter={(e) => e.target.style.backgroundColor = '#2a4a7d'}
                        onMouseLeave={(e) => e.target.style.backgroundColor = colors.navy}
                    >
                        {loading ? 'Authenticating...' : <><LogIn size={18} /> Sign In</>}
                    </button>
                </form>

                <p style={{ marginTop: '25px', fontSize: '0.8rem', color: '#94a3b8' }}>
                    © 2026 TVET CDACC. All rights reserved.
                </p>
            </div>
        </div>
    );
};

export default Login;