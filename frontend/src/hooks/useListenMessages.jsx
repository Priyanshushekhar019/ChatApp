import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setMessages } from "../redux/messageSlice";

const useListenMessages = () => {
    const dispatch = useDispatch();
    const { socket } = useSelector(store => store.socket);
    const { messages } = useSelector(store => store.message);

    useEffect(() => {
        if (!socket) return;

        const handleNewMessage = (newMessage) => {
            dispatch(setMessages([...messages, newMessage]));
        };

        socket.on("newMessage", handleNewMessage);

        return () => {
            socket.off("newMessage", handleNewMessage);
        };
    }, [socket, messages, dispatch]);
};

export default useListenMessages;
