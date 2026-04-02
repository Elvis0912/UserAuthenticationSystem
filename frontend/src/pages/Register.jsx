import { useState } from 'react';
import api from '../services/api';
import { Link, useNavigate } from 'react-router-dom';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Eye Icon Component for reuse
  const EyeIcon = ({ visible }) => (
    <span style={{ fontSize: '1.2rem', cursor: 'pointer', userSelect: 'none' }}>
      {visible ? '👁️‍🗨️' : '👁️'}
    </span>
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!name || !email || !password || !confirmPassword) {
      window.Swal.fire({
        title: 'Missing Information',
        text: "Please fill in all required fields to register.",
        icon: 'warning',
        confirmButtonColor: 'var(--accent)'
      });
      return;
    }

    if (name.length < 3) {
      window.Swal.fire({
        title: 'Name Too Short',
        text: "Please enter your full name (at least 3 characters).",
        icon: 'error',
        confirmButtonColor: 'var(--accent)'
      });
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      window.Swal.fire({
        title: 'Invalid Email',
        text: "Please enter a valid email address.",
        icon: 'error',
        confirmButtonColor: 'var(--accent)'
      });
      return;
    }

    if (password.length < 8) {
      window.Swal.fire({
        title: 'Weak Password',
        text: "Password must be at least 8 characters long for security.",
        icon: 'warning',
        confirmButtonColor: 'var(--accent)'
      });
      return;
    }

    if (password !== confirmPassword) {
      window.Swal.fire({
        title: 'Matching Error',
        text: "Passwords do not match!",
        icon: 'warning',
        confirmButtonColor: 'var(--accent)'
      });
      return;
    }

    try {
      const response = await api.post('/auth/register', {
        username: name, // Map 'name' to 'username' for the DTO
        email,
        password
      });

      if (response.data.statusCode === 200) {
        await window.Swal.fire({
          title: 'Registered!',
          text: response.data.message || "Registration successful! Please login.",
          icon: 'success',
          confirmButtonColor: 'var(--primary)',
          timer: 2000,
          timerProgressBar: true,
          showConfirmButton: false
        });
        navigate('/login');
      } else {
        window.Swal.fire({
          title: 'Access Denied',
          text: response.data.message || "Registration failed.",
          icon: 'error',
          confirmButtonColor: 'var(--accent)'
        });
      }
      
    } catch (err) {
      window.Swal.fire({
        title: 'Request Failed',
        text: err.response?.data?.message || "Internal server error. Please try again.",
        icon: 'error',
        confirmButtonColor: 'var(--accent)'
      });
    }
  };

  return (
    <div className="auth-split-container">
      <div className="auth-image-side"></div>
      
      <div className="auth-form-side">
        <h2 style={{ fontSize: '2.2rem', marginBottom: '10px' }}>Join Us</h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '30px' }}>Create your account to get started.</p>

        {error && <p style={{ color: '#ef4444', backgroundColor: 'rgba(239, 68, 68, 0.1)', padding: '12px', borderRadius: '12px', fontSize: '0.9rem', textAlign: 'center', marginBottom: '20px', border: '1px solid rgba(239, 68, 68, 0.2)' }}>{error}</p>}
        
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: '600' }}>Full Name</label>
            <input 
              type="text" 
              placeholder="John Doe" 
              value={name} 
              onChange={(e) => setName(e.target.value)} 
              required 
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: '600' }}>Email Address</label>
            <input 
              type="email" 
              placeholder="name@company.com" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required 
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: '600' }}>Password</label>
            <div style={{ position: 'relative' }}>
              <input 
                type={showPassword ? "text" : "password"} 
                placeholder="••••••••" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                required 
              />
              <button 
                type="button" 
                onClick={() => setShowPassword(!showPassword)}
                style={{ 
                  position: 'absolute', 
                  right: '16px', 
                  top: '50%', 
                  transform: 'translateY(-50%)',
                  background: 'none',
                  color: 'var(--text-muted)'
                }}
              >
                <EyeIcon visible={showPassword} />
              </button>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: '600' }}>Confirm Password</label>
            <div style={{ position: 'relative' }}>
              <input 
                type={showConfirmPassword ? "text" : "password"} 
                placeholder="••••••••" 
                value={confirmPassword} 
                onChange={(e) => setConfirmPassword(e.target.value)} 
                required 
              />
              <button 
                type="button" 
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                style={{ 
                  position: 'absolute', 
                  right: '16px', 
                  top: '50%', 
                  transform: 'translateY(-50%)',
                  background: 'none',
                  color: 'var(--text-muted)'
                }}
              >
                <EyeIcon visible={showConfirmPassword} />
              </button>
            </div>
          </div>

          <button type="submit" className="btn-gradient" style={{ marginTop: '10px' }}>Create Free Account</button>

          <div style={{ textAlign: 'center', marginTop: '10px' }}>
            <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Already member? </span>
            <Link to="/login" style={{ fontSize: '0.9rem', color: 'var(--primary)', textDecoration: 'none', fontWeight: '700' }}>Sign In Instead</Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;