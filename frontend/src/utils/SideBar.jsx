import React from 'react';
import { LayoutDashboard, QrCode, LogOut, ChevronRight, Menu, ChevronLeft } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

const SideBar = ({ isCollapsed, setIsCollapsed }) => {
    const navigate = useNavigate();
    const location = useLocation();

    const colors = {
        navy: '#1a365d',
        navyLight: '#2a4a7d',
        orange: '#f58220',
        textMain: '#ffffff',
        textMuted: '#94a3b8'
    };

    const sidebarWidth = isCollapsed ? '80px' : '250px';

    const menuItems = [
        { name: 'Dashboard', icon: <LayoutDashboard size={20} />, path: '/dashboard' },
        { name: 'QR Tables', icon: <QrCode size={20} />, path: '/qrs' },
    ];

    const itemStyle = (isActive) => ({
        display: 'flex',
        alignItems: 'center',
        justifyContent: isCollapsed ? 'center' : 'flex-start',
        gap: isCollapsed ? '0' : '12px',
        padding: '12px',
        margin: '8px 10px',
        borderRadius: '8px',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        textDecoration: 'none',
        color: isActive ? colors.textMain : colors.textMuted,
        backgroundColor: isActive ? colors.orange : 'transparent',
    });

    return (
        <div style={{
            width: sidebarWidth,
            height: '100vh',
            position: 'fixed',
            top: 0,
            left: 0,
            zIndex: 1100,
            backgroundColor: colors.navy,
            display: 'flex',
            flexDirection: 'column',
            transition: 'width 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            overflow: 'hidden'
        }}>
            {/* Toggle Button */}
            <button 
                onClick={() => setIsCollapsed(!isCollapsed)}
                style={{
                    position: 'absolute', top: '15px', right: isCollapsed ? '25px' : '15px',
                    background: colors.navyLight, border: 'none', borderRadius: '5px',
                    color: 'white', cursor: 'pointer', padding: '5px'
                }}
            >
                {isCollapsed ? <Menu size={20} /> : <ChevronLeft size={20} />}
            </button>

            {/* Logo */}
            {!isCollapsed && (
                <div style={{ padding: '40px 20px 20px', textAlign: 'center' }}>
                    <div style={{ color: colors.textMain, fontWeight: '800' }}>
                        TVET <span style={{ color: colors.orange }}>CDACC</span>
                    </div>
                </div>
            )}

            {/* Nav */}
            <nav style={{ flex: 1, marginTop: isCollapsed ? '60px' : '10px' }}>
                {menuItems.map((item) => (
                    <div 
                        key={item.name} 
                        onClick={() => navigate(item.path)}
                        style={itemStyle(location.pathname === item.path)}
                    >
                        {item.icon}
                        {!isCollapsed && <span style={{ flex: 1 }}>{item.name}</span>}
                    </div>
                ))}
            </nav>

            {/* Logout */}
            <div style={{ padding: '15px' }}>
                <button 
                    onClick={() => { localStorage.clear(); navigate('/'); }}
                    style={{
                        display: 'flex', alignItems: 'center', justifyContent: isCollapsed ? 'center' : 'flex-start',
                        width: '100%', padding: '12px', borderRadius: '8px', border: 'none',
                        backgroundColor: 'rgba(239, 68, 68, 0.1)', color: '#f87171', cursor: 'pointer'
                    }}
                >
                    <LogOut size={20} />
                    {!isCollapsed && <span style={{ marginLeft: '10px' }}>Logout</span>}
                </button>
            </div>
        </div>
    );
};

export default SideBar;