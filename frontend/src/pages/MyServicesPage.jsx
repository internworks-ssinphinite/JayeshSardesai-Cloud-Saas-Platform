import React from 'react';
import { useOutletContext } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';

const MyServicesPage = () => {
    const { user } = useOutletContext();

    if (!user) {
        return <div>Loading your services...</div>;
    }

    const hasActivePlan = user && user.planName && user.planName !== 'No Plan';

    return (
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            <div style={{ marginBottom: '2rem' }}>
                <h1 style={{ fontSize: '2.25rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>Available Services</h1>
                <p style={{ color: 'var(--muted-foreground)' }}>
                    Explore the services we offer. Choose a plan to get started.
                </p>
            </div>

            <div style={{ display: 'grid', gap: '1.5rem', gridTemplateColumns: '1fr' }}>
                <div className="card">
                    <div className="card-header">
                        <h3 className="card-title">Document Analyzer</h3>
                        <p className="card-description">Summarize text and analyze images in your documents.</p>

                        {hasActivePlan ? (
                            <>
                                <div style={{ margin: '1rem 0' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        <Sparkles size={16} className="text-primary" />
                                        <span>{user.remainingCredits} Credits Remaining</span>
                                    </div>
                                </div>
                                <Link to="/dashboard/analyzer" className='btn btn-primary' style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    Launch Service <ArrowRight size={16} />
                                </Link>
                            </>
                        ) : (
                            <>
                                <div style={{ margin: '1rem 0' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        <Sparkles size={16} className="text-primary" />
                                        <span>Subscribe to a plan to get credits and use this service.</span>
                                    </div>
                                </div>
                                <Link to="/dashboard/billing" className="btn btn-primary" style={{ width: '100%' }}>
                                    View Plans
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MyServicesPage;