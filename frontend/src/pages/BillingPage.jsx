import React, { useState } from 'react';
import { CreditCard, Download, Calendar, DollarSign, TrendingDown, CheckCircle2 } from 'lucide-react';

const BillingPage = () => {
    const [invoices] = useState([
        { id: 'INV-2024-001', date: 'Jan 15, 2024', amount: '$124.00', status: 'paid' },
        { id: 'INV-2024-002', date: 'Feb 15, 2024', amount: '$124.00', status: 'paid' },
        { id: 'INV-2024-003', date: 'Mar 15, 2024', amount: '$124.00', status: 'paid' },
        { id: 'INV-2024-004', date: 'Apr 15, 2024', amount: '$124.00', status: 'pending' },
    ]);

    const currentPlan = {
        name: 'Professional Plan',
        price: '$124',
        period: 'month',
        nextBilling: 'May 15, 2024',
        services: 4
    };

    return (
        <>
            <div style={{ marginBottom: '2rem' }}>
                <h1 style={{ fontSize: '2.25rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>Billing & Invoices</h1>
                <p style={{ color: 'var(--muted-foreground)' }}>
                    Manage your subscription, payment methods, and download invoices.
                </p>
            </div>

            {/* Current Plan Card */}
            <div className="card" style={{ marginBottom: '2rem', background: 'linear-gradient(135deg, #6d28d9 0%, #5b21b6 100%)' }}>
                <div className="card-header">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
                        <div>
                            <p style={{ fontSize: '0.875rem', color: 'rgba(255, 255, 255, 0.8)', marginBottom: '0.5rem' }}>
                                Current Plan
                            </p>
                            <h2 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#ffffff', margin: '0 0 0.5rem' }}>
                                {currentPlan.name}
                            </h2>
                            <p style={{ fontSize: '1.125rem', color: 'rgba(255, 255, 255, 0.9)' }}>
                                <span style={{ fontSize: '2.5rem', fontWeight: 'bold' }}>{currentPlan.price}</span>
                                <span style={{ fontSize: '1rem' }}>/{currentPlan.period}</span>
                            </p>
                        </div>
                        <button className="btn btn-ghost" style={{ 
                            backgroundColor: 'rgba(255, 255, 255, 0.2)', 
                            color: '#ffffff',
                            border: '1px solid rgba(255, 255, 255, 0.3)'
                        }}>
                            Upgrade Plan
                        </button>
                    </div>
                    <div style={{ 
                        display: 'grid', 
                        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
                        gap: '1.5rem',
                        marginTop: '2rem',
                        paddingTop: '1.5rem',
                        borderTop: '1px solid rgba(255, 255, 255, 0.2)'
                    }}>
                        <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                                <Calendar style={{ width: '1rem', height: '1rem', color: 'rgba(255, 255, 255, 0.8)' }} />
                                <p style={{ fontSize: '0.875rem', color: 'rgba(255, 255, 255, 0.8)', margin: 0 }}>
                                    Next Billing
                                </p>
                            </div>
                            <p style={{ fontSize: '1rem', fontWeight: '600', color: '#ffffff', margin: 0 }}>
                                {currentPlan.nextBilling}
                            </p>
                        </div>
                        <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                                <CheckCircle2 style={{ width: '1rem', height: '1rem', color: 'rgba(255, 255, 255, 0.8)' }} />
                                <p style={{ fontSize: '0.875rem', color: 'rgba(255, 255, 255, 0.8)', margin: 0 }}>
                                    Active Services
                                </p>
                            </div>
                            <p style={{ fontSize: '1rem', fontWeight: '600', color: '#ffffff', margin: 0 }}>
                                {currentPlan.services} Services
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Stats Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
                <div className="card">
                    <div className="card-header">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                            <p className="card-description">This Month</p>
                            <DollarSign style={{ width: '1rem', height: '1rem', color: 'var(--muted-foreground)' }} />
                        </div>
                        <h3 style={{ fontSize: '1.875rem', fontWeight: 'bold', margin: '0.25rem 0' }}>$124.00</h3>
                        <p style={{ fontSize: '0.75rem', color: 'var(--muted-foreground)' }}>
                            <span style={{ color: '#10b981' }}>On track</span> with budget
                        </p>
                    </div>
                </div>
                <div className="card">
                    <div className="card-header">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                            <p className="card-description">Avg. Monthly</p>
                            <TrendingDown style={{ width: '1rem', height: '1rem', color: 'var(--muted-foreground)' }} />
                        </div>
                        <h3 style={{ fontSize: '1.875rem', fontWeight: 'bold', margin: '0.25rem 0' }}>$118.50</h3>
                        <p style={{ fontSize: '0.75rem', color: 'var(--muted-foreground)' }}>
                            <span style={{ color: 'var(--primary)' }}>-5%</span> from last quarter
                        </p>
                    </div>
                </div>
                <div className="card">
                    <div className="card-header">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                            <p className="card-description">Payment Method</p>
                            <CreditCard style={{ width: '1rem', height: '1rem', color: 'var(--muted-foreground)' }} />
                        </div>
                        <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', margin: '0.25rem 0' }}>•••• 4242</h3>
                        <p style={{ fontSize: '0.75rem', color: 'var(--muted-foreground)' }}>
                            Expires 12/2025
                        </p>
                    </div>
                </div>
            </div>

            {/* Invoices Table */}
            <div className="card">
                <div className="card-header">
                    <h3 className="card-title" style={{ marginBottom: '1rem' }}>Recent Invoices</h3>
                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr style={{ borderBottom: '1px solid var(--border)' }}>
                                    <th style={{ textAlign: 'left', padding: '0.75rem 0', fontSize: '0.875rem', fontWeight: '600', color: 'var(--muted-foreground)' }}>
                                        Invoice ID
                                    </th>
                                    <th style={{ textAlign: 'left', padding: '0.75rem 0', fontSize: '0.875rem', fontWeight: '600', color: 'var(--muted-foreground)' }}>
                                        Date
                                    </th>
                                    <th style={{ textAlign: 'left', padding: '0.75rem 0', fontSize: '0.875rem', fontWeight: '600', color: 'var(--muted-foreground)' }}>
                                        Amount
                                    </th>
                                    <th style={{ textAlign: 'left', padding: '0.75rem 0', fontSize: '0.875rem', fontWeight: '600', color: 'var(--muted-foreground)' }}>
                                        Status
                                    </th>
                                    <th style={{ textAlign: 'right', padding: '0.75rem 0', fontSize: '0.875rem', fontWeight: '600', color: 'var(--muted-foreground)' }}>
                                        Action
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {invoices.map((invoice) => (
                                    <tr key={invoice.id} style={{ borderBottom: '1px solid var(--border)' }}>
                                        <td style={{ padding: '1rem 0', fontSize: '0.875rem', fontWeight: '500' }}>
                                            {invoice.id}
                                        </td>
                                        <td style={{ padding: '1rem 0', fontSize: '0.875rem', color: 'var(--muted-foreground)' }}>
                                            {invoice.date}
                                        </td>
                                        <td style={{ padding: '1rem 0', fontSize: '0.875rem', fontWeight: '600' }}>
                                            {invoice.amount}
                                        </td>
                                        <td style={{ padding: '1rem 0' }}>
                                            <span style={{
                                                display: 'inline-flex',
                                                alignItems: 'center',
                                                padding: '0.25rem 0.75rem',
                                                borderRadius: '9999px',
                                                fontSize: '0.75rem',
                                                fontWeight: '600',
                                                backgroundColor: invoice.status === 'paid' ? '#10b98115' : '#f59e0b15',
                                                color: invoice.status === 'paid' ? '#10b981' : '#f59e0b',
                                                textTransform: 'capitalize'
                                            }}>
                                                {invoice.status}
                                            </span>
                                        </td>
                                        <td style={{ padding: '1rem 0', textAlign: 'right' }}>
                                            <button style={{
                                                display: 'inline-flex',
                                                alignItems: 'center',
                                                gap: '0.5rem',
                                                padding: '0.5rem 0.75rem',
                                                fontSize: '0.875rem',
                                                color: 'var(--primary)',
                                                backgroundColor: 'transparent',
                                                border: 'none',
                                                cursor: 'pointer',
                                                fontWeight: '500'
                                            }}>
                                                <Download style={{ width: '1rem', height: '1rem' }} />
                                                Download
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </>
    );
};

export default BillingPage;