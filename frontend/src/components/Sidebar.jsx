import React, { useState } from 'react';
import { BiSearchAlt2 } from "react-icons/bi";
import OtherUsers from './OtherUsers';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useSelector, useDispatch } from 'react-redux';
import { setAuthUser, setSelectedUser, setOtherUsers } from '../redux/userSlice';
import { BASE_URL } from '../config';


const Sidebar = () => {
    const [search, setSearch] = useState("");
    const { otherUsers } = useSelector(store => store.user);
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
        <div className='border-r borde-slate-500 p-4 flex flex-col'>
            <form onSubmit={searchSubmitHandler} action="" className='flex items-center gap-2'>
                <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className='input input-bordered rounded-md' type="text"
                    placeholder='Search...'
                />
                <button type='submit' className='btn btn-circle bg-zinc-500 text-white'>
                    <BiSearchAlt2 className='w-6 h-6 outline-none' />
                </button>
            </form>
            <div className='divider px-3'> </div>
            <OtherUsers />
            <div className='mt-2'>
                <button onClick={logoutHandler} className='btn btn-sn'>Logout</button>
            </div>
        </div>
    )
}
export default Sidebar;