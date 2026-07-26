import { useEffect, useState } from "react";
import {
    getDashboardSummary,
    getTodayClasses,
    getRecentAttendance
} from "../../services/studentDashboardService";

function Dashboard() {

    const [summary, setSummary] = useState(null);
    const [todayClasses, setTodayClasses] = useState([]);
    const [recentAttendance, setRecentAttendance] = useState([]);

    const [loading, setLoading] = useState(true);

    useEffect(() => {

        loadDashboard();

    }, []);

    const loadDashboard = async () => {

        try {

            const [
                summaryResponse,
                classResponse,
                attendanceResponse
            ] = await Promise.all([

                getDashboardSummary(),
                getTodayClasses(),
                getRecentAttendance()

            ]);

            if (summaryResponse.success) {
                setSummary(summaryResponse.data);
            }

            if (classResponse.success) {
                setTodayClasses(classResponse.data);
            }

            if (attendanceResponse.success) {
                setRecentAttendance(attendanceResponse.data);
            }

        }

        catch (error) {

            console.error(error);

            alert("Failed to load dashboard.");

        }

        finally {

            setLoading(false);

        }

    };

    if (loading) {

        return (

            <div className="container py-4">

                <h4>Loading Dashboard...</h4>

            </div>

        );

    }

    return (

        <div className="container-fluid py-4">

            <div className="mb-4">

                <h2>

                    Welcome,

                    {" "}

                    {summary.student_name}

                    👋

                </h2>

                <p className="text-muted">

                    Student Dashboard

                </p>

            </div>

            <div className="row g-4">

                <div className="col-md-3">

                    <div className="card shadow border-0 text-bg-primary">

                        <div className="card-body text-center">

                            <h1>

                                {summary.total_classes}

                            </h1>

                            <h5>

                                Total Classes

                            </h5>

                        </div>

                    </div>

                </div>

                <div className="col-md-3">

                    <div className="card shadow border-0 text-bg-success">

                        <div className="card-body text-center">

                            <h1>

                                {summary.present}

                            </h1>

                            <h5>

                                Present

                            </h5>

                        </div>

                    </div>

                </div>

                <div className="col-md-3">

                    <div className="card shadow border-0 text-bg-danger">

                        <div className="card-body text-center">

                            <h1>

                                {summary.absent}

                            </h1>

                            <h5>

                                Absent

                            </h5>

                        </div>

                    </div>

                </div>

                <div className="col-md-3">

                    <div className="card shadow border-0 text-bg-warning">

                        <div className="card-body text-center">

                            <h1>

                                {summary.attendance_percentage}%

                            </h1>

                            <h5>

                                Attendance

                            </h5>

                        </div>

                    </div>

                </div>

            </div>

            <div className="row mt-5">

                <div className="col-lg-6 mb-4">

                    <div className="card shadow">

                        <div className="card-header bg-primary text-white">

                            <h5 className="mb-0">

                                Today's Classes

                            </h5>

                        </div>

                        <div className="card-body">

                            {todayClasses.length === 0 ? (

                                <p className="text-muted text-center">

                                    No classes scheduled today.

                                </p>

                            ) : (

                                todayClasses.map((item) => (

                                    <div
                                        key={item.class_session_id}
                                        className="border rounded p-3 mb-3"
                                    >

                                        <h5 className="text-primary">

                                            {item.course_code}

                                        </h5>

                                        <p className="mb-1">

                                            <strong>Course:</strong>

                                            {" "}

                                            {item.course_name}

                                        </p>

                                        <p className="mb-1">

                                            <strong>Lecturer:</strong>

                                            {" "}

                                            {item.lecturer_name}

                                        </p>

                                        <p className="mb-1">

                                            <strong>Time:</strong>

                                            {" "}

                                            {item.start_time}

                                            {" - "}

                                            {item.end_time}

                                        </p>

                                        <p className="mb-1">

                                            <strong>Room:</strong>

                                            {" "}

                                            {item.room}

                                        </p>

                                        <span className="badge bg-info">

                                            {item.session_status}

                                        </span>

                                    </div>

                                ))

                            )}

                        </div>

                    </div>

                </div>

                <div className="col-lg-6 mb-4">

                    <div className="card shadow">

                        <div className="card-header bg-success text-white">

                            <h5 className="mb-0">

                                Recent Attendance

                            </h5>

                        </div>

                       <div className="card-body">

                        {recentAttendance.length === 0 ? (

                            <p className="text-center text-muted">

                                No attendance records found.

                            </p>

                        ) : (

                            recentAttendance.map((item, index) => (

                                <div
                                    key={index}
                                    className="border rounded p-3 mb-3"
                                >

                                    <h6 className="text-primary">

                                        {item.course_code}

                                    </h6>

                                    <p className="mb-1">

                                        {item.course_name}

                                    </p>

                                    <p className="mb-1">

                                        <strong>Date:</strong>

                                        {" "}

                                        {item.session_date}

                                    </p>

                                    <span
                                        className={
                                            item.attendance_status === "Present"
                                                ? "badge bg-success"
                                                : item.attendance_status === "Late"
                                                ? "badge bg-warning text-dark"
                                                : "badge bg-danger"
                                        }
                                    >
                                        {item.attendance_status}
                                    </span>

                                </div>

                            ))

                        )}

                    </div>

                    </div>

                </div>

            </div>

        </div>

    );

}

export default Dashboard;