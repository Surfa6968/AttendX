import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
    getFaculties,
    deleteFaculty
} from "../../../services/facultyService";

function FacultyList() {

    const [faculties, setFaculties] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadFaculties();
    }, []);

    const loadFaculties = async () => {

        try {

            const res = await getFaculties();

            setFaculties(res.data);

        } catch (err) {

            console.error(err);

            alert("Failed to load faculties.");

        } finally {

            setLoading(false);

        }

    };

    const handleDelete = async (id) => {

        if (!window.confirm("Delete this faculty?")) {
            return;
        }

        try {

            const res = await deleteFaculty(id);

            alert(res.message);

            loadFaculties();

        } catch (err) {

            console.error(err);

            alert(
                err.response?.data?.message ||
                "Delete failed."
            );

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

                <h2>Faculty Management</h2>

                <Link
                    to="/admin/faculties/add"
                    className="btn btn-primary"
                >
                    + Add Faculty
                </Link>

            </div>

            <div className="card shadow-sm">

                <div className="card-body">

                    <table className="table table-hover align-middle">

                        <thead className="table-dark">

                            <tr>

                                <th>ID</th>

                                <th>Faculty Code</th>

                                <th>Faculty Name</th>

                                <th width="180">
                                    Actions
                                </th>

                            </tr>

                        </thead>

                        <tbody>

                            {faculties.length > 0 ? (

                                faculties.map((faculty) => (

                                    <tr key={faculty.id}>

                                        <td>{faculty.id}</td>

                                        <td>{faculty.faculty_code}</td>

                                        <td>{faculty.faculty_name}</td>

                                        <td>

                                            <Link
                                                to={`/admin/faculties/edit/${faculty.id}`}
                                                className="btn btn-warning btn-sm me-2"
                                            >
                                                Edit
                                            </Link>

                                            <button
                                                className="btn btn-danger btn-sm"
                                                onClick={() => handleDelete(faculty.id)}
                                            >
                                                Delete
                                            </button>

                                        </td>

                                    </tr>

                                ))

                            ) : (

                                <tr>

                                    <td
                                        colSpan="4"
                                        className="text-center"
                                    >
                                        No faculties found.
                                    </td>

                                </tr>

                            )}

                        </tbody>

                    </table>

                </div>

            </div>

        </div>

    );

}

export default FacultyList;