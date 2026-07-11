import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "bootstrap-icons/font/bootstrap-icons.css";
import {
    getCourses,
    deleteCourse,
    searchCourses
} from "../../../services/courseService";

function CourseList() {

    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [keyword, setKeyword] = useState("");

    useEffect(() => {
        loadCourses();
    }, []);

    const loadCourses = async () => {

        try {

            const res = await getCourses();

            setCourses(res.data);

        } catch (err) {

            console.error(err);

            alert("Failed to load courses.");

        } finally {

            setLoading(false);

        }

    };

    const handleDelete = async (id) => {

        if (!window.confirm("Delete this course?")) {
            return;
        }

        try {

            const res = await deleteCourse(id);

            alert(res.message);

            loadCourses();

        } catch (err) {

            console.error(err);

            alert(
                err.response?.data?.message ||
                "Delete failed."
            );

        }

    };

    const handleSearch = async (value) => {

        setKeyword(value);

        try {

            if (value.trim() === "") {

                loadCourses();

                return;

            }

            const res = await searchCourses(value);

            setCourses(res.data);

        } catch (err) {

            console.error(err);

        }

    };

    if (loading) {

        return (

            <div className="text-center mt-5">

                <div className="spinner-border text-primary"></div>

            </div>

        );

    }

    return (

        <div className="container-fluid">

            <div className="d-flex justify-content-between align-items-center mb-4">

                <h2>Course Management</h2>

                <Link
                    to="/admin/courses/add"
                    className="btn btn-primary"
                >
                    + Add Course
                </Link>

            </div>

            <div className="row mb-3">

                <div className="col-md-4">

                    <input
                        type="text"
                        className="form-control"
                        placeholder="Search course..."
                        value={keyword}
                        onChange={(e) => handleSearch(e.target.value)}
                    />

                </div>

            </div>

            <div className="card shadow-sm">

                <div className="card-body">

                    <table className="table table-hover align-middle">

                        <thead className="table-dark">

                            <tr>

                                <th>Code</th>

                                <th>Name</th>

                                <th>Faculty</th>

                                <th>Department</th>

                                <th>Lecturer</th>

                                <th>Credits</th>

                                <th>Year</th>

                                <th>Semester</th>

                                <th>Status</th>

                                <th width="180">

                                    Actions

                                </th>

                            </tr>

                        </thead>

                        <tbody>

                            {

                                courses.length > 0 ?

                                courses.map(course => (

                                    <tr key={course.id}>

                                        <td>

                                            {course.course_code}

                                        </td>

                                        <td>

                                            {course.course_name}

                                        </td>

                                        <td>

                                            {course.faculty_name}

                                        </td>

                                        <td>

                                            {course.department_name}

                                        </td>

                                        <td>

                                            {course.lecturer_name}

                                        </td>

                                        <td>

                                            {course.credits}

                                        </td>

                                        <td>

                                            {course.academic_year}

                                        </td>

                                        <td>

                                            {course.semester}

                                        </td>

                                        <td>

                                            {

                                                course.is_active == 1 ?

                                                <span className="badge bg-success">

                                                    Active

                                                </span>

                                                :

                                                <span className="badge bg-danger">

                                                    Disabled

                                                </span>

                                            }

                                        </td>

                                        <td>

                                            <Link
                                                to={`/admin/courses/edit/${course.id}`}
                                                className="btn btn-warning btn-sm me-2"
                                                title="Edit Student"
                                            >
                                                <i className="bi bi-pencil-square"></i>
                                            </Link>

                                            <button
                                                className="btn btn-danger btn-sm"
                                                onClick={() => handleDelete(course.id)}
                                                title="Delete Student"
                                            >
                                                <i className="bi bi-trash"></i>
                                            </button>

                                        </td>

                                    </tr>

                                ))

                                :

                                <tr>

                                    <td
                                        colSpan="10"
                                        className="text-center"
                                    >

                                        No courses found.

                                    </td>

                                </tr>

                            }

                        </tbody>

                    </table>

                </div>

            </div>

        </div>

    );

}

export default CourseList;