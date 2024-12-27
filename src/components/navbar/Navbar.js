import NavDropdown from 'react-bootstrap/NavDropdown';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import './Navbar.scss';
import { useAuth } from '../../contexts/AuthContext';

const Navbar = () => {
    const { user, logout } = useAuth();
    return (
        <nav className="navbar navbar-expand navbar-light bg-white topbar mb-4 static-top shadow">
            <ul className="navbar-nav ml-auto">
                <div className="topbar-divider d-none d-sm-block"></div>
                <li className="nav-item dropdown no-arrow">
                    <NavDropdown
                        id="nav-dropdown-dark-example"
                        title={
                            <div className="nav-link dropdown-toggle" id="userDropdown" role="button"
                                data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                <span className="mr-2 d-none d-lg-inline text-gray-600 small">{user.name}</span>
                                <img className="img-profile rounded-circle" alt="profile"
                                    src="/images/undraw_profile.svg" />
                            </div>
                        }
                        menuVariant="dark"
                    >
                        <NavDropdown.Item onClick={logout}>
                            <FontAwesomeIcon icon="fa-solid fa-right-from-bracket" className="mr-2 text-gray-400" />
                            Logout
                        </NavDropdown.Item>

                    </NavDropdown>
                </li>

            </ul>
        </nav>
    );
};

export default Navbar;