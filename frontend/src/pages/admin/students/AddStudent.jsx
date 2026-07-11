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

    const [formData, setFormData] = useState({

        registration_no: "",
        full_name: "",
        email: "",
        password: "",
        gender: "",
        faculty_id: "",
        department_id: "",
        academic_year: "",
        year_of_study: "",
        semester: "",
        phone: "",
        address: "",
        guardian_name: "",
        guardian_phone: "",
        is_active: 1

    });

    useEffect(() => {
        loadFaculties();
        loadDepartments();
    }, []);

    const loadFaculties = async () => {
        try {
            const res = await getFaculties();
            setFaculties(res.data);
        }

        catch (err) {
            console.error(err);
        }
    };

    const loadDepartments = async () => {
        try {
            const res = await getDepartments();
            setDepartments(res.data);
        }

        catch (err) {
            console.error(err);
        }
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            console.log(formData);
            const res = await createStudent(formData);
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
                <div className="card-header bg-primary text-white">
                    <h3>Add Student</h3>
                </div>

                <div className="card-body">
                    <form onSubmit={handleSubmit}>
                        <div className="row">

                            {/* Registration Number */}
                            <div className="col-md-6 mb-3">
                                <label className="form-label"> Registration Number </label>

                                <input
                                    type="text"
                                    className="form-control"
                                    name="registration_no"
                                    value={formData.registration_no}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            {/* Full Name */}
                            <div className="col-md-6 mb-3">
                                <label className="form-label"> Full Name </label>
                                <input
                                    type="text"
                                    className="form-control"
                                    name="full_name"
                                    value={formData.full_name}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            {/* Email */}
                            <div className="col-md-6 mb-3">
                                <label className="form-label"> Email </label>
                                <input
                                    type="email"
                                    className="form-control"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            {/* Password */}

                            <div className="col-md-6 mb-3">

                                <label className="form-label">

                                    Password

                                </label>

                                <input
                                    type="password"
                                    className="form-control"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    required
                                />

                            </div>

                            {/* Gender */}

                            <div className="col-md-4 mb-3">

                                <label className="form-label">

                                    Gender

                                </label>

                                <select
                                    className="form-select"
                                    name="gender"
                                    value={formData.gender}
                                    onChange={handleChange}
                                >

                                    <option value="Male">Male</option>

                                    <option value="Female">Female</option>

                                </select>

                            </div>

                            {/* Faculty */}

                            <div className="col-md-4 mb-3">

                                <label className="form-label">

                                    Faculty

                                </label>

                                <select
                                    className="form-select"
                                    name="faculty_id"
                                    value={formData.faculty_id}
                                    onChange={handleChange}
                                >

                                    <option value="">
                                        Select Faculty
                                    </option>

                                    {

                                        faculties.map((faculty)=>(

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

                            {/* Department */}

                            <div className="col-md-4 mb-3">

                                <label className="form-label">

                                    Department

                                </label>

                                <select
                                    className="form-select"
                                    name="department_id"
                                    value={formData.department_id}
                                    onChange={handleChange}
                                >

                                    <option value="">
                                        Select Department
                                    </option>

                                    {

                                        departments.map((department)=>(

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

                            {/* Academic Year */}

                            <div className="col-md-4 mb-3">

                                <label className="form-label">

                                    Academic Year

                                </label>

                                <input
                                    type="text"
                                    className="form-control"
                                    name="academic_year"
                                    value={formData.academic_year}
                                    onChange={handleChange}
                                    placeholder="2023/2024"
                                />

                            </div>

                            {/* Year of Study */}

                            <div className="col-md-4 mb-3">

                                <label className="form-label">

                                    Year of Study

                                </label>

                                <select
                                    className="form-select"
                                    name="year_of_study"
                                    value={formData.year_of_study}
                                    onChange={handleChange}
                                >

                                    <option value="">Select</option>

                                    <option value="1">Year 1</option>

                                    <option value="2">Year 2</option>

                                    <option value="3">Year 3</option>

                                    <option value="4">Year 4</option>

                                </select>

                            </div>

                            {/* Semester */}
                            <div className="col-md-4 mb-3">
                                <label className="form-label"> Semester </label>
                                <select
                                    className="form-select"
                                    name="semester"
                                    value={formData.semester}
                                    onChange={handleChange}
                                >
                                    <option value="">Select</option>
                                    <option value="1">Semester 1</option>
                                    <option value="2">Semester 2</option>
                                </select>
                            </div>

                            {/* Phone */}
                            <div className="col-md-6 mb-3">
                                <label className="form-label"> Phone </label>
                                <input
                                    type="text"
                                    className="form-control"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                />
                            </div>

                            {/* Guardian Phone */}
                            <div className="col-md-6 mb-3">
                                <label className="form-label"> Guardian Phone </label>
                                <input
                                    type="text"
                                    className="form-control"
                                    name="guardian_phone"
                                    value={formData.guardian_phone}
                                    onChange={handleChange}
                                />
                            </div>

                            {/* Address */}
                            <div className="col-md-12 mb-3">
                                <label className="form-label"> Address </label>
                                <textarea
                                    rows="3"
                                    className="form-control"
                                    name="address"
                                    value={formData.address}
                                    onChange={handleChange}
                                />
                            </div>

                            {/* Guardian Name */}
                            <div className="col-md-12 mb-3">
                                <label className="form-label"> Guardian Name  </label>
                                <input
                                    type="text"
                                    className="form-control"
                                    name="guardian_name"
                                    value={formData.guardian_name}
                                    onChange={handleChange}
                                />
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
                                            : "Save Student"
                                    }
                                </button>

                                <button
                                    type="button"
                                    className="btn btn-secondary"
                                    onClick={() => navigate("/admin/students")}
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default AddStudent;