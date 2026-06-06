import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setMessages } from "../redux/messageSlice";
import { setOtherUsers, addUnreadUser } from "../redux/userSlice";
import toast from 'react-hot-toast';

const useListenMessages = () => {
    const dispatch = useDispatch();
    const { socket } = useSelector(store => store.socket);
    const { messages } = useSelector(store => store.message);
    const { selectedUser, otherUsers, authUser } = useSelector(store => store.user);

    useEffect(() => {
        if (!socket) return;

        const handleNewMessage = (newMessage) => {
            // 1. If it belongs to the currently active conversation, append it
            if (
                (selectedUser && newMessage.senderId === selectedUser._id) || 
                (authUser && newMessage.senderId === authUser._id)
            ) {
                dispatch(setMessages([...messages, newMessage]));
            } else {
                // 2. Otherwise, find the sender in otherUsers and show a toast notification
                const sender = otherUsers?.find(u => u._id === newMessage.senderId);
                if (sender) {
                    toast(`New message from ${sender.fullName}: ${newMessage.message}`, {
                        icon: '💬',
                    });
                }
                dispatch(addUnreadUser(newMessage.senderId));
            }

            // 3. Move the user who sent the message to the top of the sidebar list
            if (otherUsers) {
                const senderIndex = otherUsers.findIndex(u => u._id === newMessage.senderId);
                if (senderIndex !== -1) {
                    const senderObj = otherUsers[senderIndex];
                    const updatedUsers = [senderObj, ...otherUsers.filter(u => u._id !== newMessage.senderId)];
                    dispatch(setOtherUsers(updatedUsers));
                }
            }
        };

        socket.on("newMessage", handleNewMessage);

        return () => {
            socket.off("newMessage", handleNewMessage);
        };
    }, [socket, messages, selectedUser, otherUsers, authUser, dispatch]);
};

export default useListenMessages;
