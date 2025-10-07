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
            backgroundColor: 'rgba(255, 255, 255, 0.6)',
            backdropFilter: 'blur(10px)',
        }}>
            <div className="container" style={{ height: '4rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.25rem', fontWeight: 'bold', textDecoration: 'none', color: 'var(--foreground)' }}>
                    <Zap style={{ height: '1.5rem', width: '1.5rem', color: 'var(--primary)' }} />
                    SS Infinite
                </Link>

                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
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
