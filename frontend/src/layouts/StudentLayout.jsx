import StudentSidebar from "../components/student/StudentSidebar";
import StudentTopbar from "../components/student/StudentTopbar";
import { Outlet } from "react-router-dom";

function StudentLayout() {
    return (
        <div className="d-flex">
            <StudentSidebar />

            <div className="flex-grow-1">
                <StudentTopbar />

                <main className="p-4">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}

export default StudentLayout;