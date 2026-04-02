import { Link, useNavigate } from 'react-router-dom';
import api, { logoutUser, getToken } from '../services/api';

const Navbar = () => {
  const navigate = useNavigate();
  // Check both storage locations for token
  const token = getToken();

  const handleLogout = async () => {
    const result = await window.Swal.fire({
      title: 'Sign Out?',
      text: "Are you sure you want to log out of your session?",
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
        title: 'Logged Out',
        text: 'You have been successfully signed out.',
        icon: 'success',
        timer: 1500,
        showConfirmButton: false,
        timerProgressBar: true
      });
      navigate('/login');
    }
  };

  const UserIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
  );

  const RegisterIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><line x1="19" y1="8" x2="19" y2="14"></line><line x1="16" y1="11" x2="22" y2="11"></line></svg>
  );

  const LogoutIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
  );

  return (
    <nav className="navbar">
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <h2 style={{ margin: 0, fontSize: '1.5rem', color: 'var(--primary)', fontWeight: '800' }}>AuthApp</h2>
      </div>

      <div style={{ display: 'flex', gap: '30px', alignItems: 'center' }}>
        {token ? (
          <>
            <button 
              onClick={handleLogout} 
              className="nav-link"
              style={{ background: 'none', cursor: 'pointer', outline: 'none' }}
            >
              <LogoutIcon /> Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="nav-link">
              <UserIcon /> Login
            </Link>
            <Link to="/register" className="nav-link">
              <RegisterIcon /> Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
