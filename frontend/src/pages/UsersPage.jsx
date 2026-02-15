import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Users, Trash, Pencil, UserPlus, X, Eye, EyeOff, RefreshCw, Copy, Check } from 'lucide-react';
import SideBar from '../utils/SideBar';
import Navbar from '../Components/Navbar';

const ApiUrl = import.meta.env.VITE_API_URL;

export default function UsersPage() {
    const [users, setUsers] = useState([]);
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);
    
    // Responsive Logic
    useEffect(() => {
        const handleResize = () => setWindowWidth(window.innerWidth);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const isMobile = windowWidth <= 768;
    const sidebarWidth = isMobile ? '0px' : (isCollapsed ? '80px' : '250px');

    // UI States
    const [showModal, setShowModal] = useState(false);
    const [modalMode, setModalMode] = useState('add'); 
    const [visiblePasswords, setVisiblePasswords] = useState({});
    const [showPasswordInModal, setShowPasswordInModal] = useState(false);
    const [copied, setCopied] = useState(false);

    // Form State
    const [selectedUser, setSelectedUser] = useState({ name: '', email: '', password: '' });

    useEffect(() => { fetchUsers(); }, []);

    const fetchUsers = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get(`${ApiUrl}/users`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setUsers(res.data);
        } catch (err) { console.error("Fetch error:", err); }
    };

    const generateTempPassword = () => {
        const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*";
        let retVal = "";
        for (let i = 0; i < 10; ++i) retVal += charset.charAt(Math.floor(Math.random() * charset.length));
        setSelectedUser({ ...selectedUser, password: retVal });
        setShowPasswordInModal(true);
    };

    const handleCopy = (text) => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleOpenModal = (mode, user = { name: '', email: '', password: '' }) => {
        setModalMode(mode);
        setSelectedUser({ ...user, password: '' }); 
        setShowPasswordInModal(false);
        setShowModal(true);
    };

    const handleSave = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        try {
            if (modalMode === 'add') {
                await axios.post(`${ApiUrl}/register`, selectedUser);
            } else if (modalMode === 'edit') {
                const updateData = { name: selectedUser.name, email: selectedUser.email };
                if (selectedUser.password) updateData.password = selectedUser.password;
                await axios.put(`${ApiUrl}/users/${selectedUser._id}`, updateData, {
                    headers: { Authorization: `Bearer ${token}` }
                });
            }
            setShowModal(false);
            fetchUsers();
        } catch (err) { alert(err.response?.data?.message || "Operation failed"); }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Delete this user permanently?")) return;
        try {
            const token = localStorage.getItem('token');
            await axios.delete(`${ApiUrl}/users/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setUsers(users.filter(u => u._id !== id));
        } catch (err) { alert("Delete failed"); }
    };

    return (
        <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f8fafc' }}>
            {/* Sidebar usually handles its own mobile visibility via isCollapsed */}
            <SideBar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
            
            <div style={{ 
                flex: 1, 
                marginLeft: sidebarWidth, 
                transition: 'all 0.3s ease', 
                width: isMobile ? '100%' : `calc(100% - ${sidebarWidth})` 
            }}>
                <Navbar isCollapsed={isCollapsed} />
                
                <main style={{ padding: isMobile ? '1rem' : '2rem', marginTop: '70px' }}>
                    {/* Header: Stack vertically on small screens */}
                    <div style={{ 
                        display: 'flex', 
                        flexDirection: isMobile ? 'column' : 'row',
                        justifyContent: 'space-between', 
                        alignItems: isMobile ? 'flex-start' : 'center', 
                        gap: '1rem',
                        marginBottom: '2rem' 
                    }}>
                        <h1 style={{ display: 'flex', alignItems: 'center', gap: '12px', margin: 0, color: '#1a365d', fontSize: isMobile ? '1.5rem' : '2rem' }}>
                            <Users size={isMobile ? 24 : 32} /> User Management
                        </h1>
                        <button onClick={() => handleOpenModal('add')} style={{ width: isMobile ? '100%' : 'auto', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', height: '40px', padding: '0 15px', backgroundColor: '#f58220', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '500' }}>
                            <UserPlus size={18} /> Add New User
                        </button>
                    </div>

                    {/* Table Container: Allow horizontal scroll on mobile */}
                    <div style={{ 
                        background: 'white', 
                        borderRadius: '12px', 
                        boxShadow: '0 4px 6px rgba(0,0,0,0.05)', 
                        overflowX: 'auto' // Crucial for mobile
                    }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '600px' }}>
                            <thead style={{ backgroundColor: '#f1f5f9', color: '#475569' }}>
                                <tr>
                                    <th style={{ padding: '15px' }}>Full Name</th>
                                    <th style={{ padding: '15px' }}>Email</th>
                                    <th style={{ padding: '15px' }}>Password</th>
                                    <th style={{ padding: '15px', textAlign: 'center' }}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map(u => (
                                    <tr key={u._id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                                        <td style={{ padding: '15px', fontWeight: '600' }}>{u.name}</td>
                                        <td style={{ padding: '15px', color: '#64748b' }}>{u.email}</td>
                                        <td style={{ padding: '15px' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.75rem', color: '#94a3b8' }}>
                                                <code style={{ background: '#f1f5f9', padding: '4px 8px', borderRadius: '4px', whiteSpace: 'nowrap' }}>
                                                    {visiblePasswords[u._id] ? u.password : "••••••••"}
                                                </code>
                                                <button onClick={() => setVisiblePasswords(p => ({...p, [u._id]: !p[u._id]}))} style={{ border: 'none', background: 'none', cursor: 'pointer' }}>
                                                    {visiblePasswords[u._id] ? <EyeOff size={14} /> : <Eye size={14} />}
                                                </button>
                                            </div>
                                        </td>
                                        <td style={{ padding: '15px' }}>
                                            <div style={{ display: 'flex', justifyContent: 'center', gap: '15px' }}>
                                                <Pencil size={18} color="#1a365d" cursor="pointer" onClick={() => handleOpenModal('edit', u)} />
                                                <Trash size={18} color="#ef4444" cursor="pointer" onClick={() => handleDelete(u._id)} />
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </main>
            </div>

            {/* MODAL: Full screen width on mobile */}
            {showModal && (
                <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 2000, backdropFilter: 'blur(3px)', padding: '20px' }}>
                    <div style={{ 
                        background: 'white', 
                        padding: isMobile ? '20px' : '30px', 
                        borderRadius: '16px', 
                        width: '100%',
                        maxWidth: '400px', 
                        position: 'relative' 
                    }}>
                        <X size={20} style={{ position: 'absolute', top: '20px', right: '20px', cursor: 'pointer' }} onClick={() => setShowModal(false)} />
                        
                        <h2 style={{ color: '#1a365d', marginBottom: '20px' }}>{modalMode === 'add' ? 'Create User' : 'Edit User'}</h2>

                        <form onSubmit={handleSave}>
                            <div style={{ marginBottom: '15px' }}>
                                <label style={{ display: 'block', marginBottom: '5px', fontSize: '0.85rem' }}>Full Name</label>
                                <input style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', boxSizing: 'border-box' }} value={selectedUser.name} onChange={(e) => setSelectedUser({ ...selectedUser, name: e.target.value })} required />
                            </div>
                            <div style={{ marginBottom: '15px' }}>
                                <label style={{ display: 'block', marginBottom: '5px', fontSize: '0.85rem' }}>Email</label>
                                <input type="email" style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', boxSizing: 'border-box' }} value={selectedUser.email} onChange={(e) => setSelectedUser({ ...selectedUser, email: e.target.value })} required />
                            </div>

                            <div style={{ marginBottom: '25px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '5px' }}>
                                    <label style={{ fontSize: '0.85rem' }}>Password</label>
                                    <button type="button" onClick={generateTempPassword} style={{ fontSize: '0.75rem', color: '#f58220', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                        <RefreshCw size={12} /> Generate
                                    </button>
                                </div>
                                <div style={{ position: 'relative' }}>
                                    <input 
                                        type={showPasswordInModal ? "text" : "password"} 
                                        style={{ width: '100%', padding: '10px', paddingRight: '60px', borderRadius: '8px', border: '1px solid #cbd5e1', boxSizing: 'border-box' }} 
                                        value={selectedUser.password} 
                                        onChange={(e) => setSelectedUser({ ...selectedUser, password: e.target.value })} 
                                        placeholder={modalMode === 'edit' ? "Keep current" : "Enter password"}
                                        required={modalMode === 'add'} 
                                    />
                                    <div style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', display: 'flex', gap: '8px' }}>
                                        {selectedUser.password && (
                                            <button type="button" onClick={() => handleCopy(selectedUser.password)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}>
                                                {copied ? <Check size={16} color="green" /> : <Copy size={16} />}
                                            </button>
                                        )}
                                        <div onClick={() => setShowPasswordInModal(!showPasswordInModal)} style={{ cursor: 'pointer', color: '#64748b' }}>
                                            {showPasswordInModal ? <EyeOff size={18} /> : <Eye size={18} />}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <button type="submit" style={{ width: '100%', padding: '12px', background: '#1a365d', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600' }}>
                                {modalMode === 'add' ? 'Create Account' : 'Save Changes'}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}