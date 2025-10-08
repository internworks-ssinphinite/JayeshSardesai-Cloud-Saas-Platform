// frontend/src/pages/CheckEmailPage.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { Mail } from 'lucide-react';

const CheckEmailPage = () => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-background p-4">
            <div className="w-full max-w-md text-center">
                <Mail className="h-12 w-12 text-primary mx-auto mb-4" />
                <h2 className="mt-6 text-2xl font-bold tracking-tight">Check your email</h2>
                <p className="mt-2 text-sm text-muted-foreground">
                    We've sent a verification link to your email address. Please check your inbox and follow the link to activate your account.
                </p>
                <div className="mt-6">
                    <Link to="/login" className="font-medium text-primary hover:underline">
                        Back to Login
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default CheckEmailPage;