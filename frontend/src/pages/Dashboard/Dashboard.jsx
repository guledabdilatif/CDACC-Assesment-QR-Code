import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Database, Users, QrCode, TrendingUp, Download } from 'lucide-react'; // Added Download icon
import Navbar from '../../Components/Navbar';
import SideBar from '../../utils/SideBar';
import * as XLSX from 'xlsx'; // Import xlsx

const ApiUrl = import.meta.env.VITE_API_URL;

const Dashboard = () => {
    const [stats, setStats] = useState({ totalRecords: 0, totalUsers: 0 });
    const [chartData, setChartData] = useState([]);
    const [rawRecords, setRawRecords] = useState([]); // Store raw data for Excel export

    const [isCollapsed, setIsCollapsed] = useState(false);
    const sidebarWidth = isCollapsed ? '80px' : '250px';

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const token = localStorage.getItem('token');
                const headers = { 'Authorization': `Bearer ${token}` };
                const [usersRes, recordsRes] = await Promise.all([
                    axios.get(`${ApiUrl}/users`, { headers }),
                    axios.get(`${ApiUrl}/qr`, { headers })
                ]);

                setStats({
                    totalUsers: usersRes.data.length,
                    totalRecords: recordsRes.data.length
                });

                setRawRecords(recordsRes.data); // Save for Excel

                const formattedData = recordsRes.data.map(rec => ({
                    date: new Date(rec.dateCreated).toLocaleDateString(),
                    count: 1
                }));
                setChartData(formattedData);
            } catch (err) {
                console.error("Dashboard fetch error", err);
            }
        };
        fetchDashboardData();
    }, []);

    // --- NEW: EXCEL DOWNLOAD FUNCTION ---
   const downloadExcel = async () => {
    try {
        const token = localStorage.getItem('token');
        const headers = { 'Authorization': `Bearer ${token}` };

        // STOP: Make sure this URL is /submissions
        // If you use /qr here, it will download EVERYTHING in your database
        const res = await axios.get(`${ApiUrl}/submissions`, { headers });
        const submittedData = res.data;

        if (submittedData.length === 0) {
            alert("No data has been submitted for verification yet.");
            return;
        }

        const worksheet = XLSX.utils.json_to_sheet(submittedData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Verified Submissions");
        XLSX.writeFile(workbook, "Verified_Report.xlsx");
    } catch (err) {
        console.error("Download error", err);
        alert("Failed to fetch verified data.");
    }
};

    const StatCard = ({ title, value, icon: Icon, color }) => (
        <div style={{
            background: 'white', padding: '20px', borderRadius: '12px', flex: '1 1 200px',
            boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', display: 'flex', alignItems: 'center', gap: '15px'
        }}>
            <div style={{ background: `${color}22`, color: color, padding: '12px', borderRadius: '10px' }}>
                <Icon size={24} />
            </div>
            <div>
                <p style={{ margin: 0, color: '#64748b', fontSize: '0.875rem' }}>{title}</p>
                <h3 style={{ margin: 0, color: '#1e293b' }}>{value}</h3>
            </div>
        </div>
    );

    return (
        <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f8fafc' }}>
            <SideBar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />

            <div style={{
                flex: 1,
                marginLeft: sidebarWidth,
                width: `calc(100% - ${sidebarWidth})`,
                transition: 'margin-left 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                display: 'flex',
                flexDirection: 'column'
            }}>
                <Navbar />
                <main style={{ padding: '2rem', marginTop: '70px' }}>
                    
                    {/* Header with Download Button */}
                    <div style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                        <div>
                            <h1 style={{ color: '#1e293b', marginBottom: '0.5rem' }}>System Overview</h1>
                            <p style={{ color: '#64748b' }}>Welcome back! Here is what's happening with your QR records.</p>
                        </div>
                        
                        <button 
                            onClick={downloadExcel}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                background: '#1e293b',
                                color: 'white',
                                padding: '10px 20px',
                                borderRadius: '8px',
                                border: 'none',
                                cursor: 'pointer',
                                fontWeight: '500',
                                transition: 'background 0.2s'
                            }}
                            onMouseOver={(e) => e.target.style.background = '#334155'}
                            onMouseOut={(e) => e.target.style.background = '#1e293b'}
                        >
                            <Download size={18} /> Export Excel
                        </button>
                    </div>

                    {/* STATS ROW */}
                    <div style={{ display: 'flex', gap: '20px', marginBottom: '2rem', flexWrap: 'wrap' }}>
                        <StatCard title="Total Users" value={stats.totalUsers} icon={Users} color="#3b82f6" />
                        <StatCard title="QR Records" value={stats.totalRecords} icon={QrCode} color="#10b981" />
                        <StatCard title="Storage" value="Active" icon={Database} color="#f59e0b" />
                        <StatCard title="Growth" value="+12%" icon={TrendingUp} color="#8b5cf6" />
                    </div>

                    {/* CHART SECTION */}
                    <div style={{
                        background: 'white', padding: '25px', borderRadius: '12px',
                        boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                    }}>
                        <h3 style={{ marginBottom: '1.5rem', color: '#1e293b' }}>Record Activity Trend</h3>
                        <div style={{ width: '100%', height: 350 }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={chartData}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                    <XAxis dataKey="date" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} dy={10} />
                                    <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} dx={-10} />
                                    <Tooltip
                                        contentStyle={{
                                            borderRadius: '8px',
                                            border: 'none',
                                            boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)'
                                        }}
                                    />
                                    <Line
                                        type="monotone"
                                        dataKey="count"
                                        stroke="#3b82f6"
                                        strokeWidth={3}
                                        dot={{ r: 4, fill: '#3b82f6', strokeWidth: 2, stroke: '#fff' }}
                                        activeDot={{ r: 6, strokeWidth: 0 }}
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default Dashboard;