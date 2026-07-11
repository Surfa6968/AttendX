import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { createLecturer } from "../../../services/lecturerService";
import { getFaculties } from "../../../services/facultyService";
import { getDepartments } from "../../../services/departmentService";

function AddLecturer() {

    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);

    const [faculties, setFaculties] = useState([]);
    const [departments, setDepartments] = useState([]);

    const [form, setForm] = useState({

        full_name: "",
        email: "",
        password: "",
        gender: "",
        employee_no: "",
        faculty_id: "",
        department_id: "",
        designation: "",
        qualification: "",
        specialization: "",
        office_room: "",
        phone: "",
        joined_date: ""

    });

    useEffect(() => {
        loadDropdowns();
    }, []);

    const loadDropdowns = async () => {
        try {
            const facultyRes = await getFaculties();
            setFaculties(facultyRes.data);
            const departmentRes = await getDepartments();
            setDepartments(departmentRes.data);
        }

        catch (err) {
            console.error(err);
            alert("Failed to load dropdowns.");
        }
    };

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await createLecturer(form);
            alert(res.message);
            navigate("/admin/lecturers");
        }

        catch (err) {
            console.error(err);
            alert(
                err.response?.data?.message ||
                "Failed to create lecturer."
            );
        }

        finally {
            setLoading(false);
        }
    };

    return (

        <div className="container-fluid">

            <div className="card shadow-sm">

                <div className="card-header bg-primary text-white">

                    <h3>Add Lecturer</h3>

                </div>

                <div className="card-body">

                    <form onSubmit={handleSubmit}>

                        <div className="row">

                            <div className="col-md-6 mb-3">

                                <label className="form-label">

                                    Full Name

                                </label>

                                <input
                                    type="text"
                                    className="form-control"
                                    name="full_name"
                                    value={form.full_name}
                                    onChange={handleChange}
                                    required
                                />

                            </div>

                            <div className="col-md-6 mb-3">

                                <label className="form-label">

                                    Email

                                </label>

                                <input
                                    type="email"
                                    className="form-control"
                                    name="email"
                                    value={form.email}
                                    onChange={handleChange}
                                    required
                                />

                            </div>

                            <div className="col-md-6 mb-3">

                                <label className="form-label">

                                    Password

                                </label>

                                <input
                                    type="password"
                                    className="form-control"
                                    name="password"
                                    value={form.password}
                                    onChange={handleChange}
                                    required
                                />

                            </div>

                            <div className="col-md-6 mb-3">

                                <label className="form-label">

                                    Gender

                                </label>

                                <select
                                    className="form-select"
                                    name="gender"
                                    value={form.gender}
                                    onChange={handleChange}
                                    required
                                >

                                    <option value="">Select Gender</option>
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>

                                </select>

                            </div>

                            <div className="col-md-6 mb-3">

                                <label className="form-label">

                                    Employee Number

                                </label>

                                <input
                                    type="text"
                                    className="form-control"
                                    name="employee_no"
                                    value={form.employee_no}
                                    onChange={handleChange}
                                    required
                                />

                            </div>

                            <div className="col-md-6 mb-3">

                                <label className="form-label">

                                    Designation

                                </label>

                                <input
                                    type="text"
                                    className="form-control"
                                    name="designation"
                                    value={form.designation}
                                    onChange={handleChange}
                                    required
                                />

                            </div>

                            <div className="col-md-6 mb-3">

                                <label className="form-label">

                                    Faculty

                                </label>

                                <select
                                    className="form-select"
                                    name="faculty_id"
                                    value={form.faculty_id}
                                    onChange={handleChange}
                                    required
                                >

                                    <option value="">Select Faculty</option>

                                    {

                                        faculties.map(faculty => (

                                            <option
                                                key={faculty.id}
                                                value={faculty.id}
                                            >

                                                {faculty.faculty_name}

                                            </option>

                                        ))

                                    }

                                </select>

                            </div>

                            <div className="col-md-6 mb-3">

                                <label className="form-label">

                                    Department

                                </label>

                                <select
                                    className="form-select"
                                    name="department_id"
                                    value={form.department_id}
                                    onChange={handleChange}
                                    required
                                >

                                    <option value="">Select Department</option>

                                    {

                                        departments
                                            .filter(
                                                d =>
                                                    !form.faculty_id ||
                                                    Number(d.faculty_id) === Number(form.faculty_id)
                                            )
                                            .map(department => (

                                                <option
                                                    key={department.id}
                                                    value={department.id}
                                                >

                                                    {department.department_name}

                                                </option>

                                            ))

                                    }

                                </select>
                            </div>

                            <div className="col-md-6 mb-3">

                                <label className="form-label">

                                    Qualification

                                </label>

                                <input
                                    type="text"
                                    className="form-control"
                                    name="qualification"
                                    value={form.qualification}
                                    onChange={handleChange}
                                />

                            </div>

                            <div className="col-md-6 mb-3">

                                <label className="form-label">

                                    Specialization

                                </label>

                                <input
                                    type="text"
                                    className="form-control"
                                    name="specialization"
                                    value={form.specialization}
                                    onChange={handleChange}
                                />

                            </div>

                            <div className="col-md-6 mb-3">

                                <label className="form-label">

                                    Office Room

                                </label>

                                <input
                                    type="text"
                                    className="form-control"
                                    name="office_room"
                                    value={form.office_room}
                                    onChange={handleChange}
                                />

                            </div>

                            <div className="col-md-6 mb-3">

                                <label className="form-label">

                                    Phone

                                </label>

                                <input
                                    type="text"
                                    className="form-control"
                                    name="phone"
                                    value={form.phone}
                                    onChange={handleChange}
                                />

                            </div>

                            <div className="col-md-6 mb-4">

                                <label className="form-label">

                                    Joined Date

                                </label>

                                <input
                                    type="date"
                                    className="form-control"
                                    name="joined_date"
                                    value={form.joined_date}
                                    onChange={handleChange}
                                />

                            </div>
                        </div>

                        <div className="col-12 mt-4">
                            <button
                                type="submit"
                                className="btn btn-primary me-2"
                                disabled={loading}
                            >
                                {
                                    loading
                                        ? "Saving..."
                                        : "Create Lecturer"
                                }
                            </button>
                            
                            <button
                                type="button"
                                className="btn btn-secondary"
                                onClick={() => navigate("/admin/lecturers")}
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default AddLecturer;