import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Zap } from 'lucide-react';

const SignUpPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }
        try {
            const response = await axios.post('/api/auth/register', { email, password });
            localStorage.setItem('token', response.data.token);
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || 'Sign up failed. Please try again.');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-background p-4">
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <Link to="/" className="flex items-center justify-center gap-2 text-2xl font-bold text-foreground">
                        <Zap className="h-7 w-7 text-primary" />
                        SS Infinite
                    </Link>
                    <h2 className="mt-6 text-2xl font-bold tracking-tight">Create an account</h2>
                    <p className="mt-2 text-sm text-muted-foreground">
                        Already have an account?{' '}
                        <Link to="/login" className="font-medium text-primary hover:underline">Log In</Link>
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="email">Email address</label>
                        <div className="mt-1">
                            <input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="w-full px-3 py-2 border border-border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary"
                                placeholder="you@example.com"
                            />
                        </div>
                    </div>
                    <div>
                        <label htmlFor="password">Password</label>
                        <div className="mt-1">
                            <input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="w-full px-3 py-2 border border-border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary"
                                placeholder="Minimum 8 characters"
                            />
                        </div>
                    </div>
                    <div>
                        <label htmlFor="confirmPassword">Confirm Password</label>
                        <div className="mt-1">
                            <input
                                id="confirmPassword"
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                                className="w-full px-3 py-2 border border-border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary"
                                placeholder="Re-enter your password"
                            />
                        </div>
                    </div>

                    {error && <p className="text-sm text-red-600">{error}</p>}

                    <div>
                        <button type="submit" className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-primary-foreground bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary">
                            Create Account
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default SignUpPage;
