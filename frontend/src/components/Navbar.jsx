import { Link } from 'react-router-dom';

function Navbar() {
  const isLoggedIn = localStorage.getItem('token');

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/';
  };

  return (
    <nav style={{
      padding: '15px 30px',
      background: '#333',
      color: 'white',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    }}>
      <div>
        <Link to="/" style={{ color: 'white', textDecoration: 'none', fontSize: '20px', fontWeight: 'bold' }}>
          My Portfolio
        </Link>
      </div>
      <div style={{ display: 'flex', gap: '20px' }}>
        <Link to="/" style={{ color: 'white', textDecoration: 'none' }}>Home</Link>
        {isLoggedIn ? (
          <>
            <Link to="/admin" style={{ color: 'white', textDecoration: 'none' }}>Dashboard</Link>
            <button onClick={handleLogout} style={{
              background: 'red',
              color: 'white',
              border: 'none',
              padding: '5px 15px',
              borderRadius: '4px',
              cursor: 'pointer'
            }}>
              Logout
            </button>
          </>
        ) : (
          <Link to="/login" style={{ color: 'white', textDecoration: 'none' }}>Login</Link>
        )}
      </div>
    </nav>
  );
}

export default Navbar;