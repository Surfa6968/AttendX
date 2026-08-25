import { useEffect, useState } from "react";

import {
    FaBook,
    FaCalendarAlt,
    FaQrcode,
    FaClipboardCheck,
    FaChartLine,
    FaUsers,
    FaClock,
    FaArrowRight,
} from "react-icons/fa";

function LecturerDashboard() {

    const [loading, setLoading] = useState(true);

    const [statistics, setStatistics] = useState({
        totalCourses: 0,
        todayClasses: 0,
        activeQRSession: 0,
        todayAttendance: 0,
    });

    const [upcomingClasses, setUpcomingClasses] = useState([]);

    const [recentAttendance, setRecentAttendance] = useState([]);


    /*
    |--------------------------------------------------------------------------
    | Load Dashboard Data
    |--------------------------------------------------------------------------
    */

    useEffect(() => {

        const loadDashboard = async () => {

            try {

                setLoading(true);

                /*
                 * API integration will be connected here.
                 *
                 * For now we use empty/default values so the
                 * dashboard can be developed without breaking.
                 */

                setStatistics({
                    totalCourses: 0,
                    todayClasses: 0,
                    activeQRSession: 0,
                    todayAttendance: 0,
                });

                setUpcomingClasses([]);

                setRecentAttendance([]);

            } catch (error) {

                console.error(
                    "Failed to load lecturer dashboard:",
                    error
                );

            } finally {

                setLoading(false);

            }

        };

        loadDashboard();

    }, []);


    /*
    |--------------------------------------------------------------------------
    | Loading
    |--------------------------------------------------------------------------
    */

    if (loading) {

        return (

            <div className="container-fluid">

                <div className="text-center py-5">

                    <div
                        className="spinner-border text-primary"
                        role="status"
                    >

                        <span className="visually-hidden">
                            Loading...
                        </span>

                    </div>

                    <p className="text-muted mt-3 mb-0">
                        Loading lecturer dashboard...
                    </p>

                </div>

            </div>

        );

    }


    /*
    |--------------------------------------------------------------------------
    | Dashboard
    |--------------------------------------------------------------------------
    */

    return (

        <div className="container-fluid">


            {/* ============================================================
                HEADER
            ============================================================ */}

            <div className="d-flex justify-content-between align-items-center mb-4">

                <div>

                    <h2 className="fw-bold mb-1">
                        Lecturer Dashboard
                    </h2>

                    <p className="text-muted mb-0">
                        Welcome to your AttendX lecturer dashboard.
                    </p>

                </div>

            </div>


            {/* ============================================================
                STATISTICS
            ============================================================ */}

            <div className="row g-4 mb-4">


                {/* My Courses */}

                <div className="col-xl-3 col-md-6">

                    <div className="card border-0 shadow-sm h-100">

                        <div className="card-body">

                            <div className="d-flex justify-content-between align-items-center">

                                <div>

                                    <p className="text-muted mb-2">
                                        My Courses
                                    </p>

                                    <h3 className="fw-bold mb-0">
                                        {statistics.totalCourses}
                                    </h3>

                                </div>

                                <div
                                    className="d-flex align-items-center justify-content-center rounded-3 bg-primary text-white"
                                    style={{
                                        width: "50px",
                                        height: "50px",
                                    }}
                                >

                                    <FaBook size={21} />

                                </div>

                            </div>

                        </div>

                    </div>

                </div>


                {/* Today's Classes */}

                <div className="col-xl-3 col-md-6">

                    <div className="card border-0 shadow-sm h-100">

                        <div className="card-body">

                            <div className="d-flex justify-content-between align-items-center">

                                <div>

                                    <p className="text-muted mb-2">
                                        Today's Classes
                                    </p>

                                    <h3 className="fw-bold mb-0">
                                        {statistics.todayClasses}
                                    </h3>

                                </div>

                                <div
                                    className="d-flex align-items-center justify-content-center rounded-3 bg-success text-white"
                                    style={{
                                        width: "50px",
                                        height: "50px",
                                    }}
                                >

                                    <FaCalendarAlt size={21} />

                                </div>

                            </div>

                        </div>

                    </div>

                </div>


                {/* Active QR Session */}

                <div className="col-xl-3 col-md-6">

                    <div className="card border-0 shadow-sm h-100">

                        <div className="card-body">

                            <div className="d-flex justify-content-between align-items-center">

                                <div>

                                    <p className="text-muted mb-2">
                                        Active QR Session
                                    </p>

                                    <h3 className="fw-bold mb-0">
                                        {statistics.activeQRSession}
                                    </h3>

                                </div>

                                <div
                                    className="d-flex align-items-center justify-content-center rounded-3 bg-warning text-white"
                                    style={{
                                        width: "50px",
                                        height: "50px",
                                    }}
                                >

                                    <FaQrcode size={21} />

                                </div>

                            </div>

                        </div>

                    </div>

                </div>


                {/* Today's Attendance */}

                <div className="col-xl-3 col-md-6">

                    <div className="card border-0 shadow-sm h-100">

                        <div className="card-body">

                            <div className="d-flex justify-content-between align-items-center">

                                <div>

                                    <p className="text-muted mb-2">
                                        Today's Attendance
                                    </p>

                                    <h3 className="fw-bold mb-0">
                                        {statistics.todayAttendance}
                                    </h3>

                                </div>

                                <div
                                    className="d-flex align-items-center justify-content-center rounded-3 bg-info text-white"
                                    style={{
                                        width: "50px",
                                        height: "50px",
                                    }}
                                >

                                    <FaClipboardCheck size={21} />

                                </div>

                            </div>

                        </div>

                    </div>

                </div>

            </div>


            {/* ============================================================
                QUICK ACTIONS
            ============================================================ */}

            <div className="card border-0 shadow-sm mb-4">

                <div className="card-body p-4">

                    <h5 className="fw-bold mb-4">
                        Quick Actions
                    </h5>


                    <div className="row g-3">


                        {/* Start QR */}

                        <div className="col-md-4">

                            <button
                                type="button"
                                className="btn btn-primary w-100 py-3"
                                onClick={() =>
                                    window.location.href =
                                        "/lecturer/qrSession"
                                }
                            >

                                <FaQrcode className="me-2" />

                                Start QR Session

                            </button>

                        </div>


                        {/* Attendance */}

                        <div className="col-md-4">

                            <button
                                type="button"
                                className="btn btn-success w-100 py-3"
                                onClick={() =>
                                    window.location.href =
                                        "/lecturer/attendance"
                                }
                            >

                                <FaClipboardCheck className="me-2" />

                                View Attendance

                            </button>

                        </div>


                        {/* Timetable */}

                        <div className="col-md-4">

                            <button
                                type="button"
                                className="btn btn-outline-primary w-100 py-3"
                                onClick={() =>
                                    window.location.href =
                                        "/lecturer/timetable"
                                }
                            >

                                <FaCalendarAlt className="me-2" />

                                View Timetable

                            </button>

                        </div>

                    </div>

                </div>

            </div>


            {/* ============================================================
                UPCOMING CLASSES + ATTENDANCE
            ============================================================ */}

            <div className="row g-4">


                {/* ========================================================
                    UPCOMING CLASSES
                ======================================================== */}

                <div className="col-lg-7">

                    <div className="card border-0 shadow-sm h-100">

                        <div className="card-body p-4">

                            <div className="d-flex justify-content-between align-items-center mb-4">

                                <h5 className="fw-bold mb-0">
                                    Upcoming Classes
                                </h5>

                                <a
                                    href="/lecturer/timetable"
                                    className="text-decoration-none"
                                >
                                    View All
                                    <FaArrowRight
                                        className="ms-2"
                                        size={12}
                                    />
                                </a>

                            </div>


                            {upcomingClasses.length === 0 ? (

                                <div className="text-center py-5">

                                    <FaCalendarAlt
                                        size={40}
                                        className="text-muted mb-3"
                                    />

                                    <h6 className="fw-semibold">
                                        No upcoming classes
                                    </h6>

                                    <p className="text-muted mb-0">
                                        Your upcoming classes will
                                        appear here.
                                    </p>

                                </div>

                            ) : (

                                <div className="list-group list-group-flush">

                                    {upcomingClasses.map(
                                        (item, index) => (

                                            <div
                                                key={item.id || index}
                                                className="list-group-item px-0 py-3"
                                            >

                                                <div className="d-flex justify-content-between">

                                                    <div>

                                                        <h6 className="fw-semibold mb-1">
                                                            {item.course_name}
                                                        </h6>

                                                        <small className="text-muted">
                                                            {item.course_code}
                                                        </small>

                                                    </div>

                                                    <div className="text-end">

                                                        <div>
                                                            <FaClock
                                                                className="me-1"
                                                            />

                                                            {item.start_time}
                                                        </div>

                                                        <small className="text-muted">
                                                            {item.room}
                                                        </small>

                                                    </div>

                                                </div>

                                            </div>

                                        )
                                    )}

                                </div>

                            )}

                        </div>

                    </div>

                </div>


                {/* ========================================================
                    RECENT ATTENDANCE
                ======================================================== */}

                <div className="col-lg-5">

                    <div className="card border-0 shadow-sm h-100">

                        <div className="card-body p-4">

                            <div className="d-flex justify-content-between align-items-center mb-4">

                                <h5 className="fw-bold mb-0">
                                    Recent Attendance
                                </h5>

                                <a
                                    href="/lecturer/reports"
                                    className="text-decoration-none"
                                >
                                    Reports
                                </a>

                            </div>


                            {recentAttendance.length === 0 ? (

                                <div className="text-center py-5">

                                    <FaChartLine
                                        size={40}
                                        className="text-muted mb-3"
                                    />

                                    <h6 className="fw-semibold">
                                        No attendance records
                                    </h6>

                                    <p className="text-muted mb-0">
                                        Recent attendance data will
                                        appear here.
                                    </p>

                                </div>

                            ) : (

                                <div>

                                    {recentAttendance.map(
                                        (item, index) => (

                                            <div
                                                key={
                                                    item.id ||
                                                    index
                                                }
                                                className="d-flex justify-content-between align-items-center border-bottom py-3"
                                            >

                                                <div>

                                                    <h6 className="fw-semibold mb-1">
                                                        {item.course_name}
                                                    </h6>

                                                    <small className="text-muted">
                                                        {item.date}
                                                    </small>

                                                </div>

                                                <div className="text-end">

                                                    <strong>
                                                        {item.present}
                                                    </strong>

                                                    <small className="text-muted">
                                                        {" "}
                                                        /{" "}
                                                        {item.total}
                                                    </small>

                                                </div>

                                            </div>

                                        )
                                    )}

                                </div>

                            )}

                        </div>

                    </div>

                </div>

            </div>

        </div>

    );

}

export default LecturerDashboard;