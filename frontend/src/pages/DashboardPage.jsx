import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { LayoutDashboard, Package, CreditCard, Settings, LogOut, Sparkles, TrendingUp, Users, Activity } from 'lucide-react';

const DashboardPage = () => {
    const [userEmail, setUserEmail] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchDashboardData = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                navigate('/login');
                return;
            }
            try {
                const response = await axios.get('/api/dashboard', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setUserEmail(response.data.userEmail);
            } catch (err) {
                setError('Failed to fetch dashboard data.');
                localStorage.removeItem('token');
                navigate('/login');
            }
        };
        fetchDashboardData();
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    const menuItems = [
        { icon: LayoutDashboard, label: 'Dashboard', active: true },
        { icon: Package, label: 'Services', active: false },
        { icon: CreditCard, label: 'Billing', active: false },
        { icon: Settings, label: 'Settings', active: false },
    ];

    const stats = [
        { label: 'Active Services', value: '8', icon: Package, trend: '+2' },
        { label: 'Team Members', value: '12', icon: Users, trend: '+3' },
        { label: 'Monthly Spend', value: '$2,450', icon: TrendingUp, trend: '-5%' },
        { label: 'Uptime', value: '99.9%', icon: Activity, trend: '+0.1%' },
    ];

    if (error) {
        return <div style={{ padding: '2rem' }}>{error}</div>;
    }

    return (
        <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f9fafb' }}>
            {/* Sidebar */}
            <aside style={{ width: '260px', borderRight: '1px solid var(--border)', backgroundColor: 'var(--card)', padding: '1.5rem', display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '2rem' }}>
                    <div style={{ height: '2rem', width: '2rem', borderRadius: '0.5rem', backgroundColor: 'var(--primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', background: "rgba(109, 40, 217, 0.1)" }}>
                        <Sparkles style={{ height: '1rem', width: '1rem', color: 'var(--primary)' }} />
                    </div>
                    <span style={{ fontWeight: 'bold', fontSize: '1.125rem' }}>SS Infinite</span>
                </div>
                <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {menuItems.map((item) => (
                        <button key={item.label} className={`btn ${item.active ? 'btn-primary' : 'btn-ghost'}`} style={{ justifyContent: 'flex-start', gap: '0.75rem', padding: '0.75rem' }}>
                            <item.icon style={{ height: '1rem', width: '1rem' }} />
                            <span>{item.label}</span>
                        </button>
                    ))}
                </nav>
                <div>
                    <div style={{ padding: '0.75rem', fontSize: '0.875rem', color: 'var(--muted-foreground)' }}>
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
                    <h1 style={{ fontSize: '2.25rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>Welcome back!</h1>
                    <p style={{ color: 'var(--muted-foreground)', marginBottom: '2rem' }}>Here's what's happening with your services today.</p>
                    <div style={{ display: 'grid', gap: '1.5rem', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', marginBottom: '2rem' }}>
                        {stats.map((stat) => (
                            <div key={stat.label} className="card">
                                <div className="card-header">
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <p className="card-description">{stat.label}</p>
                                        <stat.icon style={{ height: '1rem', width: '1rem', color: 'var(--muted-foreground)' }} />
                                    </div>
                                    <h3 style={{ fontSize: '1.875rem', fontWeight: 'bold', margin: '0.25rem 0' }}>{stat.value}</h3>
                                    <p style={{ fontSize: '0.75rem', color: 'var(--muted-foreground)' }}>
                                        <span style={{ color: 'var(--primary)' }}>{stat.trend}</span> from last month
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                    {/* Other cards can be added here */}
                </div>
            </main>
        </div>
    );
};

export default DashboardPage;
