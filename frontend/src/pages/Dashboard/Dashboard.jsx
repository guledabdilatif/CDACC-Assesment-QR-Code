import React, { useState } from 'react';
import Navbar from '../../Components/Navbar'; 
import SideBar from '../../utils/SideBar';
import Profile from '../../Components/Profile';

const Dashboard = () => {
    const [view, setView] = useState('welcome');

    return (
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            {/* Pass setView to Navbar so the Profile card can trigger the view change */}
            <Navbar setView={setView} />
            
            <div style={{ display: 'flex', flex: 1 }}>
                <SideBar />
                
                <main style={{ padding: '2rem', flex: 1, background: '#fff' }}>
                    {view === 'welcome' ? (
                        <div style={{ textAlign: 'center', marginTop: '50px' }}>
                            <h1>Welcome to your Dashboard</h1>
                            <p>Select an option from the menu to get started.</p>
                        </div>
                    ) : (
                        <Profile />
                    )}
                </main>
            </div>
        </div>
    );
};

export default Dashboard;