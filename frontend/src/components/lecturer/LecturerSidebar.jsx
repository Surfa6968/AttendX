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
} from "react-icons/fa";

function Sidebar() {

    const { logout } = useAuth();

    const navigate = useNavigate();

    /*
    |--------------------------------------------------------------------------
    | Logout
    |--------------------------------------------------------------------------
    */

    const handleLogout = async () => {

        try {

            await logout();

            navigate("/login", {
                replace: true,
            });

        } catch (error) {

            console.error(
                "Logout failed:",
                error
            );

            navigate("/login", {
                replace: true,
            });

        }

    };


    /*
    |--------------------------------------------------------------------------
    | Lecturer Menu
    |--------------------------------------------------------------------------
    */

    const menuItems = [

        {
            title: "Dashboard",
            icon: <FaTachometerAlt />,
            path: "/lecturer/dashboard",
        },

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

    ];


    /*
    |--------------------------------------------------------------------------
    | Render
    |--------------------------------------------------------------------------
    */

    return (

        <aside
            className="d-flex flex-column text-white shadow-lg"
            style={{
                width: "270px",
                minHeight: "100vh",
                background: "#111827",
            }}
        >

            {/* ============================================================
                HEADER
            ============================================================ */}

            <div
                className="text-center py-4"
                style={{
                    background:
                        "linear-gradient(135deg,#2563eb,#1d4ed8)",
                    borderBottom:
                        "1px solid rgba(255,255,255,.1)",
                }}
            >

                <div
                    className="mx-auto mb-3 d-flex align-items-center justify-content-center"
                    style={{
                        width: "65px",
                        height: "65px",
                        borderRadius: "50%",
                        background:
                            "rgba(255,255,255,.15)",
                        fontSize: "28px",
                        fontWeight: "bold",
                    }}
                >
                    A
                </div>


                <h4 className="fw-bold mb-1">
                    AttendX
                </h4>


                <small className="text-light">
                    Lecturer Panel
                </small>

            </div>


            {/* ============================================================
                NAVIGATION
            ============================================================ */}

            <div
                className="flex-grow-1 py-3 px-2"
                style={{
                    overflowY: "auto",
                }}
            >

                {menuItems.map((item) => (

                    <NavLink
                        key={item.title}
                        to={item.path}
                        className={({ isActive }) =>
                            `d-flex align-items-center text-decoration-none mb-2 px-3 py-3 rounded-3 ${
                                isActive
                                    ? "bg-primary text-white shadow"
                                    : "text-light"
                            }`
                        }
                        style={({ isActive }) => ({
                            transition: "0.25s",
                            background:
                                isActive
                                    ? ""
                                    : "transparent",
                        })}
                    >

                        <span
                            className="me-3 fs-5"
                            style={{
                                width: "24px",
                                textAlign: "center",
                            }}
                        >
                            {item.icon}
                        </span>


                        <span className="fw-medium">
                            {item.title}
                        </span>

                    </NavLink>

                ))}

            </div>


            {/* ============================================================
                FOOTER / LOGOUT
            ============================================================ */}

            <div
                className="p-3"
                style={{
                    borderTop:
                        "1px solid rgba(255,255,255,.08)",
                }}
            >

                <button
                    type="button"
                    className="btn btn-danger w-100 rounded-pill"
                    onClick={handleLogout}
                >

                    <FaSignOutAlt className="me-2" />

                    Logout

                </button>

            </div>

        </aside>

    );

}

export default Sidebar;