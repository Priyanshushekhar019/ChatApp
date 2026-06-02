import React, { useEffect } from 'react';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { setOtherUsers } from '../redux/userSlice';
import { BASE_URL } from '../config';

const useGetOtherUsers = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        const fetchOtherUsers = async () => {
            try {
                axios.defaults.withCredentials = true;
                const res = await axios.get(`${BASE_URL}/api/v1/user/`);
                // Save the fetched users into your Redux store
                dispatch(setOtherUsers(res.data));
            } catch (error) {
                console.log(error);
            }
        };

        fetchOtherUsers();
    }, [dispatch]);
}

export default useGetOtherUsers;