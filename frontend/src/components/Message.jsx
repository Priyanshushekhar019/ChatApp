import React from 'react';
import { useSelector } from 'react-redux';

const Message = ({ message }) => {
    // Access authUser from Redux store
    const { authUser } = useSelector(store => store.user || {});
    
    // Determine if the message is sent by the current user:
    // 1. Supports local mock messages where sender is 'sent'
    // 2. Supports backend DB messages where senderId matches the authUser's _id
    const isSender = message?.sender === 'sent' || (authUser && message?.senderId === authUser?._id);

    // Format message timestamp beautifully
    const getFormattedTime = () => {
        if (message?.createdAt) {
            const date = new Date(message.createdAt);
            return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        }
        // Fallback for mock/new messages using the current time
        return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    return (
        <div className={`message ${isSender ? 'sent' : 'received'}`}>
            <div className="message-content">
                {message?.text || message?.message}
            </div>
            <div className="message-info">
                <span className="message-time">{getFormattedTime()}</span>
                {isSender && (
                    <span className="message-status">
                        {/* WhatsApp-style double checkmarks (blue ticks) */}
                        <svg width="16" height="11" viewBox="0 0 16 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M1.5 5.5L4.5 8.5L10.5 2.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M5.5 5.5L8.5 8.5L14.5 2.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                    </span>
                )}
            </div>
        </div>
    );
};

export default Message;