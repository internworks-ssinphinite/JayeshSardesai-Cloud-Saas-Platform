import React from 'react';
import { Bell, Zap } from 'lucide-react';

const NotificationsPage = () => {
    const notifications = [
        { id: 1, icon: Bell, title: 'New Feature Released', message: 'You can now export your data to CSV.', time: '2 hours ago', read: false },
        { id: 2, icon: Zap, title: 'Your trial is ending soon', message: 'Upgrade to a paid plan to continue using our services.', time: '1 day ago', read: false },
        { id: 3, icon: Bell, title: 'Server Maintenance', message: 'We will be undergoing scheduled maintenance on Sunday.', time: '3 days ago', read: true },
    ];

    return (
        <>
            <div style={{ marginBottom: '2rem' }}>
                <h1 style={{ fontSize: '2.25rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>Notifications</h1>
                <p style={{ color: 'var(--muted-foreground)' }}>
                    Here are your latest updates and alerts.
                </p>
            </div>

            <div className="card">
                <div className="card-header">
                    {notifications.map(notification => (
                        <div key={notification.id} style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '1rem',
                            padding: '1rem',
                            borderBottom: '1px solid var(--border)',
                            backgroundColor: !notification.read ? 'var(--muted)' : 'transparent'
                        }}>
                            <notification.icon style={{ height: '1.5rem', width: '1.5rem', color: 'var(--primary)' }} />
                            <div style={{ flex: 1 }}>
                                <p style={{ fontWeight: '600', margin: 0 }}>{notification.title}</p>
                                <p style={{ color: 'var(--muted-foreground)', margin: '0.25rem 0 0' }}>{notification.message}</p>
                            </div>
                            <p style={{ color: 'var(--muted-foreground)', fontSize: '0.875rem' }}>{notification.time}</p>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
};

export default NotificationsPage;