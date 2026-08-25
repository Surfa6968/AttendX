import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
    FaBook,
    FaCalendarAlt,
    FaQrcode,
    FaClipboardCheck,
    FaChartLine,
    FaClock,
    FaArrowRight,
    FaExclamationCircle,
    FaSyncAlt,
} from "react-icons/fa";

import { getLecturerDashboard } from "../../services/lecturerDashboardService";

import "../../css/LecturerDashboard.css";


function LecturerDashboard() {

    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");

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
    | LOAD DASHBOARD
    |--------------------------------------------------------------------------
    */

    const loadDashboard = async () => {

        try {

            setLoading(true);

            setError("");


            const response =
                await getLecturerDashboard();


            console.log(
                "LECTURER DASHBOARD RESPONSE:",
                response
            );


            if (response?.success === true) {

                /*
                 * Support different response structures:
                 *
                 * response.data
                 * response.data.dashboard
                 * response.dashboard
                 */

                const dashboard =
                    response?.data?.dashboard ||
                    response?.dashboard ||
                    response?.data ||
                    {};


                /*
                 * STATISTICS
                 */

                const stats =
                    dashboard.statistics ||
                    dashboard.stats ||
                    {};


                setStatistics({

                    totalCourses:
                        Number(
                            stats.totalCourses ??
                            stats.total_courses ??
                            dashboard.totalCourses ??
                            dashboard.total_courses ??
                            0
                        ),

                    todayClasses:
                        Number(
                            stats.todayClasses ??
                            stats.today_classes ??
                            dashboard.todayClasses ??
                            dashboard.today_classes ??
                            0
                        ),

                    activeQRSession:
                        Number(
                            stats.activeQRSession ??
                            stats.active_qr_session ??
                            dashboard.activeQRSession ??
                            dashboard.active_qr_session ??
                            0
                        ),

                    todayAttendance:
                        Number(
                            stats.todayAttendance ??
                            stats.today_attendance ??
                            dashboard.todayAttendance ??
                            dashboard.today_attendance ??
                            0
                        ),

                });


                /*
                 * UPCOMING CLASSES
                 */

                const classes =
                    dashboard.upcomingClasses ||
                    dashboard.upcoming_classes ||
                    response?.upcomingClasses ||
                    response?.upcoming_classes ||
                    [];


                setUpcomingClasses(
                    Array.isArray(classes)
                        ? classes
                        : []
                );


                /*
                 * RECENT ATTENDANCE
                 */

                const attendance =
                    dashboard.recentAttendance ||
                    dashboard.recent_attendance ||
                    response?.recentAttendance ||
                    response?.recent_attendance ||
                    [];


                setRecentAttendance(
                    Array.isArray(attendance)
                        ? attendance
                        : []
                );


            } else {

                setError(
                    response?.message ||
                    "Unable to load lecturer dashboard."
                );

            }


        } catch (error) {

            console.error(
                "Failed to load lecturer dashboard:",
                error
            );


            setError(
                error?.response?.data?.message ||
                "Unable to connect to the AttendX server."
            );


        } finally {

            setLoading(false);

        }

    };


    /*
    |--------------------------------------------------------------------------
    | INITIAL LOAD
    |--------------------------------------------------------------------------
    */

    useEffect(() => {

        loadDashboard();

    }, []);


    /*
    |--------------------------------------------------------------------------
    | LOADING
    |--------------------------------------------------------------------------
    */

    if (loading) {

        return (

            <div className="container-fluid">

                <div className="lecturer-dashboard-loading">

                    <div
                        className="spinner-border text-primary"
                        role="status"
                    >

                        <span className="visually-hidden">
                            Loading...
                        </span>

                    </div>

                    <h5 className="mt-3 fw-semibold">
                        Loading Dashboard
                    </h5>

                    <p className="text-muted mb-0">
                        Retrieving your lecturer information...
                    </p>

                </div>

            </div>

        );

    }


    /*
    |--------------------------------------------------------------------------
    | DASHBOARD
    |--------------------------------------------------------------------------
    */

    return (

        <div className="container-fluid lecturer-dashboard">


            {/* ============================================================
                HEADER
            ============================================================ */}

            <div className="lecturer-dashboard-header">

                <div>

                    <span className="dashboard-breadcrumb">
                        Lecturer Portal / Dashboard
                    </span>

                    <h2>
                        Lecturer Dashboard
                    </h2>

                    <p>
                        Welcome back. Here's an overview of your
                        academic activities.
                    </p>

                </div>


                <button
                    type="button"
                    className="dashboard-refresh-btn"
                    onClick={loadDashboard}
                    disabled={loading}
                >

                    <FaSyncAlt />

                    Refresh

                </button>

            </div>


            {/* ============================================================
                ERROR
            ============================================================ */}

            {error && (

                <div className="dashboard-error">

                    <FaExclamationCircle />

                    <div>

                        <strong>
                            Unable to load dashboard
                        </strong>

                        <p>
                            {error}
                        </p>

                    </div>


                    <button
                        type="button"
                        onClick={loadDashboard}
                    >
                        Retry
                    </button>

                </div>

            )}


            {/* ============================================================
                STATISTICS
            ============================================================ */}

            <div className="row g-4 mb-4">


                {/* COURSES */}

                <div className="col-xl-3 col-md-6">

                    <div className="dashboard-stat-card">

                        <div>

                            <span>
                                My Courses
                            </span>

                            <h3>
                                {statistics.totalCourses}
                            </h3>

                            <small>
                                Assigned courses
                            </small>

                        </div>


                        <div className="dashboard-stat-icon blue">

                            <FaBook />

                        </div>

                    </div>

                </div>


                {/* TODAY CLASSES */}

                <div className="col-xl-3 col-md-6">

                    <div className="dashboard-stat-card">

                        <div>

                            <span>
                                Today's Classes
                            </span>

                            <h3>
                                {statistics.todayClasses}
                            </h3>

                            <small>
                                Scheduled today
                            </small>

                        </div>


                        <div className="dashboard-stat-icon green">

                            <FaCalendarAlt />

                        </div>

                    </div>

                </div>


                {/* QR */}

                <div className="col-xl-3 col-md-6">

                    <div className="dashboard-stat-card">

                        <div>

                            <span>
                                Active QR Session
                            </span>

                            <h3>
                                {statistics.activeQRSession}
                            </h3>

                            <small>
                                Currently active
                            </small>

                        </div>


                        <div className="dashboard-stat-icon orange">

                            <FaQrcode />

                        </div>

                    </div>

                </div>


                {/* ATTENDANCE */}

                <div className="col-xl-3 col-md-6">

                    <div className="dashboard-stat-card">

                        <div>

                            <span>
                                Today's Attendance
                            </span>

                            <h3>
                                {statistics.todayAttendance}
                            </h3>

                            <small>
                                Students recorded
                            </small>

                        </div>


                        <div className="dashboard-stat-icon purple">

                            <FaClipboardCheck />

                        </div>

                    </div>

                </div>

            </div>


            {/* ============================================================
                QUICK ACTIONS
            ============================================================ */}

            <div className="dashboard-panel mb-4">

                <div className="dashboard-panel-header">

                    <div>

                        <h5>
                            Quick Actions
                        </h5>

                        <p>
                            Quickly access your most used lecturer tools.
                        </p>

                    </div>

                </div>


                <div className="row g-3">


                    <div className="col-lg-4 col-md-6">

                        <button
                            type="button"
                            className="dashboard-action primary"
                            onClick={() =>
                                navigate("/lecturer/qrSession")
                            }
                        >

                            <span className="action-icon">

                                <FaQrcode />

                            </span>

                            <span>

                                <strong>
                                    Start QR Session
                                </strong>

                                <small>
                                    Generate attendance QR
                                </small>

                            </span>

                            <FaArrowRight />

                        </button>

                    </div>


                    <div className="col-lg-4 col-md-6">

                        <button
                            type="button"
                            className="dashboard-action success"
                            onClick={() =>
                                navigate("/lecturer/attendance")
                            }
                        >

                            <span className="action-icon">

                                <FaClipboardCheck />

                            </span>

                            <span>

                                <strong>
                                    View Attendance
                                </strong>

                                <small>
                                    Check student attendance
                                </small>

                            </span>

                            <FaArrowRight />

                        </button>

                    </div>


                    <div className="col-lg-4 col-md-6">

                        <button
                            type="button"
                            className="dashboard-action purple"
                            onClick={() =>
                                navigate("/lecturer/timetable")
                            }
                        >

                            <span className="action-icon">

                                <FaCalendarAlt />

                            </span>

                            <span>

                                <strong>
                                    View Timetable
                                </strong>

                                <small>
                                    Check your weekly schedule
                                </small>

                            </span>

                            <FaArrowRight />

                        </button>

                    </div>

                </div>

            </div>


            {/* ============================================================
                UPCOMING + ATTENDANCE
            ============================================================ */}

            <div className="row g-4">


                {/* ========================================================
                    UPCOMING CLASSES
                ======================================================== */}

                <div className="col-xl-7">

                    <div className="dashboard-panel h-100">

                        <div className="dashboard-panel-header">

                            <div>

                                <h5>
                                    Upcoming Classes
                                </h5>

                                <p>
                                    Your next scheduled classes.
                                </p>

                            </div>


                            <button
                                type="button"
                                className="dashboard-view-btn"
                                onClick={() =>
                                    navigate("/lecturer/timetable")
                                }
                            >

                                View All

                                <FaArrowRight />

                            </button>

                        </div>


                        {upcomingClasses.length === 0 ? (

                            <div className="dashboard-empty">

                                <div className="dashboard-empty-icon">

                                    <FaCalendarAlt />

                                </div>

                                <h6>
                                    No Upcoming Classes
                                </h6>

                                <p>
                                    Your upcoming classes will appear
                                    here once they are scheduled.
                                </p>

                            </div>

                        ) : (

                            <div className="upcoming-class-list">

                                {upcomingClasses.map(
                                    (item, index) => (

                                        <div
                                            key={
                                                item.id ||
                                                item.timetable_id ||
                                                index
                                            }
                                            className="upcoming-class-item"
                                        >

                                            <div className="class-date-icon">

                                                <FaCalendarAlt />

                                            </div>


                                            <div className="upcoming-class-info">

                                                <strong>

                                                    {
                                                        item.course_name ||
                                                        item.courseName ||
                                                        "-"
                                                    }

                                                </strong>

                                                <span>

                                                    {
                                                        item.course_code ||
                                                        item.courseCode ||
                                                        "-"
                                                    }

                                                </span>

                                            </div>


                                            <div className="upcoming-class-time">

                                                <strong>

                                                    <FaClock />

                                                    {
                                                        item.start_time ||
                                                        item.startTime ||
                                                        "-"
                                                    }

                                                </strong>

                                                <span>

                                                    {
                                                        item.room ||
                                                        "-"
                                                    }

                                                </span>

                                            </div>

                                        </div>

                                    )
                                )}

                            </div>

                        )}

                    </div>

                </div>


                {/* ========================================================
                    RECENT ATTENDANCE
                ======================================================== */}

                <div className="col-xl-5">

                    <div className="dashboard-panel h-100">

                        <div className="dashboard-panel-header">

                            <div>

                                <h5>
                                    Recent Attendance
                                </h5>

                                <p>
                                    Latest attendance records.
                                </p>

                            </div>


                            <button
                                type="button"
                                className="dashboard-view-btn"
                                onClick={() =>
                                    navigate("/lecturer/reports")
                                }
                            >

                                Reports

                                <FaArrowRight />

                            </button>

                        </div>


                        {recentAttendance.length === 0 ? (

                            <div className="dashboard-empty">

                                <div className="dashboard-empty-icon">

                                    <FaChartLine />

                                </div>

                                <h6>
                                    No Attendance Records
                                </h6>

                                <p>
                                    Recent attendance data will appear
                                    here.
                                </p>

                            </div>

                        ) : (

                            <div className="recent-attendance-list">

                                {recentAttendance.map(
                                    (item, index) => (

                                        <div
                                            key={
                                                item.id ||
                                                item.attendance_id ||
                                                index
                                            }
                                            className="recent-attendance-item"
                                        >

                                            <div>

                                                <strong>

                                                    {
                                                        item.course_name ||
                                                        item.courseName ||
                                                        "-"
                                                    }

                                                </strong>

                                                <span>

                                                    {
                                                        item.date ||
                                                        "-"
                                                    }

                                                </span>

                                            </div>


                                            <div className="attendance-count">

                                                <strong>

                                                    {
                                                        item.present ??
                                                        0
                                                    }

                                                </strong>

                                                <span>
                                                    /
                                                    {
                                                        item.total ??
                                                        0
                                                    }
                                                </span>

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

    );

}


export default LecturerDashboard;