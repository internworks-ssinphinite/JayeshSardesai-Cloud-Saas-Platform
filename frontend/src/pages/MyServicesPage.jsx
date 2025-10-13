import React from 'react';
import { useOutletContext } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';

const MyServicesPage = () => {
    const { user } = useOutletContext();

    // In the future, you might have multiple services. For now, we'll just show the Document Analyzer.
    const hasActivePlan = user && user.planName && user.planName !== 'No Plan';

    return (
        <>
            <div style={{ marginBottom: '2rem' }}>
                <h1 style={{ fontSize: '2.25rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>My Services</h1>
                <p style={{ color: 'var(--muted-foreground)' }}>
                    Access all the services included in your current plan.
                </p>
            </div>

            <div style={{ display: 'grid', gap: '1.5rem', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))' }}>
                {hasActivePlan ? (
                    <div className="card">
                        <div className="card-header">
                            <h3 className="card-title">Document Analyzer</h3>
                            <p className="card-description">Summarize text and analyze images in your documents.</p>
                            <div style={{ margin: '1rem 0' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <Sparkles size={16} className="text-primary" />
                                    <span>{user.remainingCredits} Credits Remaining</span>
                                </div>
                            </div>
                            <Link to="/dashboard/analyzer" className='btn btn-primary' style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                Launch Service <ArrowRight size={16} />
                            </Link>
                        </div>
                    </div>
                ) : (
                    <div className="card" style={{ textAlign: 'center', padding: '2rem' }}>
                        <h3 className="card-title">No Services Active</h3>
                        <p className="card-description" style={{ marginBottom: '1.5rem' }}>
                            You don't have an active plan. Please choose a plan to access services.
                        </p>
                        <Link to="/dashboard/billing" className="btn btn-primary">
                            View Plans
                        </Link>
                    </div>
                )}
                {/* When you add more services, you can add more cards here */}
            </div>
        </>
    );
};

export default MyServicesPage;