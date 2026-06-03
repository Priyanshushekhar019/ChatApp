import React, { useEffect } from 'react';
import SendInput from './SendInput';
import { useDispatch, useSelector } from 'react-redux';
import Messages from './Messages';
import { setSelectedUser } from '../redux/userSlice';

const MessageContainer = () => {
    const { selectedUser, authUser } = useSelector(store => store.user);
    const { onlineUsers } = useSelector(store => store.socket);
    const dispatch = useDispatch();
    const isOnline = onlineUsers?.includes(selectedUser?._id);

    // Clean up selected user state when this component unmounts
    useEffect(() => {
        return () => dispatch(setSelectedUser(null));
    }, [dispatch]);

    return (
        selectedUser !== null ? (
            <div className='md:min-w-[550px] flex flex-col h-full bg-zinc-900'>
                {/* Active Chat Header */}
                <div className='flex gap-2 items-center bg-zinc-800 text-white px-4 py-3 mb-2'>
                    <div className={`avatar ${isOnline ? 'online' : ''}`}>
                        <div className='w-12 rounded-full border border-zinc-700'>
                            <img 
                                src={selectedUser?.profilePhoto} 
                                alt="user profile" 
                                onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(selectedUser?.fullName || '')}&background=random&color=fff`;
                                }}
                            />
                        </div>
                    </div>
                    <div className='flex flex-col flex-1'>
                        <div className='flex justify-between gap-2'>
                            <p className='font-bold text-sm'>{selectedUser?.fullName}</p>
                        </div>
                    </div>
                </div>
                
                {/* Scrollable Messages Area */}
                <Messages />
                
                {/* Text input area */}
                <SendInput />
            </div>
        ) : (
            // Welcome screen when no friend is selected
            <div className='md:min-w-[550px] flex flex-col justify-center items-center bg-zinc-900 text-zinc-500 h-full p-8 min-h-[450px]'>
                <h1 className='text-4xl font-bold text-zinc-100 mb-2'>Hi, {authUser?.fullName}</h1>
                <p className='text-lg'>Welcome to your Chat App</p>
                <p className='text-sm text-zinc-600 mt-2'>Select a friend from the sidebar to start a real-time conversation!</p>
            </div>
        )
    )
}

export default MessageContainer;
