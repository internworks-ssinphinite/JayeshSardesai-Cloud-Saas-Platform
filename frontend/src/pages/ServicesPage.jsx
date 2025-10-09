import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FileSearch, FileCheck, BarChart3, Brain, Sparkles, CheckCircle2, XCircle } from 'lucide-react';

const ServicesPage = () => {
    const [services] = useState([
        {
            id: 1,
            name: 'Document Analyzer',
            icon: FileSearch,
            description: 'Summarize text and analyze images in your documents.',
            status: 'active',
            price: '$25/month',
            usage: '0 / 100 analyses',
            color: '#8b5cf6',
            link: '/dashboard/analyzer'
        },
        {
            id: 2,
            name: 'PDF Data Analysis',
            icon: BarChart3,
            description: 'Analyze and extract structured data',
            status: 'active',
            price: '$29/month',
            usage: '856 / 1,500 analyses',
            color: '#3b82f6'
        },
        {
            id: 4,
            name: 'PDF Validation',
            icon: FileCheck,
            description: 'Verify PDF integrity and compliance',
            status: 'active',
            price: '$15/month',
            usage: '678 / 1,000 validations',
            color: '#10b981'
        },
        {
            id: 5,
            name: 'AI Document Intelligence',
            icon: Brain,
            description: 'Advanced AI-powered document insights',
            status: 'inactive',
            price: '$49/month',
            usage: 'Not configured',
            color: '#f59e0b'
        },
        {
            id: 6,
            name: 'Batch Processing',
            icon: Sparkles,
            description: 'Process multiple PDFs simultaneously',
            status: 'inactive',
            price: '$35/month',
            usage: 'Not configured',
            color: '#06b6d4'
        },
    ]);

    return (
        <>
            <div style={{ marginBottom: '2rem' }}>
                <h1 style={{ fontSize: '2.25rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>Manage Your Services</h1>
                <p style={{ color: 'var(--muted-foreground)' }}>
                    Activate, deactivate, and monitor all your integrated services in one place.
                </p>
            </div>

            <div style={{ display: 'grid', gap: '1.5rem', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))' }}>
                {services.map((service) => (
                    <div key={service.id} className="card" style={{ position: 'relative', overflow: 'hidden' }}>
                        <div style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '4px',
                            height: '100%',
                            backgroundColor: service.color
                        }} />
                        <div className="card-header">
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                    <div style={{
                                        width: '3rem',
                                        height: '3rem',
                                        borderRadius: '0.5rem',
                                        backgroundColor: `${service.color}15`,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }}>
                                        <service.icon style={{ width: '1.5rem', height: '1.5rem', color: service.color }} />
                                    </div>
                                    <div>
                                        <h3 className="card-title" style={{ marginBottom: '0.25rem' }}>{service.name}</h3>
                                        <p className="card-description" style={{ margin: 0 }}>{service.description}</p>
                                    </div>
                                </div>
                            </div>

                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                                marginBottom: '1rem',
                                padding: '0.5rem 0.75rem',
                                backgroundColor: service.status === 'active' ? '#10b98115' : '#f3f4f6',
                                borderRadius: '0.375rem',
                                width: 'fit-content'
                            }}>
                                {service.status === 'active' ? (
                                    <CheckCircle2 style={{ width: '1rem', height: '1rem', color: '#10b981' }} />
                                ) : (
                                    <XCircle style={{ width: '1rem', height: '1rem', color: '#6b7280' }} />
                                )}
                                <span style={{
                                    fontSize: '0.875rem',
                                    fontWeight: '600',
                                    color: service.status === 'active' ? '#10b981' : '#6b7280',
                                    textTransform: 'capitalize'
                                }}>
                                    {service.status}
                                </span>
                            </div>

                            <div style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                paddingTop: '1rem',
                                borderTop: '1px solid var(--border)'
                            }}>
                                <div>
                                    <p style={{ fontSize: '0.75rem', color: 'var(--muted-foreground)', margin: '0 0 0.25rem' }}>
                                        Usage
                                    </p>
                                    <p style={{ fontSize: '0.875rem', fontWeight: '600', margin: 0 }}>
                                        {service.usage}
                                    </p>
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    <p style={{ fontSize: '0.75rem', color: 'var(--muted-foreground)', margin: '0 0 0.25rem' }}>
                                        Price
                                    </p>
                                    <p style={{ fontSize: '0.875rem', fontWeight: '600', color: 'var(--primary)', margin: 0 }}>
                                        {service.price}
                                    </p>
                                </div>
                            </div>

                            {service.link ? (
                                <Link
                                    to={service.link}
                                    className={service.status === 'active' ? 'btn btn-secondary' : 'btn btn-primary'}
                                    style={{ width: '100%', marginTop: '1rem' }}
                                >
                                    {service.status === 'active' ? 'Configure' : 'Activate Service'}
                                </Link>
                            ) : (
                                <button
                                    className={service.status === 'active' ? 'btn btn-secondary' : 'btn btn-primary'}
                                    style={{ width: '100%', marginTop: '1rem' }}
                                >
                                    {service.status === 'active' ? 'Configure' : 'Activate Service'}
                                </button>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </>
    );
};

export default ServicesPage;