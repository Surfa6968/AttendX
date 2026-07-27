import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { createCourse } from "../../../services/courseService";
import { getFaculties } from "../../../services/facultyService";
import { getDepartments } from "../../../services/departmentService";
import axios from "axios";

function AddCourse() {

    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);

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

        year_of_study: "",
        semester: ""

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

            const lecturerRes = await axios.get(

                "http://localhost/AttendX/backend/api/admin/lecturers/list.php",

                {

                    withCredentials: true

                }

            );

            setLecturers(lecturerRes.data.data);

        }

        catch (err) {

            console.error(err);

            alert("Failed to load dropdown data.");

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

            const res = await createCourse(form);

            alert(res.message);

            navigate("/admin/courses");

        }

        catch (err) {

            console.error(err);

            alert(

                err.response?.data?.message ||

                "Failed to create course."

            );

        }

        finally {

            setLoading(false);

        }

    };

    return (

        <div className="container py-4">
            <div 
                className="card border-0 shadow-lg" 
                style={{ borderRadius: "18px" }}
            >

                <div className="card-header border-0 d-flex justify-content-between align-items-center"
                    style={{
                        background:"linear-gradient(135deg,#2563eb,#1d4ed8)",
                        color:"#fff",
                        borderTopLeftRadius:"18px",
                        borderTopRightRadius:"18px",
                        padding:"18px 24px"
                    }}
                >
                    <h3>Add Course</h3>
                </div>

                <div className="card-body py-4">
                    <form onSubmit={handleSubmit}>
                        <div className="row">
                            <div className="col-md-6 mb-4">
                                <label className="form-label fw-semibold">
                                    Course Code
                                </label>

                                <input
                                    type="text"
                                    className="form-control shadow-sm"
                                    style={{borderRadius:"10px"}}
                                    name="course_code"
                                    value={form.course_code}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="col-md-6 mb-4">
                                <label className="form-label fw-semibold">
                                    Course Name
                                </label>

                                <input
                                    type="text"
                                    className="form-control shadow-sm"
                                    style={{borderRadius:"10px"}}
                                    name="course_name"
                                    value={form.course_name}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="col-12 mb-4">
                                <label className="form-label fw-semibold">
                                    Description
                                </label>

                                <textarea
                                    rows="3"
                                    className="form-control shadow-sm"
                                    style={{borderRadius:"10px"}}
                                    name="description"
                                    value={form.description}
                                    onChange={handleChange}
                                ></textarea>
                            </div>

                            <div className="col-md-4 mb-4">
                                <label className="form-label fw-semibold">
                                    Credits
                                </label>

                                <input
                                    type="number"
                                    className="form-control shadow-sm"
                                    style={{borderRadius:"10px"}}
                                    name="credits"
                                    value={form.credits}
                                    onChange={handleChange}
                                    min="1"
                                    required
                                />

                            </div>

                            <div className="col-md-4 mb-4">
                                <label className="form-label fw-semibold">
                                    Year of Study
                                </label>

                                <select
                                    className="form-select shadow-sm"
                                    style={{borderRadius:"10px"}}
                                    name="year_of_study"
                                    value={form.year_of_study}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="">Select</option>
                                    <option value="1">Year 1</option>
                                    <option value="2">Year 2</option>
                                    <option value="3">Year 3</option>
                                    <option value="4">Year 4</option>
                                </select>
                            </div>

                            <div className="col-md-4 mb-4">
                                <label className="form-label fw-semibold">
                                    Semester
                                </label>

                                <select
                                    className="form-select shadow-sm"
                                    style={{borderRadius:"10px"}}
                                    name="semester"
                                    value={form.semester}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="">Select</option>
                                    <option value="1">Semester 1</option>
                                    <option value="2">Semester 2</option>
                                </select>
                            </div>

                            <div className="col-md-4 mb-4">
                                <label className="form-label fw-semibold">
                                    Faculty
                                </label>

                                <select
                                    className="form-select shadow-sm"
                                    style={{borderRadius:"10px"}}
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

                            <div className="col-md-4 mb-4">
                                <label className="form-label fw-semibold">
                                    Department
                                </label>

                                <select
                                    className="form-select shadow-sm"
                                    style={{borderRadius:"10px"}}
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
                                            )
                                        )
                                    }
                                </select>
                            </div>

                            <div className="col-md-4 mb-4">
                                <label className="form-label fw-semibold">
                                    Lecturer
                                </label>

                                <select
                                    className="form-select shadow-sm"
                                    style={{borderRadius:"10px"}}
                                    name="lecturer_id"
                                    value={form.lecturer_id}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="">Select Lecturer</option>
                                    {
                                        lecturers.map(lecturer => (
                                            <option
                                                key={lecturer.id}
                                                value={lecturer.id}
                                            >
                                                {lecturer.full_name}
                                            </option>
                                        ))
                                    }
                                </select>
                            </div>
                        </div>

                        <div className="col-12 mt-4">
                            <div className="d-flex justify-content-end gap-3">
                                <button
                                    type="submit"
                                    className="btn btn-primary px-5"
                                    disabled={loading}
                                >
                                    {
                                        loading
                                            ? "Saving..."
                                            : "Create Course"
                                    }
                                </button>
                                
                                <button
                                    type="button"
                                    className="btn btn-secondary px-4"
                                    onClick={() => navigate("/admin/courses")}
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

export default AddCourse;