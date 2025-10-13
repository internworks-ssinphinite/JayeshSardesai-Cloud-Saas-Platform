import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useOutletContext } from 'react-router-dom';
import { Calendar, CheckCircle2, Sparkles } from 'lucide-react';

const BillingPage = () => {
    const { user } = useOutletContext();
    const [subscription, setSubscription] = useState(null);
    const [availablePlans, setAvailablePlans] = useState([]);
    const [billingCycle, setBillingCycle] = useState('monthly');
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    const fetchData = async () => {
        setIsLoading(true);
        const token = localStorage.getItem('token');
        try {
            const [plansRes, subRes] = await Promise.all([
                axios.get('/api/plans', { headers: { Authorization: `Bearer ${token}` } }),
                axios.get('/api/plans/subscription', { headers: { Authorization: `Bearer ${token}` } })
            ]);
            setAvailablePlans(plansRes.data);
            setSubscription(subRes.data);
            setError('');
        } catch (err) {
            setError('Failed to load billing information. Please try again later.');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();

        // Load Razorpay script
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.async = true;
        document.body.appendChild(script);

        return () => {
            document.body.removeChild(script);
        };
    }, []);

    const handleChoosePlan = async (plan) => {
        try {
            const token = localStorage.getItem('token');
            const { data: order } = await axios.post('/api/payment/create-order',
                { planId: plan.id, billingCycle },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            const options = {
                key: order.key_id,
                amount: order.amount,
                currency: "INR",
                name: "SS Infinite",
                description: `Activate ${plan.name} Plan`,
                image: "/ss-infinite-logo.svg",
                order_id: order.id,
                handler: async (response) => {
                    const verificationResponse = await axios.post('/api/payment/verify-payment', response, {
                        headers: { Authorization: `Bearer ${token}` }
                    });

                    if (verificationResponse.data.success) {
                        alert(`${plan.name} plan activated successfully!`);
                        fetchData(); // Refresh subscription data
                    } else {
                        alert("Payment verification failed.");
                    }
                },
                prefill: {
                    name: user ? `${user.firstName} ${user.lastName}` : "",
                    email: user ? user.email : "",
                },
                theme: { color: "#6d28d9" }
            };

            const rzp = new window.Razorpay(options);
            rzp.open();

        } catch (error) {
            console.error("Activation failed:", error);
            alert("Failed to activate plan.");
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    };

    if (isLoading) return <div style={{ textAlign: 'center', marginTop: '2rem' }}>Loading your billing details...</div>;

    return (
        <>
            <div style={{ marginBottom: '2rem' }}>
                <h1 style={{ fontSize: '2.25rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>Plans & Billing</h1>
                <p style={{ color: 'var(--muted-foreground)' }}>Manage your subscription and explore available plans.</p>
            </div>

            {error && <div className="card" style={{ marginBottom: '2rem', backgroundColor: 'rgba(239, 68, 68, 0.1)', borderColor: 'var(--destructive)' }}><div className="card-header"><p style={{ color: '#c02626' }}>{error}</p></div></div>}

            <div className="card" style={{ marginBottom: '2rem' }}>
                <div className="card-header">
                    <h3 className="card-title">Current Subscription</h3>
                    {subscription ? (
                        <div style={{ marginTop: '1rem', display: 'flex', flexWrap: 'wrap', gap: '2rem' }}>
                            <div><strong>Plan:</strong> {subscription.plan_name}</div>
                            <div><strong>Status:</strong> <span style={{ textTransform: 'capitalize' }}>{subscription.status}</span></div>
                            <div><strong>Credits Remaining:</strong> {subscription.remaining_credits} / {subscription.total_credits}</div>
                            <div><strong>Renews On:</strong> {formatDate(subscription.renews_at)}</div>
                        </div>
                    ) : (
                        <p style={{ color: 'var(--muted-foreground)', marginTop: '1rem' }}>You do not have an active subscription.</p>
                    )}
                </div>
            </div>

            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                <div style={{ display: 'inline-flex', padding: '4px', backgroundColor: 'var(--muted)', borderRadius: 'var(--radius)' }}>
                    <button onClick={() => setBillingCycle('monthly')} style={{ padding: '8px 16px', borderRadius: '6px', border: 'none', background: billingCycle === 'monthly' ? 'var(--primary)' : 'transparent', color: billingCycle === 'monthly' ? 'white' : 'black', cursor: 'pointer' }}>Monthly</button>
                    <button onClick={() => setBillingCycle('yearly')} style={{ padding: '8px 16px', borderRadius: '6px', border: 'none', background: billingCycle === 'yearly' ? 'var(--primary)' : 'transparent', color: billingCycle === 'yearly' ? 'white' : 'black', cursor: 'pointer' }}>Yearly (Save 20%)</button>
                </div>
            </div>

            <div style={{ display: 'grid', gap: '1.5rem', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' }}>
                {availablePlans.length > 0 ? (
                    availablePlans.map(plan => (
                        <div key={plan.id} className="card">
                            <div className="card-header">
                                <h3 className="card-title">{plan.name}</h3>
                                <p className="card-description">{plan.description}</p>
                                <p style={{ fontSize: '1.5rem', fontWeight: 'bold', margin: '1rem 0' }}>
                                    ₹{((billingCycle === 'yearly' ? plan.price_yearly : plan.price_monthly) / 100).toFixed(2)}
                                    <span style={{ fontSize: '0.875rem', color: 'var(--muted-foreground)', fontWeight: 'normal' }}>
                                        /{billingCycle === 'yearly' ? 'year' : 'month'}
                                    </span>
                                </p>
                                <ul style={{ listStyle: 'none', padding: 0, margin: '1rem 0', color: 'var(--muted-foreground)' }}>
                                    <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        <Sparkles size={16} /> {plan.analysis_credits} analysis credits
                                    </li>
                                </ul>
                                <button
                                    onClick={() => handleChoosePlan(plan)}
                                    className="btn btn-primary"
                                    style={{ width: '100%' }}
                                    disabled={subscription?.plan_name === plan.name}
                                >
                                    {subscription?.plan_name === plan.name ? 'Current Plan' : 'Choose Plan'}
                                </button>
                            </div>
                        </div>
                    ))
                ) : !isLoading && !error ? (
                    <div className="card"><div className="card-header"><p>No plans are available at this moment.</p></div></div>
                ) : null}
            </div>
        </>
    );
};

export default BillingPage;