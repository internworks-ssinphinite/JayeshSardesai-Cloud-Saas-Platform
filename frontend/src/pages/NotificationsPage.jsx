import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Bell, Zap } from 'lucide-react';

const NotificationsPage = () => {
    const [notifications, setNotifications] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchNotifications = async () => {
            const token = localStorage.getItem('token');
            setIsLoading(true);
            try {
                const response = await axios.get('/api/notifications', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setNotifications(response.data);
            } catch (error) {
                console.error("Failed to fetch notifications", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchNotifications();
    }, []);

    const getIcon = (title) => {
        if (title.toLowerCase().includes('welcome')) {
            return Zap;
        }
        return Bell;
    };

    const timeSince = (date) => {
        const seconds = Math.floor((new Date() - new Date(date)) / 1000);
        let interval = seconds / 31536000;
        if (interval > 1) return Math.floor(interval) + " years ago";
        interval = seconds / 2592000;
        if (interval > 1) return Math.floor(interval) + " months ago";
        interval = seconds / 86400;
        if (interval > 1) return Math.floor(interval) + " days ago";
        interval = seconds / 3600;
        if (interval > 1) return Math.floor(interval) + " hours ago";
        interval = seconds / 60;
        if (interval > 1) return Math.floor(interval) + " minutes ago";
        return Math.floor(seconds) + " seconds ago";
    };


    if (isLoading) {
        return <div>Loading notifications...</div>;
    }

    return (
        <>
            <div style={{ marginBottom: '2rem' }}>
                <h1 style={{ fontSize: '2.25rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>Notifications</h1>
                <p style={{ color: 'var(--muted-foreground)' }}>Here are your latest updates and alerts.</p>
            </div>

            <div className="card">
                <div className="card-header">
                    {notifications.length > 0 ? (
                        notifications.map(notification => {
                            const Icon = getIcon(notification.title);
                            return (
                                <div key={notification.id} style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '1rem',
                                    padding: '1rem',
                                    borderBottom: '1px solid var(--border)',
                                    backgroundColor: !notification.is_read ? 'var(--muted)' : 'transparent'
                                }}>
                                    <Icon style={{ height: '1.5rem', width: '1.5rem', color: 'var(--primary)' }} />
                                    <div style={{ flex: 1 }}>
                                        <p style={{ fontWeight: '600', margin: 0 }}>{notification.title}</p>
                                        <p style={{ color: 'var(--muted-foreground)', margin: '0.25rem 0 0' }}>{notification.message}</p>
                                    </div>
                                    <p style={{ color: 'var(--muted-foreground)', fontSize: '0.875rem', whiteSpace: 'nowrap' }}>{timeSince(notification.created_at)}</p>
                                </div>
                            )
                        })
                    ) : (
                        <p style={{ textAlign: 'center', color: 'var(--muted-foreground)', padding: '2rem' }}>You have no notifications yet.</p>
                    )}
                </div>
            </div>
        </>
    );
};

export default NotificationsPage;