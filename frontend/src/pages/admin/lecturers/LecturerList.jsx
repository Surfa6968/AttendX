import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "bootstrap-icons/font/bootstrap-icons.css";
import {
    getLecturers,
    deleteLecturer,
    searchLecturers
} from "../../../services/lecturerService";

function LecturerList() {

    const [lecturers, setLecturers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [keyword, setKeyword] = useState("");

    useEffect(() => {

        loadLecturers();

    }, []);

    const loadLecturers = async () => {

        try {

            const res = await getLecturers();

            setLecturers(res.data);

        }

        catch (err) {

            console.error(err);

            alert("Failed to load lecturers.");

        }

        finally {

            setLoading(false);

        }

    };

    const handleDelete = async (id) => {

        if (!window.confirm("Delete this lecturer?")) {

            return;

        }

        try {

            const res = await deleteLecturer(id);

            alert(res.message);

            loadLecturers();

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

                loadLecturers();

                return;

            }

            const res = await searchLecturers(value);

            setLecturers(res.data);

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

                <h2>Lecturer Management</h2>

                <Link
                    to="/admin/lecturers/add"
                    className="btn btn-primary"
                >

                    + Add Lecturer

                </Link>

            </div>

            <div className="row mb-3">

                <div className="col-md-4">

                    <input
                        type="text"
                        className="form-control"
                        placeholder="Search lecturer..."
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

                                <th>Employee No</th>

                                <th>Name</th>

                                <th>Email</th>

                                <th>Faculty</th>

                                <th>Department</th>

                                <th>Designation</th>

                                <th>Status</th>

                                <th width="180">

                                    Actions

                                </th>

                            </tr>

                        </thead>

                        <tbody>

                            {

                                lecturers.length > 0 ?

                                lecturers.map((lecturer)=>(

                                    <tr key={lecturer.id}>

                                        <td>

                                            {lecturer.employee_no}

                                        </td>

                                        <td>

                                            {lecturer.full_name}

                                        </td>

                                        <td>

                                            {lecturer.email}

                                        </td>

                                        <td>

                                            {lecturer.faculty_name}

                                        </td>

                                        <td>

                                            {lecturer.department_name}

                                        </td>

                                        <td>

                                            {lecturer.designation}

                                        </td>

                                        <td>

                                            {

                                                lecturer.is_active == 1 ?

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
                                                to={`/admin/lecturers/edit/${lecturer.id}`}
                                                className="btn btn-warning btn-sm me-2"
                                                title="Edit Lecturer"
                                            >
                                                <i className="bi bi-pencil-square"></i>
                                            </Link>

                                            <button
                                                className="btn btn-danger btn-sm"
                                                onClick={()=>handleDelete(lecturer.id)}
                                                title="Delete Lecturer"
                                            >
                                                <i className="bi bi-trash"></i>
                                            </button>

                                        </td>

                                    </tr>

                                ))

                                :

                                <tr>

                                    <td
                                        colSpan="8"
                                        className="text-center"
                                    >

                                        No lecturers found.

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

export default LecturerList;