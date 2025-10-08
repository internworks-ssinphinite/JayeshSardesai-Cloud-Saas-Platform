import { Link } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Zap, Shield, Plug, Sparkles, ArrowRight } from 'lucide-react';

const LandingPage = () => {
    return (
        <div style={{ minHeight: '100vh', backgroundColor: 'var(--background)' }}>
            <Navbar />

            {/* Hero Section */}
            <section style={{ paddingTop: '8rem', paddingBottom: '5rem', textAlign: 'center' }}>
                <div className="container">
                    <h1 style={{ fontSize: '3.5rem', fontWeight: '800', marginBottom: '1.5rem' }}>
                        Unify Your Fragmented Tools.
                        <br />
                        Unleash Your Team's Potential.
                    </h1>
                    <p style={{ fontSize: '1.25rem', color: 'var(--muted-foreground)', marginBottom: '2rem', maxWidth: '600px', margin: '0 auto 2rem' }}>
                        SS Infinite brings all your services under one roof with an intelligent AI assistant that learns and adapts to your workflow.
                    </p>
                    <Link to="/signup" className="btn btn-primary" style={{ padding: '0.75rem 1.5rem', fontSize: '1rem' }}>
                        Start Your Free Trial
                        <ArrowRight style={{ marginLeft: '0.5rem', height: '1rem', width: '1rem' }} />
                    </Link>
                </div>
            </section>

            {/* Three Pillars Section */}
            <section style={{ padding: '5rem 0', backgroundColor: 'var(--muted)' }}>
                <div className="container">
                    <h2 style={{ fontSize: '2.5rem', fontWeight: '700', textAlign: 'center', marginBottom: '3rem' }}>
                        Built on Three Unshakeable Pillars
                    </h2>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
                        {/* Pillar 1 */}
                        <div className="card">
                            <div className="card-header">
                                <div style={{ height: '3rem', width: '3rem', borderRadius: '0.5rem', backgroundColor: 'var(--primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem', background: "rgba(109, 40, 217, 0.1)" }}>
                                    <Zap style={{ height: '1.5rem', width: '1.5rem', color: 'var(--primary)' }} />
                                </div>
                                <h3 className="card-title">Intuitive Experience</h3>
                                <p className="card-description">A single, elegant interface that feels familiar from day one. No steep learning curves.</p>
                            </div>
                        </div>
                        {/* Pillar 2 */}
                        <div className="card">
                            <div className="card-header">
                                <div style={{ height: '3rem', width: '3rem', borderRadius: '0.5rem', backgroundColor: 'var(--primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem', background: "rgba(109, 40, 217, 0.1)" }}>
                                    <Shield style={{ height: '1.5rem', width: '1.5rem', color: 'var(--primary)' }} />
                                </div>
                                <h3 className="card-title">Secure Billing</h3>
                                <p className="card-description">One transparent invoice. Bank-grade encryption. Complete control over your subscription.</p>
                            </div>
                        </div>
                        {/* Pillar 3 */}
                        <div className="card">
                            <div className="card-header">
                                <div style={{ height: '3rem', width: '3rem', borderRadius: '0.5rem', backgroundColor: 'var(--primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem', background: "rgba(109, 40, 217, 0.1)" }}>
                                    <Plug style={{ height: '1.5rem', width: '1.5rem', color: 'var(--primary)' }} />
                                </div>
                                <h3 className="card-title">Plug-and-Play Architecture</h3>
                                <p className="card-description">Activate and deactivate services instantly. Scale up or down as your needs evolve.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer style={{ 
                padding: '3rem 0', 
                borderTop: '1px solid var(--border)',
                backgroundColor: '#ffffff',
                marginTop: '4rem'
            }}>
                <div className="container">
                    <div style={{ 
                        display: 'flex', 
                        flexDirection: 'column', 
                        alignItems: 'center', 
                        gap: '1rem',
                        textAlign: 'center'
                    }}>
                        <div style={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            gap: '0.5rem',
                            marginBottom: '0.5rem'
                        }}>
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                width: '2rem',
                                height: '2rem',
                                borderRadius: '0.375rem',
                                background: 'linear-gradient(135deg, #6d28d9 0%, #5b21b6 100%)',
                            }}>
                                <Zap style={{ height: '1rem', width: '1rem', color: '#ffffff' }} />
                            </div>
                            <span style={{ 
                                fontSize: '1.125rem', 
                                fontWeight: '700',
                                color: 'var(--foreground)'
                            }}>
                                SS Infinite
                            </span>
                        </div>
                        <p style={{ 
                            fontSize: '0.875rem', 
                            color: 'var(--muted-foreground)',
                            maxWidth: '500px',
                            margin: '0 0 1rem'
                        }}>
                            Unify your tools. Unleash your potential. Experience the future of integrated productivity.
                        </p>
                        <div style={{
                            paddingTop: '1rem',
                            borderTop: '1px solid var(--border)',
                            width: '100%',
                            maxWidth: '600px'
                        }}>
                            <p style={{ 
                                fontSize: '0.8125rem', 
                                color: 'var(--muted-foreground)',
                                margin: 0
                            }}>
                                © {new Date().getFullYear()} SS Infinite. All rights reserved.
                            </p>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;
