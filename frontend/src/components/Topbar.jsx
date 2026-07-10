import { FaBars, FaBell, FaUserCircle } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

function Topbar({ toggleSidebar }) {

    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {

        await logout();

        navigate("/login", { replace: true });

    };

    return (

        <nav
            className="navbar navbar-expand-lg bg-white border-bottom shadow-sm px-4"
            style={{ height: "70px" }}
        >

            <button
                className="btn btn-outline-primary d-lg-none me-3"
                onClick={toggleSidebar}
            >
                <FaBars />
            </button>

            <h4 className="mb-0 fw-bold text-primary">
                AttendX Dashboard
            </h4>

            <div className="ms-auto d-flex align-items-center">

                <button className="btn btn-light position-relative me-3">
                    <FaBell size={20} />
                    <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                        3
                    </span>
                </button>

                <div className="dropdown">

                    <button
                        className="btn btn-light dropdown-toggle d-flex align-items-center"
                        data-bs-toggle="dropdown"
                    >
                        <FaUserCircle size={28} className="me-2" />

                        <span>
                            {user?.full_name || "Administrator"}
                        </span>

                    </button>

                    <ul className="dropdown-menu dropdown-menu-end">

                        <li>
                            <span className="dropdown-item-text">
                                {user?.email}
                            </span>
                        </li>

                        <li>
                            <hr className="dropdown-divider" />
                        </li>

                        <li>

                            <button
                                className="dropdown-item text-danger"
                                onClick={handleLogout}
                            >
                                Logout
                            </button>

                        </li>

                    </ul>

                </div>

            </div>

        </nav>

    );

}

export default Topbar;