import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Calendar, CheckCircle2, CreditCard, ArrowRight } from 'lucide-react';

const BillingPage = () => {
    const [subscription, setSubscription] = useState(null);
    const [availableServices, setAvailableServices] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchBillingData = async () => {
            const token = localStorage.getItem('token');
            setIsLoading(true);
            try {
                const [subsResponse, servicesResponse] = await Promise.all([
                    axios.get('/api/services/subscriptions', { headers: { Authorization: `Bearer ${token}` } }),
                    axios.get('/api/services', { headers: { Authorization: `Bearer ${token}` } })
                ]);

                const activeSub = subsResponse.data.find(s => s.status === 'active');
                setSubscription(activeSub);

                const subscribedServiceIds = new Set(subsResponse.data.map(s => s.service_id));
                setAvailableServices(servicesResponse.data.filter(service => !subscribedServiceIds.has(service.id)));

            } catch (err) {
                setError('Failed to load billing information.');
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchBillingData();
    }, []);

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    };

    if (isLoading) return <div>Loading your billing details...</div>;
    if (error) return <div style={{ color: 'var(--destructive)' }}>{error}</div>;

    return (
        <>
            <div style={{ marginBottom: '2rem' }}>
                <h1 style={{ fontSize: '2.25rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>Billing & Plans</h1>
                <p style={{ color: 'var(--muted-foreground)' }}>Manage your current plan and explore other available services.</p>
            </div>

            {/* Current Plan Card */}
            <h3 className="card-title" style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Your Active Plan</h3>
            <div className="card" style={{ marginBottom: '2rem', background: 'linear-gradient(135deg, #6d28d9 0%, #5b21b6 100%)' }}>
                <div className="card-header">
                    {subscription ? (
                        <>
                            <h2 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#ffffff', margin: '0 0 0.5rem' }}>{subscription.name}</h2>
                            <p style={{ fontSize: '1.125rem', color: 'rgba(255, 255, 255, 0.9)' }}>
                                <span style={{ fontSize: '2.5rem', fontWeight: 'bold' }}>₹{(subscription.price / 100).toFixed(2)}</span>
                                <span style={{ fontSize: '1rem' }}>/month</span>
                            </p>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.5rem', marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px solid rgba(255, 255, 255, 0.2)' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <CheckCircle2 style={{ width: '1rem', height: '1rem', color: 'rgba(255, 255, 255, 0.8)' }} />
                                    <p style={{ margin: 0, color: 'rgba(255, 255, 255, 0.8)' }}>Status: Active</p>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <Calendar style={{ width: '1rem', height: '1rem', color: 'rgba(255, 255, 255, 0.8)' }} />
                                    <p style={{ margin: 0, color: 'rgba(255, 255, 255, 0.8)' }}>Renews on: {formatDate(subscription.expires_at)}</p>
                                </div>
                            </div>
                        </>
                    ) : (
                        <div style={{ color: 'white' }}>
                            <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>No Active Plan</h2>
                            <p style={{ opacity: 0.9 }}>Choose a plan below to get started.</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Available Plans Section */}
            <h3 className="card-title" style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Available Plans</h3>
            {availableServices.length > 0 ? (
                <div style={{ display: 'grid', gap: '1.5rem', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' }}>
                    {availableServices.map(service => (
                        <div key={service.id} className="card">
                            <div className="card-header">
                                <h3 className="card-title">{service.name}</h3>
                                <p className="card-description">{service.description}</p>
                                <p style={{ fontSize: '1.5rem', fontWeight: 'bold', margin: '1rem 0' }}>
                                    ₹{(service.price / 100).toFixed(2)}
                                    <span style={{ fontSize: '0.875rem', color: 'var(--muted-foreground)', fontWeight: 'normal' }}>/month</span>
                                </p>
                                <button onClick={() => navigate('/dashboard/services')} className="btn btn-primary" style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    Activate Now <ArrowRight size={16} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <p>You are currently subscribed to all available services.</p>
            )}
        </>
    );
};

export default BillingPage;