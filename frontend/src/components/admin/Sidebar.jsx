import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

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
  FaSignOutAlt,
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
      path: "/admin/dashboard",
    },

    {
      title: "Users",
      icon: <FaUsers />,
      path: "/admin/users",
    },

    {
      title: "Faculties",
      icon: <FaUniversity />,
      path: "/admin/faculties",
    },

    {
      title: "Departments",
      icon: <FaBuilding />,
      path: "/admin/departments",
    },

    {
      title: "Courses",
      icon: <FaBook />,
      path: "/admin/courses",
    },

    {
      title: "Lecturers",
      icon: <FaChalkboardTeacher />,
      path: "/admin/lecturers",
    },

    {
      title: "Students",
      icon: <FaUsers />,
      path: "/admin/students",
    },

    {
      title: "Timetable",
      icon: <FaCalendarAlt />,
      path: "/admin/timetable",
    },

    {
      title: "Class Sessions",
      icon: <FaCalendarAlt />,
      path: "/admin/classSession",
    },

    {
      title: "QR Sessions",
      icon: <FaQrcode />,
      path: "/admin/qrSession",
    },

    {
      title: "Attendance",
      icon: <FaClipboardCheck />,
      path: "/admin/attendance",
    },

    {
      title: "Reports",
      icon: <FaChartBar />,
      path: "/admin/reports",
    },

    {
      title: "Notifications",
      icon: <FaBell />,
      path: "/admin/notifications",
    },

    {
      title: "Settings",
      icon: <FaCog />,
      path: "/admin/settings",
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
                      fontSize: "28px",
                      fontWeight: "bold",
                  }}
              >
                  A
              </div>

              <h4 className="fw-bold mb-1">AttendX</h4>

              <small className="text-light">
                  Administration Panel
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
                          `d-flex align-items-center text-decoration-none mb-2 px-3 py-3 rounded-3 transition ${
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

export default Sidebar;
