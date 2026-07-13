import { useEffect, useState } from "react";
import { getAttendanceHistory } from "../../services/studentAttendanceService";

function AttendanceHistory() {

    const [attendance, setAttendance] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {

        async function loadHistory() {

            try {

                const response = await getAttendanceHistory();

                setAttendance(response.data.data || []);

            } catch (error) {

                console.error(error);

            }

            setLoading(false);

        }

        loadHistory();

    }, []);

    return (

        <div className="container-fluid py-4">

            <div className="card shadow-sm">

                <div className="card-header bg-primary text-white">

                    <h4 className="mb-0">

                        My Attendance History

                    </h4>

                </div>

                <div className="card-body">

                    {

                        loading ?

                        (

                            <div className="text-center py-5">

                                <div className="spinner-border text-primary"></div>

                                <p className="mt-3">

                                    Loading...

                                </p>

                            </div>

                        )

                        :

                        (

                            <div className="table-responsive">

                                <table className="table table-bordered table-hover">

                                    <thead className="table-dark">

                                        <tr>

                                            <th>#</th>

                                            <th>Course</th>

                                            <th>Course Name</th>

                                            <th>Lecturer</th>

                                            <th>Date</th>

                                            <th>Time</th>

                                            <th>Status</th>

                                            <th>Scanned At</th>

                                        </tr>

                                    </thead>

                                    <tbody>

                                        {

                                            attendance.length === 0 ?

                                            (

                                                <tr>

                                                    <td
                                                        colSpan="8"
                                                        className="text-center"
                                                    >

                                                        No attendance records found.

                                                    </td>

                                                </tr>

                                            )

                                            :

                                            (

                                                attendance.map((record, index) => (

                                                    <tr key={record.id}>

                                                        <td>

                                                            {index + 1}

                                                        </td>

                                                        <td>

                                                            {record.course_code}

                                                        </td>

                                                        <td>

                                                            {record.course_name}

                                                        </td>

                                                        <td>

                                                            {record.lecturer_name}

                                                        </td>

                                                        <td>

                                                            {record.session_date}

                                                        </td>

                                                        <td>

                                                            {record.start_time} - {record.end_time}

                                                        </td>

                                                        <td>

                                                            <span
                                                                className={`badge ${
                                                                    record.attendance_status === "Present"
                                                                        ? "bg-success"
                                                                        : record.attendance_status === "Late"
                                                                        ? "bg-warning text-dark"
                                                                        : "bg-danger"
                                                                }`}
                                                            >

                                                                {record.attendance_status}

                                                            </span>

                                                        </td>

                                                        <td>

                                                            {record.scanned_at}

                                                        </td>

                                                    </tr>

                                                ))

                                            )

                                        }

                                    </tbody>

                                </table>

                            </div>

                        )

                    }

                </div>

            </div>

        </div>

    );

}

export default AttendanceHistory;