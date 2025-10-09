import React, { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { User, Mail, Lock, Save, Eye, EyeOff } from 'lucide-react';
import axios from 'axios';

const SettingsPage = () => {
    const { user } = useOutletContext();

    const [otp, setOtp] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [otpSent, setOtpSent] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const handlePasswordChangeRequest = async () => {
        try {
            const token = localStorage.getItem('token');
            await axios.post('/api/auth/request-password-reset', {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setOtpSent(true);
            setMessage('An OTP has been sent to your email.');
            setError('');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to send OTP.');
            setMessage('');
        }
    };

    const handlePasswordReset = async (e) => {
        e.preventDefault();
        setError('');
        if (newPassword !== confirmNewPassword) {
            setError("New passwords do not match.");
            return;
        }
        try {
            const token = localStorage.getItem('token');
            const response = await axios.post('/api/auth/reset-password', { otp, newPassword }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setMessage(response.data.message);
            setError('');
            setOtpSent(false);
            setOtp('');
            setNewPassword('');
            setConfirmNewPassword('');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to reset password.');
            setMessage('');
        }
    };

    return (
        <>
            <div style={{ marginBottom: '2rem' }}>
                <h1 style={{ fontSize: '2.25rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>Account Settings</h1>
                <p style={{ color: 'var(--muted-foreground)' }}>
                    Manage your account preferences and security settings.
                </p>
            </div>

            <div style={{ display: 'grid', gap: '1.5rem', maxWidth: '800px' }}>
                {/* Profile Information Card */}
                <div className="card">
                    <div className="card-header">
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
                            <div style={{
                                width: '2.5rem',
                                height: '2.5rem',
                                borderRadius: '0.5rem',
                                background: 'linear-gradient(135deg, #6d28d9 0%, #5b21b6 100%)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}>
                                <User style={{ width: '1.25rem', height: '1.25rem', color: '#ffffff' }} />
                            </div>
                            <h3 className="card-title">Profile Information</h3>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', marginBottom: '0.5rem' }}>Full Name</label>
                                <p className="w-full px-3 py-2 bg-muted text-muted-foreground rounded-md border border-border">
                                    {user ? `${user.firstName} ${user.lastName}` : 'Loading...'}
                                </p>
                            </div>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', marginBottom: '0.5rem' }}>Email Address</label>
                                <p className="w-full px-3 py-2 bg-muted text-muted-foreground rounded-md border border-border">
                                    {user ? user.email : 'Loading...'}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Password Change Card */}
                <div className="card">
                    <div className="card-header">
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
                            <div style={{ width: '2.5rem', height: '2.5rem', borderRadius: '0.5rem', backgroundColor: 'rgba(239, 68, 68, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <Lock style={{ width: '1.25rem', height: '1.25rem', color: '#ef4444' }} />
                            </div>
                            <h3 className="card-title">Change Password</h3>
                        </div>

                        {!otpSent ? (
                            <button className="btn btn-secondary" onClick={handlePasswordChangeRequest}>
                                Send Password Reset OTP
                            </button>
                        ) : (
                            <form onSubmit={handlePasswordReset} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                <div>
                                    <label htmlFor="otp">OTP</label>
                                    <input
                                        id="otp"
                                        type="text"
                                        value={otp}
                                        onChange={(e) => setOtp(e.target.value)}
                                        required
                                        className="w-full mt-1 px-3 py-2 border border-border rounded-md"
                                        placeholder="Enter OTP from your email"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="newPassword">New Password</label>
                                    {/* THIS IS THE CORRECTED PASSWORD INPUT */}
                                    <div className="mt-1 relative">
                                        <input
                                            id="newPassword"
                                            type={showPassword ? 'text' : 'password'}
                                            value={newPassword}
                                            onChange={(e) => setNewPassword(e.target.value)}
                                            required
                                            className="w-full px-3 py-2 border border-border rounded-md"
                                            placeholder="Minimum 8 characters"
                                        />
                                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                                            {showPassword ? (
                                                <EyeOff className="h-5 w-5 text-gray-400 cursor-pointer" onClick={() => setShowPassword(false)} />
                                            ) : (
                                                <Eye className="h-5 w-5 text-gray-400 cursor-pointer" onClick={() => setShowPassword(true)} />
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <label htmlFor="confirmNewPassword">Confirm New Password</label>
                                    {/* THIS IS THE CORRECTED PASSWORD INPUT */}
                                    <div className="mt-1 relative">
                                        <input
                                            id="confirmNewPassword"
                                            type={showPassword ? 'text' : 'password'}
                                            value={confirmNewPassword}
                                            onChange={(e) => setConfirmNewPassword(e.target.value)}
                                            required
                                            className="w-full px-3 py-2 border border-border rounded-md"
                                            placeholder="Re-enter new password"
                                        />
                                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                                            {showPassword ? (
                                                <EyeOff className="h-5 w-5 text-gray-400 cursor-pointer" onClick={() => setShowPassword(false)} />
                                            ) : (
                                                <Eye className="h-5 w-5 text-gray-400 cursor-pointer" onClick={() => setShowPassword(true)} />
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <button type="submit" className="btn btn-primary" style={{ width: 'fit-content' }}>
                                    <Save style={{ width: '1rem', height: '1rem', marginRight: '0.5rem' }} />
                                    Reset Password
                                </button>
                            </form>
                        )}
                        {message && <p style={{ color: 'green', marginTop: '1rem' }}>{message}</p>}
                        {error && <p style={{ color: 'red', marginTop: '1rem' }}>{error}</p>}
                    </div>
                </div>
            </div>
        </>
    );
};

export default SettingsPage;