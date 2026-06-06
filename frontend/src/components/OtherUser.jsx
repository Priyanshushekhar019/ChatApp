import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setSelectedUser, removeUnreadUser } from '../redux/userSlice';

const OtherUser = ({ user }) => {
    const dispatch = useDispatch();
    const { selectedUser, unreadUsers } = useSelector(store => store.user);
    const { onlineUsers } = useSelector(store => store.socket);
    const isOnline = onlineUsers?.includes(user?._id);
    const hasUnread = unreadUsers?.includes(user?._id);

    const selectedUserHandler = (user) => {
        dispatch(setSelectedUser(user));
        dispatch(removeUnreadUser(user?._id));
    }
    return (
        <div>
            <div onClick={() => selectedUserHandler(user)} className={`${selectedUser?._id === user?._id ? 'bg-zinc-200 text-black' : 'text-white'} flex gap-2 hover:text-black items-center hover:bg-zinc-200 rounded p-2 cursor-pointer`}>
                <div className={`avatar ${isOnline ? 'online' : ''}`}>
                    <div className='w-12 rounded-full'>
                        <img 
                            src={user?.profilePhoto?.includes('avatar.iran.liara.run') 
                                ? `https://api.dicebear.com/9.x/avataaars/svg?seed=${encodeURIComponent(user?.fullName || '')}` 
                                : user?.profilePhoto
                            } 
                            alt="user profile" 
                        />
                    </div>
                </div>
                <div className='flex flex-col flex-1'>
                    <div className='flex justify-between items-center gap-2'>
                        <p className={`${hasUnread && selectedUser?._id !== user?._id ? 'font-bold text-indigo-400' : ''}`}>{user?.fullName}</p>
                        {hasUnread && selectedUser?._id !== user?._id && (
                            <span className="w-2.5 h-2.5 rounded-full bg-indigo-500 animate-pulse shadow-sm shadow-indigo-500/50 mr-1"></span>
                        )}
                    </div>
                </div>
            </div>
            <div className='divider my-0 py-0 h-1'></div>
        </div>
    )
}
export default OtherUser;