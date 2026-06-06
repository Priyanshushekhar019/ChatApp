import React, { useState } from 'react';
import { BiSearchAlt2 } from "react-icons/bi";
import OtherUsers from './OtherUsers';
import ExploreUsers from './ExploreUsers';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useSelector, useDispatch } from 'react-redux';
import { setAuthUser, setSelectedUser, setOtherUsers } from '../redux/userSlice';
import { BASE_URL } from '../config';
import useGetConnectionRequests from '../hooks/useGetConnectionRequests';

const Sidebar = () => {
    const [activeTab, setActiveTab] = useState("chats");
    const [search, setSearch] = useState("");
    
    // Fetch pending requests on mount and store in Redux
    useGetConnectionRequests();

    const { otherUsers, receivedRequests } = useSelector(store => store.user);
    const dispatch = useDispatch();

    const logoutHandler = async () => {
        try {
            const res = await axios.get(`${BASE_URL}/api/v1/user/logout`);
            toast.success(res.data.message);
            dispatch(setAuthUser(null));
            dispatch(setSelectedUser(null));
            window.location.pathname = "/login";
        } catch (error) {
            console.log(error);
        }
    }

    const searchSubmitHandler = (e) => {
        e.preventDefault();
        const ConversationUser = otherUsers?.find((user) => user.fullName.toLowerCase().includes(search.toLowerCase()));
        if (ConversationUser) {
            dispatch(setOtherUsers([ConversationUser]));
        } else {
            toast.error("User not found");
        }
    }

    return (
        <div className='border-r border-slate-700 p-4 flex flex-col sm:w-[280px] md:w-[350px] h-full bg-zinc-900 bg-opacity-70 min-w-[280px]'>
            {/* Tabs Header */}
            <div className="flex border-b border-zinc-800 pb-3 mb-4 gap-2">
                <button 
                    onClick={() => setActiveTab('chats')} 
                    className={`flex-1 py-2 text-center text-xs font-bold uppercase tracking-wider rounded-md transition-all duration-200 ${activeTab === 'chats' ? 'bg-indigo-600 text-white shadow' : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/40'}`}
                >
                    Chats
                </button>
                <button 
                    onClick={() => setActiveTab('explore')} 
                    className={`flex-1 py-2 text-center text-xs font-bold uppercase tracking-wider rounded-md transition-all duration-200 ${activeTab === 'explore' ? 'bg-indigo-600 text-white shadow' : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/40'} flex items-center justify-center gap-1.5`}
                >
                    Explore
                    {receivedRequests && receivedRequests.length > 0 && (
                        <span className="bg-rose-500 text-white rounded-full px-1.5 py-0.5 text-[10px] font-extrabold animate-pulse">
                            {receivedRequests.length}
                        </span>
                    )}
                </button>
            </div>

            {/* Tab Contents */}
            {activeTab === 'chats' ? (
                <div className="flex-1 flex flex-col min-h-0">
                    <form onSubmit={searchSubmitHandler} action="" className='flex items-center gap-2 mb-2'>
                        <input
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className='input input-bordered rounded-md bg-zinc-800 text-white border-zinc-700 focus:outline-none focus:border-indigo-500 w-full text-sm px-3 py-2' 
                            type="text"
                            placeholder='Search chats...'
                        />
                        <button type='submit' className='btn btn-circle bg-zinc-700 text-white hover:bg-zinc-600 border-none w-10 h-10 min-h-0 flex items-center justify-center'>
                            <BiSearchAlt2 className='w-5 h-5' />
                        </button>
                    </form>
                    <div className='divider my-2 px-3 border-zinc-800'></div>
                    <OtherUsers search={search} />
                </div>
            ) : (
                <ExploreUsers />
            )}

            {/* Sidebar Footer */}
            <div className='mt-auto pt-3 border-t border-zinc-800'>
                <button onClick={logoutHandler} className='btn btn-sm bg-zinc-800 hover:bg-rose-900 hover:text-white border-none text-zinc-300 w-full py-2 rounded font-semibold text-xs tracking-wider uppercase transition-all duration-200'>
                    Logout
                </button>
            </div>
        </div>
    )
}
export default Sidebar;