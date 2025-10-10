// frontend/src/pages/DashboardPage.jsx
import React from 'react';
import { Package, User, DollarSign, Activity } from 'lucide-react';

const DashboardPage = () => {
    // Updated stats to reflect an individual plan and active services
    const stats = [
        { label: 'Active Services', value: '1', icon: Package, trend: 'Document Analyzer' },
        { label: 'Account Type', value: 'Individual', icon: User, trend: 'Standard Plan' },
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
                            <p style={{ fontSize: '0.75rem', color: 'var(--muted-foreground)' }}>
                                <span style={{ color: 'var(--primary)' }}>{stat.trend}</span>
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </>
    );
};

export default DashboardPage;