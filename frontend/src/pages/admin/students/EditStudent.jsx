import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
    getStudent,
    updateStudent
} from "../../../services/studentService";

import {
    getFaculties
} from "../../../services/facultyService";

import {
    getDepartments
} from "../../../services/departmentService";

function EditStudent() {

    const { id } = useParams();

    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);

    const [faculties, setFaculties] = useState([]);
    const [departments, setDepartments] = useState([]);

    const [form, setForm] = useState({

        full_name: "",
        email: "",
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
        guardian_phone: "",

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

            const studentRes = await getStudent(id);

            setForm(studentRes.data);

        }

        catch (err) {

            console.error(err);

            alert("Unable to load student.");

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

            const res = await updateStudent(id, form);

            alert(res.message);

            navigate("/admin/students");

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

                    <h3>Edit Student</h3>

                </div>

                <div className="card-body">

                    <form onSubmit={handleSubmit}>

                        <div className="row">

                            <div className="col-md-6 mb-3">

                                <label>Full Name</label>

                                <input
                                    className="form-control"
                                    name="full_name"
                                    value={form.full_name}
                                    onChange={handleChange}
                                    required
                                />

                            </div>

                            <div className="col-md-6 mb-3">

                                <label>Email</label>

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

                                <label>Gender</label>

                                <select
                                    className="form-select"
                                    name="gender"
                                    value={form.gender}
                                    onChange={handleChange}
                                >

                                    <option value="Male">Male</option>

                                    <option value="Female">Female</option>

                                </select>

                            </div>

                            <div className="col-md-6 mb-3">

                                <label>Registration No</label>

                                <input
                                    className="form-control"
                                    name="registration_no"
                                    value={form.registration_no}
                                    onChange={handleChange}
                                />

                            </div>

                            <div className="col-md-6 mb-3">

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

                            <div className="col-md-6 mb-3">

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

                                                        <div className="col-md-6 mb-3">

                                <label>Year of Study</label>

                                <select
                                    className="form-select"
                                    name="year_of_study"
                                    value={form.year_of_study}
                                    onChange={handleChange}
                                >

                                    <option value="1">Year 1</option>
                                    <option value="2">Year 2</option>
                                    <option value="3">Year 3</option>
                                    <option value="4">Year 4</option>

                                </select>

                            </div>

                            <div className="col-md-6 mb-3">

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

                            <div className="col-md-6 mb-3">

                                <label>Intake Year</label>

                                <input
                                    type="number"
                                    className="form-control"
                                    name="intake_year"
                                    value={form.intake_year}
                                    onChange={handleChange}
                                />

                            </div>

                            <div className="col-md-6 mb-3">

                                <label>Phone</label>

                                <input
                                    className="form-control"
                                    name="phone"
                                    value={form.phone}
                                    onChange={handleChange}
                                />

                            </div>

                            <div className="col-md-12 mb-3">

                                <label>Address</label>

                                <textarea
                                    className="form-control"
                                    rows="3"
                                    name="address"
                                    value={form.address}
                                    onChange={handleChange}
                                />

                            </div>

                            <div className="col-md-6 mb-3">

                                <label>Guardian Name</label>

                                <input
                                    className="form-control"
                                    name="guardian_name"
                                    value={form.guardian_name}
                                    onChange={handleChange}
                                />

                            </div>

                            <div className="col-md-6 mb-3">

                                <label>Guardian Phone</label>

                                <input
                                    className="form-control"
                                    name="guardian_phone"
                                    value={form.guardian_phone}
                                    onChange={handleChange}
                                />

                            </div>

                            <div className="col-md-6 mb-4">

                                <label>Status</label>

                                <select
                                    className="form-select"
                                    name="is_active"
                                    value={form.is_active}
                                    onChange={handleChange}
                                >

                                    <option value="1">

                                        Active

                                    </option>

                                    <option value="0">

                                        Inactive

                                    </option>

                                </select>

                            </div>

                        </div>

                        <button
                            type="submit"
                            className="btn btn-success"
                        >

                            Update Student

                        </button>

                    </form>

                </div>

            </div>

        </div>

    );

}

export default EditStudent;