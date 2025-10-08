// frontend/src/components/DashboardLayout.jsx
import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate, Outlet } from 'react-router-dom';
import axios from 'axios';
import { LayoutDashboard, Package, CreditCard, Settings, LogOut, Sparkles } from 'lucide-react';

const DashboardLayout = () => {
    const [userEmail, setUserEmail] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserData = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                navigate('/login');
                return;
            }
            try {
                // You can reuse the dashboard endpoint to get user info
                const response = await axios.get('/api/dashboard', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setUserEmail(response.data.userEmail);
            } catch (err) {
                localStorage.removeItem('token');
                navigate('/login');
            }
        };
        fetchUserData();
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/');
    };

    const menuItems = [
        { icon: LayoutDashboard, label: 'Dashboard', to: '/dashboard' },
        { icon: Package, label: 'Services', to: '/dashboard/services' },
        { icon: CreditCard, label: 'Billing', to: '/dashboard/billing' },
        { icon: Settings, label: 'Settings', to: '/dashboard/settings' },
    ];

    const activeLinkStyle = {
        backgroundColor: 'var(--primary)',
        color: 'var(--primary-foreground)',
    };

    return (
        <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f9fafb' }}>
            {/* Sidebar */}
            <aside style={{ width: '260px', borderRight: '1px solid var(--border)', backgroundColor: 'var(--card)', padding: '1.5rem', display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '2rem' }}>
                    <div style={{ height: '2rem', width: '2rem', borderRadius: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', background: "rgba(109, 40, 217, 0.1)" }}>
                        <Sparkles style={{ height: '1rem', width: '1rem', color: 'var(--primary)' }} />
                    </div>
                    <span style={{ fontWeight: 'bold', fontSize: '1.125rem' }}>SS Infinite</span>
                </div>
                <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {menuItems.map((item) => (
                        <NavLink
                            key={item.label}
                            to={item.to}
                            end={item.to === '/dashboard'} // Match exact path for Dashboard link
                            className="btn btn-ghost"
                            style={({ isActive }) => ({
                                justifyContent: 'flex-start',
                                gap: '0.75rem',
                                padding: '0.75rem',
                                ...(isActive ? activeLinkStyle : {})
                            })}
                        >
                            <item.icon style={{ height: '1rem', width: '1rem' }} />
                            <span>{item.label}</span>
                        </NavLink>
                    ))}
                </nav>
                <div>
                    <div style={{ padding: '0.75rem', fontSize: '0.875rem', color: 'var(--muted-foreground)', wordBreak: 'break-all' }}>
                        {userEmail}
                    </div>
                    <button onClick={handleLogout} className="btn btn-ghost" style={{ width: '100%', justifyContent: 'flex-start', gap: '0.5rem' }}>
                        <LogOut style={{ height: '1rem', width: '1rem' }} />
                        Logout
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main style={{ flex: 1, padding: '2rem', overflowY: 'auto' }}>
                <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                    <Outlet /> {/* This is where the child pages will render */}
                </div>
            </main>
        </div>
    );
};

export default DashboardLayout;