// frontend/src/pages/EmailVerifiedPage.jsx
import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import axios from 'axios';
import { CheckCircle, XCircle } from 'lucide-react';

const EmailVerifiedPage = () => {
    const [status, setStatus] = useState('verifying');
    const location = useLocation();

    useEffect(() => {
        const token = new URLSearchParams(location.search).get('token');
        if (token) {
            axios.get(`/api/auth/verify-email?token=${token}`)
                .then(() => setStatus('success'))
                .catch(() => setStatus('error'));
        } else {
            setStatus('error');
        }
    }, [location]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-background p-4">
            <div className="w-full max-w-md text-center">
                {status === 'verifying' && <p>Verifying your email...</p>}
                {status === 'success' && (
                    <>
                        <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                        <h2 className="mt-6 text-2xl font-bold tracking-tight">Email Verified!</h2>
                        <p className="mt-2 text-sm text-muted-foreground">
                            Your email has been successfully verified. You can now log in to your account.
                        </p>
                        <div className="mt-6">
                            <Link to="/login" className="btn btn-primary">
                                Go to Login
                            </Link>
                        </div>
                    </>
                )}
                {status === 'error' && (
                    <>
                        <XCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
                        <h2 className="mt-6 text-2xl font-bold tracking-tight">Verification Failed</h2>
                        <p className="mt-2 text-sm text-muted-foreground">
                            The verification link is invalid or has expired. Please try again or request a new link.
                        </p>
                        <div className="mt-6">
                            <Link to="/login" className="font-medium text-primary hover:underline">
                                Back to Login
                            </Link>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default EmailVerifiedPage;