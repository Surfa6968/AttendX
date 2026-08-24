import { Outlet } from "react-router-dom";

import LecturerSidebar from "../components/lecturer/LecturerSidebar";
import LecturerTopbar from "../components/common/Topbar";

function LecturerLayout() {
    return (
        <div className="d-flex">
            
            {/* Lecturer Sidebar */}
            <LecturerSidebar />

            {/* Lecturer Main Area */}
            <div className="flex-grow-1">

                {/* Topbar */}
                <LecturerTopbar />

                {/* Page Content */}
                <main className="p-4">
                    <Outlet />
                </main>

            </div>

        </div>
    );
}

export default LecturerLayout;