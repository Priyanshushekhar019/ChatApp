import { useEffect } from 'react';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { setReceivedRequests, setSentRequests } from '../redux/userSlice';
import { BASE_URL } from '../config';

const useGetConnectionRequests = () => {
    const dispatch = useDispatch();
    const { authUser } = useSelector(store => store.user);

    const fetchRequests = async () => {
        try {
            axios.defaults.withCredentials = true;
            const res = await axios.get(`${BASE_URL}/api/v1/user/requests`);
            dispatch(setReceivedRequests(res.data.received));
            dispatch(setSentRequests(res.data.sent));
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        if (authUser) {
            fetchRequests();
        }
    }, [authUser, dispatch]);

    return fetchRequests;
}

export default useGetConnectionRequests;
