import { useEffect, useMemo, useState } from "react";

import {
    FaCalendarAlt,
    FaClock,
    FaMapMarkerAlt,
    FaBook,
    FaSyncAlt,
    FaSearch,
    FaFilter,
    FaExclamationCircle,
} from "react-icons/fa";

import { getLecturerTimetable } from "../../services/lecturerTimetableService";

import "../../css/LecturerTimetable.css";


function Timetable() {

    /* ============================================================
       STATE
    ============================================================ */

    const [timetable, setTimetable] = useState([]);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");

    const [search, setSearch] = useState("");

    const [dayFilter, setDayFilter] = useState("");


    /* ============================================================
       DAYS
    ============================================================ */

    const days = [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday",
    ];


    /* ============================================================
       LOAD TIMETABLE
    ============================================================ */

    const loadTimetable = async () => {

        try {

            setLoading(true);

            setError("");

            const response =
                await getLecturerTimetable();


            console.log(
                "LECTURER TIMETABLE RESPONSE:",
                response
            );


            if (response?.success === true) {

                /*
                 * Support both:
                 *
                 * data: [...]
                 *
                 * and
                 *
                 * data: {
                 *     timetable: [...]
                 * }
                 */

                let records = [];

                if (Array.isArray(response.data)) {

                    records = response.data;

                } else if (
                    Array.isArray(response.data?.timetable)
                ) {

                    records =
                        response.data.timetable;

                } else if (
                    Array.isArray(response.timetable)
                ) {

                    records =
                        response.timetable;

                }


                setTimetable(records);

            } else {

                setTimetable([]);

                setError(
                    response?.message ||
                    "Unable to load timetable."
                );

            }

        } catch (err) {

            console.error(
                "LECTURER TIMETABLE ERROR:",
                err
            );

            setTimetable([]);

            setError(
                err?.response?.data?.message ||
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

        loadTimetable();

    }, []);


    /* ============================================================
       NORMALIZE DATA
    ============================================================ */

    const normalizedTimetable = useMemo(() => {

        return timetable.map((item) => {

            return {

                id:
                    item.id ??
                    item.timetable_id,

                courseId:
                    item.course_id ??
                    "",

                courseCode:
                    item.course_code ??
                    "-",

                courseName:
                    item.course_name ??
                    "-",

                day:
                    item.day_of_week ??
                    item.day ??
                    "",

                startTime:
                    item.start_time ??
                    "",

                endTime:
                    item.end_time ??
                    "",

                room:
                    item.room ??
                    "-",

                academicYear:
                    item.academic_year ??
                    "",

                yearOfStudy:
                    item.year_of_study ??
                    "",

                semester:
                    item.semester ??
                    "",

            };

        });

    }, [timetable]);


    /* ============================================================
       FILTER
    ============================================================ */

    const filteredTimetable = useMemo(() => {

        const keyword =
            search
                .toLowerCase()
                .trim();


        return normalizedTimetable.filter(
            (item) => {

                const matchesSearch =
                    !keyword ||

                    item.courseCode
                        .toLowerCase()
                        .includes(keyword)

                    ||

                    item.courseName
                        .toLowerCase()
                        .includes(keyword)

                    ||

                    item.room
                        .toLowerCase()
                        .includes(keyword);


                const matchesDay =
                    !dayFilter ||
                    item.day === dayFilter;


                return (
                    matchesSearch &&
                    matchesDay
                );

            }
        );

    }, [
        normalizedTimetable,
        search,
        dayFilter,
    ]);


    /* ============================================================
       SORT
    ============================================================ */

    const dayOrder = {
        Monday: 1,
        Tuesday: 2,
        Wednesday: 3,
        Thursday: 4,
        Friday: 5,
        Saturday: 6,
        Sunday: 7,
    };


    const sortedTimetable = useMemo(() => {

        return [...filteredTimetable].sort(
            (a, b) => {

                const dayDifference =
                    (dayOrder[a.day] || 99) -
                    (dayOrder[b.day] || 99);


                if (dayDifference !== 0) {

                    return dayDifference;

                }


                return String(a.startTime)
                    .localeCompare(
                        String(b.startTime)
                    );

            }
        );

    }, [filteredTimetable]);


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
       DAY CLASS
    ============================================================ */

    const getDayClass = (day) => {

        return (
            "timetable-day " +
            String(day)
                .toLowerCase()
                .replace(/\s+/g, "-")
        );

    };


    /* ============================================================
       CLEAR FILTERS
    ============================================================ */

    const clearFilters = () => {

        setSearch("");

        setDayFilter("");

    };


    const hasFilters =
        search ||
        dayFilter;


    /* ============================================================
       RENDER
    ============================================================ */

    return (

        <div className="lecturer-timetable-page">


            {/* ========================================================
               HEADER
            ======================================================== */}

            <div className="lecturer-timetable-header">

                <div>

                    <div className="timetable-breadcrumb">

                        Lecturer Portal

                        <span>/</span>

                        Timetable

                    </div>


                    <h1>
                        My Timetable
                    </h1>


                    <p>
                        View the timetable assigned to you by the
                        administrator.
                    </p>

                </div>


                <button
                    type="button"
                    className="timetable-refresh-button"
                    onClick={loadTimetable}
                    disabled={loading}
                >

                    <FaSyncAlt
                        className={
                            loading
                                ? "timetable-spin"
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

                <div className="timetable-error">

                    <FaExclamationCircle />

                    <div>

                        <strong>
                            Unable to load timetable
                        </strong>

                        <p>
                            {error}
                        </p>

                    </div>


                    <button
                        type="button"
                        onClick={loadTimetable}
                    >
                        Retry
                    </button>

                </div>

            )}


            {/* ========================================================
               SUMMARY
            ======================================================== */}

            {!loading && !error && (

                <div className="timetable-summary">

                    <div className="timetable-summary-card">

                        <div className="summary-icon blue">

                            <FaCalendarAlt />

                        </div>

                        <div>

                            <span>
                                Total Classes
                            </span>

                            <strong>
                                {normalizedTimetable.length}
                            </strong>

                        </div>

                    </div>


                    <div className="timetable-summary-card">

                        <div className="summary-icon green">

                            <FaBook />

                        </div>

                        <div>

                            <span>
                                Courses
                            </span>

                            <strong>

                                {
                                    new Set(
                                        normalizedTimetable.map(
                                            (item) =>
                                                item.courseId ||
                                                item.courseCode
                                        )
                                    ).size
                                }

                            </strong>

                        </div>

                    </div>


                    <div className="timetable-summary-card">

                        <div className="summary-icon purple">

                            <FaCalendarAlt />

                        </div>

                        <div>

                            <span>
                                Teaching Days
                            </span>

                            <strong>

                                {
                                    new Set(
                                        normalizedTimetable.map(
                                            (item) =>
                                                item.day
                                        )
                                    ).size
                                }

                            </strong>

                        </div>

                    </div>

                </div>

            )}


            {/* ========================================================
               FILTERS
            ======================================================== */}

            <div className="timetable-filter-panel">

                <div className="timetable-filter-title">

                    <div>

                        <h3>
                            Timetable Filters
                        </h3>

                        <p>
                            Search and filter your assigned classes.
                        </p>

                    </div>


                    {hasFilters && (

                        <button
                            type="button"
                            className="timetable-clear-button"
                            onClick={clearFilters}
                        >
                            Clear Filters
                        </button>

                    )}

                </div>


                <div className="timetable-filters">


                    {/* Search */}

                    <div className="timetable-search">

                        <FaSearch />

                        <input
                            type="text"
                            placeholder="Search course or room..."
                            value={search}
                            onChange={(event) =>
                                setSearch(
                                    event.target.value
                                )
                            }
                        />

                    </div>


                    {/* Day */}

                    <div className="timetable-select">

                        <FaFilter />

                        <select
                            value={dayFilter}
                            onChange={(event) =>
                                setDayFilter(
                                    event.target.value
                                )
                            }
                        >

                            <option value="">
                                All Days
                            </option>

                            {days.map((day) => (

                                <option
                                    key={day}
                                    value={day}
                                >
                                    {day}
                                </option>

                            ))}

                        </select>

                    </div>

                </div>

            </div>


            {/* ========================================================
               LOADING
            ======================================================== */}

            {loading ? (

                <div className="timetable-loading">

                    <div className="timetable-loader"></div>

                    <h3>
                        Loading timetable
                    </h3>

                    <p>
                        Retrieving your assigned classes...
                    </p>

                </div>

            ) : sortedTimetable.length === 0 ? (

                /* ====================================================
                   EMPTY
                ==================================================== */

                <div className="timetable-empty">

                    <div className="timetable-empty-icon">

                        <FaCalendarAlt />

                    </div>


                    <h3>
                        No Timetable Records
                    </h3>


                    <p>

                        {hasFilters
                            ? "No classes match your selected filters."
                            : "No timetable has been assigned to you yet."
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
                   TIMETABLE
                ==================================================== */

                <div className="lecturer-timetable-content">

                    <div className="timetable-results-header">

                        <div>

                            <h3>
                                Weekly Schedule
                            </h3>

                            <span>
                                {sortedTimetable.length} class
                                {sortedTimetable.length !== 1
                                    ? "es"
                                    : ""
                                } assigned
                            </span>

                        </div>

                    </div>


                    {/* =================================================
                       DAY GROUPS
                    ================================================= */}

                    <div className="timetable-days">

                        {days.map((day) => {

                            const dayClasses =
                                sortedTimetable.filter(
                                    (item) =>
                                        item.day === day
                                );


                            if (
                                dayClasses.length === 0
                            ) {

                                return null;

                            }


                            return (

                                <section
                                    key={day}
                                    className="timetable-day-section"
                                >


                                    {/* Day Header */}

                                    <div className="timetable-day-header">

                                        <div
                                            className={
                                                getDayClass(day)
                                            }
                                        >

                                            <FaCalendarAlt />

                                            <span>
                                                {day}
                                            </span>

                                        </div>


                                        <span className="day-class-count">

                                            {dayClasses.length}

                                            {" "}

                                            class

                                            {dayClasses.length !== 1
                                                ? "es"
                                                : ""
                                            }

                                        </span>

                                    </div>


                                    {/* Classes */}

                                    <div className="timetable-class-list">

                                        {dayClasses.map(
                                            (item, index) => (

                                                <div
                                                    className="timetable-class-card"
                                                    key={
                                                        item.id ||
                                                        `${day}-${index}`
                                                    }
                                                >


                                                    {/* Time */}

                                                    <div className="class-time">

                                                        <FaClock />

                                                        <div>

                                                            <strong>

                                                                {
                                                                    formatTime(
                                                                        item.startTime
                                                                    )
                                                                }

                                                            </strong>

                                                            <span>

                                                                {
                                                                    formatTime(
                                                                        item.endTime
                                                                    )
                                                                }

                                                            </span>

                                                        </div>

                                                    </div>


                                                    {/* Course */}

                                                    <div className="class-course">

                                                        <span className="course-code">

                                                            {
                                                                item.courseCode
                                                            }

                                                        </span>


                                                        <h4>

                                                            {
                                                                item.courseName
                                                            }

                                                        </h4>


                                                        <div className="class-details">

                                                            <span>

                                                                <FaMapMarkerAlt />

                                                                {
                                                                    item.room
                                                                }

                                                            </span>


                                                            {item.semester && (

                                                                <span>

                                                                    <FaCalendarAlt />

                                                                    {
                                                                        item.semester
                                                                    }

                                                                </span>

                                                            )}


                                                            {item.yearOfStudy && (

                                                                <span>

                                                                    Year{" "}

                                                                    {
                                                                        item.yearOfStudy
                                                                    }

                                                                </span>

                                                            )}

                                                        </div>

                                                    </div>


                                                    {/* Academic Year */}

                                                    <div className="class-academic">

                                                        <span>
                                                            Academic Year
                                                        </span>

                                                        <strong>
                                                            {
                                                                item.academicYear ||
                                                                "-"
                                                            }
                                                        </strong>

                                                    </div>

                                                </div>

                                            )
                                        )}

                                    </div>

                                </section>

                            );

                        })}

                    </div>

                </div>

            )}

        </div>

    );

}


export default Timetable;