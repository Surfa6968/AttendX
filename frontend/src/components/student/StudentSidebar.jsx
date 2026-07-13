import { NavLink } from "react-router-dom";

function StudentSidebar() {

    return (

        <div
            className="bg-dark text-white vh-100"
            style={{ width: "260px" }}
        >

            <div className="p-4 text-center border-bottom">

                <h2>AttendX</h2>

                <p>Student Panel</p>

            </div>

            <ul className="nav flex-column p-3">

                <li className="nav-item mb-2">
                    <NavLink className="nav-link text-white" to="/student/dashboard">
                        Dashboard
                    </NavLink>
                </li>

                <li className="nav-item mb-2">
                    <NavLink className="nav-link text-white" to="/student/scan">
                        Scan QR
                    </NavLink>
                </li>

                <li className="nav-item mb-2">
                    <NavLink className="nav-link text-white" to="/student/attendance">
                        My Attendance
                    </NavLink>
                </li>

                <li className="nav-item">
                    <NavLink className="nav-link text-white" to="/student/profile">
                        Profile
                    </NavLink>
                </li>

            </ul>

        </div>

    );

}

export default StudentSidebar;