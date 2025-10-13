// frontend/src/pages/DashboardPage.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useOutletContext } from 'react-router-dom';
import UsageChart from '../components/UsageChart';
import { Package, Sparkles, Activity } from 'lucide-react';

const DashboardPage = () => {
    const { user } = useOutletContext();
    const [usageData, setUsageData] = useState([]);

    useEffect(() => {
        const fetchUsageData = async () => {
            const token = localStorage.getItem('token');
            try {
                const response = await axios.get('/api/usage', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setUsageData(response.data);
            } catch (error) {
                console.error("Failed to fetch usage data", error);
            }
        };

        if (user) {
            fetchUsageData();
        }
    }, [user]);

    const stats = [
        { label: 'Current Plan', value: user?.planName || 'N/A', icon: Package },
        { label: 'Remaining Credits', value: user?.remainingCredits ?? 'N/A', icon: Sparkles },
    ];

    return (
        <>
            <h1 style={{ fontSize: '2.25rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>Welcome back!</h1>
            <p style={{ color: 'var(--muted-foreground)', marginBottom: '2rem' }}>Here's what's happening with your account today.</p>
            <div style={{ display: 'grid', gap: '1.5rem', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', marginBottom: '2rem' }}>
                {stats.map((stat) => (
                    <div key={stat.label} className="card">
                        <div className="card-header">
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <p className="card-description">{stat.label}</p>
                                <stat.icon style={{ height: '1rem', width: '1rem', color: 'var(--muted-foreground)' }} />
                            </div>
                            <h3 style={{ fontSize: '1.875rem', fontWeight: 'bold', margin: '0.25rem 0' }}>{stat.value}</h3>
                        </div>
                    </div>
                ))}
            </div>

            {/* Usage Chart with smaller container */}
            <div className="card">
                <div className="card-header">
                    <h3 className="card-title" style={{ marginBottom: '1rem' }}>Monthly Usage</h3>
                    <div style={{ height: '250px', position: 'relative' }}>
                        <UsageChart usageData={usageData} />
                    </div>
                </div>
            </div>
        </>
    );
};

export default DashboardPage;