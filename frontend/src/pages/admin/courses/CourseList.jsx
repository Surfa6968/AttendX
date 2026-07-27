import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
    FaPlus,
    FaSearch,
    FaEdit,
    FaTrash,
    FaEye,
    FaBookOpen,
    FaCheckCircle,
    FaTimesCircle,
    FaFilter
} from "react-icons/fa";

import {
    getCourses,
    deleteCourse
} from "../../../services/courseService";

function CourseList() {
    const navigate = useNavigate();

    /*
    |--------------------------------------------------------------------------
    | States
    |--------------------------------------------------------------------------
    */
    const [loading, setLoading] = useState(true);

    const [courses, setCourses] = useState([]);
    const [filteredCourses, setFilteredCourses] = useState([]);

    const [search, setSearch] = useState("");

    const [facultyFilter, setFacultyFilter] = useState("");
    const [departmentFilter, setDepartmentFilter] = useState("");
    const [lecturerFilter, setLecturerFilter] = useState("");
    const [statusFilter, setStatusFilter] = useState("");

    /*
    |--------------------------------------------------------------------------
    | Statistics
    |--------------------------------------------------------------------------
    */
    const [statistics, setStatistics] = useState({
        total: 0,
        active: 0,
        inactive: 0,
        totalCredits: 0
    });

    /*
    |--------------------------------------------------------------------------
    | Load Courses
    |--------------------------------------------------------------------------
    */
    useEffect(() => {
        loadCourses();
    }, []);

    const loadCourses = async () => {
        try {
            setLoading(true);

            const res = await getCourses();
            if (res.success) {
                const data = res.data || [];

                setCourses(data);
                setFilteredCourses(data);
                setStatistics({
                    total: data.length,
                    active: data.filter(course => Number(course.is_active) === 1).length,
                    inactive: data.filter(course => Number(course.is_active) === 0).length,
                    totalCredits: data.reduce(
                        (total, course) => total + Number(course.credits),
                        0
                    )
                });
            }

        } catch (err) {
            console.error(err);
            alert("Failed to load courses.");
        } finally {
            setLoading(false);
        }
    };

    /*
    |--------------------------------------------------------------------------
    | Search & Filter
    |--------------------------------------------------------------------------
    */
    useEffect(() => {
        let data = [...courses];
        /*
        |--------------------------------------------------------------------------
        | Search
        |--------------------------------------------------------------------------
        */
        if (search.trim() !== "") {
            data = data.filter(course =>
                course.course_code
                    .toLowerCase()
                    .includes(search.toLowerCase())
                ||
                course.course_name
                    .toLowerCase()
                    .includes(search.toLowerCase())
            );
        }

        /*
        |--------------------------------------------------------------------------
        | Faculty
        |--------------------------------------------------------------------------
        */
        if (facultyFilter !== "") {
            data = data.filter(
                course => course.faculty_name === facultyFilter
            );
        }

        /*
        |--------------------------------------------------------------------------
        | Department
        |--------------------------------------------------------------------------
        */
        if (departmentFilter !== "") {
            data = data.filter(
                course => course.department_name === departmentFilter
            );
        }

        /*
        |--------------------------------------------------------------------------
        | Lecturer
        |--------------------------------------------------------------------------
        */
        if (lecturerFilter !== "") {
            data = data.filter(
                course => course.lecturer_name === lecturerFilter
            );
        }

        /*
        |--------------------------------------------------------------------------
        | Status
        |--------------------------------------------------------------------------
        */
        if (statusFilter !== "") {
            data = data.filter(
                course => String(course.is_active) === statusFilter
            );
        }
        setFilteredCourses(data);
    }, [
        search,
        facultyFilter,
        departmentFilter,
        lecturerFilter,
        statusFilter,
        courses
    ]);

    if (loading) {

        return (
            <div className="text-center py-5">
                <div className="spinner-border text-primary"></div>
            </div>
        );
    }
    
    const handleDelete = async (courseId) => {
        if (!window.confirm("Are you sure you want to delete this course?")) {
            return;
        }

        try {
            const res = await deleteCourse(courseId);

            if (res.success) {
                alert(res.message);
                loadCourses(); 
            } else {
                alert(res.message);
            }
        } catch (err) {
            console.error(err);
            alert("Failed to delete course.");
        }
    };

    return (
        <div className="container-fluid py-4">

            {/* Header */}
            <div
                className="card border-0 shadow mb-4"
                style={{ borderRadius: "18px" }}
            >

                <div
                    className="card-header border-0 d-flex justify-content-between align-items-center"
                    style={{
                        background: "linear-gradient(135deg,#2563eb,#1d4ed8)",
                        color: "#fff",
                        borderTopLeftRadius: "18px",
                        borderTopRightRadius: "18px",
                        padding: "18px 24px"
                    }}
                >

                    <div className="d-flex align-items-center gap-3">
                        <FaBookOpen  size={28} />

                        <div>
                            <h3 className="mb-0 fw-bold"> Course Management </h3>
                            <small>  Manage university courses and lecturer assignments </small>
                        </div>
                    </div>

                    <button
                        className="btn btn-light fw-semibold px-4"
                        onClick={() => navigate("/admin/courses/add")}
                    >
                        <FaPlus className="me-2"/>
                        Add Course
                    </button>
                </div>
            </div>

            {/* Statistics */}
            <div className="row g-3 mb-4">
                <div className="col-md-3">
                    <div
                        className="card border-0 shadow-sm"
                        style={{ borderRadius:"15px" }}
                    >
                        <div className="card-body">
                            <small className="text-muted">
                                Total Courses
                            </small>
                            <h2 className="fw-bold">
                                {statistics.total}
                            </h2>
                        </div>
                    </div>
                </div>

                <div className="col-md-3">
                    <div
                        className="card border-0 shadow-sm"
                        style={{ borderRadius:"15px" }}
                    >
                        <div className="card-body">
                            <small className="text-muted">
                                Active Courses
                            </small>

                            <h2 className="fw-bold text-success">
                                {statistics.active}
                            </h2>
                        </div>
                    </div>
                </div>

                <div className="col-md-3">
                    <div
                        className="card border-0 shadow-sm"
                        style={{ borderRadius:"15px" }}
                    >
                        <div className="card-body">
                            <small className="text-muted">
                                Inactive Courses
                            </small>

                            <h2 className="fw-bold text-danger">
                                {statistics.inactive}
                            </h2>
                        </div>
                    </div>
                </div>

                <div className="col-md-3">
                    <div
                        className="card border-0 shadow-sm"
                        style={{ borderRadius:"15px" }}
                    >
                        <div className="card-body">
                            <small className="text-muted">
                                Total Credits
                            </small>

                            <h2 className="fw-bold text-primary">
                                {statistics.totalCredits}
                            </h2>
                        </div>
                    </div>
                </div>
            </div>

            {/* Search & Filters */}
            <div
                className="card border-0 shadow-sm mb-4"
                style={{ borderRadius: "15px" }}
            >
                <div className="card-body">
                    <div className="row g-3">

                        {/* Search */}
                        <div className="col-lg-4">
                            <div className="input-group">
                                <span className="input-group-text bg-white">
                                    <FaSearch />
                                </span>

                                <input
                                    type="text"
                                    className="form-control"
                                    style={{ borderRadius: "10px" }}
                                    placeholder="Search course code or name..."
                                    value={search}
                                    onChange={(e)=>setSearch(e.target.value)}
                                />
                            </div>
                        </div>

                        {/* Faculty */}
                        <div className="col-lg-2">
                            <select
                                className="form-select"
                                style={{ borderRadius:"10px" }}
                                value={facultyFilter}
                                onChange={(e)=>setFacultyFilter(e.target.value)}
                            >

                                <option value="">
                                    All Faculties
                                </option>

                                {[...new Set(courses.map(c=>c.faculty_name))]
                                    .map(name=>(
                                        <option
                                            key={name}
                                            value={name}
                                        >
                                            {name}
                                        </option>
                                    ))}
                            </select>
                        </div>

                        {/* Department */}
                        <div className="col-lg-2">
                            <select
                                className="form-select"
                                style={{ borderRadius:"10px" }}
                                value={departmentFilter}
                                onChange={(e)=>setDepartmentFilter(e.target.value)}
                            >

                                <option value="">
                                    All Departments
                                </option>

                                {[...new Set(courses.map(c=>c.department_name))]
                                    .map(name=>(
                                        <option
                                            key={name}
                                            value={name}
                                        >
                                            {name}
                                        </option>
                                    ))}
                            </select>
                        </div>

                        {/* Lecturer */}
                        <div className="col-lg-2">
                            <select
                                className="form-select"
                                style={{ borderRadius:"10px" }}
                                value={lecturerFilter}
                                onChange={(e)=>setLecturerFilter(e.target.value)}
                            >

                                <option value="">
                                    All Lecturers
                                </option>

                                {[...new Set(courses.map(c=>c.lecturer_name))]
                                    .map(name=>(
                                        <option
                                            key={name}
                                            value={name}
                                        >
                                            {name}
                                        </option>
                                    ))}
                            </select>
                        </div>

                        {/* Status */}
                        <div className="col-lg-2">
                            <select
                                className="form-select"
                                style={{ borderRadius:"10px" }}
                                value={statusFilter}
                                onChange={(e)=>setStatusFilter(e.target.value)}
                            >

                                <option value="">
                                    All Status
                                </option>

                                <option value="1">
                                    Active
                                </option>

                                <option value="0">
                                    Inactive
                                </option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>

            {/* Course Table */}
            <div
                className="card border-0 shadow-sm"
                style={{ borderRadius: "15px" }}
            >
                <div className="card-body p-0">
                    <div className="table-responsive">
                        <table className="table table-hover align-middle mb-0">
                            <thead className="table-primary">
                                <tr>
                                    <th>Code</th>
                                    <th>Lecturer</th>
                                    <th>Faculty</th>
                                    <th>Department</th>
                                    <th>Year</th>
                                    <th>Semester</th>
                                    <th>Credits</th>
                                    <th>Status</th>
                                    <th width="140">
                                        Actions
                                    </th>
                                </tr>
                            </thead>

                            <tbody>
                                {
                                    filteredCourses.length > 0 ? (
                                        filteredCourses.map(course => (
                                            <tr key={course.id}>
                                                <td>
                                                    <div className="fw-semibold"> {course.course_code} </div>

                                                    <small className="text-muted">{course.course_name} </small>
                                                </td>

                                                <td> {course.lecturer_name} </td>
                                                <td> {course.faculty_name} </td>
                                                <td> {course.department_name} </td>
                                                <td> Y {course.year_of_study} </td>
                                                <td> S {course.semester} </td>
                                                <td> {course.credits} </td>

                                                <td>
                                                    <span
                                                        className={`badge ${
                                                            Number(course.is_active) === 1
                                                                ? "bg-success"
                                                                : "bg-danger"
                                                        }`}
                                                    >
                                                        {
                                                            Number(course.is_active) === 1
                                                                ? "Active"
                                                                : "Inactive"
                                                        }
                                                    </span>
                                                </td>

                                                <td>
                                                    <div className="d-flex gap-2 justify-content-center">
                                                        <button
                                                            className="btn btn-sm btn-warning"
                                                            title="Edit"
                                                            onClick={() =>
                                                                navigate(`/admin/courses/edit/${course.id}`)
                                                            }
                                                        >
                                                            <FaEdit />
                                                        </button>
                                                        <button
                                                            className="btn btn-sm btn-danger"
                                                            title="Delete"
                                                            onClick={() =>
                                                                handleDelete(course.id)
                                                            }
                                                        >
                                                            <FaTrash />
                                                        </button>
                                                    </div>
                                                </td>    
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td
                                                colSpan="10"
                                                className="text-center py-5"
                                            >
                                                <h4 className="text-muted">
                                                    No courses available
                                                </h4>

                                                <p className="text-muted">
                                                    Create your first course to get started.
                                                </p>
                                            </td>
                                        </tr>
                                    )
                                }
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CourseList;

        