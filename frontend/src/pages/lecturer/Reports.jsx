import { useEffect, useMemo, useState } from "react";

import {
    FaChartBar,
    FaSearch,
    FaFilter,
    FaCalendarAlt,
    FaBook,
    FaUsers,
    FaCheckCircle,
    FaTimesCircle,
    FaClock,
    FaPercentage,
    FaTimes,
    FaPrint,
    FaSyncAlt,
} from "react-icons/fa";

import {
    getLecturerAttendanceReport,
} from "../../services/lecturerAttendanceService";

import "../../css/LecturerReports.css";


function LecturerReports() {

    /* ============================================================
       STATE
    ============================================================ */

    const [reports, setReports] = useState([]);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");

    const [search, setSearch] = useState("");

    const [courseFilter, setCourseFilter] = useState("");

    const [statusFilter, setStatusFilter] = useState("");

    const [fromDate, setFromDate] = useState("");

    const [toDate, setToDate] = useState("");


    /* ============================================================
       LOAD REPORT
    ============================================================ */

    const loadReport = async () => {

        try {

            setLoading(true);
            setError("");

            /*
             * Load all lecturer attendance records.
             *
             * Filtering is handled locally below.
             * This avoids sending course_code as course_id.
             */

            const response =
                await getLecturerAttendanceReport();


            console.log(
                "LECTURER REPORT RESPONSE:",
                response
            );


            if (response?.success === true) {

                const attendanceData =
                    Array.isArray(response?.data?.data)
                        ? response.data.data
                        : [];


                console.log(
                    "ATTENDANCE RECORDS:",
                    attendanceData
                );


                setReports(attendanceData);

                setError("");

            } else {

                setReports([]);

                setError(
                    response?.message ||
                    "Failed to load attendance report."
                );

            }

        } catch (err) {

            console.error(
                "LECTURER REPORT ERROR:",
                err
            );


            setReports([]);


            setError(
                err?.response?.data?.message ||
                err?.message ||
                "Unable to connect to the AttendX server."
            );

        } finally {

            setLoading(false);

        }

    };


    /* ============================================================
       INITIAL LOAD
    ============================================================ */

    useEffect(() => {

        loadReport();

    }, []);


    /* ============================================================
       NORMALIZE DATA
    ============================================================ */

    const normalizedReports = useMemo(() => {

        return reports.map((item) => {

            return {

                id:
                    item.attendance_id ??
                    item.id ??
                    `${item.student_id}-${item.session_id}`,

                attendanceId:
                    item.attendance_id ??
                    item.id ??
                    "",

                sessionId:
                    item.session_id ??
                    "",

                studentId:
                    item.student_id ??
                    item.studentId ??
                    "",

                studentNo:
                    item.student_no ??
                    item.student_number ??
                    item.registration_no ??
                    item.student_id ??
                    "-",

                studentName:
                    item.student_name ??
                    item.full_name ??
                    item.name ??
                    "Unknown Student",

                courseId:
                    item.course_id ??
                    "",

                courseCode:
                    item.course_code ??
                    "-",

                courseName:
                    item.course_name ??
                    "-",

                lecturerName:
                    item.lecturer_name ??
                    "-",

                sessionDate:
                    item.session_date ??
                    item.date ??
                    "",

                startTime:
                    item.start_time ??
                    "",

                endTime:
                    item.end_time ??
                    "",

                status:
                    String(
                        item.attendance_status ??
                        item.status ??
                        ""
                    )
                        .trim()
                        .toLowerCase(),

                markedAt:
                    item.marked_at ??
                    item.scanned_at ??
                    item.created_at ??
                    "",

            };

        });

    }, [reports]);


    /* ============================================================
       COURSE OPTIONS
    ============================================================ */

    const courses = useMemo(() => {

        const uniqueCourses = new Map();


        normalizedReports.forEach((report) => {

            if (
                report.courseId !== "" &&
                report.courseCode &&
                report.courseCode !== "-"
            ) {

                const key =
                    String(report.courseId);


                if (!uniqueCourses.has(key)) {

                    uniqueCourses.set(
                        key,
                        {
                            id: report.courseId,
                            code: report.courseCode,
                            name: report.courseName,
                        }
                    );

                }

            }

        });


        return Array.from(
            uniqueCourses.values()
        );

    }, [normalizedReports]);


    /* ============================================================
       FILTER REPORTS
    ============================================================ */

    const filteredReports = useMemo(() => {

        const keyword =
            search
                .toLowerCase()
                .trim();


        return normalizedReports.filter(
            (report) => {

                /* --------------------------------------------
                   Search
                -------------------------------------------- */

                const matchesSearch =
                    !keyword ||

                    String(report.studentNo)
                        .toLowerCase()
                        .includes(keyword)

                    ||

                    String(report.studentName)
                        .toLowerCase()
                        .includes(keyword)

                    ||

                    String(report.courseCode)
                        .toLowerCase()
                        .includes(keyword)

                    ||

                    String(report.courseName)
                        .toLowerCase()
                        .includes(keyword);


                /* --------------------------------------------
                   Course
                -------------------------------------------- */

                const matchesCourse =
                    !courseFilter ||
                    String(report.courseId) ===
                    String(courseFilter);


                /* --------------------------------------------
                   Status
                -------------------------------------------- */

                const matchesStatus =
                    !statusFilter ||
                    report.status ===
                    statusFilter;


                /* --------------------------------------------
                   From Date
                -------------------------------------------- */

                const matchesFromDate =
                    !fromDate ||
                    report.sessionDate >= fromDate;


                /* --------------------------------------------
                   To Date
                -------------------------------------------- */

                const matchesToDate =
                    !toDate ||
                    report.sessionDate <= toDate;


                return (
                    matchesSearch &&
                    matchesCourse &&
                    matchesStatus &&
                    matchesFromDate &&
                    matchesToDate
                );

            }
        );

    }, [
        normalizedReports,
        search,
        courseFilter,
        statusFilter,
        fromDate,
        toDate,
    ]);


    /* ============================================================
       STATISTICS
    ============================================================ */

    const totalRecords =
        filteredReports.length;


    const presentCount =
        filteredReports.filter(
            (report) =>
                report.status === "present"
        ).length;


    const lateCount =
        filteredReports.filter(
            (report) =>
                report.status === "late"
        ).length;


    const absentCount =
        filteredReports.filter(
            (report) =>
                report.status === "absent"
        ).length;


    /*
     * Present + Late are considered attended.
     */

    const attendedCount =
        presentCount +
        lateCount;


    const attendancePercentage =
        totalRecords > 0
            ? Math.round(
                (
                    attendedCount /
                    totalRecords
                ) * 100
            )
            : 0;


    /* ============================================================
       CLEAR FILTERS
    ============================================================ */

    const clearFilters = () => {

        setSearch("");

        setCourseFilter("");

        setStatusFilter("");

        setFromDate("");

        setToDate("");

    };


    const hasFilters =
        Boolean(
            search ||
            courseFilter ||
            statusFilter ||
            fromDate ||
            toDate
        );


    /* ============================================================
       STATUS CLASS
    ============================================================ */

    const getStatusClass = (status) => {

        if (status === "present") {

            return "report-status present";

        }


        if (status === "late") {

            return "report-status late";

        }


        if (status === "absent") {

            return "report-status absent";

        }


        return "report-status unknown";

    };


    /* ============================================================
       STATUS ICON
    ============================================================ */

    const getStatusIcon = (status) => {

        if (status === "present") {

            return <FaCheckCircle />;

        }


        if (status === "late") {

            return <FaClock />;

        }


        if (status === "absent") {

            return <FaTimesCircle />;

        }


        return null;

    };


    /* ============================================================
       FORMAT STATUS
    ============================================================ */

    const formatStatus = (status) => {

        if (!status) {

            return "Unknown";

        }


        return (
            status.charAt(0).toUpperCase() +
            status.slice(1)
        );

    };


    /* ============================================================
       FORMAT DATE
    ============================================================ */

    const formatDate = (date) => {

        if (!date) {

            return "-";

        }


        const parsed =
            new Date(
                `${date}T00:00:00`
            );


        if (
            Number.isNaN(
                parsed.getTime()
            )
        ) {

            return date;

        }


        return parsed.toLocaleDateString(
            "en-GB",
            {
                day: "2-digit",
                month: "short",
                year: "numeric",
            }
        );

    };


    /* ============================================================
       FORMAT TIME
    ============================================================ */

    const formatTime = (time) => {

        if (!time) {

            return "-";

        }


        const parts =
            String(time).split(":");


        if (parts.length < 2) {

            return time;

        }


        const hour =
            Number(parts[0]);


        const minute =
            parts[1];


        const suffix =
            hour >= 12
                ? "PM"
                : "AM";


        const displayHour =
            hour % 12 || 12;


        return `${displayHour}:${minute} ${suffix}`;

    };


    /* ============================================================
       FORMAT MARKED TIME
    ============================================================ */

    const formatMarkedAt = (value) => {

        if (!value) {

            return "-";

        }


        const parsed =
            new Date(
                String(value).replace(" ", "T")
            );


        if (
            Number.isNaN(
                parsed.getTime()
            )
        ) {

            return value;

        }


        return parsed.toLocaleString(
            "en-GB",
            {
                day: "2-digit",
                month: "short",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
            }
        );

    };


    /* ============================================================
       PRINT
    ============================================================ */

    const handlePrint = () => {

        window.print();

    };


    /* ============================================================
       RENDER
    ============================================================ */

    return (

        <div className="lecturer-reports-page">


            {/* ========================================================
               PAGE HEADER
            ======================================================== */}

            <div className="reports-page-header">

                <div>

                    <div className="reports-breadcrumb">

                        Lecturer Portal

                        <span>/</span>

                        Attendance Reports

                    </div>


                    <h1>
                        Attendance Reports
                    </h1>


                    <p>
                        Monitor and analyse attendance records
                        for your assigned courses.
                    </p>

                </div>


                <div className="reports-header-actions">

                    <button
                        type="button"
                        className="report-action-button secondary"
                        onClick={loadReport}
                        disabled={loading}
                    >

                        <FaSyncAlt
                            className={
                                loading
                                    ? "report-spin"
                                    : ""
                            }
                        />

                        Refresh

                    </button>


                    <button
                        type="button"
                        className="report-action-button primary"
                        onClick={handlePrint}
                    >

                        <FaPrint />

                        Print Report

                    </button>

                </div>

            </div>


            {/* ========================================================
               ERROR
            ======================================================== */}

            {error && (

                <div className="reports-error">

                    <FaTimesCircle />

                    <div>

                        <strong>
                            Unable to load attendance report
                        </strong>

                        <p>
                            {error}
                        </p>

                    </div>


                    <button
                        type="button"
                        onClick={loadReport}
                    >
                        Retry
                    </button>

                </div>

            )}


            {/* ========================================================
               STATISTICS
            ======================================================== */}

            {!loading && (

                <div className="reports-statistics">


                    {/* Total */}

                    <div className="report-stat-card">

                        <div className="report-stat-icon blue">

                            <FaUsers />

                        </div>

                        <div>

                            <span>
                                Attendance Records
                            </span>

                            <strong>
                                {totalRecords}
                            </strong>

                            <small>
                                Filtered records
                            </small>

                        </div>

                    </div>


                    {/* Present */}

                    <div className="report-stat-card">

                        <div className="report-stat-icon green">

                            <FaCheckCircle />

                        </div>

                        <div>

                            <span>
                                Present
                            </span>

                            <strong>
                                {presentCount}
                            </strong>

                            <small>
                                Students present
                            </small>

                        </div>

                    </div>


                    {/* Late */}

                    <div className="report-stat-card">

                        <div className="report-stat-icon orange">

                            <FaClock />

                        </div>

                        <div>

                            <span>
                                Late
                            </span>

                            <strong>
                                {lateCount}
                            </strong>

                            <small>
                                Late attendance
                            </small>

                        </div>

                    </div>


                    {/* Absent */}

                    <div className="report-stat-card">

                        <div className="report-stat-icon red">

                            <FaTimesCircle />

                        </div>

                        <div>

                            <span>
                                Absent
                            </span>

                            <strong>
                                {absentCount}
                            </strong>

                            <small>
                                Students absent
                            </small>

                        </div>

                    </div>


                    {/* Percentage */}

                    <div className="report-stat-card">

                        <div className="report-stat-icon purple">

                            <FaPercentage />

                        </div>

                        <div>

                            <span>
                                Attendance Rate
                            </span>

                            <strong>
                                {attendancePercentage}%
                            </strong>

                            <small>
                                Current filtered rate
                            </small>

                        </div>

                    </div>

                </div>

            )}


            {/* ========================================================
               FILTER PANEL
            ======================================================== */}

            <div className="reports-filter-panel">

                <div className="reports-filter-header">

                    <div>

                        <h5>
                            Report Filters
                        </h5>

                        <span>
                            Narrow attendance records by course,
                            date and status.
                        </span>

                    </div>


                    {hasFilters && (

                        <button
                            type="button"
                            className="report-clear-button"
                            onClick={clearFilters}
                        >

                            <FaTimes />

                            Clear Filters

                        </button>

                    )}

                </div>


                <div className="reports-filters">


                    {/* Search */}

                    <div className="report-search">

                        <FaSearch />

                        <input
                            type="text"
                            placeholder="Search student or course..."
                            value={search}
                            onChange={(event) =>
                                setSearch(
                                    event.target.value
                                )
                            }
                        />


                        {search && (

                            <button
                                type="button"
                                onClick={() =>
                                    setSearch("")
                                }
                            >

                                <FaTimes />

                            </button>

                        )}

                    </div>


                    {/* Course */}

                    <div className="report-select">

                        <FaBook />

                        <select
                            value={courseFilter}
                            onChange={(event) =>
                                setCourseFilter(
                                    event.target.value
                                )
                            }
                        >

                            <option value="">
                                All Courses
                            </option>


                            {courses.map(
                                (course) => (

                                    <option
                                        key={course.id}
                                        value={course.id}
                                    >

                                        {course.code}
                                        {" - "}
                                        {course.name}

                                    </option>

                                )
                            )}

                        </select>

                    </div>


                    {/* Status */}

                    <div className="report-select">

                        <FaFilter />

                        <select
                            value={statusFilter}
                            onChange={(event) =>
                                setStatusFilter(
                                    event.target.value
                                )
                            }
                        >

                            <option value="">
                                All Status
                            </option>

                            <option value="present">
                                Present
                            </option>

                            <option value="late">
                                Late
                            </option>

                            <option value="absent">
                                Absent
                            </option>

                        </select>

                    </div>


                    {/* From Date */}

                    <div className="report-date">

                        <FaCalendarAlt />

                        <input
                            type="date"
                            value={fromDate}
                            onChange={(event) =>
                                setFromDate(
                                    event.target.value
                                )
                            }
                        />

                    </div>


                    {/* To Date */}

                    <div className="report-date">

                        <FaCalendarAlt />

                        <input
                            type="date"
                            value={toDate}
                            onChange={(event) =>
                                setToDate(
                                    event.target.value
                                )
                            }
                        />

                    </div>

                </div>

            </div>


            {/* ========================================================
               RESULTS HEADER
            ======================================================== */}

            <div className="reports-results-header">

                <div>

                    <h5>
                        Attendance Records
                    </h5>


                    {!loading && (

                        <span>

                            Showing{" "}

                            <strong>
                                {filteredReports.length}
                            </strong>

                            {" "}of{" "}

                            <strong>
                                {normalizedReports.length}
                            </strong>

                            {" "}records

                        </span>

                    )}

                </div>


                <div className="reports-results-icon">

                    <FaChartBar />

                </div>

            </div>


            {/* ========================================================
               LOADING
            ======================================================== */}

            {loading ? (

                <div className="reports-loading">

                    <div className="report-loading-spinner">

                        <div className="spinner-border text-primary">
                        </div>

                    </div>

                    <h5>
                        Loading attendance reports
                    </h5>

                    <p>
                        Retrieving attendance records from AttendX...
                    </p>

                </div>

            ) : filteredReports.length === 0 ? (

                /* ====================================================
                   EMPTY
                ==================================================== */

                <div className="reports-empty">

                    <div className="reports-empty-icon">

                        <FaChartBar />

                    </div>

                    <h4>
                        No Attendance Records Found
                    </h4>

                    <p>

                        {hasFilters
                            ? "No attendance records match your selected filters."
                            : "There are currently no attendance records available."
                        }

                    </p>


                    {hasFilters && (

                        <button
                            type="button"
                            onClick={clearFilters}
                        >

                            Clear Filters

                        </button>

                    )}

                </div>

            ) : (

                /* ====================================================
                   REPORT TABLE
                ==================================================== */

                <div className="reports-table-card">

                    <div className="table-responsive">

                        <table className="lecturer-report-table">

                            <thead>

                                <tr>

                                    <th>
                                        #
                                    </th>

                                    <th>
                                        Student
                                    </th>

                                    <th>
                                        Course
                                    </th>

                                    <th>
                                        Session Date
                                    </th>

                                    <th>
                                        Session Time
                                    </th>

                                    <th>
                                        Status
                                    </th>

                                    <th>
                                        Marked At
                                    </th>

                                </tr>

                            </thead>


                            <tbody>

                                {filteredReports.map(
                                    (report, index) => (

                                        <tr
                                            key={
                                                report.id ||
                                                `${report.studentId}-${report.sessionId}-${index}`
                                            }
                                        >

                                            {/* Number */}

                                            <td>

                                                <span className="report-row-number">

                                                    {String(
                                                        index + 1
                                                    ).padStart(
                                                        2,
                                                        "0"
                                                    )}

                                                </span>

                                            </td>


                                            {/* Student */}

                                            <td>

                                                <div className="report-student">

                                                    <div className="student-avatar">

                                                        {report.studentName
                                                            .charAt(0)
                                                            .toUpperCase()
                                                        }

                                                    </div>


                                                    <div>

                                                        <strong>
                                                            {
                                                                report.studentName
                                                            }
                                                        </strong>

                                                        <span>
                                                            Student ID:{" "}
                                                            {
                                                                report.studentNo
                                                            }
                                                        </span>

                                                    </div>

                                                </div>

                                            </td>


                                            {/* Course */}

                                            <td>

                                                <div className="report-course">

                                                    <strong>
                                                        {
                                                            report.courseCode
                                                        }
                                                    </strong>

                                                    <span>
                                                        {
                                                            report.courseName
                                                        }
                                                    </span>

                                                </div>

                                            </td>


                                            {/* Date */}

                                            <td>

                                                <div className="report-date-value">

                                                    <FaCalendarAlt />

                                                    {
                                                        formatDate(
                                                            report.sessionDate
                                                        )
                                                    }

                                                </div>

                                            </td>


                                            {/* Time */}

                                            <td>

                                                <div className="report-time-value">

                                                    <FaClock />

                                                    <span>

                                                        {
                                                            formatTime(
                                                                report.startTime
                                                            )
                                                        }

                                                        {" - "}

                                                        {
                                                            formatTime(
                                                                report.endTime
                                                            )
                                                        }

                                                    </span>

                                                </div>

                                            </td>


                                            {/* Status */}

                                            <td>

                                                <span
                                                    className={
                                                        getStatusClass(
                                                            report.status
                                                        )
                                                    }
                                                >

                                                    {
                                                        getStatusIcon(
                                                            report.status
                                                        )
                                                    }

                                                    {
                                                        formatStatus(
                                                            report.status
                                                        )
                                                    }

                                                </span>

                                            </td>


                                            {/* Marked At */}

                                            <td>

                                                <span className="report-marked-at">

                                                    {
                                                        formatMarkedAt(
                                                            report.markedAt
                                                        )
                                                    }

                                                </span>

                                            </td>

                                        </tr>

                                    )
                                )}

                            </tbody>

                        </table>

                    </div>

                </div>

            )}

        </div>

    );

}


export default LecturerReports;