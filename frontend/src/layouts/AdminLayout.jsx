import { useState } from "react";
import { Outlet } from "react-router-dom";

import Sidebar from "../components/admin/Sidebar";
import Topbar from "../components/common/Topbar";

function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="d-flex bg-light">
      {/* Sidebar */}

      <div className={sidebarOpen ? "d-block" : "d-none d-lg-block"}>
        <Sidebar />
      </div>

      {/* Main Content */}
      <div
        className="flex-grow-1"
        style={{
          minHeight: "100vh",
        }}
      >
        <div
          style={{
            position: "sticky",
            top: 0,
            zIndex: 1050,
          }}
        >
          <Topbar toggleSidebar={toggleSidebar} />
        </div>

        <main className="p-4">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default AdminLayout;
