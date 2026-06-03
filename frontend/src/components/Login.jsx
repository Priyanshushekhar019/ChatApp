import React, { useState } from 'react'
import axios from 'axios';
import toast from 'react-hot-toast';
import { useDispatch } from 'react-redux';
import { setAuthUser } from '../redux/userSlice';
import { BASE_URL } from '../config';

const Login = () => {
    const dispatch = useDispatch();
    const [formData, setFormData] = useState({
        username: '',
        password: ''
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post(`${BASE_URL}/api/v1/user/login`, formData, {
                headers: {
                    'Content-Type': 'application/json'
                },
                withCredentials: true
            });
            if (res.data.success) {
                toast.success(res.data.message);
                console.log("Logged In User Data:", res.data);
                dispatch(setAuthUser(res.data.user));
                setFormData({
                    username: '',
                    password: ''
                });
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Incorrect username or password");
            console.error("Login Error:", error);
        }
    };

    return (
        <div className="auth-card">
            <h1 className="auth-title">Hello Again!</h1>
            <p className="auth-subtitle">Sign in to jump back into your conversations</p>
            
            <form className="auth-form" onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="username">Username</label>
                    <input
                        id="username"
                        className="form-input"
                        type="text"
                        name="username"
                        value={formData.username}
                        onChange={handleInputChange}
                        placeholder="Enter your username"
                        required
                    />
                </div>
                
                <div className="form-group">
                    <label htmlFor="password">Password</label>
                    <input
                        id="password"
                        className="form-input"
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        placeholder="Enter your password"
                        required
                    />
                </div>

                <p className="auth-footer">
                    Don't have an account?{' '}
                    <a 
                        href="/signup" 
                        onClick={(e) => {
                            e.preventDefault();
                            window.history.pushState(null, '', '/signup');
                        }}
                        className="auth-link"
                    >
                        Signup
                    </a>
                </p>

                <button type="submit" className="auth-submit-btn">
                    Login
                </button>
            </form>
        </div>
    )
}

export default Login