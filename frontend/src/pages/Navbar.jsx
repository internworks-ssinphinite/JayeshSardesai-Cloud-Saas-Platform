import { Link } from 'react-router-dom';
import { Zap } from 'lucide-react';

export const Navbar = () => {
    return (
        <nav style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            zIndex: 50,
            borderBottom: '1px solid var(--border)',
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(12px)',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
        }}>
            <div className="container" style={{ height: '4.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Link to="/" style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    fontSize: '1.25rem',
                    fontWeight: '700',
                    textDecoration: 'none',
                    color: 'var(--foreground)',
                    transition: 'opacity 0.2s'
                }}>
                    <img src="/ss-infinite-logo.svg" alt="SS Infinite Logo" style={{ height: '2.5rem', width: '2.5rem' }} />
                    SS Infinite
                </Link>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <Link to="/login" className="btn btn-ghost">
                        Login
                    </Link>
                    <Link to="/signup" className="btn btn-primary">
                        Start Free Trial
                    </Link>
                </div>
            </div>
        </nav>
    );
};
