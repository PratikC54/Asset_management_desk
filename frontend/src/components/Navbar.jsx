import { useNavigate } from 'react-router-dom';
import { FaArrowRightFromBracket, FaBoxArchive } from 'react-icons/fa6';
import './../styles/Navbar.css';
import { useAuth } from '../context/useAuth';

const Navbar = () => {
  const navigate = useNavigate();
  const { isAuthenticated, logout, user } = useAuth();

  function handleLogout() {
    logout();
    navigate('/login');
  }

  return (
    <nav className="navbar">
      <div className="navbar-brand"><span className="navbar-mark"><FaBoxArchive /></span><div><h1 className="navbar-logo">assetflow</h1><span>Operations workspace</span></div></div>
      <ul className="navbar-links">

        {isAuthenticated ? (
          <li>
            <span className="navbar-user">{user?.name?.split(' ')[0] || 'User'} <small>{user?.role?.replace('_', ' ')}</small></span><button type="button" onClick={handleLogout} className="logout-button">
              <FaArrowRightFromBracket /> Sign out
            </button>
          </li>
        ) : null}
      </ul>
    </nav>
  );
};

export default Navbar;
