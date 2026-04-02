import { useState, useEffect } from 'react';
import api, { getToken } from '../services/api';
import { Link, useNavigate } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Redirect if already logged in
  useEffect(() => {
    if (getToken()) {
      navigate('/dashboard');
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      window.Swal.fire({
        title: 'Missing Info',
        text: 'Please enter both email and password.',
        icon: 'warning',
        confirmButtonColor: 'var(--accent)'
      });
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      window.Swal.fire({
        title: 'Invalid Email',
        text: "Please enter your email in the correct format (e.g. name@example.com).",
        icon: 'error',
        confirmButtonColor: 'var(--accent)'
      });
      return;
    }

    try {
      // 1. Call the API
      const response = await api.post('/auth/login', {
        email,
        password
      });

      // 2. Check for success based on StatusCode
      
      if (response.data.statusCode === 200) {
        // Store the token and metadata
        const storage = rememberMe ? localStorage : sessionStorage;
        storage.setItem('token', response.data.token);
        storage.setItem('username', response.data.username);

        // Also set a flag in localStorage so api.js knows where to look if needed, 
        // or just have api.js check both.
        localStorage.setItem('rememberMe', rememberMe ? 'true' : 'false');

        // 3. Redirect to Dashboard
        await window.Swal.fire({
          title: 'Welcome Back!',
          text: `Login successful. Redirecting...`,
          icon: 'success',
          confirmButtonColor: 'var(--primary)',
          timer: 1500,
          timerProgressBar: true,
          showConfirmButton: false
        });
        navigate('/dashboard');
      } else {
        window.Swal.fire({
          title: 'Login Failed',
          text: response.data.message || "Invalid credentials.",
          icon: 'error',
          confirmButtonColor: 'var(--accent)'
        });
      }

    } catch (err) {
      window.Swal.fire({
        title: 'Error',
        text: err.response?.data?.message || "Login failed. Check your credentials.",
        icon: 'error',
        confirmButtonColor: 'var(--accent)'
      });
    }
  };


  // Eye Icon Component
  const EyeIcon = ({ visible }) => (
    <span style={{ fontSize: '1.2rem', cursor: 'pointer', userSelect: 'none' }}>
      {visible ? '👁️‍🗨️' : '👁️'}
    </span>
  );

  return (
    <div className="auth-split-container">
      <div className="auth-image-side"></div>
      
      <div className="auth-form-side">
        <h2 style={{ fontSize: '2.2rem', marginBottom: '10px' }}>Welcome Back</h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '30px' }}>Please enter your details to sign in.</p>
        
        {error && <p style={{ color: '#ef4444', backgroundColor: 'rgba(239, 68, 68, 0.1)', padding: '12px', borderRadius: '12px', fontSize: '0.9rem', textAlign: 'center', marginBottom: '20px', border: '1px solid rgba(239, 68, 68, 0.2)' }}>{error}</p>}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Email Address</label>
            <input
              type="email"
              placeholder="name@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Password</label>
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
                  border: 'none',
                  padding: 0,
                  color: 'var(--text-muted)'
                }}
              >
                <EyeIcon visible={showPassword} />
              </button>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <input
              type="checkbox"
              id="rememberMe"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              style={{ width: '18px', height: '18px', cursor: 'pointer', accentColor: 'var(--primary)' }}
            />
            <label htmlFor="rememberMe" style={{ fontSize: '0.9rem', color: 'var(--text-muted)', cursor: 'pointer' }}>
              Keep me signed in
            </label>
          </div>

          <button type="submit" className="btn-gradient">Sign In to Dashboard</button>

          <div style={{ textAlign: 'center', marginTop: '10px' }}>
            <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>New here? </span>
            <Link to="/register" style={{ fontSize: '0.9rem', color: 'var(--primary)', textDecoration: 'none', fontWeight: '700' }}>Create an Account</Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;