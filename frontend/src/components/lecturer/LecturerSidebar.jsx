import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

import {
    FaTachometerAlt,
    FaBook,
    FaCalendarAlt,
    FaQrcode,
    FaClipboardCheck,
    FaChartBar,
    FaBell,
    FaUser,
    FaCog,
    FaSignOutAlt,
    FaChevronRight,
} from "react-icons/fa";

import "../../css/LecturerSidebar.css";


function LecturerSidebar() {

    const { logout } = useAuth();

    const navigate = useNavigate();


    const handleLogout = async () => {

        try {

            await logout();

        } catch (error) {

            console.error(
                "Logout failed:",
                error
            );

        } finally {

            navigate("/login", {
                replace: true,
            });

        }

    };


    const menuSections = [

        {
            title: "OVERVIEW",

            items: [

                {
                    title: "Dashboard",
                    icon: <FaTachometerAlt />,
                    path: "/lecturer/dashboard",
                },

            ],
        },


        {
            title: "ACADEMIC",

            items: [

                {
                    title: "My Courses",
                    icon: <FaBook />,
                    path: "/lecturer/courses",
                },

                {
                    title: "Timetable",
                    icon: <FaCalendarAlt />,
                    path: "/lecturer/timetable",
                },

                {
                    title: "Class Sessions",
                    icon: <FaCalendarAlt />,
                    path: "/lecturer/classSession",
                },

            ],
        },


        {
            title: "ATTENDANCE",

            items: [

                {
                    title: "QR Sessions",
                    icon: <FaQrcode />,
                    path: "/lecturer/qrSession",
                },

                {
                    title: "Attendance",
                    icon: <FaClipboardCheck />,
                    path: "/lecturer/attendance",
                },

                {
                    title: "Reports",
                    icon: <FaChartBar />,
                    path: "/lecturer/reports",
                },

            ],
        },


        {
            title: "ACCOUNT",

            items: [

                {
                    title: "Notifications",
                    icon: <FaBell />,
                    path: "/lecturer/notifications",
                },

                {
                    title: "My Profile",
                    icon: <FaUser />,
                    path: "/lecturer/profile",
                },

                {
                    title: "Settings",
                    icon: <FaCog />,
                    path: "/lecturer/settings",
                },

            ],
        },

    ];


    return (

        <aside 
            className="lecturer-sidebar d-flex flex-column text-white shadow-lg"
        >

            {/* =====================================================
                BRAND
            ===================================================== */}

            <div className="lecturer-brand">

                <div className="lecturer-brand-logo">
                    A
                </div>

                <div className="lecturer-brand-text">

                    <h4>
                        AttendX
                    </h4>

                    <span>
                        Lecturer Portal
                    </span>

                </div>

            </div>


            {/* =====================================================
                NAVIGATION
            ===================================================== */}

            <nav className="lecturer-navigation">

                {menuSections.map((section) => (

                    <div
                        className="lecturer-nav-section"
                        key={section.title}
                    >

                        <div className="lecturer-nav-label">
                            {section.title}
                        </div>


                        {section.items.map((item) => (

                            <NavLink
                                key={item.title}
                                to={item.path}
                                className={({ isActive }) =>
                                    `lecturer-nav-item ${
                                        isActive
                                            ? "active"
                                            : ""
                                    }`
                                }
                            >

                                <span className="lecturer-nav-icon">
                                    {item.icon}
                                </span>


                                <span className="lecturer-nav-title">
                                    {item.title}
                                </span>


                                <FaChevronRight className="lecturer-nav-arrow" />

                            </NavLink>

                        ))}

                    </div>

                ))}

            </nav>


            {/* =====================================================
                BOTTOM AREA
            ===================================================== */}

            <div className="lecturer-sidebar-bottom">

                <div className="lecturer-sidebar-profile">

                    <div className="lecturer-avatar">
                        L
                    </div>

                    <div className="lecturer-profile-info">

                        <strong>
                            Lecturer
                        </strong>

                        <span>
                            Academic Staff
                        </span>

                    </div>

                </div>


                <button
                    type="button"
                    className="lecturer-logout"
                    onClick={handleLogout}
                >

                    <FaSignOutAlt />

                    <span>
                        Logout
                    </span>

                </button>

            </div>

        </aside>

    );

}

export default LecturerSidebar;