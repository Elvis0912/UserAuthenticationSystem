import { useState, useEffect } from 'react';
import api, { logoutUser, getToken } from '../services/api';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const [user, setUser] = useState({ name: '', email: '' });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      // 1. Check both storage locations for token
      const token = getToken();
      const storedName = localStorage.getItem('username') || sessionStorage.getItem('username');

      if (!token) {
        navigate('/login');
        return;
      }

      // Initial state from storage for speed
      setUser(prev => ({ ...prev, name: storedName || 'User' }));

      try {
        // 2. Fetch fresh data from Protected Profile API
        const response = await api.get('/user/profile');
        
        if (response.data.statusCode === 200 && response.data.user) {
          setUser({
            name: response.data.user.username,
            email: response.data.user.email
          });
        }
      } catch (err) {
        // If 401 Unauthorized, token might be expired
        if (err.response?.status === 401) {
          handleLogout();
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [navigate]);

  const handleLogout = async () => {
    const result = await window.Swal.fire({
      title: 'Sign Out?',
      text: "Are you sure you want to end your session?",
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: 'var(--primary)',
      cancelButtonColor: 'var(--accent)',
      confirmButtonText: 'Yes, Logout',
      background: 'rgba(15, 23, 42, 0.95)',
      color: '#fff'
    });

    if (result.isConfirmed) {
      logoutUser();
      await window.Swal.fire({
        title: 'Signed Out',
        text: 'Your current session has been terminated.',
        icon: 'success',
        timer: 1500,
        showConfirmButton: false,
        timerProgressBar: true
      });
      navigate('/login');
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', marginTop: '50px' }}>
        <p style={{ color: 'var(--text-muted)' }}>Securely loading profile...</p>
      </div>
    );
  }

  return (
    <div className="auth-card">
      <div style={{ 
        width: '80px', 
        height: '80px', 
        background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
        borderRadius: '50%',
        margin: '0 auto 20px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        color: 'white',
        fontSize: '2rem',
        fontWeight: 'bold'
      }}>
        {user.name.charAt(0).toUpperCase()}
      </div>
      
      <h1 style={{ marginBottom: '10px' }}>Welcome back, {user.name}!</h1>
      <p style={{ color: 'var(--text-muted)', marginBottom: '30px' }}>
        You are securely logged in using JWT Authentication.
      </p>

      <div style={{ 
        background: 'rgba(255, 255, 255, 0.03)', 
        padding: '30px', 
        borderRadius: '20px', 
        textAlign: 'left',
        marginBottom: '30px',
        border: '1px solid rgba(255, 255, 255, 0.05)'
      }}>
        <h3 style={{ fontSize: '1.1rem', marginBottom: '15px', color: 'var(--primary)' }}>Account Details</h3>
        <p style={{ fontSize: '1rem', color: 'white', marginBottom: '10px' }}><strong>Name:</strong> {user.name}</p>
        <p style={{ fontSize: '1rem', color: 'white', marginBottom: '10px' }}><strong>Email:</strong> {user.email}</p>
        <p style={{ fontSize: '1rem', color: 'white' }}><strong>Status:</strong> <span style={{ color: '#10b981' }}>Verified ✅</span></p>
      </div>

      <button 
        onClick={handleLogout} 
        style={{ 
          background: 'none', 
          border: '2px solid #e2e8f0', 
          color: 'var(--text-muted)', 
          padding: '10px 30px', 
          borderRadius: '8px',
          cursor: 'pointer'
        }}
      >
        Sign Out
      </button>
    </div>
  );
};

export default Dashboard;