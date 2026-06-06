import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { setOtherUsers, setReceivedRequests, setSentRequests } from '../redux/userSlice';
import { BASE_URL } from '../config';

const ExploreUsers = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    
    const dispatch = useDispatch();
    const { otherUsers, receivedRequests, sentRequests } = useSelector(store => store.user);

    // Fetch initial suggestions or query search
    const fetchUsers = async (query = "") => {
        setLoading(true);
        try {
            axios.defaults.withCredentials = true;
            const res = await axios.get(`${BASE_URL}/api/v1/user/search?query=${encodeURIComponent(query)}`);
            setUsers(res.data);
        } catch (error) {
            console.log(error);
            toast.error("Error searching users");
        } finally {
            setLoading(false);
        }
    };

    // Load recommendations on mount
    useEffect(() => {
        fetchUsers("");
    }, []);

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        fetchUsers(searchQuery);
    };

    const handleSearchChange = (e) => {
        const val = e.target.value;
        setSearchQuery(val);
        if (val.trim() === "") {
            fetchUsers("");
        }
    };

    const sendRequest = async (userId) => {
        try {
            axios.defaults.withCredentials = true;
            const res = await axios.post(`${BASE_URL}/api/v1/user/request/send/${userId}`);
            toast.success(res.data.message || "Connection request sent!");
            
            // Update sentRequests in Redux
            const updatedSent = [...(sentRequests || [])];
            const targetUser = users.find(u => u._id === userId) || receivedRequests.find(u => u._id === userId);
            if (targetUser && !updatedSent.some(u => u._id === userId)) {
                updatedSent.push(targetUser);
            }
            dispatch(setSentRequests(updatedSent));
        } catch (error) {
            console.log(error);
            toast.error(error.response?.data?.message || "Failed to send request");
        }
    };

    const acceptRequest = async (userId) => {
        try {
            axios.defaults.withCredentials = true;
            const res = await axios.post(`${BASE_URL}/api/v1/user/request/accept/${userId}`);
            toast.success("Connection request accepted!");

            // Remove from receivedRequests in Redux
            const updatedReceived = (receivedRequests || []).filter(u => u._id !== userId);
            dispatch(setReceivedRequests(updatedReceived));

            // Fetch updated friends/connections list
            const friendsRes = await axios.get(`${BASE_URL}/api/v1/user/`);
            dispatch(setOtherUsers(friendsRes.data));
        } catch (error) {
            console.log(error);
            toast.error("Failed to accept request");
        }
    };

    const rejectRequest = async (userId) => {
        try {
            axios.defaults.withCredentials = true;
            const res = await axios.post(`${BASE_URL}/api/v1/user/request/reject/${userId}`);
            toast.success("Connection request declined");

            // Remove from receivedRequests in Redux
            const updatedReceived = (receivedRequests || []).filter(u => u._id !== userId);
            dispatch(setReceivedRequests(updatedReceived));
        } catch (error) {
            console.log(error);
            toast.error("Failed to decline request");
        }
    };

    const getAvatarUrl = (user) => {
        return user?.profilePhoto?.includes('avatar.iran.liara.run') 
            ? `https://api.dicebear.com/9.x/avataaars/svg?seed=${encodeURIComponent(user?.fullName || '')}` 
            : user?.profilePhoto;
    };

    return (
        <div className="flex-1 flex flex-col min-h-0">
            {/* Search Box */}
            <form onSubmit={handleSearchSubmit} className="flex items-center gap-2 mb-4">
                <input
                    value={searchQuery}
                    onChange={handleSearchChange}
                    className="input input-bordered rounded-md w-full bg-zinc-800 text-white border-zinc-700 focus:border-indigo-500 focus:outline-none text-sm px-3 py-2"
                    type="text"
                    placeholder="Search users..."
                />
            </form>

            <div className="flex-1 overflow-y-auto pr-1">
                {/* Received Requests Section */}
                {receivedRequests && receivedRequests.length > 0 && (
                    <div className="mb-4">
                        <h3 className="text-xs font-bold text-rose-400 uppercase tracking-wider mb-2 px-2 flex justify-between items-center">
                            <span>Pending Invitations</span>
                            <span className="bg-rose-500/20 text-rose-400 px-1.5 py-0.5 rounded-full text-[10px]">
                                {receivedRequests.length}
                            </span>
                        </h3>
                        <div className="space-y-2">
                            {receivedRequests.map((user) => (
                                <div key={user._id} className="flex items-center justify-between p-2 rounded-lg bg-zinc-800/40 border border-zinc-800/80">
                                    <div className="flex items-center gap-2">
                                        <div className="avatar">
                                            <div className="w-10 rounded-full border border-zinc-700">
                                                <img src={getAvatarUrl(user)} alt="avatar" />
                                            </div>
                                        </div>
                                        <div>
                                            <p className="text-sm font-semibold text-white">{user.fullName}</p>
                                            <p className="text-xs text-zinc-400">@{user.username}</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-1">
                                        <button 
                                            onClick={() => acceptRequest(user._id)}
                                            className="btn btn-xs btn-success text-white px-2.5 rounded"
                                        >
                                            Accept
                                        </button>
                                        <button 
                                            onClick={() => rejectRequest(user._id)}
                                            className="btn btn-xs bg-zinc-700 hover:bg-zinc-600 text-zinc-300 border-none px-2 rounded"
                                        >
                                            Ignore
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="divider my-4 px-2 border-zinc-800"></div>
                    </div>
                )}

                {/* Explore/Suggestions Section */}
                <div>
                    <h3 className="text-xs font-bold text-indigo-400 uppercase tracking-wider mb-2 px-2">
                        {searchQuery ? "Search Results" : "People you may know"}
                    </h3>

                    {loading ? (
                        <div className="flex justify-center items-center py-8">
                            <span className="loading loading-spinner loading-md text-indigo-500"></span>
                        </div>
                    ) : (
                        <div className="space-y-1">
                            {users && users.length > 0 ? (
                                users.map((user) => {
                                    const isFriend = otherUsers?.some(u => u._id === user._id);
                                    const isSent = sentRequests?.some(u => u._id === user._id);
                                    const isReceived = receivedRequests?.some(u => u._id === user._id);

                                    return (
                                        <div key={user._id} className="flex items-center justify-between p-2 rounded hover:bg-zinc-800/30 transition-colors duration-200">
                                            <div className="flex items-center gap-2">
                                                <div className="avatar">
                                                    <div className="w-10 rounded-full border border-zinc-800">
                                                        <img src={getAvatarUrl(user)} alt="avatar" />
                                                    </div>
                                                </div>
                                                <div>
                                                    <p className="text-sm font-semibold text-white">{user.fullName}</p>
                                                    <p className="text-xs text-zinc-400">@{user.username}</p>
                                                </div>
                                            </div>
                                            <div>
                                                {isFriend ? (
                                                    <span className="text-xs text-emerald-400 font-semibold px-2 py-1 rounded bg-emerald-500/10">
                                                        Friends
                                                    </span>
                                                ) : isSent ? (
                                                    <span className="text-xs text-zinc-400 font-semibold px-2 py-1 rounded bg-zinc-800 border border-zinc-700/50">
                                                        Requested
                                                    </span>
                                                ) : isReceived ? (
                                                    <div className="flex gap-1">
                                                        <button 
                                                            onClick={() => acceptRequest(user._id)}
                                                            className="btn btn-xs btn-success text-white px-2 rounded"
                                                        >
                                                            Accept
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <button 
                                                        onClick={() => sendRequest(user._id)}
                                                        className="btn btn-xs btn-primary bg-indigo-600 hover:bg-indigo-500 text-white border-none px-3 rounded"
                                                    >
                                                        Connect
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })
                            ) : (
                                <p className="text-center text-xs text-zinc-500 py-8">
                                    {searchQuery ? "No users found" : "No recommendations available"}
                                </p>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ExploreUsers;
