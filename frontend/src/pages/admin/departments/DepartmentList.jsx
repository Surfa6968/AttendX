import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "bootstrap-icons/font/bootstrap-icons.css";
import {
    getDepartments,
    deleteDepartment
} from "../../../services/departmentService";

function DepartmentList() {

    const [departments, setDepartments] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadDepartments();
    }, []);

    const loadDepartments = async () => {

        try {

            const res = await getDepartments();

            setDepartments(res.data);

        } catch (err) {

            console.error(err);

            alert("Failed to load departments.");

        } finally {

            setLoading(false);

        }

    };

    const handleDelete = async (id) => {

        if (!window.confirm("Delete this department?")) {
            return;
        }

        try {

            const res = await deleteDepartment(id);

            alert(res.message);

            loadDepartments();

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

                <h2>Department Management</h2>

                <Link
                    to="/admin/departments/add"
                    className="btn btn-primary"
                >
                    + Add Department
                </Link>

            </div>

            <div className="card shadow-sm">

                <div className="card-body">

                    <table className="table table-hover align-middle">

                        <thead className="table-dark">

                            <tr>

                                <th>ID</th>
                                <th>Department Code</th>
                                <th>Department Name</th>
                                <th>Faculty</th>
                                <th width="180">Actions</th>

                            </tr>

                        </thead>

                        <tbody>

                            {

                                departments.length > 0 ?

                                departments.map((department)=>(

                                    <tr key={department.id}>

                                        <td>{department.id}</td>

                                        <td>{department.department_code}</td>

                                        <td>{department.department_name}</td>

                                        <td>{department.faculty_name}</td>

                                        <td>

                                            <Link
                                                to={`/admin/departments/edit/${department.id}`}
                                                className="btn btn-warning btn-sm me-2"
                                                title="Edit Department"
                                            >
                                                <i className="bi bi-pencil-square"></i>
                                            </Link>

                                            <button
                                                className="btn btn-danger btn-sm"
                                                onClick={() => handleDelete(department.id)}
                                                title="Delete Department"
                                            >
                                                <i className="bi bi-trash"></i>
                                            </button>

                                        </td>

                                    </tr>

                                ))

                                :

                                <tr>

                                    <td colSpan="5" className="text-center">

                                        No departments found.

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

export default DepartmentList;