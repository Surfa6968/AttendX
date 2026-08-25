import { useEffect, useMemo, useState } from "react";

import {
    FaBook,
    FaSearch,
    FaGraduationCap,
    FaCalendarAlt,
    FaCheckCircle,
    FaTimesCircle,
    FaLayerGroup,
    FaChevronDown,
    FaTimes,
} from "react-icons/fa";

import { getLecturerCourses } from "../../services/lecturerCourseService";

import "../../css/LecturerCourses.css";


function Courses() {

    /* ============================================================
       STATE
    ============================================================ */

    const [courses, setCourses] = useState([]);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");

    const [search, setSearch] = useState("");

    const [semesterFilter, setSemesterFilter] = useState("");

    const [yearFilter, setYearFilter] = useState("");

    const [statusFilter, setStatusFilter] = useState("");

    const [selectedCourse, setSelectedCourse] = useState(null);


    /* ============================================================
       LOAD COURSES
    ============================================================ */

    useEffect(() => {

        loadCourses();

    }, []);


    const loadCourses = async () => {

        try {

            setLoading(true);

            setError("");

            const response = await getLecturerCourses();

            console.log(
                "LECTURER COURSES:",
                response
            );


            if (
                response?.success &&
                Array.isArray(response.data)
            ) {

                setCourses(response.data);

            } else {

                setCourses([]);

                setError(
                    response?.message ||
                    "Failed to load your courses."
                );

            }

        } catch (error) {

            console.error(
                "Failed to load lecturer courses:",
                error
            );

            setCourses([]);

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

    const totalCourses =
        courses.length;


    const activeCourses =
        courses.filter(
            (course) =>
                Number(course.is_active) === 1
        ).length;


    const inactiveCourses =
        courses.filter(
            (course) =>
                Number(course.is_active) !== 1
        ).length;


    const totalCredits =
        courses.reduce(
            (total, course) =>
                total +
                Number(course.credits || 0),
            0
        );


    /* ============================================================
       FILTER OPTIONS
    ============================================================ */

    const semesters = useMemo(() => {

        return [
            ...new Set(
                courses
                    .map((course) =>
                      String(course.semester ?? "").trim()
                    )
                    .filter(Boolean)
            )
        ].sort((a, b) => Number(a) - Number(b));
    }, [courses]);


    const studyYears = useMemo(() => {

        return [
            ...new Set(
                courses
                    .map(
                        (course) =>
                            String(course.year_of_study ?? "").trim()
                    )
                    .filter(Boolean)
            ),
        ].sort((a, b) => Number(a) - Number(b));

    }, [courses]);


    /* ============================================================
       FILTER COURSES
    ============================================================ */

    const filteredCourses = useMemo(() => {
            const keyword = search.trim().toLowerCase();

            return courses.filter((course) => {

              /* ----------------------------------------------------
                 Normalize database values
              ---------------------------------------------------- */
              const courseCode = String(
                  course.course_code ?? ""
              ).trim().toLowerCase();

              const courseName = String(
                  course.course_name ?? ""
              ).trim().toLowerCase();

              const semester = String(
                  course.semester ?? ""
              ).trim().toLowerCase();

              const year = String(
                  course.year_of_study ?? ""
              ).trim().toLowerCase();

              const status = Number(
                  course.is_active
              ) === 1 ? "active" : "inactive";

              /* ----------------------------------------------------
                 Apply filters
              ---------------------------------------------------- */
              const matchesSearch =       
                !keyword ||
                courseCode.includes(keyword) ||
                courseName.includes(keyword) ||
                semester.toLowerCase().includes(keyword) ||
                year.toLowerCase().includes(keyword) ||

                `semester ${semester}`.toLowerCase().includes(keyword) ||
                `year ${year}`.toLowerCase().includes(keyword);
            
             
              const matchesSemester =
                !semesterFilter ||
                semester === String(semesterFilter).trim();


              const matchesYear =
                !yearFilter ||
                year === String(yearFilter).trim();


              const matchesStatus =
                !statusFilter ||
                status === statusFilter;


              return (
                     matchesSearch &&
                     matchesSemester &&
                     matchesYear &&
                     matchesStatus
              );

       });
}, [ courses, search, semesterFilter, yearFilter, statusFilter ]);


    /* ============================================================
       CLEAR FILTERS
    ============================================================ */

    const clearFilters = () => {

        setSearch("");

        setSemesterFilter("");

        setYearFilter("");

        setStatusFilter("");

    };


    const hasFilters =
        search ||
        semesterFilter ||
        yearFilter ||
        statusFilter;


    /* ============================================================
       COURSE CARD
       
       IMPORTANT:
       Only course code, course name and status
       are shown on the card.

       Other information is available through
       "View Course Details".
    ============================================================ */

    const CourseCard = ({
        course,
        index,
    }) => {

        const isActive =
            Number(course.is_active) === 1;


        return (

            <div className="lecturer-courses-header">

                {/* Top Accent */}

                <div className="course-card-accent"></div>


                <div className="course-card-body">


                    {/* ====================================================
                       CARD HEADER
                    ==================================================== */}

                    <div className="course-card-header">

                        <div className="course-card-number">

                            {String(
                                index + 1
                            ).padStart(2, "0")}

                        </div>


                        <div className="course-card-title">

                            <span className="course-code">

                                {course.course_code}

                            </span>


                            <h5>

                                {course.course_name}

                            </h5>

                        </div>


                        <div>

                            {isActive ? (

                                <span className="course-status active">

                                    <FaCheckCircle />

                                    Active

                                </span>

                            ) : (

                                <span className="course-status inactive">

                                    <FaTimesCircle />

                                    Inactive

                                </span>

                            )}

                        </div>

                    </div>


                    {/* ====================================================
                       FOOTER
                       
                       Description and academic information have been
                       removed from the card.
                    ==================================================== */}

                    <div className="course-card-footer">

                        <button
                            type="button"
                            className="course-details-button"
                            onClick={() =>
                                setSelectedCourse(course)
                            }
                        >

                            View Course Details

                            <span>
                                →
                            </span>

                        </button>

                    </div>

                </div>

            </div>

        );

    };


    /* ============================================================
       RENDER
    ============================================================ */

    return (

        <div className="lecturer-courses-page">


            {/* ============================================================
               PAGE HEADER
            ============================================================ */}

            <div className="courses-page-header">

                <div>

                    <div className="page-breadcrumb">

                        Lecturer Portal

                        <span>
                            /
                        </span>

                        My Courses

                    </div>


                    <h1>
                        My Courses
                    </h1>


                    <p>
                        View and manage the academic courses
                        assigned to you in AttendX.
                    </p>

                </div>


                <div className="page-header-icon">

                    <FaBook />

                </div>

            </div>


            {/* ============================================================
               ERROR
            ============================================================ */}

            {error && (

                <div className="courses-error">

                    <FaTimesCircle />

                    <div>

                        <strong>
                            Unable to load courses
                        </strong>

                        <p>
                            {error}
                        </p>

                    </div>


                    <button
                        type="button"
                        onClick={loadCourses}
                    >
                        Retry
                    </button>

                </div>

            )}


            {/* ============================================================
               STATISTICS
            ============================================================ */}

            {!loading && (

                <div className="course-statistics">


                    {/* Total Courses */}

                    <div className="course-stat-card">

                        <div className="stat-icon blue">

                            <FaBook />

                        </div>


                        <div>

                            <span>
                                Total Courses
                            </span>

                            <strong>
                                {totalCourses}
                            </strong>

                            <small>
                                Assigned courses
                            </small>

                        </div>

                    </div>


                    {/* Active Courses */}

                    <div className="course-stat-card">

                        <div className="stat-icon green">

                            <FaCheckCircle />

                        </div>


                        <div>

                            <span>
                                Active Courses
                            </span>

                            <strong>
                                {activeCourses}
                            </strong>

                            <small>
                                Currently active
                            </small>

                        </div>

                    </div>


                    {/* Total Credits */}

                    <div className="course-stat-card">

                        <div className="stat-icon purple">

                            <FaGraduationCap />

                        </div>


                        <div>

                            <span>
                                Total Credits
                            </span>

                            <strong>
                                {totalCredits}
                            </strong>

                            <small>
                                Across assigned courses
                            </small>

                        </div>

                    </div>


                    {/* Inactive Courses */}

                    <div className="course-stat-card">

                        <div className="stat-icon orange">

                            <FaTimesCircle />

                        </div>


                        <div>

                            <span>
                                Inactive Courses
                            </span>

                            <strong>
                                {inactiveCourses}
                            </strong>

                            <small>
                                Currently inactive
                            </small>

                        </div>

                    </div>

                </div>

            )}


            {/* ============================================================
               FILTER PANEL
            ============================================================ */}

            <div className="courses-filter-panel">

                <div className="filter-header">

                    <div>

                        <h5>
                            Course Directory
                        </h5>

                        <span>
                            Search and filter your assigned courses
                        </span>

                    </div>


                    {hasFilters && (

                        <button
                            type="button"
                            className="clear-filter-button"
                            onClick={clearFilters}
                        >

                            <FaTimes />

                            Clear Filters

                        </button>

                    )}

                </div>


                <div className="course-filters">


                    {/* Search */}

                    <div className="course-search">

                        <FaSearch />

                        <input
                            type="text"
                            placeholder="Search course code, or name..."
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


                    {/* Semester */}

                    <div className="course-select">

                        <FaCalendarAlt />

                        <select
                            value={semesterFilter}
                            onChange={(event) =>
                                setSemesterFilter(event.target.value)
                            }
                        >

                            <option value="">
                                All Semesters
                            </option>


                            {semesters.map((semester) => (
                                   <option
                                        key={semester}
                                        value={semester}
                                   >
                                        Semester {semester}
                                   </option>
                                )
                            )}
                        </select>
                        <FaChevronDown />
                    </div>


                    {/* Year */}
                    <div className="course-select">

                        <FaGraduationCap />

                        <select
                            value={yearFilter}
                            onChange={(event) =>
                                setYearFilter(event.target.value)
                            }
                        >

                            <option value="">
                                All Years
                            </option>


                            {studyYears.map((year) => (

                                    <option
                                        key={year}
                                        value={year}
                                    >
                                        Year {year}
                                    </option>
                            ))}
                        </select>
                        <FaChevronDown />
                    </div>


                    {/* Status */}

                    <div className="course-select">

                        <FaCheckCircle />

                        <select
                            value={statusFilter}
                            onChange={(event) =>
                                setStatusFilter(event.target.value)
                            }
                        >

                            <option value="">
                                All Status
                            </option>

                            <option value="active">
                                Active
                            </option>

                            <option value="inactive">
                                Inactive
                            </option>

                        </select>


                        <FaChevronDown />

                    </div>

                </div>

            </div>


            {/* ============================================================
               COURSE RESULTS HEADER
            ============================================================ */}

            <div className="course-results-header">

                <div>

                    <h5>
                        Assigned Courses
                    </h5>


                    {!loading && (

                        <span>

                            Showing{" "}

                            <strong>
                                {filteredCourses.length}
                            </strong>{" "}

                            of{" "}

                            <strong>
                                {courses.length}
                            </strong>{" "}

                            courses

                        </span>

                    )}

                </div>


                <div className="course-results-icon">

                    <FaLayerGroup />

                </div>

            </div>


            {/* ============================================================
               LOADING
            ============================================================ */}

            {loading ? (

                <div className="courses-loading">

                    <div className="loading-spinner">

                        <div className="spinner-border text-primary"></div>

                    </div>


                    <h5>
                        Loading your courses
                    </h5>


                    <p>
                        Retrieving your assigned courses from AttendX...
                    </p>

                </div>

            ) : filteredCourses.length === 0 ? (


                /* ========================================================
                   EMPTY STATE
                ======================================================== */

                <div className="courses-empty">

                    <div className="empty-icon">

                        <FaGraduationCap />

                    </div>


                    <h4>
                        No Courses Found
                    </h4>


                    <p>

                        {hasFilters
                            ? "No courses match the selected search or filters."
                            : "You currently have no courses assigned to your lecturer account."
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


                /* ========================================================
                   COURSE GRID
                ======================================================== */

                <div className="courses-grid">

                    {filteredCourses.map(
                        (course, index) => (

                            <CourseCard
                                key={course.id}
                                course={course}
                                index={index}
                            />

                        )
                    )}

                </div>

            )}


            {/* ============================================================
               COURSE DETAILS MODAL
               
               All removed information is displayed here.
            ============================================================ */}

            {selectedCourse && (

                <div
                    className="course-modal-overlay"
                    onClick={() =>
                        setSelectedCourse(null)
                    }
                >

                    <div
                        className="course-modal"
                        onClick={(event) =>
                            event.stopPropagation()
                        }
                    >


                        {/* Modal Header */}

                        <div className="course-modal-header">

                            <div>

                                <span>
                                    {selectedCourse.course_code}
                                </span>

                                <h4>
                                    {selectedCourse.course_name}
                                </h4>

                            </div>


                            <button
                                type="button"
                                onClick={() =>
                                    setSelectedCourse(null)
                                }
                            >

                                <FaTimes />

                            </button>

                        </div>


                        {/* Modal Body */}

                        <div className="course-modal-body">


                            {/* Status */}

                            <div className="modal-status-row">

                                {Number(
                                    selectedCourse.is_active
                                ) === 1 ? (

                                    <span className="course-status active">

                                        <FaCheckCircle />

                                        Active Course

                                    </span>

                                ) : (

                                    <span className="course-status inactive">

                                        <FaTimesCircle />

                                        Inactive Course

                                    </span>

                                )}

                            </div>


                            {/* Description */}

                            <div className="modal-description">

                                <label>
                                    Course Description
                                </label>

                                <p>

                                    {selectedCourse.description ||
                                        "No description available."
                                    }

                                </p>

                            </div>


                            {/* Course Details */}

                            <div className="modal-details-grid">


                                {/* Course ID */}

                                <div>

                                    <span>
                                        Course ID
                                    </span>

                                    <strong>
                                        #{selectedCourse.id}
                                    </strong>

                                </div>


                                {/* Course Code */}

                                <div>

                                    <span>
                                        Course Code
                                    </span>

                                    <strong>
                                        {selectedCourse.course_code}
                                    </strong>

                                </div>


                                {/* Course Name */}

                                <div>

                                    <span>
                                        Course Name
                                    </span>

                                    <strong>
                                        {selectedCourse.course_name}
                                    </strong>

                                </div>


                                {/* Credits */}

                                <div>

                                    <span>
                                        Credits
                                    </span>

                                    <strong>
                                        {selectedCourse.credits ?? "-"}
                                    </strong>

                                </div>


                                {/* Year */}

                                <div>

                                    <span>
                                        Year of Study
                                    </span>

                                    <strong>

                                        {selectedCourse.year_of_study
                                            ? `Year ${selectedCourse.year_of_study}`
                                            : "-"
                                        }

                                    </strong>

                                </div>


                                {/* Semester */}

                                <div>

                                    <span>
                                        Semester
                                    </span>

                                    <strong>

                                        {selectedCourse.semester
                                            ? `Semester ${selectedCourse.semester}`
                                            : "-"
                                        }

                                    </strong>

                                </div>


                                {/* Faculty */}

                                <div>

                                    <span>
                                        Faculty ID
                                    </span>

                                    <strong>
                                        #{selectedCourse.faculty_id ?? "-"}
                                    </strong>

                                </div>


                                {/* Department */}

                                <div>

                                    <span>
                                        Department ID
                                    </span>

                                    <strong>
                                        #{selectedCourse.department_id ?? "-"}
                                    </strong>

                                </div>


                                {/* Lecturer */}

                                <div>

                                    <span>
                                        Lecturer ID
                                    </span>

                                    <strong>
                                        #{selectedCourse.lecturer_id ?? "-"}
                                    </strong>

                                </div>


                                {/* Created At */}

                                <div>

                                    <span>
                                        Created At
                                    </span>

                                    <strong>
                                        {selectedCourse.created_at || "-"}
                                    </strong>

                                </div>

                            </div>

                        </div>


                        {/* Modal Footer */}

                        <div className="course-modal-footer">

                            <button
                                type="button"
                                onClick={() =>
                                    setSelectedCourse(null)
                                }
                            >
                                Close
                            </button>

                        </div>

                    </div>

                </div>

            )}

        </div>

    );

}

export default Courses;