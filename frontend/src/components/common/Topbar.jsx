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


    /* ============================================================
       ROLE
       ============================================================ */

    const role =
        user?.role?.toLowerCase() || "admin";


    /* ============================================================
       ROLE CONFIGURATION
       ============================================================ */

    const roleConfig = {

        admin: {
            title: "Administration Panel",
            badge: "Administrator",
            profile: "/admin/profile",
            icon: <FaUserShield />,
        },

        lecturer: {
            title: "Lecturer Portal",
            badge: "Lecturer",
            profile: "/lecturer/profile",
            icon: <FaChalkboardTeacher />,
        },

        student: {
            title: "Student Portal",
            badge: "Student",
            profile: "/student/profile",
            icon: <FaUserGraduate />,
        },

    };


    const current =
        roleConfig[role] ||
        roleConfig.admin;


    /* ============================================================
       LOGOUT
       ============================================================ */

    const handleLogout = async () => {

        try {

            await logout();

        } catch (error) {

            console.error(
                "Logout failed:",
                error
            );

        } finally {

            navigate(
                "/login",
                {
                    replace: true,
                }
            );

        }

    };


    /* ============================================================
       DARK MODE
       ============================================================ */

    const toggleTheme = () => {

        const next =
            !darkMode;

        setDarkMode(next);

        document.body.setAttribute(
            "data-bs-theme",
            next
                ? "dark"
                : "light"
        );

    };


    /* ============================================================
       PROFILE NAVIGATION
       ============================================================ */

    const openProfile = () => {

        navigate(
            current.profile
        );

    };


    /* ============================================================
       RENDER
       ============================================================ */

    return (

        <header className="attendx-topbar">


            {/* =====================================================
                LEFT
            ===================================================== */}

            <div className="topbar-left">


                {/* Mobile Sidebar */}
                {toggleSidebar && (

                    <button
                        type="button"
                        className="topbar-menu-button"
                        onClick={toggleSidebar}
                        aria-label="Open navigation"
                    >

                        <FaBars />

                    </button>

                )}


                {/* Brand */}
                <div className="topbar-brand">

                    <div className="topbar-brand-logo">
                        A
                    </div>

                    <div className="topbar-brand-text">

                        <h5>
                            AttendX
                        </h5>

                        <span>
                            {current.title}
                        </span>

                    </div>

                </div>

            </div>


            {/* =====================================================
                RIGHT
            ===================================================== */}

            <div className="topbar-right">


                {/* =================================================
                    THEME
                ================================================= */}

                <button
                    type="button"
                    className="topbar-icon-button"
                    onClick={toggleTheme}
                    title={
                        darkMode
                            ? "Light mode"
                            : "Dark mode"
                    }
                >

                    {darkMode
                        ? <FaSun />
                        : <FaMoon />
                    }

                </button>


                {/* =================================================
                    NOTIFICATIONS
                ================================================= */}

                <div className="topbar-notification">

                    <NotificationBell />

                </div>


                {/* =================================================
                    PROFILE
                ================================================= */}

                <div className="dropdown">

                    <button
                        type="button"
                        className="topbar-profile-button dropdown-toggle"
                        data-bs-toggle="dropdown"
                        aria-expanded="false"
                    >

                        <div
                            className={
                                `topbar-role-icon topbar-role-${role}`
                            }
                        >

                            {current.icon}

                        </div>


                        <div className="topbar-user-info">

                            <strong>
                                {user?.full_name ||
                                    "User"
                                }
                            </strong>

                            <span>
                                {current.badge}
                            </span>

                        </div>

                    </button>


                    {/* =================================================
                        DROPDOWN
                    ================================================= */}

                    <ul className="dropdown-menu dropdown-menu-end topbar-dropdown">


                        {/* Profile Header */}

                        <li>

                            <div className="topbar-dropdown-header">

                                <div
                                    className={
                                        `topbar-dropdown-avatar topbar-role-${role}`
                                    }
                                >

                                    {current.icon}

                                </div>


                                <div>

                                    <strong>
                                        {
                                            user?.full_name ||
                                            "User"
                                        }
                                    </strong>

                                    <span>
                                        {
                                            user?.email ||
                                            ""
                                        }
                                    </span>

                                    <small>
                                        {current.badge}
                                    </small>

                                </div>

                            </div>

                        </li>


                        <li>
                            <hr className="dropdown-divider" />
                        </li>


                        {/* Profile */}

                        <li>

                            <button
                                type="button"
                                className="dropdown-item topbar-dropdown-item"
                                onClick={openProfile}
                            >

                                <span className="dropdown-item-icon">
                                    <FaUser />
                                </span>

                                <span>
                                    My Profile
                                </span>

                            </button>

                        </li>


                        {/* Logout */}

                        <li>

                            <button
                                type="button"
                                className="dropdown-item topbar-dropdown-item logout"
                                onClick={handleLogout}
                            >

                                <span className="dropdown-item-icon">
                                    <FaSignOutAlt />
                                </span>

                                <span>
                                    Logout
                                </span>

                            </button>

                        </li>

                    </ul>

                </div>

            </div>

        </header>

    );

}


export default Topbar;