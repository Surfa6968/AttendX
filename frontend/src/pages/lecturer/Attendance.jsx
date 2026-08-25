import { useEffect, useMemo, useState } from "react";

import {
    FaCalendarAlt,
    FaCheckCircle,
    FaTimesCircle,
    FaClock,
    FaSearch,
    FaClipboardCheck,
    FaUserGraduate,
    FaBook,
    FaFilter,
    FaTimes,
    FaSyncAlt,
    FaChevronDown,
} from "react-icons/fa";

import { getLecturerAttendance } from "../../services/lecturerAttendanceService";

import "../../css/LecturerAttendance.css";


function Attendance() {

    /* ============================================================
       STATE
    ============================================================ */

    const [attendance, setAttendance] = useState([]);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");

    const [search, setSearch] = useState("");

    const [courseFilter, setCourseFilter] = useState("");

    const [statusFilter, setStatusFilter] = useState("");

    const [dateFilter, setDateFilter] = useState("");


    /* ============================================================
       LOAD ATTENDANCE
    ============================================================ */

    useEffect(() => {

        loadAttendance();

    }, []);


    const loadAttendance = async () => {

        try {

            setLoading(true);

            setError("");

            const response =
                await getLecturerAttendance();


            console.log(
                "LECTURER ATTENDANCE:",
                response
            );


            if (
                response?.success &&
                Array.isArray(response.data)
            ) {

                setAttendance(response.data);

            } else {

                setAttendance([]);

                setError(
                    response?.message ||
                    "Failed to load attendance records."
                );

            }

        } catch (err) {

            console.error(
                "Failed to load lecturer attendance:",
                err
            );

            setAttendance([]);

            setError(
                "Unable to connect to the AttendX server."
            );

        } finally {

            setLoading(false);

        }

    };


    /* ============================================================
       STATISTICS
    ============================================================ */

    const totalRecords =
        attendance.length;


    const presentCount =
        attendance.filter(
            (item) =>
                String(
                    item.attendance_status || ""
                ).toLowerCase() === "present"
        ).length;


    const absentCount =
        attendance.filter(
            (item) =>
                String(
                    item.attendance_status || ""
                ).toLowerCase() === "absent"
        ).length;


    const lateCount =
        attendance.filter(
            (item) =>
                String(
                    item.attendance_status || ""
                ).toLowerCase() === "late"
        ).length;


    /* ============================================================
       COURSE OPTIONS
    ============================================================ */

    const courses = useMemo(() => {

        const map = new Map();

        attendance.forEach((item) => {

            if (item.course_id) {

                map.set(
                    item.course_id,
                    {
                        id: item.course_id,
                        code: item.course_code,
                        name: item.course_name,
                    }
                );

            }

        });

        return Array.from(map.values());

    }, [attendance]);


    /* ============================================================
       STATUS OPTIONS
    ============================================================ */

    const statuses = useMemo(() => {

        return [
            ...new Set(
                attendance
                    .map(
                        (item) =>
                            item.attendance_status
                    )
                    .filter(Boolean)
            ),
        ];

    }, [attendance]);


    /* ============================================================
       FILTER ATTENDANCE
    ============================================================ */

    const filteredAttendance =
        attendance.filter((item) => {

            const keyword =
                search
                    .toLowerCase()
                    .trim();


            const matchesSearch =
                !keyword ||

                String(
                    item.student_name || ""
                )
                    .toLowerCase()
                    .includes(keyword)

                ||

                String(
                    item.student_email || ""
                )
                    .toLowerCase()
                    .includes(keyword)

                ||

                String(
                    item.course_code || ""
                )
                    .toLowerCase()
                    .includes(keyword)

                ||

                String(
                    item.course_name || ""
                )
                    .toLowerCase()
                    .includes(keyword);


            const matchesCourse =
                !courseFilter ||
                String(
                    item.course_id || ""
                ) === courseFilter;


            const matchesStatus =
                !statusFilter ||
                String(
                    item.attendance_status || ""
                ).toLowerCase() ===
                statusFilter.toLowerCase();


            const matchesDate =
                !dateFilter ||
                String(
                    item.session_date || ""
                ) === dateFilter;


            return (
                matchesSearch &&
                matchesCourse &&
                matchesStatus &&
                matchesDate
            );

        });


    /* ============================================================
       CLEAR FILTERS
    ============================================================ */

    const clearFilters = () => {

        setSearch("");

        setCourseFilter("");

        setStatusFilter("");

        setDateFilter("");

    };


    const hasFilters =
        search ||
        courseFilter ||
        statusFilter ||
        dateFilter;


    /* ============================================================
       STATUS HELPER
    ============================================================ */

    const getStatusClass = (status) => {

        const value =
            String(status || "")
                .toLowerCase();


        if (value === "present") {
            return "present";
        }

        if (value === "absent") {
            return "absent";
        }

        if (value === "late") {
            return "late";
        }

        return "unknown";

    };


    const getStatusIcon = (status) => {

        const value =
            String(status || "")
                .toLowerCase();


        if (value === "present") {
            return <FaCheckCircle />;
        }

        if (value === "absent") {
            return <FaTimesCircle />;
        }

        if (value === "late") {
            return <FaClock />;
        }

        return <FaClipboardCheck />;

    };


    /* ============================================================
       FORMAT DATE
    ============================================================ */

    const formatDate = (date) => {

        if (!date) {
            return "-";
        }

        const parsed =
            new Date(date + "T00:00:00");


        if (Number.isNaN(parsed.getTime())) {
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


        let hour =
            parseInt(parts[0], 10);

        const minute =
            parts[1];


        const suffix =
            hour >= 12
                ? "PM"
                : "AM";


        hour =
            hour % 12 || 12;


        return `${hour}:${minute} ${suffix}`;

    };


    /* ============================================================
       RENDER
    ============================================================ */

    return (

        <div className="lecturer-attendance-page">


            {/* ========================================================
               PAGE HEADER
            ======================================================== */}

            <div className="attendance-page-header">

                <div>

                    <div className="attendance-breadcrumb">

                        Lecturer Portal

                        <span>/</span>

                        Attendance

                    </div>


                    <h1>
                        Attendance
                    </h1>


                    <p>
                        Monitor and review attendance records
                        for your assigned courses.
                    </p>

                </div>


                <button
                    type="button"
                    className="attendance-refresh-button"
                    onClick={loadAttendance}
                    disabled={loading}
                >

                    <FaSyncAlt
                        className={
                            loading
                                ? "attendance-spin"
                                : ""
                        }
                    />

                    Refresh

                </button>

            </div>


            {/* ========================================================
               ERROR
            ======================================================== */}

            {error && (

                <div className="attendance-error">

                    <FaTimesCircle />

                    <div>

                        <strong>
                            Unable to load attendance
                        </strong>

                        <p>
                            {error}
                        </p>

                    </div>


                    <button
                        type="button"
                        onClick={loadAttendance}
                    >
                        Retry
                    </button>

                </div>

            )}


            {/* ========================================================
               STATISTICS
            ======================================================== */}

            {!loading && (

                <div className="attendance-statistics">


                    {/* Total */}

                    <div className="attendance-stat-card">

                        <div className="attendance-stat-icon blue">

                            <FaClipboardCheck />

                        </div>

                        <div>

                            <span>
                                Total Records
                            </span>

                            <strong>
                                {totalRecords}
                            </strong>

                            <small>
                                Attendance records
                            </small>

                        </div>

                    </div>


                    {/* Present */}

                    <div className="attendance-stat-card">

                        <div className="attendance-stat-icon green">

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

                    <div className="attendance-stat-card">

                        <div className="attendance-stat-icon orange">

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

                    <div className="attendance-stat-card">

                        <div className="attendance-stat-icon red">

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

                </div>

            )}


            {/* ========================================================
               FILTER PANEL
            ======================================================== */}

            <div className="attendance-filter-panel">


                <div className="attendance-filter-header">

                    <div>

                        <h5>
                            Attendance Records
                        </h5>

                        <span>
                            Search and filter attendance records
                        </span>

                    </div>


                    {hasFilters && (

                        <button
                            type="button"
                            className="attendance-clear-button"
                            onClick={clearFilters}
                        >

                            <FaTimes />

                            Clear Filters

                        </button>

                    )}

                </div>


                <div className="attendance-filters">


                    {/* Search */}

                    <div className="attendance-search">

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

                    <div className="attendance-select">

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
                                    </option>

                                )
                            )}

                        </select>

                        <FaChevronDown />

                    </div>


                    {/* Status */}

                    <div className="attendance-select">

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

                            {statuses.map(
                                (status) => (

                                    <option
                                        key={status}
                                        value={status}
                                    >
                                        {String(status)
                                            .charAt(0)
                                            .toUpperCase() +
                                            String(status)
                                                .slice(1)}
                                    </option>

                                )
                            )}

                        </select>

                        <FaChevronDown />

                    </div>


                    {/* Date */}

                    <div className="attendance-date">

                        <FaCalendarAlt />

                        <input
                            type="date"
                            value={dateFilter}
                            onChange={(event) =>
                                setDateFilter(
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

            <div className="attendance-results-header">

                <div>

                    <h5>
                        Attendance History
                    </h5>

                    {!loading && (

                        <span>

                            Showing{" "}

                            <strong>
                                {filteredAttendance.length}
                            </strong>

                            {" "}of{" "}

                            <strong>
                                {attendance.length}
                            </strong>

                            {" "}records

                        </span>

                    )}

                </div>


                <div className="attendance-results-icon">

                    <FaUserGraduate />

                </div>

            </div>


            {/* ========================================================
               LOADING
            ======================================================== */}

            {loading ? (

                <div className="attendance-loading">

                    <div className="attendance-loading-spinner">

                        <div className="spinner-border text-primary"></div>

                    </div>

                    <h5>
                        Loading attendance
                    </h5>

                    <p>
                        Retrieving attendance records from AttendX...
                    </p>

                </div>

            ) : filteredAttendance.length === 0 ? (

                /* ====================================================
                   EMPTY
                ==================================================== */

                <div className="attendance-empty">

                    <div className="attendance-empty-icon">

                        <FaClipboardCheck />

                    </div>

                    <h4>
                        No Attendance Records Found
                    </h4>

                    <p>

                        {hasFilters
                            ? "No attendance records match the selected filters."
                            : "There are currently no attendance records for your courses."
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
                   TABLE
                ==================================================== */

                <div className="attendance-table-card">

                    <div className="attendance-table-wrapper">

                        <table className="attendance-table">

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

                                {filteredAttendance.map(
                                    (item, index) => (

                                        <tr
                                            key={
                                                item.attendance_id
                                            }
                                        >


                                            {/* Number */}

                                            <td>

                                                <span className="attendance-row-number">

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

                                                <div className="attendance-student">

                                                    <div className="attendance-student-avatar">

                                                        <FaUserGraduate />

                                                    </div>


                                                    <div>

                                                        <strong>

                                                            {
                                                                item.student_name ||
                                                                "Unknown Student"
                                                            }

                                                        </strong>

                                                        <span>

                                                            {
                                                                item.student_email ||
                                                                "-"
                                                            }

                                                        </span>

                                                    </div>

                                                </div>

                                            </td>


                                            {/* Course */}

                                            <td>

                                                <div className="attendance-course">

                                                    <span>

                                                        {
                                                            item.course_code
                                                        }

                                                    </span>

                                                    <strong>

                                                        {
                                                            item.course_name
                                                        }

                                                    </strong>

                                                </div>

                                            </td>


                                            {/* Date */}

                                            <td>

                                                <div className="attendance-date-value">

                                                    <FaCalendarAlt />

                                                    <span>

                                                        {
                                                            formatDate(
                                                                item.session_date
                                                            )
                                                        }

                                                    </span>

                                                </div>

                                            </td>


                                            {/* Time */}

                                            <td>

                                                <div className="attendance-time-value">

                                                    <FaClock />

                                                    <span>

                                                        {
                                                            formatTime(
                                                                item.start_time
                                                            )
                                                        }

                                                        {" - "}

                                                        {
                                                            formatTime(
                                                                item.end_time
                                                            )
                                                        }

                                                    </span>

                                                </div>

                                            </td>


                                            {/* Status */}

                                            <td>

                                                <span
                                                    className={`attendance-status ${getStatusClass(
                                                        item.attendance_status
                                                    )}`}
                                                >

                                                    {
                                                        getStatusIcon(
                                                            item.attendance_status
                                                        )
                                                    }

                                                    {
                                                        String(
                                                            item.attendance_status ||
                                                            "Unknown"
                                                        )
                                                            .charAt(0)
                                                            .toUpperCase() +
                                                        String(
                                                            item.attendance_status ||
                                                            "Unknown"
                                                        )
                                                            .slice(1)
                                                    }

                                                </span>

                                            </td>


                                            {/* Marked */}

                                            <td>

                                                <span className="attendance-marked">

                                                    {
                                                        item.marked_at
                                                            ? new Date(
                                                                item.marked_at.replace(
                                                                    " ",
                                                                    "T"
                                                                )
                                                            ).toLocaleString(
                                                                "en-GB",
                                                                {
                                                                    day: "2-digit",
                                                                    month: "short",
                                                                    hour: "2-digit",
                                                                    minute: "2-digit",
                                                                }
                                                            )
                                                            : "-"
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

export default Attendance;