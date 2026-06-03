import React from 'react';
import Sidebar from "./Sidebar";
import MessageContainer from "./MessageContainer";
import useListenMessages from '../hooks/useListenMessages';


const HomePage = () => {
    useListenMessages(); // Listen to incoming socket messages globally while logged in

    return (
        <div className='flex sm:h-[450px] md:h-[550px] rounded-lg overflow-hidden bg-gray-400 bg-clip-padding backdrop-filter backdrop-blur-lg bg-opacity-40 border border-gray-100'>
            <Sidebar />
            <MessageContainer />
        </div>
    )
}
export default HomePage;