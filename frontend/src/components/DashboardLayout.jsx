// frontend/src/components/DashboardLayout.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { NavLink, useNavigate, Outlet } from 'react-router-dom';
import axios from 'axios';
import { LayoutDashboard, Package, CreditCard, Settings, LogOut, Sparkles, Bell } from 'lucide-react';

const DashboardLayout = () => {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    const fetchUserData = useCallback(async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
            return;
        }
        try {
            const response = await axios.get('/api/dashboard', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setUser(response.data.user);
        } catch (err) {
            localStorage.removeItem('token');
            navigate('/login');
        }
    }, [navigate]);

    useEffect(() => {
        fetchUserData();
    }, [fetchUserData]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/');
    };

    const menuItems = [
        { icon: LayoutDashboard, label: 'Dashboard', to: '/dashboard' },
        { icon: Sparkles, label: 'My Services', to: '/dashboard/my-services' },
        { icon: CreditCard, label: 'Plans & Billing', to: '/dashboard/billing' },
        { icon: Bell, label: 'Notifications', to: '/dashboard/notifications' },
        { icon: Settings, label: 'Settings', to: '/dashboard/settings' },
    ];

    const activeLinkStyle = {
        backgroundColor: 'var(--primary)',
        color: 'var(--primary-foreground)',
    };

    return (
        <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f9fafb' }}>
            <aside style={{ width: '260px', borderRight: '1px solid var(--border)', backgroundColor: 'var(--card)', padding: '1.5rem', display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '2rem' }}>
                    <img src="/ss-infinite-logo.svg" alt="SS Infinite Logo" style={{ height: '2rem', width: '2rem' }} />
                    <span style={{ fontWeight: 'bold', fontSize: '1.125rem' }}>SS Infinite</span>
                </div>
                <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {menuItems.map((item) => (
                        <NavLink
                            key={item.label}
                            to={item.to}
                            end={item.to === '/dashboard'}
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
                        {user?.email}
                    </div>
                    <button onClick={handleLogout} className="btn btn-ghost" style={{ width: '100%', justifyContent: 'flex-start', gap: '0.5rem' }}>
                        <LogOut style={{ height: '1rem', width: '1rem' }} />
                        Logout
                    </button>
                </div>
            </aside>

            <main style={{ flex: 1, padding: '2rem', overflowY: 'auto' }}>
                <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                    <Outlet context={{ user, fetchUserData }} />
                </div>
            </main>
        </div>
    );
};

export default DashboardLayout;
