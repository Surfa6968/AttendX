import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

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

        <div className="container-fluid">

            <div className="card shadow-sm">

                <div className="card-header">

                    <h3>Edit Course</h3>

                </div>

                <div className="card-body">

                    <form onSubmit={handleSubmit}>

                        <div className="row">

                            <div className="col-md-6 mb-3">

                                <label>Course Code</label>

                                <input
                                    className="form-control"
                                    name="course_code"
                                    value={form.course_code}
                                    onChange={handleChange}
                                    required
                                />

                            </div>

                            <div className="col-md-6 mb-3">

                                <label>Course Name</label>

                                <input
                                    className="form-control"
                                    name="course_name"
                                    value={form.course_name}
                                    onChange={handleChange}
                                    required
                                />

                            </div>

                            <div className="col-12 mb-3">

                                <label>Description</label>

                                <textarea
                                    rows="3"
                                    className="form-control"
                                    name="description"
                                    value={form.description}
                                    onChange={handleChange}
                                />

                            </div>

                            <div className="col-md-3 mb-3">

                                <label>Credits</label>

                                <input
                                    type="number"
                                    className="form-control"
                                    name="credits"
                                    value={form.credits}
                                    onChange={handleChange}
                                />

                            </div>

                            <div className="col-md-3 mb-3">

                                <label>Academic Year</label>

                                <select
                                    className="form-select"
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

                            <div className="col-md-3 mb-3">

                                <label>Semester</label>

                                <select
                                    className="form-select"
                                    name="semester"
                                    value={form.semester}
                                    onChange={handleChange}
                                >

                                    <option value="1">Semester 1</option>
                                    <option value="2">Semester 2</option>

                                </select>

                            </div>

                            <div className="col-md-3 mb-3">

                                <label>Status</label>

                                <select
                                    className="form-select"
                                    name="is_active"
                                    value={form.is_active}
                                    onChange={handleChange}
                                >

                                    <option value="1">Active</option>
                                    <option value="0">Inactive</option>

                                </select>

                            </div>

                            <div className="col-md-4 mb-3">

                                <label>Faculty</label>

                                <select
                                    className="form-select"
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

                            <div className="col-md-4 mb-3">

                                <label>Department</label>

                                <select
                                    className="form-select"
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

                                <label>Lecturer</label>

                                <select
                                    className="form-select"
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

                        <button className="btn btn-success">

                            Update Course

                        </button>

                    </form>

                </div>

            </div>

        </div>

    );

}

export default EditCourse;