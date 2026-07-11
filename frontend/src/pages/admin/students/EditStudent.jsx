import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
    FaSave,
    FaTimes
} from "react-icons/fa";

import {
    getStudent,
    updateStudent
} from "../../../services/studentService";

import { getFaculties } from "../../../services/facultyService";
import { getDepartments } from "../../../services/departmentService";

function EditStudent() {

    const navigate = useNavigate();

    const { id } = useParams();

    const [loading, setLoading] = useState(false);

    const [faculties, setFaculties] = useState([]);

    const [departments, setDepartments] = useState([]);

    const [formData, setFormData] = useState({

        registration_no: "",

        full_name: "",

        email: "",

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

        loadStudent();

        loadFaculties();

        loadDepartments();

    }, []);

    const loadStudent = async () => {

        try {

            const res = await getStudent(id);

            setFormData({
                registration_no: res.data.registration_no || "",
                full_name: res.data.full_name || "",
                email: res.data.email || "",
                gender: res.data.gender || "Male",
                faculty_id: res.data.faculty_id || "",
                department_id: res.data.department_id || "",
                academic_year: res.data.academic_year || "",
                year_of_study: res.data.year_of_study || "",
                semester: res.data.semester || "",
                phone: res.data.phone || "",
                address: res.data.address || "",
                guardian_name: res.data.guardian_name || "",
                guardian_phone: res.data.guardian_phone || "",
                is_active: res.data.is_active ?? 1
            });

        }

        catch (err) {

            console.error(err);

            alert("Failed to load student.");

        }

    };

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
        console.log(formData);
        setLoading(true);

        try {

            const res = await updateStudent(id, formData);

            alert(res.message);

            navigate("/admin/students");

        }

        catch (err) {

            console.error(err);

            alert(

                err.response?.data?.message ||

                "Failed to update student."

            );

        }

        finally {

            setLoading(false);

        }

    };

        return (

        <div className="container py-4">
            <div className="card border-0 shadow-lg" style={{ borderRadius: "18px" }}>
                <div className="card-header border-0 d-flex justify-content-between align-items-center"
                    style={{
                        background: "linear-gradient(135deg,#2563eb,#1d4ed8)",
                        color: "#fff",
                        borderTopLeftRadius: "18px",
                        borderTopRightRadius: "18px",
                        padding: "18px 24px"
                    }}
                >
                    <h3 className="mb-0 fw-bold">Edit Student</h3>

                    <div className="d-flex gap-2">
                        <button
                            type="submit"
                            form="editUserForm"
                            className="btn btn-light rounded-circle shadow-sm"
                            title="Save Changes"
                            style={{ width: "46px", height: "46px" }}
                        >
                            <FaSave className="text-success" />
                        </button>

                        <button
                            type="button"
                            onClick={() => navigate("/admin/students")}
                            className="btn btn-light rounded-circle shadow-sm"
                            title="Cancel"
                            style={{ width: "46px", height: "46px" }}
                        >
                            <FaTimes className="text-danger"  />
                        </button>
                    </div>
                </div>

                <div className="card-body p-4">
                    <form id="editStudentForm" onSubmit={handleSubmit}>
                        <div className="row">

                            {/* Registration Number */}
                            <div className="col-md-6 mb-3">
                                <label className="form-label fw-semibold"> Registration Number </label>

                                <input
                                    type="text"
                                    className="form-control shadow-sm"
                                    style={{
                                        borderRadius: "10px"
                                    }}
                                    name="registration_no"
                                    value={formData.registration_no}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            {/* Full Name */}
                            <div className="col-md-6 mb-3">
                                <label className="form-label fw-semibold"> Full Name </label>

                                <input
                                    type="text"
                                    className="form-control shadow-sm"
                                    style={{
                                        borderRadius: "10px"
                                    }}
                                    name="full_name"
                                    value={formData.full_name}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            {/* Email */}
                            <div className="col-md-6 mb-3">
                                <label className="form-label fw-semibold"> Email  </label>

                                <input
                                    type="email"
                                    className="form-control shadow-sm"
                                    style={{
                                        borderRadius: "10px"
                                    }}
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            {/* Gender */}
                            <div className="col-md-3 mb-3">
                                <label className="form-label fw-semibold"> Gender  </label>

                                <select
                                    className="form-select shadow-sm"
                                    style={{
                                        borderRadius: "10px"
                                    }}
                                    name="gender"
                                    value={formData.gender}
                                    onChange={handleChange}
                                >

                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                </select>
                            </div>

                            {/* Status */}
                            <div className="col-md-3 mb-3">
                                <label className="form-label fw-semibold"> Status </label>

                                <select
                                    className="form-select shadow-sm"
                                    style={{
                                        borderRadius: "10px"
                                    }}
                                    name="is_active"
                                    value={formData.is_active}
                                    onChange={handleChange}
                                >

                                    <option value={1}>Active</option>
                                    <option value={0}>Inactive</option>
                                </select>
                            </div>

                            {/* Faculty */}
                            <div className="col-md-6 mb-3">
                                <label className="form-label fw-semibold"> Faculty </label>

                                <select
                                    className="form-select shadow-sm"
                                    style={{
                                        borderRadius: "10px"
                                    }}
                                    name="faculty_id"
                                    value={formData.faculty_id}
                                    onChange={handleChange}
                                >

                                    <option value="">Select Faculty</option>

                                    {faculties.map((faculty) => (

                                        <option
                                            key={faculty.id}
                                            value={faculty.id}
                                        >

                                            {faculty.faculty_name}

                                        </option>

                                    ))}

                                </select>

                            </div>

                            {/* Department */}

                            <div className="col-md-6 mb-3">
                                <label className="form-label fw-semibold"> Department </label>

                                <select
                                    className="form-select shadow-sm"
                                    style={{
                                        borderRadius: "10px"
                                    }}
                                    name="department_id"
                                    value={formData.department_id}
                                    onChange={handleChange}
                                >

                                    <option value="">Select Department</option>

                                    {departments.map((department) => (

                                        <option
                                            key={department.id}
                                            value={department.id}
                                        >

                                            {department.department_name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Academic Year */}
                            <div className="col-md-4 mb-3">
                                <label className="form-label fw-semibold"> Academic Year </label>

                                <input
                                    type="text"
                                    className="form-control shadow-sm"
                                    style={{
                                        borderRadius: "10px"
                                    }}
                                    name="academic_year"
                                    value={formData.academic_year}
                                    onChange={handleChange}
                                    placeholder="2023/2024"
                                />
                            </div>

                            {/* Year of Study */}
                            <div className="col-md-4 mb-3">
                                <label className="form-label fw-semibold"> Year of Study </label>

                                <select
                                    className="form-select shadow-sm"
                                    style={{
                                        borderRadius: "10px"
                                    }}
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
                                <label className="form-label fw-semibold"> Semester </label>

                                <select
                                    className="form-select shadow-sm"
                                    style={{
                                        borderRadius: "10px"
                                    }}
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
                                <label className="form-label fw-semibold"> Phone </label>

                                <input
                                    type="text"
                                    className="form-control shadow-sm"
                                    style={{
                                        borderRadius: "10px"
                                    }}
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                />

                            </div>

                            {/* Guardian Phone */}
                            <div className="col-md-6 mb-3">
                                <label className="form-label fw-semibold"> Guardian Phone </label>

                                <input
                                    type="text"
                                    className="form-control shadow-sm"
                                    style={{
                                        borderRadius: "10px"
                                    }}
                                    name="guardian_phone"
                                    value={formData.guardian_phone}
                                    onChange={handleChange}
                                />
                            </div>

                            {/* Address */}
                            <div className="col-md-12 mb-3">
                                <label className="form-label fw-semibold"> Address </label>

                                <textarea
                                    rows="3"
                                    className="form-control shadow-sm"
                                    style={{
                                        borderRadius: "10px"
                                    }}
                                    name="address"
                                    value={formData.address}
                                    onChange={handleChange}
                                />

                            </div>

                            {/* Guardian Name */}
                            <div className="col-md-12 mb-3">
                                <label className="form-label fw-semibold"> Guardian Name </label>

                                <input
                                    type="text"
                                    className="form-control shadow-sm"
                                    style={{
                                        borderRadius: "10px"
                                    }}
                                    name="guardian_name"
                                    value={formData.guardian_name}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default EditStudent;