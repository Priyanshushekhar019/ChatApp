import React from 'react';
import useGetMessages from '../hooks/useGetMessages';
import useListenMessages from '../hooks/useListenMessages';
import Message from './Message';
import { useSelector } from 'react-redux';

const Messages = () => {
    useGetMessages();
    useListenMessages();
    const { messages } = useSelector(store => store.message);
    if (!messages) return null;
    return (
        <div className='px-4 flex-1 overflow-auto'>
            {
                messages && messages?.map((message) => {
                    return (
                        <Message key={message._id} message={message} />
                    )
                })
            }
        </div>
    )
}

export default Messages;