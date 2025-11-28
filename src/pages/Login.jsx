import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiEndpoints } from '../services/api';

const Login = () => {
  const navigate = useNavigate();
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
        localStorage.setItem('authToken', `user_${user.id}_${Date.now()}`);
        localStorage.setItem('currentUser', JSON.stringify({
          id: user.id,
          username: user.username,
          role_name: user.role_name,
          location_name: user.location_name
        }));

        // Navigate to dashboard
        navigate('/');
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
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1rem'
    }}>
      <div style={{
        background: 'white',
        borderRadius: '20px',
        padding: '3rem',
        width: '100%',
        maxWidth: '400px',
        boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
        textAlign: 'center'
      }}>
        {/* Logo */}
        <div style={{
          marginBottom: '2rem'
        }}>
          {/* Replace the emoji with your logo URL */}
          <div style={{
            fontSize: '4rem',
            marginBottom: '1rem',
            display: 'flex',
            justifyContent: 'center'
          }}>
            {/* Uncomment and replace with your logo URL:
            <img 
              src="YOUR_LOGO_URL_HERE" 
              alt="Ribshack Logo" 
              style={{
                width: '80px',
                height: '80px',
                objectFit: 'contain'
              }} 
            />
            */}
            {/* Current emoji logo - remove when using URL logo */}
            <img src="https://8932109.app.netsuite.com/core/media/media.nl?id=65916&c=8932109&h=yVp7zmJXhqC031gbC_N9zx3FZJPxQ_D-_AyBKYfYnen0vK7f" alt="RIBSHACK Logo" style={{ width: '70px', height: '60px', marginBottom: '0.5rem' }} />

          </div>
          <h1 style={{
            color: '#1e293b',
            marginBottom: '0.5rem',
            fontSize: '2rem',
            fontWeight: 'bold'
          }}>
            RIBSHACK POS
          </h1>
          <p style={{
            color: '#64748b',
            margin: 0,
            fontSize: '1rem'
          }}>
            Point of Sale System
          </p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} style={{ textAlign: 'left' }}>
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{
              display: 'block',
              marginBottom: '0.5rem',
              fontWeight: '500',
              color: '#374151'
            }}>
              Username (Email)
            </label>
            <input
              type="email"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
              placeholder="Enter your email"
              style={{
                width: '100%',
                padding: '0.875rem',
                border: '2px solid #e5e7eb',
                borderRadius: '12px',
                fontSize: '1rem',
                outline: 'none',
                transition: 'border-color 0.3s ease',
                boxSizing: 'border-box'
              }}
              onFocus={(e) => e.target.style.borderColor = '#dc2626'}
              onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
            />
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{
              display: 'block',
              marginBottom: '0.5rem',
              fontWeight: '500',
              color: '#374151'
            }}>
              Password
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="Enter your password"
              style={{
                width: '100%',
                padding: '0.875rem',
                border: '2px solid #e5e7eb',
                borderRadius: '12px',
                fontSize: '1rem',
                outline: 'none',
                transition: 'border-color 0.3s ease',
                boxSizing: 'border-box'
              }}
              onFocus={(e) => e.target.style.borderColor = '#dc2626'}
              onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
            />
          </div>

          {error && (
            <div style={{
              background: '#fef2f2',
              color: '#dc2626',
              padding: '0.75rem',
              borderRadius: '8px',
              marginBottom: '1.5rem',
              fontSize: '0.9rem',
              textAlign: 'center',
              border: '1px solid #fecaca'
            }}>
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              background: loading ? '#9ca3af' : 'linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '12px',
              padding: '1rem',
              fontSize: '1.1rem',
              fontWeight: '600',
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'all 0.3s ease',
              transform: loading ? 'none' : 'scale(1)',
              boxSizing: 'border-box'
            }}
            onMouseOver={(e) => {
              if (!loading) {
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 10px 20px rgba(0, 0, 0, 0.2)';
              }
            }}
            onMouseOut={(e) => {
              if (!loading) {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = 'none';
              }
            }}
          >
            {loading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>

        {/* Demo Credentials */}
        <div style={{
          marginTop: '2rem',
          padding: '1rem',
          background: '#f8fafc',
          borderRadius: '8px',
          fontSize: '0.85rem',
          color: '#64748b'
        }}>
          <p style={{ margin: '0 0 0.5rem 0', fontWeight: '500', color: '#374151' }}>Demo Credentials:</p>
          <div style={{ textAlign: 'left' }}>
            <p style={{ margin: '0.25rem 0' }}><strong>Admin:</strong> admin@ribshack.com / admin123</p>
            <p style={{ margin: '0.25rem 0' }}><strong>Manager:</strong> manager@ribshack.com / manager123</p>
            <p style={{ margin: '0.25rem 0' }}><strong>Cashier:</strong> cashier@ribshack.com / cashier123</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;