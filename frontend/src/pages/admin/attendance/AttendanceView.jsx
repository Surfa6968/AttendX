import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { viewAttendance } from "../../../services/attendanceService";

function AttendanceView() {

    const { id } = useParams();

    const navigate = useNavigate();

    const [attendance, setAttendance] = useState(null);

    const [loading, setLoading] = useState(true);

    useEffect(() => {

        async function loadAttendance() {

            try {

                const response = await viewAttendance(id);

                setAttendance(response.data.data);

            }

            catch (error) {

                alert(

                    error.response?.data?.message ||

                    "Failed to load attendance."

                );

                navigate("/admin/attendance");

            }

            finally {

                setLoading(false);

            }

        }

        loadAttendance();

    }, [id, navigate]);

    if (loading) {

        return (

            <div className="container py-5 text-center">

                <div className="spinner-border text-primary"></div>

                <p className="mt-3">

                    Loading Attendance...

                </p>

            </div>

        );

    }

    if (!attendance) {

        return (

            <div className="container py-5">

                <div className="alert alert-danger">

                    Attendance record not found.

                </div>

            </div>

        );

    }

    return (

        <div className="container py-4">

            <div className="card shadow">

                <div className="card-header bg-primary text-white">

                    <h4 className="mb-0">

                        Attendance Details

                    </h4>

                </div>

                <div className="card-body">

                    <table className="table table-bordered">

                        <tbody>

                            <tr>

                                <th width="250">Student Name</th>

                                <td>{attendance.student_name}</td>

                            </tr>

                            <tr>

                                <th>Registration Number</th>

                                <td>{attendance.registration_no}</td>

                            </tr>

                            <tr>

                                <th>Email</th>

                                <td>{attendance.email}</td>

                            </tr>

                            <tr>

                                <th>Course Code</th>

                                <td>{attendance.course_code}</td>

                            </tr>

                            <tr>

                                <th>Course Name</th>

                                <td>{attendance.course_name}</td>

                            </tr>

                            <tr>

                                <th>Session Date</th>

                                <td>{attendance.session_date}</td>

                            </tr>

                            <tr>

                                <th>Start Time</th>

                                <td>{attendance.start_time}</td>

                            </tr>

                            <tr>

                                <th>End Time</th>

                                <td>{attendance.end_time}</td>

                            </tr>

                            <tr>

                                <th>Attendance Status</th>

                                <td>

                                    <span

                                        className={`badge ${

                                            attendance.attendance_status === "Present"

                                                ? "bg-success"

                                                : attendance.attendance_status === "Late"

                                                ? "bg-warning text-dark"

                                                : "bg-danger"

                                        }`}

                                    >

                                        {attendance.attendance_status}

                                    </span>

                                </td>

                            </tr>

                            <tr>

                                <th>Marked By</th>

                                <td>{attendance.marked_by}</td>

                            </tr>

                            <tr>

                                <th>Scanned At</th>

                                <td>{attendance.scanned_at}</td>

                            </tr>

                            <tr>

                                <th>Latitude</th>

                                <td>{attendance.latitude || "-"}</td>

                            </tr>

                            <tr>

                                <th>Longitude</th>

                                <td>{attendance.longitude || "-"}</td>

                            </tr>

                            <tr>

                                <th>IP Address</th>

                                <td>{attendance.ip_address || "-"}</td>

                            </tr>

                            <tr>

                                <th>Device</th>

                                <td>{attendance.device_info || "-"}</td>

                            </tr>

                            <tr>

                                <th>Remarks</th>

                                <td>{attendance.remarks || "-"}</td>

                            </tr>

                        </tbody>

                    </table>

                    <button

                        className="btn btn-secondary"

                        onClick={() => navigate("/admin/attendance")}

                    >

                        ← Back

                    </button>

                </div>

            </div>

        </div>

    );

}

export default AttendanceView;