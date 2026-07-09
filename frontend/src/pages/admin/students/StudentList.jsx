import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import {
    getStudents,
    deleteStudent,
    searchStudents
} from "../../../services/studentService";

function StudentList() {

    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [keyword, setKeyword] = useState("");

    useEffect(() => {
        loadStudents();
    }, []);

    const loadStudents = async () => {

        try {

            const res = await getStudents();

            setStudents(res.data);

        }

        catch (err) {

            console.error(err);

            alert("Failed to load students.");

        }

        finally {

            setLoading(false);

        }

    };

    const handleDelete = async (id) => {

        if (!window.confirm("Delete this student?")) {

            return;

        }

        try {

            const res = await deleteStudent(id);

            alert(res.message);

            loadStudents();

        }

        catch (err) {

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

                loadStudents();

                return;

            }

            const res = await searchStudents(value);

            setStudents(res.data);

        }

        catch (err) {

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

                <h2>Student Management</h2>

                <Link
                    to="/admin/students/add"
                    className="btn btn-primary"
                >

                    + Add Student

                </Link>

            </div>

            <div className="row mb-3">

                <div className="col-md-4">

                    <input
                        type="text"
                        className="form-control"
                        placeholder="Search students..."
                        value={keyword}
                        onChange={(e)=>handleSearch(e.target.value)}
                    />

                </div>

            </div>

            <div className="card shadow-sm">

                <div className="card-body">

                    <table className="table table-hover align-middle">

                        <thead className="table-dark">

                            <tr>

                                <th>Reg No</th>

                                <th>Name</th>

                                <th>Email</th>

                                <th>Faculty</th>

                                <th>Department</th>

                                <th>Academic Year</th>

                                <th>Semester</th>

                                <th>Status</th>

                                <th width="180">

                                    Actions

                                </th>

                            </tr>

                        </thead>

                        <tbody>

                            {

                                students.length > 0 ?

                                students.map((student)=>(

                                    <tr key={student.id}>

                                        <td>

                                            {student.registration_no}

                                        </td>

                                        <td>

                                            {student.full_name}

                                        </td>

                                        <td>

                                            {student.email}

                                        </td>

                                        <td>

                                            {student.faculty_name}

                                        </td>

                                        <td>

                                            {student.department_name}

                                        </td>

                                        <td>

                                            {student.academic_year}

                                        </td>

                                        <td>

                                            {student.semester}

                                        </td>

                                        <td>

                                            {

                                                student.is_active == 1 ?

                                                <span className="badge bg-success">

                                                    Active

                                                </span>

                                                :

                                                <span className="badge bg-danger">

                                                    Inactive

                                                </span>

                                            }

                                        </td>

                                        <td>

                                            <Link
                                                to={`/admin/students/edit/${student.id}`}
                                                className="btn btn-warning btn-sm me-2"
                                            >

                                                Edit

                                            </Link>

                                            <button
                                                className="btn btn-danger btn-sm"
                                                onClick={()=>handleDelete(student.id)}
                                            >

                                                Delete

                                            </button>

                                        </td>

                                    </tr>

                                ))

                                :

                                <tr>

                                    <td
                                        colSpan="9"
                                        className="text-center"
                                    >

                                        No students found.

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

export default StudentList;