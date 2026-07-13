import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
    getAttendance,
    searchAttendance,
    deleteAttendance,
    getAttendanceStatistics
} from "../../../services/attendanceService";

function AttendanceList() {

    const [attendance, setAttendance] = useState([]);
    const [statistics, setStatistics] = useState({
        total_attendance: 0,
        present: 0,
        absent: 0,
        late: 0,
        today: 0,
        attendance_percentage: 0
    });

    const [loading, setLoading] = useState(true);
    const [keyword, setKeyword] = useState("");

    const navigate = useNavigate();

    /*
    |--------------------------------------------------------------------------
    | Load Attendance
    |--------------------------------------------------------------------------
    */

    const loadAttendance = async () => {

        try {

            const response = await getAttendance();

            setAttendance(response.data.data || []);

        }

        catch (error) {

            console.error(error);

        }

    };

    /*
    |--------------------------------------------------------------------------
    | Load Statistics
    |--------------------------------------------------------------------------
    */

    const loadStatistics = async () => {

        try {

            const response = await getAttendanceStatistics();

            setStatistics(response.data.data);

        }

        catch (error) {

            console.error(error);

        }

    };

    /*
    |--------------------------------------------------------------------------
    | Search
    |--------------------------------------------------------------------------
    */

    const handleSearch = async (value) => {

        setKeyword(value);

        try {

            if (value.trim() === "") {

                loadAttendance();

                return;

            }

            const response = await searchAttendance(value);

            setAttendance(response.data.data || []);

        }

        catch (error) {

            console.error(error);

        }

    };

    /*
    |--------------------------------------------------------------------------
    | Delete
    |--------------------------------------------------------------------------
    */

    const handleDelete = async (id) => {

        if (!window.confirm("Delete attendance record?")) return;

        try {

            const response = await deleteAttendance(id);

            alert(response.data.message);

            loadAttendance();

            loadStatistics();

        }

        catch (error) {

            alert(

                error.response?.data?.message ||

                "Delete failed."

            );

        }

    };

    useEffect(() => {

        async function init() {

            await loadAttendance();

            await loadStatistics();

            setLoading(false);

        }

        init();

    }, []);

    return (

<div className="container-fluid py-4">

    <div className="card shadow-sm">

        <div className="card-header bg-primary text-white">

            <h4 className="mb-0">
                Attendance Management
            </h4>

        </div>

        <div className="card-body">

            {/* Statistics */}

            <div className="row mb-4">

                <div className="col-md-2">

                    <div className="card text-center border-primary">

                        <div className="card-body">

                            <h6>Total</h6>

                            <h3>{statistics.total_attendance}</h3>

                        </div>

                    </div>

                </div>

                <div className="col-md-2">

                    <div className="card text-center border-success">

                        <div className="card-body">

                            <h6>Present</h6>

                            <h3 className="text-success">

                                {statistics.present}

                            </h3>

                        </div>

                    </div>

                </div>

                <div className="col-md-2">

                    <div className="card text-center border-danger">

                        <div className="card-body">

                            <h6>Absent</h6>

                            <h3 className="text-danger">

                                {statistics.absent}

                            </h3>

                        </div>

                    </div>

                </div>

                <div className="col-md-2">

                    <div className="card text-center border-warning">

                        <div className="card-body">

                            <h6>Late</h6>

                            <h3 className="text-warning">

                                {statistics.late}

                            </h3>

                        </div>

                    </div>

                </div>

                <div className="col-md-2">

                    <div className="card text-center border-info">

                        <div className="card-body">

                            <h6>Today</h6>

                            <h3 className="text-info">

                                {statistics.today}

                            </h3>

                        </div>

                    </div>

                </div>

                <div className="col-md-2">

                    <div className="card text-center border-dark">

                        <div className="card-body">

                            <h6>Attendance %</h6>

                            <h3>

                                {statistics.attendance_percentage}%

                            </h3>

                        </div>

                    </div>

                </div>

            </div>

            {/* Search */}

            <div className="row mb-3">

                <div className="col-md-4">

                    <input

                        type="text"

                        className="form-control"

                        placeholder="Search Student / Course / Status"

                        value={keyword}

                        onChange={(e) => handleSearch(e.target.value)}

                    />

                </div>

            </div>

                        {/* Attendance Table */}

            {

                loading ?

                (

                    <div className="text-center py-5">

                        <div className="spinner-border text-primary"></div>

                        <p className="mt-3">
                            Loading attendance...
                        </p>

                    </div>

                )

                :

                (

                    <div className="table-responsive">

                        <table className="table table-bordered table-hover align-middle">

                            <thead className="table-dark">

                                <tr>

                                    <th>#</th>

                                    <th>Student</th>

                                    <th>Reg No</th>

                                    <th>Course</th>

                                    <th>Date</th>

                                    <th>Time</th>

                                    <th>Status</th>

                                    <th>Actions</th>

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

                                                    {record.student_name}

                                                </td>

                                                <td>

                                                    {record.registration_no}

                                                </td>

                                                <td>

                                                    {record.course_code}

                                                </td>

                                                <td>

                                                    {record.session_date}

                                                </td>

                                                <td>

                                                    {record.scanned_at}

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

                                                 <button
                                                        className="btn btn-info btn-sm me-2"
                                                        onClick={() => navigate(`/admin/attendance/view/${record.id}`)}
                                                 >
                                                        View
                                                 </button>

                                                 <button
                                                        className="btn btn-danger btn-sm"
                                                        onClick={() => handleDelete(record.id)}
                                                 >
                                                        Delete
                                                 </button>

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

export default AttendanceList;