import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Bell, Trash2, X } from 'lucide-react';

const NotificationsPage = () => {
    const [notifications, setNotifications] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

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

    useEffect(() => {
        fetchNotifications();
    }, []);

    const handleDelete = async (id) => {
        const token = localStorage.getItem('token');
        try {
            await axios.delete(`/api/notifications/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setNotifications(notifications.filter(n => n.id !== id));
        } catch (error) {
            console.error("Failed to delete notification", error);
        }
    };

    const handleClearAll = async () => {
        if (window.confirm('Are you sure you want to delete all notifications?')) {
            const token = localStorage.getItem('token');
            try {
                await axios.delete('/api/notifications', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setNotifications([]);
            } catch (error) {
                console.error("Failed to clear notifications", error);
            }
        }
    };

    if (isLoading) return <div>Loading notifications...</div>;

    return (
        <>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <div>
                    <h1 style={{ fontSize: '2.25rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>Notifications</h1>
                    <p style={{ color: 'var(--muted-foreground)' }}>Here are your latest updates and alerts.</p>
                </div>
                {notifications.length > 0 && (
                    <button onClick={handleClearAll} className="btn btn-secondary">
                        <Trash2 size={16} style={{ marginRight: '0.5rem' }} />
                        Clear All
                    </button>
                )}
            </div>

            <div className="card">
                <div className="card-header">
                    {notifications.length > 0 ? (
                        notifications.map(notification => (
                            <div key={notification.id} style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem', borderBottom: '1px solid var(--border)' }}>
                                <Bell style={{ height: '1.5rem', width: '1.5rem', color: 'var(--primary)' }} />
                                <div style={{ flex: 1 }}>
                                    <p style={{ fontWeight: '600', margin: 0 }}>{notification.title}</p>
                                    <p style={{ color: 'var(--muted-foreground)', margin: '0.25rem 0 0' }}>{notification.message}</p>
                                </div>
                                <button onClick={() => handleDelete(notification.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--muted-foreground)' }}>
                                    <X size={18} />
                                </button>
                            </div>
                        ))
                    ) : (
                        <p style={{ textAlign: 'center', color: 'var(--muted-foreground)', padding: '2rem' }}>You have no notifications yet.</p>
                    )}
                </div>
            </div>
        </>
    );
};

export default NotificationsPage;