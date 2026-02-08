import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { UserCircle, LogOut, Settings, Bell } from 'lucide-react';

const Navbar = () => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const navigate = useNavigate();
    const dropdownRef = useRef(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/');
    };

    const navColors = {
        navy: '#1a365d', 
        orange: '#f58220',
        white: '#ffffff'
    };

    return (
        <nav style={{
            color: navColors.white,
            padding: '0 2rem',
            height: '70px',
            display: 'flex',
            justifyContent: 'flex-end', // Pushes all content to the right
            alignItems: 'center',
            position: 'fixed',
            top: 0,
            left: '260px', // Starts exactly where sidebar ends
            width: 'calc(100% - 260px)', // Occupies only the available width
            zIndex: 1000,
            boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
            boxSizing: 'border-box' // Prevents padding from breaking the width calculation
        }}>
            
            {/* Right side: Actions */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '25px' }}>
                                {/* Profile Icon & Dropdown */}
                <div style={{ position: 'relative' }} ref={dropdownRef}>
                    <div 
                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                        style={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            cursor: 'pointer',
                            padding: '5px',
                            borderRadius: '50%',
                            transition: 'background 0.3s',
                            backgroundColor: isDropdownOpen ? 'rgba(255,255,255,0.1)' : 'transparent'
                        }}
                    >
                        <UserCircle size={32} color={navColors.navy} strokeWidth={2} />
                    </div>

                    {isDropdownOpen && (
                        <div style={{
                            position: 'absolute',
                            top: '55px',
                            right: '0',
                            background: 'white',
                            color: '#333',
                            borderRadius: '12px',
                            boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
                            width: '180px',
                            zIndex: 1100,
                            overflow: 'hidden',
                            border: '1px solid #eee'
                        }}>
                            <Link
                                to='/profile'
                                onClick={() => setIsDropdownOpen(false)}
                                style={{ 
                                    padding: '12px 15px', 
                                    cursor: 'pointer', 
                                    display: 'flex', 
                                    alignItems: 'center', 
                                    gap: '12px', 
                                    textDecoration: 'none',
                                    color: '#334155',
                                    fontSize: '0.9rem'
                                }}
                                onMouseEnter={(e) => e.target.style.background = '#f1f5f9'}
                                onMouseLeave={(e) => e.target.style.background = 'white'}
                            >
                                <Settings size={18} color={navColors.navy} /> Settings
                            </Link>

                            <div 
                                onClick={handleLogout}
                                style={{ 
                                    padding: '12px 15px', 
                                    cursor: 'pointer', 
                                    display: 'flex', 
                                    alignItems: 'center', 
                                    gap: '12px', 
                                    color: '#e11d48',
                                    fontSize: '0.9rem',
                                    borderTop: '1px solid #eee'
                                }}
                                onMouseEnter={(e) => e.target.style.background = '#fff1f2'}
                                onMouseLeave={(e) => e.target.style.background = 'white'}
                            >
                                <LogOut size={18} /> Logout
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;