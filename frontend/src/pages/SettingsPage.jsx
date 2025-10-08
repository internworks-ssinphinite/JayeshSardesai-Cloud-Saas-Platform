import React, { useState } from 'react';
import { User, Mail, Lock, Bell, Shield, Globe, Trash2, Save } from 'lucide-react';

const SettingsPage = () => {
    const [settings, setSettings] = useState({
        name: 'John Doe',
        email: 'john.doe@example.com',
        notifications: {
            email: true,
            push: false,
            billing: true,
            updates: true
        }
    });

    return (
        <>
            <div style={{ marginBottom: '2rem' }}>
                <h1 style={{ fontSize: '2.25rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>Account Settings</h1>
                <p style={{ color: 'var(--muted-foreground)' }}>
                    Manage your account preferences and security settings.
                </p>
            </div>

            <div style={{ display: 'grid', gap: '1.5rem', maxWidth: '800px' }}>
                {/* Profile Settings */}
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
                                <label style={{ 
                                    display: 'block', 
                                    fontSize: '0.875rem', 
                                    fontWeight: '600', 
                                    marginBottom: '0.5rem',
                                    color: 'var(--foreground)'
                                }}>
                                    Full Name
                                </label>
                                <input
                                    type="text"
                                    value={settings.name}
                                    onChange={(e) => setSettings({...settings, name: e.target.value})}
                                    style={{
                                        width: '100%',
                                        padding: '0.625rem 0.875rem',
                                        fontSize: '0.875rem',
                                        border: '1.5px solid var(--border)',
                                        borderRadius: 'var(--radius)',
                                        backgroundColor: '#ffffff',
                                        color: 'var(--foreground)'
                                    }}
                                />
                            </div>
                            
                            <div>
                                <label style={{ 
                                    display: 'block', 
                                    fontSize: '0.875rem', 
                                    fontWeight: '600', 
                                    marginBottom: '0.5rem',
                                    color: 'var(--foreground)'
                                }}>
                                    Email Address
                                </label>
                                <input
                                    type="email"
                                    value={settings.email}
                                    onChange={(e) => setSettings({...settings, email: e.target.value})}
                                    style={{
                                        width: '100%',
                                        padding: '0.625rem 0.875rem',
                                        fontSize: '0.875rem',
                                        border: '1.5px solid var(--border)',
                                        borderRadius: 'var(--radius)',
                                        backgroundColor: '#ffffff',
                                        color: 'var(--foreground)'
                                    }}
                                />
                            </div>

                            <button className="btn btn-primary" style={{ width: 'fit-content', marginTop: '0.5rem' }}>
                                <Save style={{ width: '1rem', height: '1rem', marginRight: '0.5rem' }} />
                                Save Changes
                            </button>
                        </div>
                    </div>
                </div>

                {/* Security Settings */}
                <div className="card">
                    <div className="card-header">
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
                            <div style={{
                                width: '2.5rem',
                                height: '2.5rem',
                                borderRadius: '0.5rem',
                                backgroundColor: 'rgba(239, 68, 68, 0.1)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}>
                                <Lock style={{ width: '1.25rem', height: '1.25rem', color: '#ef4444' }} />
                            </div>
                            <h3 className="card-title">Security</h3>
                        </div>
                        
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <div style={{ 
                                display: 'flex', 
                                justifyContent: 'space-between', 
                                alignItems: 'center',
                                padding: '1rem',
                                backgroundColor: 'var(--muted)',
                                borderRadius: 'var(--radius)'
                            }}>
                                <div>
                                    <p style={{ fontWeight: '600', marginBottom: '0.25rem' }}>Password</p>
                                    <p style={{ fontSize: '0.875rem', color: 'var(--muted-foreground)', margin: 0 }}>
                                        Last changed 3 months ago
                                    </p>
                                </div>
                                <button className="btn btn-secondary">
                                    Change Password
                                </button>
                            </div>

                            <div style={{ 
                                display: 'flex', 
                                justifyContent: 'space-between', 
                                alignItems: 'center',
                                padding: '1rem',
                                backgroundColor: 'var(--muted)',
                                borderRadius: 'var(--radius)'
                            }}>
                                <div>
                                    <p style={{ fontWeight: '600', marginBottom: '0.25rem' }}>Two-Factor Authentication</p>
                                    <p style={{ fontSize: '0.875rem', color: 'var(--muted-foreground)', margin: 0 }}>
                                        Add an extra layer of security
                                    </p>
                                </div>
                                <button className="btn btn-primary">
                                    Enable 2FA
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Notification Settings */}
                <div className="card">
                    <div className="card-header">
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
                            <div style={{
                                width: '2.5rem',
                                height: '2.5rem',
                                borderRadius: '0.5rem',
                                backgroundColor: 'rgba(16, 185, 129, 0.1)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}>
                                <Bell style={{ width: '1.25rem', height: '1.25rem', color: '#10b981' }} />
                            </div>
                            <h3 className="card-title">Notifications</h3>
                        </div>
                        
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            {[
                                { key: 'email', label: 'Email Notifications', desc: 'Receive updates via email' },
                                { key: 'push', label: 'Push Notifications', desc: 'Browser push notifications' },
                                { key: 'billing', label: 'Billing Alerts', desc: 'Payment and invoice notifications' },
                                { key: 'updates', label: 'Product Updates', desc: 'New features and improvements' }
                            ].map((item) => (
                                <div key={item.key} style={{ 
                                    display: 'flex', 
                                    justifyContent: 'space-between', 
                                    alignItems: 'center',
                                    padding: '1rem',
                                    backgroundColor: 'var(--muted)',
                                    borderRadius: 'var(--radius)'
                                }}>
                                    <div>
                                        <p style={{ fontWeight: '600', marginBottom: '0.25rem' }}>{item.label}</p>
                                        <p style={{ fontSize: '0.875rem', color: 'var(--muted-foreground)', margin: 0 }}>
                                            {item.desc}
                                        </p>
                                    </div>
                                    <label style={{ position: 'relative', display: 'inline-block', width: '3rem', height: '1.5rem' }}>
                                        <input
                                            type="checkbox"
                                            checked={settings.notifications[item.key]}
                                            onChange={(e) => setSettings({
                                                ...settings,
                                                notifications: {
                                                    ...settings.notifications,
                                                    [item.key]: e.target.checked
                                                }
                                            })}
                                            style={{ opacity: 0, width: 0, height: 0 }}
                                        />
                                        <span style={{
                                            position: 'absolute',
                                            cursor: 'pointer',
                                            top: 0,
                                            left: 0,
                                            right: 0,
                                            bottom: 0,
                                            backgroundColor: settings.notifications[item.key] ? 'var(--primary)' : '#d1d5db',
                                            transition: '0.3s',
                                            borderRadius: '9999px'
                                        }}>
                                            <span style={{
                                                position: 'absolute',
                                                content: '',
                                                height: '1.125rem',
                                                width: '1.125rem',
                                                left: settings.notifications[item.key] ? '1.625rem' : '0.1875rem',
                                                bottom: '0.1875rem',
                                                backgroundColor: 'white',
                                                transition: '0.3s',
                                                borderRadius: '50%'
                                            }} />
                                        </span>
                                    </label>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Danger Zone */}
                <div className="card" style={{ borderColor: '#ef4444' }}>
                    <div className="card-header">
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
                            <div style={{
                                width: '2.5rem',
                                height: '2.5rem',
                                borderRadius: '0.5rem',
                                backgroundColor: 'rgba(239, 68, 68, 0.1)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}>
                                <Trash2 style={{ width: '1.25rem', height: '1.25rem', color: '#ef4444' }} />
                            </div>
                            <h3 className="card-title" style={{ color: '#ef4444' }}>Danger Zone</h3>
                        </div>
                        
                        <div style={{ 
                            padding: '1rem',
                            backgroundColor: 'rgba(239, 68, 68, 0.05)',
                            borderRadius: 'var(--radius)',
                            border: '1px solid rgba(239, 68, 68, 0.2)'
                        }}>
                            <p style={{ fontWeight: '600', marginBottom: '0.5rem' }}>Delete Account</p>
                            <p style={{ fontSize: '0.875rem', color: 'var(--muted-foreground)', marginBottom: '1rem' }}>
                                Once you delete your account, there is no going back. Please be certain.
                            </p>
                            <button style={{
                                padding: '0.5rem 1rem',
                                fontSize: '0.875rem',
                                fontWeight: '600',
                                color: '#ffffff',
                                backgroundColor: '#ef4444',
                                border: 'none',
                                borderRadius: 'var(--radius)',
                                cursor: 'pointer'
                            }}>
                                Delete Account
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default SettingsPage;