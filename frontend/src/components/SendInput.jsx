import React, { useState } from 'react';
import axios from 'axios';
import { useSelector, useDispatch } from 'react-redux';
import { setMessages } from '../redux/messageSlice';

const SendInput = () => {
    const [message, setMessage] = useState("");
    const dispatch = useDispatch();
    const { selectedUser } = useSelector(store => store.user);
    const { messages } = useSelector(store => store.message);

    const onSubmitHandler = async (e) => {
        e.preventDefault();
        if (!message.trim() || !selectedUser?._id) return;

        try {
            axios.defaults.withCredentials = true;
            const res = await axios.post(
                `http://localhost:8080/api/v1/message/send/${selectedUser?._id}`,
                { message },
                {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            );
            
            if (res.data) {
                dispatch(setMessages([...messages, res.data]));
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
