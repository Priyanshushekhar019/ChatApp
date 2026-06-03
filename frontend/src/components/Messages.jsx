import React, { useEffect, useRef } from 'react';
import useGetMessages from '../hooks/useGetMessages';
import Message from './Message';
import { useSelector } from 'react-redux';

const Messages = () => {
    useGetMessages();
    const { messages } = useSelector(store => store.message);
    const scrollRef = useRef();

    useEffect(() => {
        scrollRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    if (!messages) return null;
    return (
        <div className='px-4 flex-1 overflow-auto flex flex-col gap-2'>
            {
                messages && messages?.map((message) => {
                    return (
                        <Message key={message._id} message={message} />
                    )
                })
            }
            <div ref={scrollRef} />
        </div>
    )
}

export default Messages;