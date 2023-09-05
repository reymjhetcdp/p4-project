import { FaSignInAlt, FaSignOutAlt, FaUser } from 'react-icons/fa';
import { Link } from 'react-router-dom';

function Header({ isLoggedIn, setIsLoggedIn }) {
  function handleLogout() {
    //remove token upon logout
    localStorage.removeItem('token');

    //set login to false and redirect to homepage
    setIsLoggedIn(false);
  }

  return (
    <header className="header">
      <div className="logo">
        {isLoggedIn ? (
          <Link to="/dashboard">Dashboard</Link>
        ) : (
          <Link to="/">Task Tracker</Link>
        )}
      </div>
      <ul>
        {isLoggedIn ? (
          <li>
            <Link to="/" onClick={handleLogout}>
              <FaSignOutAlt />
              Logout
            </Link>
          </li>
        ) : (
          <>
            <li>
              <Link to="/login">
                <FaSignInAlt /> Login
              </Link>
            </li>
            <li>
              <Link to="/register">
                <FaUser /> Register
              </Link>
            </li>
          </>
        )}
      </ul>
    </header>
  );
}

export default Header;
