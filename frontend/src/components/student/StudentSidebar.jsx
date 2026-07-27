import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

import {
    FaTachometerAlt,
    FaQrcode,
    FaClipboardCheck,
    FaUser,
    FaCalendarAlt,
    FaSignOutAlt,
    FaUserGraduate,
} from "react-icons/fa";

function StudentSidebar() {
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
            path: "/student/dashboard",
        },
        {
            title: "Scan QR",
            icon: <FaQrcode />,
            path: "/student/scan",
        },
        {
            title: "My Attendance",
            icon: <FaClipboardCheck />,
            path: "/student/attendance",
        },
        {
            title: "Timetable",
            icon: <FaCalendarAlt />,
            path: "/student/timetable",
        },
        {
            title: "Profile",
            icon: <FaUser />,
            path: "/student/profile",
        },
    ];

    return (
        <aside
            className="d-flex flex-column text-white shadow-lg"
            style={{
                width: "270px",
                minHeight: "100vh",
                background: "#111827",
            }}
        >
            {/* Header */}
            <div
                className="text-center py-4"
                style={{
                    background: "linear-gradient(135deg,#2563eb,#1d4ed8)",
                    borderBottom: "1px solid rgba(255,255,255,.1)",
                }}
            >
                <div
                    className="mx-auto mb-3 d-flex align-items-center justify-content-center"
                    style={{
                        width: "65px",
                        height: "65px",
                        borderRadius: "50%",
                        background: "rgba(255,255,255,.15)",
                    }}
                >
                    <FaUserGraduate size={28} />
                </div>

                <h4 className="fw-bold mb-1">AttendX</h4>

                <small className="text-light">
                    Student Panel
                </small>
            </div>

            {/* Navigation */}
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
                            `sidebar-link d-flex align-items-center text-decoration-none px-3 py-3 rounded-3 mb-2 transition ${
                                isActive
                                    ? "bg-primary text-white shadow"
                                    : "text-light"
                            }`
                        }
                        style={({ isActive }) => ({
                          transition: "0.25s",
                          background: isActive
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

            {/* Footer */}
            <div
                className="p-3"
                style={{
                    borderTop: "1px solid rgba(255,255,255,.08)",
                }}
            >
                <button
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

export default StudentSidebar;