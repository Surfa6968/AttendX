import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
    FaSave,
    FaTimes
} from "react-icons/fa";

import {
    getCourse,
    updateCourse
} from "../../../services/courseService";

import {
    getFaculties
} from "../../../services/facultyService";

import {
    getDepartments
} from "../../../services/departmentService";

import axios from "axios";

function EditCourse() {

    const { id } = useParams();

    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);

    const [faculties, setFaculties] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [lecturers, setLecturers] = useState([]);

    const [form, setForm] = useState({

        course_code: "",
        course_name: "",
        description: "",
        credits: "",

        faculty_id: "",
        department_id: "",
        lecturer_id: "",

        academic_year: "",
        semester: "",
        is_active: 1

    });

    useEffect(() => {

        loadData();

    }, []);

    const loadData = async () => {

        try {

            const facultyRes = await getFaculties();
            setFaculties(facultyRes.data);

            const departmentRes = await getDepartments();
            setDepartments(departmentRes.data);

            const lecturerRes = await axios.get(
                "http://localhost/AttendX/backend/api/admin/lecturers/list.php",
                {
                    withCredentials: true
                }
            );

            setLecturers(lecturerRes.data.data);

            const courseRes = await getCourse(id);

            setForm(courseRes.data);

        }

        catch (err) {

            console.error(err);

            alert("Unable to load course.");

        }

        finally {

            setLoading(false);

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

        try {

            const res = await updateCourse(id, form);

            alert(res.message);

            navigate("/admin/courses");

        }

        catch (err) {

            console.error(err);

            alert(

                err.response?.data?.message ||

                "Update failed."

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
                    <h3 className="mb-0 fw-bold">Edit Course</h3>
    
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
                            onClick={() => navigate("/admin/courses")}
                            className="btn btn-light rounded-circle shadow-sm"
                            title="Cancel"
                            style={{ width: "46px", height: "46px" }}
                        >
                            <FaTimes className="text-danger"  />
                        </button>
                    </div>
                </div>

                <div className="card-body p-4">

                    <form id="editCourseForm" onSubmit={handleSubmit}>

                        <div className="row">

                            <div className="col-md-6 mb-4">

                                <label className="form-label fw-semibold">Course Code</label>

                                <input
                                    className="form-control shadow-sm"
                                    style={{
                                        borderRadius: "10px"
                                    }}
                                    name="course_code"
                                    value={form.course_code}
                                    onChange={handleChange}
                                    required
                                />

                            </div>

                            <div className="col-md-6 mb-4">

                                <label className="form-label fw-semibold">Course Name</label>

                                <input
                                    className="form-control shadow-sm"
                                    style={{
                                        borderRadius: "10px"
                                    }}
                                    name="course_name"
                                    value={form.course_name}
                                    onChange={handleChange}
                                    required
                                />

                            </div>

                            <div className="col-12 mb-4">

                                <label className="form-label fw-semibold">Description</label>

                                <textarea
                                    rows="3"
                                    type="text"
                                    className="form-control shadow-sm"
                                    style={{
                                        borderRadius: "10px"
                                    }}
                                    name="description"
                                    value={form.description}
                                    onChange={handleChange}
                                />

                            </div>

                            <div className="col-md-3 mb-4">

                                <label className="form-label fw-semibold">Credits</label>

                                <input
                                    type="number"
                                    type="text"
                                    className="form-control shadow-sm"
                                    style={{
                                        borderRadius: "10px"
                                    }}
                                    name="credits"
                                    value={form.credits}
                                    onChange={handleChange}
                                />

                            </div>

                            <div className="col-md-3 mb-4">

                                <label className="form-label fw-semibold">Academic Year</label>

                                <select
                                    className="form-select shadow-sm"
                                    style={{
                                        borderRadius: "10px"
                                    }}
                                    name="academic_year"
                                    value={form.academic_year}
                                    onChange={handleChange}
                                >

                                    <option value="1">Year 1</option>
                                    <option value="2">Year 2</option>
                                    <option value="3">Year 3</option>
                                    <option value="4">Year 4</option>

                                </select>

                            </div>

                            <div className="col-md-3 mb-4">

                                <label className="form-label fw-semibold">Semester</label>

                                <select
                                    className="form-select shadow-sm"
                                    style={{
                                        borderRadius: "10px"
                                    }}
                                    name="semester"
                                    value={form.semester}
                                    onChange={handleChange}
                                >

                                    <option value="1">Semester 1</option>
                                    <option value="2">Semester 2</option>

                                </select>

                            </div>

                            <div className="col-md-3 mb-4">

                                <label className="form-label fw-semibold">Status</label>

                                <select
                                    className="form-select shadow-sm"
                                    style={{
                                        borderRadius: "10px"
                                    }}
                                    name="is_active"
                                    value={form.is_active}
                                    onChange={handleChange}
                                >

                                    <option value="1">Active</option>
                                    <option value="0">Inactive</option>

                                </select>

                            </div>

                            <div className="col-md-4 mb-4">

                                <label className="form-label fw-semibold">Faculty</label>

                                <select
                                    className="form-select shadow-sm"
                                    style={{
                                        borderRadius: "10px"
                                    }}
                                    name="faculty_id"
                                    value={form.faculty_id}
                                    onChange={handleChange}
                                >

                                    {faculties.map(f => (

                                        <option
                                            key={f.id}
                                            value={f.id}
                                        >

                                            {f.faculty_name}

                                        </option>

                                    ))}

                                </select>

                            </div>

                            <div className="col-md-4 mb-4">

                                <label className="form-label fw-semibold">Department</label>

                                <select
                                    className="form-select shadow-sm"
                                    style={{
                                        borderRadius: "10px"
                                    }}
                                    name="department_id"
                                    value={form.department_id}
                                    onChange={handleChange}
                                >

                                    {departments
                                        .filter(
                                            d =>
                                                Number(d.faculty_id) === Number(form.faculty_id)
                                        )
                                        .map(d => (

                                            <option
                                                key={d.id}
                                                value={d.id}
                                            >

                                                {d.department_name}

                                            </option>

                                        ))}

                                </select>

                            </div>

                            <div className="col-md-4 mb-4">

                                <label className="form-label fw-semibold">Lecturer</label>

                                <select
                                    className="form-select shadow-sm"
                                    style={{
                                        borderRadius: "10px"
                                    }}
                                    name="lecturer_id"
                                    value={form.lecturer_id}
                                    onChange={handleChange}
                                >

                                    {lecturers.map(l => (

                                        <option
                                            key={l.id}
                                            value={l.id}
                                        >

                                            {l.full_name}

                                        </option>

                                    ))}

                                </select>

                            </div>

                        </div>

                    </form>

                </div>

            </div>

        </div>

    );

}

export default EditCourse;