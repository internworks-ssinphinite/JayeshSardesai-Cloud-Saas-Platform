// frontend/src/pages/DashboardPage.jsx
import React from 'react';
import { useOutletContext } from 'react-router-dom';
import UsageChart from '../components/UsageChart';
import { Package, Sparkles, FileText } from 'lucide-react';

const DashboardPage = () => {
    const { user } = useOutletContext();

    const stats = [
        { label: 'Current Plan', value: user?.planName || 'N/A', icon: Package },
        { label: 'Service', value: 'Document Analyzer', icon: FileText },
        {
            label: 'Remaining Credits',
            value: user?.planName !== 'No Plan' ? `${user?.remainingCredits} / ${user?.totalCredits}` : 'N/A',
            icon: Sparkles
        },
    ];

    return (
        <>
            <h1 style={{ fontSize: '2.25rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>Welcome back!</h1>
            <p style={{ color: 'var(--muted-foreground)', marginBottom: '2rem' }}>Here's what's happening with your account today.</p>
            <div style={{ display: 'grid', gap: '1.5rem', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', marginBottom: '2rem' }}>
                {stats.map((stat) => (
                    <div key={stat.label} className="card">
                        <div className="card-header" style={{ backgroundColor: 'var(--primary)', color: 'white', borderRadius: 'calc(var(--radius) + 3px)' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <p style={{ margin: 0, opacity: 0.9 }}>{stat.label}</p>
                                <stat.icon style={{ height: '1.25rem', width: '1.25rem', opacity: 0.9 }} />
                            </div>
                            <h3 style={{ fontSize: '1.875rem', fontWeight: 'bold', margin: '0.25rem 0' }}>{stat.value}</h3>
                        </div>
                    </div>
                ))}
            </div>

            <div style={{ display: 'flex', justifyContent: 'center' }}>
                <div className="card" style={{ width: '100%', maxWidth: '800px' }}>
                    <div className="card-header">
                        <h3 className="card-title" style={{ marginBottom: '1rem' }}>Monthly Usage</h3>
                        <div style={{ height: '250px', position: 'relative' }}>
                            <UsageChart usageData={[]} />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default DashboardPage;
