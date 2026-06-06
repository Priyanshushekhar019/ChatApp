import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import toast from 'react-hot-toast';
import { setOtherUsers, setReceivedRequests, setSentRequests } from "../redux/userSlice";
import axios from "axios";
import { BASE_URL } from "../config";

const useListenConnectionRequests = () => {
    const dispatch = useDispatch();
    const { socket } = useSelector(store => store.socket);
    const { authUser } = useSelector(store => store.user);

    useEffect(() => {
        if (!socket) return;

        const handleRequestReceived = (data) => {
            toast(`Connection request from ${data.from.fullName}`, {
                icon: '👥',
                duration: 4000
            });
            // Re-fetch received/sent requests
            axios.get(`${BASE_URL}/api/v1/user/requests`)
                .then(res => {
                    dispatch(setReceivedRequests(res.data.received));
                    dispatch(setSentRequests(res.data.sent));
                })
                .catch(err => console.log(err));
        };

        const handleRequestAccepted = (data) => {
            toast.success(`${data.user.fullName} accepted your connection request!`, {
                duration: 4000
            });
            
            // Re-fetch connections/friends list
            axios.get(`${BASE_URL}/api/v1/user/`)
                .then(res => {
                    dispatch(setOtherUsers(res.data));
                })
                .catch(err => console.log(err));

            // Also re-fetch requests (since it was accepted, it moves out of sentRequests)
            axios.get(`${BASE_URL}/api/v1/user/requests`)
                .then(res => {
                    dispatch(setReceivedRequests(res.data.received));
                    dispatch(setSentRequests(res.data.sent));
                })
                .catch(err => console.log(err));
        };

        socket.on("connectionRequestReceived", handleRequestReceived);
        socket.on("connectionRequestAccepted", handleRequestAccepted);

        return () => {
            socket.off("connectionRequestReceived", handleRequestReceived);
            socket.off("connectionRequestAccepted", handleRequestAccepted);
        };
    }, [socket, authUser, dispatch]);
};

export default useListenConnectionRequests;
