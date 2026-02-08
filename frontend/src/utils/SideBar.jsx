import React from 'react';
import { LayoutDashboard, QrCode, LogOut, ChevronRight } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

const SideBar = () => {
    const navigate = useNavigate();
    const location = useLocation();

    // Color Palette optimized for Dark Navy background
    const colors = {
        navy: '#1a365d',     // Main Background
        navyLight: '#2a4a7d', // Hover state background
        orange: '#f58220',   // Active state / Accent
        textMain: '#ffffff', // High contrast text
        textMuted: '#94a3b8' // Subtle text for non-active links
    };

    const menuItems = [
        { name: 'Dashboard', icon: <LayoutDashboard size={20} />, path: '/dashboard' },
        { name: 'QR Tables', icon: <QrCode size={20} />, path: '/qrs' },
    ];

    const itemStyle = (isActive) => ({
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        padding: '12px 20px',
        margin: '8px 15px',
        borderRadius: '8px',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        textDecoration: 'none',
        // Text is white when active, muted gray when not
        color: isActive ? colors.textMain : colors.textMuted,
        // Orange background for active, transparent for inactive
        backgroundColor: isActive ? colors.orange : 'transparent',
        boxShadow: isActive ? '0 4px 12px rgba(245, 130, 32, 0.4)' : 'none',
    });

    return (
        <div style={{
            width: '250px',
            minWidth: '250px', 
            maxWidth: '250px',
            height: '100vh',
            position: 'fixed',
            top: 0,
            left: 0,
            zIndex: 1100,
            // NAVY BACKGROUND
            backgroundColor: colors.navy,
            borderRight: '1px solid rgba(255,255,255,0.1)',
            display: 'flex',
            flexDirection: 'column',
            overflowY: 'auto'
        }}>
            {/* Logo Section */}
            <div style={{ 
                padding: '30px 20px', 
                textAlign: 'center',
                borderBottom: '1px solid rgba(255,255,255,0.1)',
                marginBottom: '10px'
            }}>
                <div style={{ color: colors.textMain, fontWeight: '800', fontSize: '1.2rem' }}>
                    TVET <span style={{ color: colors.orange }}>CDACC</span>
                </div>
                <div style={{ fontSize: '0.7rem', color: colors.textMuted, marginTop: '5px' }}>
                    COMPETENCE CERTIFICATION
                </div>
            </div>

            {/* Navigation Links */}
            <nav style={{ flex: 1 }}>
                {menuItems.map((item) => (
                    <div 
                        key={item.name}
                        onClick={() => navigate(item.path)}
                        style={itemStyle(location.pathname === item.path)}
                        onMouseEnter={(e) => {
                            if (location.pathname !== item.path) {
                                e.currentTarget.style.backgroundColor = colors.navyLight;
                                e.currentTarget.style.color = colors.textMain;
                            }
                        }}
                        onMouseLeave={(e) => {
                            if (location.pathname !== item.path) {
                                e.currentTarget.style.backgroundColor = 'transparent';
                                e.currentTarget.style.color = colors.textMuted;
                            }
                        }}
                    >
                        {item.icon}
                        <span style={{ flex: 1, fontWeight: '500' }}>{item.name}</span>
                        {location.pathname === item.path && <ChevronRight size={16} />}
                    </div>
                ))}
            </nav>

            {/* Logout Footer */}
            <div style={{ padding: '20px', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                <button 
                    onClick={() => { localStorage.clear(); navigate('/'); }}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '10px',
                        width: '100%',
                        padding: '12px',
                        borderRadius: '8px',
                        border: '1px solid rgba(239, 68, 68, 0.2)',
                        backgroundColor: 'rgba(239, 68, 68, 0.1)',
                        color: '#f87171', // Soft red to avoid clashing with orange
                        cursor: 'pointer',
                        fontWeight: '600',
                        transition: '0.2s'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.2)'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.1)'}
                >
                    <LogOut size={20} />
                    Logout
                </button>
            </div>
        </div>
    );
};

export default SideBar;