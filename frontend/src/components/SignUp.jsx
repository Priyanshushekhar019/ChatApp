import React, { useState } from 'react'
import axios from 'axios';
import toast from 'react-hot-toast';
import { BASE_URL } from '../config';

const SignUp = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    username: '',
    password: '',
    confirmPassword: '',
    gender: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCheckboxChange = (genderVal) => {
    setFormData(prev => ({
      ...prev,
      gender: prev.gender === genderVal ? '' : genderVal
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${BASE_URL}/api/v1/user/register`, formData, {
        headers: {
          'Content-Type': 'application/json'
        },
        withCredentials: true
      });
      if (res.data.success) {
        toast.success(res.data.message);
        setFormData({
          fullName: '',
          username: '',
          password: '',
          confirmPassword: '',
          gender: ''
        });
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="auth-card">
      <h1 className="auth-title">Create Account</h1>
      <p className="auth-subtitle">Join ChatApp today and experience real-time messaging</p>
      
      <form className="auth-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="fullName">Full Name</label>
          <input 
            id="fullName"
            className="form-input" 
            type="text" 
            name="fullName"
            value={formData.fullName}
            onChange={handleInputChange}
            placeholder="Enter your Full Name" 
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="username">Username</label>
          <input 
            id="username"
            className="form-input" 
            type="text" 
            name="username"
            value={formData.username}
            onChange={handleInputChange}
            placeholder="Choose a username" 
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
            placeholder="Create a strong password" 
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="confirmPassword">Confirm Password</label>
          <input 
            id="confirmPassword"
            className="form-input" 
            type="password" 
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleInputChange}
            placeholder="Confirm your password" 
            required
          />
        </div>

        {/* Gender Section */}
        <div className="gender-section">
          <span className="gender-section-label">Gender</span>
          <div className="gender-checkbox-container">
            <label className="gender-option">
              <span>Male</span>
              <input 
                type="checkbox" 
                className="gender-checkbox" 
                checked={formData.gender === 'male'}
                onChange={() => handleCheckboxChange('male')}
              />
            </label>
            <label className="gender-option">
              <span>Female</span>
              <input 
                type="checkbox" 
                className="gender-checkbox" 
                checked={formData.gender === 'female'}
                onChange={() => handleCheckboxChange('female')}
              />
            </label>
          </div>
        </div>

        <p className="auth-footer">
          Already have an account?{' '}
          <a href="/login" className="auth-link">
            Login
          </a>
        </p>

        <button type="submit" className="auth-submit-btn">
          Sign Up
        </button>
      </form>
    </div>
  )
}

export default SignUp