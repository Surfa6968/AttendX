import { useState } from "react";
import { Outlet } from "react-router-dom";

import LecturerSidebar from "../components/lecturer/LecturerSidebar";
import LecturerTopbar from "../components/common/Topbar";

import "../css/LecturerLayout.css";


function LecturerLayout() {

    const [sidebarOpen, setSidebarOpen] = useState(false);


    const toggleSidebar = () => {
        setSidebarOpen((previous) => !previous);
    };


    const closeSidebar = () => {
        setSidebarOpen(false);
    };


    return (

        <div className="lecturer-layout">

            {/* =====================================================
                MOBILE OVERLAY
            ===================================================== */}

            {sidebarOpen && (

                <div
                    className="lecturer-sidebar-overlay"
                    onClick={closeSidebar}
                />

            )}


            {/* =====================================================
                SIDEBAR
            ===================================================== */}

            <div
                className={`lecturer-sidebar-wrapper ${
                    sidebarOpen
                        ? "mobile-open"
                        : ""
                }`}
            >

                <LecturerSidebar />

            </div>


            {/* =====================================================
                MAIN CONTENT
            ===================================================== */}

            <div className="lecturer-main-area">

                <LecturerTopbar
                    toggleSidebar={toggleSidebar}
                />


                <main className="lecturer-page-content">

                    <Outlet />

                </main>

            </div>

        </div>

    );
}


export default LecturerLayout;