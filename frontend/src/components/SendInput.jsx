import React, { useState } from 'react';
import axios from 'axios';
import { useSelector, useDispatch } from 'react-redux';
import { setMessages } from '../redux/messageSlice';
import { setOtherUsers } from '../redux/userSlice';
import { BASE_URL } from '../config';

const SendInput = () => {
    const [message, setMessage] = useState("");
    const dispatch = useDispatch();
    const { selectedUser, otherUsers } = useSelector(store => store.user);
    const { messages } = useSelector(store => store.message);

    const onSubmitHandler = async (e) => {
        e.preventDefault();
        if (!message.trim() || !selectedUser?._id) return;

        try {
            axios.defaults.withCredentials = true;
            const res = await axios.post(
                `${BASE_URL}/api/v1/message/send/${selectedUser?._id}`,
                { message },
                {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            );
            
            if (res.data) {
                dispatch(setMessages([...messages, res.data]));
                
                // Move selectedUser to the top of the sidebar list
                if (otherUsers && selectedUser) {
                    const updatedUsers = [selectedUser, ...otherUsers.filter(u => u._id !== selectedUser._id)];
                    dispatch(setOtherUsers(updatedUsers));
                }
            }
            setMessage("");
        } catch (error) {
            console.error("Error sending message:", error);
        }
    };

    return (
        <form className="chat-input-area" onSubmit={onSubmitHandler}>
            <input
                type="text"
                className="chat-input"
                placeholder="Type your message..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
            />
            <button type="submit" className="send-button">
                Send
            </button>
        </form>
    );
};

export default SendInput;
