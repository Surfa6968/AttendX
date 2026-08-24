import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

import NotificationBell from "../common/NotificationBell";

import "../../css/Topbar.css";

import {
  FaBars,
  FaSignOutAlt,
  FaUser,
  FaMoon,
  FaSun,
  FaUserGraduate,
  FaChalkboardTeacher,
  FaUserShield,
} from "react-icons/fa";

function Topbar({ toggleSidebar }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [darkMode, setDarkMode] = useState(false);

  const role = user?.role?.toLowerCase() || "admin";

  const roleConfig = {
    admin: {
      title: "Administration Panel",
      badge: "Admin",
      profile: "/admin/profile",
      color: "primary",
      icon: <FaUserShield size={36} className="text-primary me-2" />,
      largeIcon: <FaUserShield size={60} className="text-primary mb-2" />,
    },

    student: {
      title: "Student Portal",
      badge: "Student",
      profile: "/student/profile",
      color: "success",
      icon: <FaUserGraduate size={36} className="text-success me-2" />,
      largeIcon: <FaUserGraduate size={60} className="text-success mb-2" />,
    },

    lecturer: {
      title: "Lecturer Portal",
      badge: "Lecturer",
      profile: "/lecturer/profile",
      color: "warning",
      icon: <FaChalkboardTeacher size={36} className="text-warning me-2" />,
      largeIcon: (
        <FaChalkboardTeacher size={60} className="text-warning mb-2" />
      ),
    },
  };

  const current = roleConfig[role] || roleConfig.admin;

  const handleLogout = async () => {
    await logout();
    navigate("/login", { replace: true });
  };

  const toggleTheme = () => {
    const next = !darkMode;

    setDarkMode(next);

    document.body.setAttribute("data-bs-theme", next ? "dark" : "light");
  };

  return (
    <nav
      className="navbar navbar-expand-lg bg-white shadow-sm px-4"
      style={{
        height: "75px",
        borderBottom: "1px solid #e5e7eb",
      }}
    >
      <button
        className="btn btn-outline-primary d-lg-none me-3 rounded-circle"
        onClick={toggleSidebar}
      >
        <FaBars />
      </button>

      <div>
        <h4 className="fw-bold text-primary mb-0">AttendX</h4>

        <small className="text-muted">{current.title}</small>
      </div>

      <div className="ms-auto d-flex align-items-center gap-3">
        {/* Dark Mode */}
        <button
          className="btn btn-light rounded-circle shadow-sm"
          onClick={toggleTheme}
        >
          {darkMode ? <FaSun /> : <FaMoon />}
        </button>

        {/* Notifications */}
        <NotificationBell />

        {/* User Dropdown */}
        <div className="dropdown">
          <button
            className="btn btn-light dropdown-toggle d-flex align-items-center rounded-pill px-3 shadow-sm"
            data-bs-toggle="dropdown"
          >
            {current.icon}

            <div className="text-start">
              <div className="fw-semibold">{user?.full_name}</div>

              <small className="text-muted">{current.badge}</small>
            </div>
          </button>

          <ul
            className="dropdown-menu dropdown-menu-end border-0 shadow"
            style={{
              width: "280px",
              borderRadius: "15px",
            }}
          >
            <li className="text-center py-3">
              {current.largeIcon}

              <h6 className="fw-bold mb-1">{user?.full_name}</h6>

              <small className="text-muted">{user?.email}</small>

              <br />

              <span className={`badge bg-${current.color} mt-2`}>
                {current.badge}
              </span>
            </li>

            <li>
              <hr className="dropdown-divider" />
            </li>

            <li>
              <button
                className="dropdown-item"
                onClick={() => navigate(current.profile)}
              >
                <FaUser className="me-2" />
                My Profile
              </button>
            </li>

            <li>
              <button
                className="dropdown-item text-danger"
                onClick={handleLogout}
              >
                <FaSignOutAlt className="me-2" />
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
