import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useOutletContext } from 'react-router-dom';
import { Sparkles, XCircle } from 'lucide-react';

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
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.async = true;
        document.body.appendChild(script);
        return () => {
            if (document.body.contains(script)) {
                document.body.removeChild(script);
            }
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
                        fetchData();
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
            alert(error.response?.data?.message || "Failed to activate plan.");
        }
    };

    const handlePlanChange = async (plan, action) => {
        const token = localStorage.getItem('token');
        const endpoint = action === 'upgrade' ? '/api/payment/upgrade-plan' : '/api/payment/downgrade-plan';

        try {
            const { data } = await axios.post(endpoint, {
                planId: plan.id,
                billingCycle
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (data.new_amount_payable > 0) {
                const options = {
                    key: data.key_id,
                    amount: data.new_amount_payable,
                    currency: "INR",
                    name: "SS Infinite",
                    description: `Switch to ${plan.name} Plan`,
                    order_id: data.order_id,
                    handler: async (response) => {
                        await axios.post('/api/payment/verify-plan-change', response, {
                            headers: { Authorization: `Bearer ${token}` }
                        });
                        alert(`Successfully switched to ${plan.name} plan!`);
                        fetchData();
                    },
                    prefill: {
                        name: user ? `${user.firstName} ${user.lastName}` : "",
                        email: user ? user.email : "",
                    },
                    theme: { color: "#6d28d9" }
                };
                const rzp = new window.Razorpay(options);
                rzp.open();
            } else {
                alert(`Successfully switched to ${plan.name} plan! A credit has been applied to your account.`);
                fetchData();
            }
        } catch (error) {
            alert(error.response?.data?.message || `Failed to ${action} plan.`);
        }
    };

    const handleCancelSubscription = async () => {
        if (window.confirm('Are you sure you want to cancel your subscription? This action cannot be undone.')) {
            try {
                const token = localStorage.getItem('token');
                await axios.post('/api/payment/cancel-subscription', {}, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                alert('Your subscription has been cancelled.');
                fetchData();
            } catch (error) {
                alert(error.response?.data?.message || 'Failed to cancel subscription.');
            }
        }
    };

    if (isLoading) return <div style={{ textAlign: 'center', marginTop: '2rem' }}>Loading...</div>;

    const currentPlanPrice = subscription ? (subscription.billing_cycle === 'yearly' ? subscription.price_yearly : subscription.price_monthly) : 0;

    return (
        <>
            <div style={{ marginBottom: '2rem' }}>
                <h1 style={{ fontSize: '2.25rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>Plans & Billing</h1>
                <p style={{ color: 'var(--muted-foreground)' }}>Manage your subscription and explore available plans.</p>
            </div>

            <div className="card" style={{ marginBottom: '2rem', background: 'linear-gradient(135deg, #6d28d9 0%, #5b21b6 100%)', color: 'white' }}>
                <div className="card-header">
                    <h3 className="card-title">Current Subscription</h3>
                    {subscription ? (
                        <>
                            <div style={{ marginTop: '1rem', display: 'flex', flexWrap: 'wrap', gap: '2rem', opacity: 0.9 }}>
                                <div><strong>Plan:</strong> {subscription.plan_name}</div>
                                <div><strong>Status:</strong> <span style={{ textTransform: 'capitalize' }}>{subscription.status}</span></div>
                                <div><strong>Credits Remaining:</strong> {subscription.remaining_credits} / {subscription.total_credits}</div>
                                <div><strong>Renews On:</strong> {new Date(subscription.renews_at).toLocaleDateString()}</div>
                            </div>
                            <div style={{ marginTop: '1.5rem' }}>
                                <button onClick={handleCancelSubscription} className="btn" style={{ backgroundColor: 'rgba(255,255,255,0.1)', color: 'white', border: '1px solid rgba(255,255,255,0.2)' }}>
                                    <XCircle size={16} style={{ marginRight: '0.5rem' }} />
                                    Cancel Subscription
                                </button>
                            </div>
                        </>
                    ) : (
                        <p style={{ marginTop: '1rem', opacity: 0.9 }}>You do not have an active subscription.</p>
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
                {availablePlans.map(plan => {
                    const planPrice = billingCycle === 'yearly' ? plan.price_yearly : plan.price_monthly;
                    const isCurrentPlan = subscription?.plan_name === plan.name && subscription?.billing_cycle === billingCycle;
                    const isUpgrade = subscription && planPrice > currentPlanPrice;
                    const isDowngrade = subscription && planPrice < currentPlanPrice;
                    const action = isUpgrade ? 'upgrade' : (isDowngrade ? 'downgrade' : 'choose');
                    const credits = billingCycle === 'yearly' ? plan.credits_yearly : plan.credits_monthly;

                    return (
                        <div key={plan.id} className="card" style={isCurrentPlan ? { border: '2px solid var(--primary)' } : {}}>
                            <div className="card-header">
                                <h3 className="card-title">{plan.name}</h3>
                                <p className="card-description">{plan.description}</p>
                                <p style={{ fontSize: '1.5rem', fontWeight: 'bold', margin: '1rem 0' }}>
                                    ₹{(planPrice / 100).toFixed(2)}
                                    <span style={{ fontSize: '0.875rem', color: 'var(--muted-foreground)', fontWeight: 'normal' }}>/{billingCycle === 'yearly' ? 'year' : 'month'}</span>
                                </p>
                                <ul style={{ listStyle: 'none', padding: 0, margin: '1rem 0', color: 'var(--muted-foreground)' }}>
                                    <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        <Sparkles size={16} /> {credits} analysis credits
                                    </li>
                                </ul>
                                <button
                                    onClick={() => subscription ? handlePlanChange(plan, action) : handleChoosePlan(plan)}
                                    className={`btn ${isCurrentPlan ? 'btn-secondary' : 'btn-primary'}`}
                                    style={{ width: '100%' }}
                                    disabled={isCurrentPlan}
                                >
                                    {isCurrentPlan ? 'Current Plan' : (isUpgrade ? 'Upgrade' : (isDowngrade ? 'Downgrade' : 'Choose Plan'))}
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>
        </>
    );
};

export default BillingPage;

