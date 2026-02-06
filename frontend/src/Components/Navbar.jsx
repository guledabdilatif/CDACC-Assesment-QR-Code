import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserCircle, LogOut, Settings, Home } from 'lucide-react';

const Navbar = ({ setView }) => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/');
    };

    return (
        <nav style={{ 
            background: '#333', 
            color: '#fff', 
            padding: '0.8rem 2rem', 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            position: 'relative' 
        }}>
            <div style={{ fontWeight: 'bold', fontSize: '1.2rem' }}>My App</div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                <Home size={20} style={{ cursor: 'pointer' }} onClick={() => setView('welcome')} />
                
                {/* Profile Icon & Dropdown Container */}
                <div style={{ position: 'relative' }}>
                    <UserCircle 
                        size={28} 
                        style={{ cursor: 'pointer' }} 
                        onClick={() => setIsDropdownOpen(!isDropdownOpen)} 
                    />

                    {isDropdownOpen && (
                        <div style={{
                            position: 'absolute',
                            top: '40px',
                            right: '0',
                            background: 'white',
                            color: '#333',
                            borderRadius: '8px',
                            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                            width: '150px',
                            zIndex: 100,
                            overflow: 'hidden'
                        }}>
                            <div 
                                onClick={() => { setView('settings'); setIsDropdownOpen(false); }}
                                style={{ padding: '10px 15px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px', borderBottom: '1px solid #eee' }}
                                onMouseEnter={(e) => e.target.style.background = '#f5f5f5'}
                                onMouseLeave={(e) => e.target.style.background = 'white'}
                            >
                                <Settings size={16} /> Profile
                            </div>
                            <div 
                                onClick={handleLogout}
                                style={{ padding: '10px 15px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px', color: '#ff4d4d' }}
                                onMouseEnter={(e) => e.target.style.background = '#f5f5f5'}
                                onMouseLeave={(e) => e.target.style.background = 'white'}
                            >
                                <LogOut size={16} /> Logout
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;