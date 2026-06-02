import React from 'react';
import OtherUser from './OtherUser';
import useGetOtherUsers from '../hooks/useGetOtherUsers';
import { useSelector } from 'react-redux';

const OtherUsers = ({ search }) => {
    // Fetch other users on load
    useGetOtherUsers();

    const { otherUsers } = useSelector(store => store.user);

    if (!otherUsers) {
        return (
            <div className="flex justify-center items-center h-20 text-zinc-500">
                <span className="loading loading-spinner loading-md"></span>
            </div>
        );
    }

    // Filter users dynamically based on search query prop
    const filteredUsers = otherUsers?.filter((user) =>
        user.fullName.toLowerCase().includes((search || "").toLowerCase())
    );

    return (
        <div className='flex-1 overflow-auto py-2'>
            {
                filteredUsers && filteredUsers.length > 0 ? (
                    filteredUsers.map((user) => (
                        <OtherUser key={user._id} user={user} />
                    ))
                ) : (
                    <div className="text-center text-zinc-500 text-sm mt-4">
                        No friends found
                    </div>
                )
            }
        </div>
    );
};

export default OtherUsers;
