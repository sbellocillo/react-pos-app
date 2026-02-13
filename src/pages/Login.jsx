import React, { useState } from 'react';
import { apiEndpoints } from '../services/api';
import { useAuth } from '../context/AuthContext';
import '../styles/login.css'

const Login = () => {
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Get all users and find matching credentials
      const response = await apiEndpoints.users.getAll();

      let users = [];
      if (response && response.data && response.data.data && Array.isArray(response.data.data)) {
        users = response.data.data;
      } else {
        // Fallback users for demo
        users = [
          {
            id: 1,
            username: 'admin@ribshack.com',
            password: 'admin123',
            role_id: 1,
            role_name: 'Administrator',
            location_id: 1,
            location_name: 'Main Branch',
            is_active: true
          },
          {
            id: 2,
            username: 'manager@ribshack.com',
            password: 'manager123',
            role_id: 2,
            role_name: 'Manager',
            location_id: 1,
            location_name: 'Main Branch',
            is_active: true
          },
          {
            id: 3,
            username: 'cashier@ribshack.com',
            password: 'cashier123',
            role_id: 3,
            role_name: 'Cashier',
            location_id: 2,
            location_name: 'BGC Branch',
            is_active: true
          }
        ];
      }

      // Find user with matching credentials
      const user = users.find(u =>
        u.username.toLowerCase() === formData.username.toLowerCase() &&
        u.password === formData.password &&
        u.is_active
      );

      if (user) {
        // Store user data and auth token
        const authToken = `user_${user.id}_${Date.now()}`;
        const userData = {
          id: user.id,
          username: user.username,
          role_name: user.role_name,
          location_id: user.location_id,
          location_name: user.location_name,
          loginTime: new Date().toLocaleTimeString('en-US', {hour: '2-digit', minute: '2-digit' })
        };

        await login(userData, authToken)

      } else {
        setError('Invalid username, password, or account is inactive');
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='login-page'>
      <div className='login-card'>

        {/* Logo */}
        <div className='logo-container'>
          <div className='logo-wrapper'>
            <img
              src='https://8932109.app.netsuite.com/core/media/media.nl?id=65916&c=8932109&h=yVp7zmJXhqC031gbC_N9zx3FZJPxQ_D-_AyBKYfYnen0vK7f'
              alt='RIBSHACK Logo'
              className='logo-image'
            />
          </div>
          <h1 className='app-title'>RIBSHACK POS</h1>
          <p className='app-subtitle'>Point of Sale System</p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className='login-form'>
          <div className='form-group'>
            <label className='form-label'>Username</label>
            <input
              type='email'
              name='username'
              value={formData.username}
              onChange={handleChange}
              required
              placeholder='Enter your email'
              className='form-input'
            />
          </div>

          <div className='form-group'>
            <label className='form-label'>Password</label>
            <input
              type='password'
              name='password'
              value={formData.password}
              onChange={handleChange}
              required
              placeholder='Enter your password'
              className='form-input'
            />
          </div>

          {error && <div className='error-message'>{error}</div>}

          <button type='submit' disabled={loading} className='submit-btn'>
            {loading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>

        {/* Demo Credentials */}
        <div className='demo-credentials'>
          <p className='demo-title'>Demo Credentials:</p>
          <div>
            <p><strong>Admin:</strong> admin@ribshack.com / admin123</p>
            <p><strong>Manager:</strong> manager@ribshack.com / manager123</p>
            <p><strong>Cashier:</strong> cashier@ribshack.com / cashier123</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;