import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { NavLink } from 'react-router-dom';
import { useAuth } from "../../contexts/AuthContext";

const SideBar = () => {
    const { user } = useAuth();
    return (
        <ul className="navbar-nav bg-gradient-primary sidebar sidebar-dark accordion" id="accordionSidebar">
            <div className="sidebar-brand d-flex align-items-center justify-content-center">
                <div className="sidebar-brand-icon rotate-n-15">
                    <i className="fas fa-laugh-wink"></i>
                </div>
                <div className="sidebar-brand-text mx-3">H.M.B.S</div>
            </div>

            <hr className="sidebar-divider my-0" />
            {user && user.role === 'Admin' && (
                <>
                    <li className="nav-item">
                        <NavLink
                            to="/admin/dashboard"
                            className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
                        >
                            <FontAwesomeIcon icon="fa-solid fa-gauge" className="nav-link-icon" />
                            <span>Dashboard</span>
                        </NavLink>
                    </li>
                    <hr className="sidebar-divider" />
                    <li className="nav-item">
                        <NavLink
                            to="/admin/properties"
                            className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
                        >
                            <FontAwesomeIcon icon="fa-solid fa-hotel" className="nav-link-icon" />
                            <span>Properties</span>
                        </NavLink>
                    </li>
                </>
            )}

            {user && user.role === 'Manager' && (
                <>
                    <li className="nav-item">
                        <NavLink
                            to="/manager/dashboard"
                            className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
                        >
                            <FontAwesomeIcon icon="fa-solid fa-gauge" className="nav-link-icon" />
                            <span>Dashboard</span>
                        </NavLink>
                    </li>
                </>
            )}

            {user && user.role === 'Guest' && (
                <>
                    <li className="nav-item">
                        <NavLink
                            to="/guest/properties"
                            className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
                        >
                            <FontAwesomeIcon icon="fa-solid fa-hotel" className="nav-link-icon" />
                            <span>Properties</span>
                        </NavLink>
                    </li>
                    <hr className="sidebar-divider" />
                    <li className="nav-item">
                        <NavLink
                            to="/guest/bookings"
                            className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
                        >
                            <FontAwesomeIcon icon="fa-solid fa-calendar-check" className="nav-link-icon" />

                            <span>Bookings</span>
                        </NavLink>
                    </li>
                </>
            )}


            <hr className="sidebar-divider" />
        </ul>
    );
}

export default SideBar;