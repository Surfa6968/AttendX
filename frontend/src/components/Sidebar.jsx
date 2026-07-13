import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

import {
    FaTachometerAlt,
    FaUsers,
    FaUniversity,
    FaBuilding,
    FaBook,
    FaChalkboardTeacher,
    FaCalendarAlt,
    FaQrcode,
    FaClipboardCheck,
    FaChartBar,
    FaBell,
    FaCog,
    FaSignOutAlt
} from "react-icons/fa";

function Sidebar() {

    const { logout } = useAuth();

    const navigate = useNavigate();

    const handleLogout = async () => {

        await logout();

        navigate("/login", { replace: true });

    };

    const menuItems = [

        {
            title: "Dashboard",
            icon: <FaTachometerAlt />,
            path: "/admin/dashboard"
        },

        {
            title: "Users",
            icon: <FaUsers />,
            path: "/admin/users"
        },

        {
            title: "Faculties",
            icon: <FaUniversity />,
            path: "/admin/faculties"
        },

        {
            title: "Departments",
            icon: <FaBuilding />,
            path: "/admin/departments"
        },

        {
            title: "Courses",
            icon: <FaBook />,
            path: "/admin/courses"
        },

        {
            title: "Lecturers",
            icon: <FaChalkboardTeacher />,
            path: "/admin/lecturers"
        },

        {
            title: "Students",
            icon: <FaUsers />,
            path: "/admin/students"
        },

        {
            title: "Timetable",
            icon: <FaCalendarAlt />,
            path: "/admin/timetable"
        },

        {
            title: "Class Sessions",
            icon: <FaCalendarAlt />,
            path: "/admin/classSession"
        },

        {
            title: "QR Sessions",
            icon: <FaQrcode />,
            path: "/admin/qrSession"
        },

        {
            title: "Attendance",
            icon: <FaClipboardCheck />,
            path: "/admin/attendance"
        },

        {
            title: "Reports",
            icon: <FaChartBar />,
            path: "/admin/reports"
        },

        {
            title: "Notifications",
            icon: <FaBell />,
            path: "/admin/notifications"
        },

        {
            title: "Settings",
            icon: <FaCog />,
            path: "/admin/settings"
        }

    ];

    return (

        <aside
            className="bg-dark text-white d-flex flex-column"
            style={{
                width: "260px",
                minHeight: "100vh"
            }}
        >

            <div className="text-center py-4 border-bottom">

                <h3 className="fw-bold">
                    AttendX
                </h3>

                <small>
                    Admin Panel
                </small>

            </div>

            <div className="flex-grow-1">

                {
                    menuItems.map((item) => (

                        <NavLink
                            key={item.title}
                            to={item.path}
                            className={({ isActive }) =>
                                `d-flex align-items-center text-decoration-none px-4 py-3 ${
                                    isActive
                                        ? "bg-primary text-white"
                                        : "text-light"
                                }`
                            }
                        >

                            <span className="me-3 fs-5">
                                {item.icon}
                            </span>

                            {item.title}

                        </NavLink>

                    ))
                }

            </div>

            <div className="border-top p-3">

                <button
                    className="btn btn-danger w-100"
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