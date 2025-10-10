import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useOutletContext } from 'react-router-dom';
import axios from 'axios';
import { FileSearch, CheckCircle2, XCircle, ArrowRight } from 'lucide-react';

const ServicesPage = () => {
    const { user } = useOutletContext();
    const [availableServices, setAvailableServices] = useState([]);
    const [userSubscriptions, setUserSubscriptions] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            const token = localStorage.getItem('token');
            try {
                const [servicesRes, subsRes] = await Promise.all([
                    axios.get('/api/services', { headers: { Authorization: `Bearer ${token}` } }),
                    axios.get('/api/services/subscriptions', { headers: { Authorization: `Bearer ${token}` } })
                ]);
                setAvailableServices(servicesRes.data);
                setUserSubscriptions(subsRes.data.map(sub => sub.id)); // Store active subscription IDs
            } catch (error) {
                console.error("Failed to fetch services or subscriptions", error);
            }
        };

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

    const handleActivateService = async (service) => {
        try {
            const token = localStorage.getItem('token');
            // 1. Create Order
            const { data: order } = await axios.post('/api/payment/create-order', { serviceId: service.id }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            // 2. Configure Razorpay
            const options = {
                key: order.key_id,
                amount: order.amount,
                currency: "INR",
                name: "SS Infinite",
                description: `Activate ${service.name}`,
                image: "/ss-infinite-logo.svg",
                order_id: order.id,
                handler: async function (response) {
                    // 3. Verify Payment
                    const verificationResponse = await axios.post('/api/payment/verify-payment', response, {
                        headers: { Authorization: `Bearer ${token}` }
                    });

                    if (verificationResponse.data.success) {
                        alert(`${service.name} activated successfully!`);
                        // Refresh subscriptions to update UI
                        const subsRes = await axios.get('/api/services/subscriptions', { headers: { Authorization: `Bearer ${token}` } });
                        setUserSubscriptions(subsRes.data.map(sub => sub.id));
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

            // 4. Open Checkout
            const rzp = new window.Razorpay(options);
            rzp.open();

        } catch (error) {
            console.error("Activation failed:", error);
            alert("Failed to activate service.");
        }
    };

    // Example colors for different services
    const serviceColors = {
        1: '#8b5cf6', // Document Analyzer
        // Add more colors by service ID as you add more services
    };

    return (
        <>
            <div style={{ marginBottom: '2rem' }}>
                <h1 style={{ fontSize: '2.25rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>Manage Your Services</h1>
                <p style={{ color: 'var(--muted-foreground)' }}>
                    Activate and manage all your integrated services in one place.
                </p>
            </div>

            <div style={{ display: 'grid', gap: '1.5rem', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))' }}>
                {availableServices.map((service) => {
                    const isSubscribed = userSubscriptions.includes(service.id);
                    const color = serviceColors[service.id] || '#6b7280';

                    return (
                        <div key={service.id} className="card" style={{ position: 'relative', overflow: 'hidden' }}>
                            <div style={{ position: 'absolute', top: 0, left: 0, width: '4px', height: '100%', backgroundColor: color }} />
                            <div className="card-header">
                                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                                    <div style={{ width: '3rem', height: '3rem', borderRadius: '0.5rem', backgroundColor: `${color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <FileSearch style={{ width: '1.5rem', height: '1.5rem', color: color }} />
                                    </div>
                                    <div>
                                        <h3 className="card-title" style={{ marginBottom: '0.25rem' }}>{service.name}</h3>
                                        <p className="card-description" style={{ margin: 0 }}>{service.description}</p>
                                    </div>
                                </div>

                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                                    <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--primary)', margin: 0 }}>
                                        ₹{(service.price / 100).toFixed(2)}
                                        <span style={{ fontSize: '0.875rem', color: 'var(--muted-foreground)', fontWeight: 'normal' }}>/month</span>
                                    </p>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 0.75rem', backgroundColor: isSubscribed ? '#10b98115' : '#f3f4f6', borderRadius: '0.375rem' }}>
                                        {isSubscribed ? <CheckCircle2 style={{ width: '1rem', height: '1rem', color: '#10b981' }} /> : <XCircle style={{ width: '1rem', height: '1rem', color: '#6b7280' }} />}
                                        <span style={{ fontSize: '0.875rem', fontWeight: '600', color: isSubscribed ? '#10b981' : '#6b7280' }}>
                                            {isSubscribed ? 'Active' : 'Inactive'}
                                        </span>
                                    </div>
                                </div>

                                <div style={{ paddingTop: '1.5rem', borderTop: '1px solid var(--border)' }}>
                                    {isSubscribed ? (
                                        <Link to="/dashboard/analyzer" className='btn btn-secondary' style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            Go to Service <ArrowRight style={{ width: '1rem', height: '1rem' }} />
                                        </Link>
                                    ) : (
                                        <button onClick={() => handleActivateService(service)} className="btn btn-primary" style={{ width: '100%' }}>
                                            Activate Service
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </>
    );
};

export default ServicesPage;