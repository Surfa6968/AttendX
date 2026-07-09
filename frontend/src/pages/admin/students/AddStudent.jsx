import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { createStudent } from "../../../services/studentService";
import { getFaculties } from "../../../services/facultyService";
import { getDepartments } from "../../../services/departmentService";

function AddStudent() {

    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);

    const [faculties, setFaculties] = useState([]);
    const [departments, setDepartments] = useState([]);

    const [form, setForm] = useState({

        full_name: "",
        email: "",
        password: "",
        gender: "",

        registration_no: "",

        faculty_id: "",
        department_id: "",

        year_of_study: "",
        semester: "",
        intake_year: "",

        phone: "",
        address: "",

        guardian_name: "",
        guardian_phone: ""

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

            const res = await createStudent(form);

            alert(res.message);

            navigate("/admin/students");

        }

        catch (err) {

            console.error(err);

            alert(

                err.response?.data?.message ||

                "Failed to create student."

            );

        }

        finally {

            setLoading(false);

        }

    };

    return (

        <div className="container-fluid">

            <div className="card shadow-sm">

                <div className="card-header">

                    <h3>Add Student</h3>

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

                                    Registration Number

                                </label>

                                <input
                                    type="text"
                                    className="form-control"
                                    name="registration_no"
                                    value={form.registration_no}
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

                                    Year of Study

                                </label>

                                <select
                                    className="form-select"
                                    name="year_of_study"
                                    value={form.year_of_study}
                                    onChange={handleChange}
                                    required
                                >

                                    <option value="">Select Year</option>

                                    <option value="1">Year 1</option>

                                    <option value="2">Year 2</option>

                                    <option value="3">Year 3</option>

                                    <option value="4">Year 4</option>

                                </select>

                            </div>

                            <div className="col-md-6 mb-3">

                                <label className="form-label">

                                    Semester

                                </label>

                                <select
                                    className="form-select"
                                    name="semester"
                                    value={form.semester}
                                    onChange={handleChange}
                                    required
                                >

                                    <option value="">Select Semester</option>

                                    <option value="1">Semester 1</option>

                                    <option value="2">Semester 2</option>

                                </select>

                            </div>

                            <div className="col-md-6 mb-3">

                                <label className="form-label">

                                    Intake Year

                                </label>

                                <input
                                    type="number"
                                    className="form-control"
                                    name="intake_year"
                                    value={form.intake_year}
                                    onChange={handleChange}
                                    placeholder="2026"
                                    required
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

                            <div className="col-md-12 mb-3">

                                <label className="form-label">

                                    Address

                                </label>

                                <textarea
                                    className="form-control"
                                    rows="3"
                                    name="address"
                                    value={form.address}
                                    onChange={handleChange}
                                ></textarea>

                            </div>

                            <div className="col-md-6 mb-3">

                                <label className="form-label">

                                    Guardian Name

                                </label>

                                <input
                                    type="text"
                                    className="form-control"
                                    name="guardian_name"
                                    value={form.guardian_name}
                                    onChange={handleChange}
                                />

                            </div>

                            <div className="col-md-6 mb-4">

                                <label className="form-label">

                                    Guardian Phone

                                </label>

                                <input
                                    type="text"
                                    className="form-control"
                                    name="guardian_phone"
                                    value={form.guardian_phone}
                                    onChange={handleChange}
                                />

                            </div>

                        </div>

                        <button
                            type="submit"
                            className="btn btn-primary"
                            disabled={loading}
                        >

                            {

                                loading

                                    ?

                                    "Saving..."

                                    :

                                    "Create Student"

                            }

                        </button>

                    </form>

                </div>

            </div>

        </div>

    );

}

export default AddStudent;