import React from 'react';
import Navbar from '../../Components/Navbar';
import SideBar from '../../utils/SideBar';

const Dashboard = () => {
    // This must match the width you set in your SideBar component
    const sidebarWidth = '250px'; 

    return (
        <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f8fafc' }}>
            {/* 1. SIDEBAR (Position Fixed is handled inside the component) */}
            <SideBar />

            {/* 2. MAIN CONTENT WRAPPER */}
            <div style={{ 
                flex: 1,                      // Take up remaining space
                marginLeft: '250px',    // IMPORTANT: Pushes content to the right of the Sidebar
                display: 'flex', 
                flexDirection: 'column',
                width: `calc(100% - ${sidebarWidth})` // Ensures it doesn't overflow horizontally
            }}>
                {/* NAVBAR (Should also have width: calc(100% - 250px) inside its own file) */}
                <Navbar />

                {/* ACTUAL PAGE CONTENT */}
                <main style={{ 
                    padding: '2rem', 
                    marginTop: '70px' // Space for the fixed Navbar height
                }}>
                    <h1 style={{ color: '#1a365d' }}>Main content</h1>
                    <div style={{ maxWidth: '800px' }}>
                        <p style={{ color: '#64748b', lineHeight: '1.6' }}>
                            Lorem ipsum dolor sit amet consectetur adipisicing elit. Maxime sunt ut
                            dolores iure voluptatem, mollitia debitis. Vitae, itaque qui asperiores 
                            perferendis recusandae ea debitis numquam maxime, veniam voluptas iure nisi.
                        </p>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default Dashboard;