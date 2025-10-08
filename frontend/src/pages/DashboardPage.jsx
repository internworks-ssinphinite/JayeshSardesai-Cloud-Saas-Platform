// frontend/src/pages/DashboardPage.jsx
import React from 'react';
import { Package, TrendingUp, Users, Activity } from 'lucide-react';

const DashboardPage = () => {
    const stats = [
        { label: 'Active Services', value: '8', icon: Package, trend: '+2' },
        { label: 'Team Members', value: '12', icon: Users, trend: '+3' },
        { label: 'Monthly Spend', value: '$2,450', icon: TrendingUp, trend: '-5%' },
        { label: 'Uptime', value: '99.9%', icon: Activity, trend: '+0.1%' },
    ];

    return (
        <>
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
        </>
    );
};

export default DashboardPage;