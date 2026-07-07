import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
    getLecturer,
    updateLecturer
} from "../../../services/lecturerService";

import {
    getFaculties
} from "../../../services/facultyService";

import {
    getDepartments
} from "../../../services/departmentService";

function EditLecturer() {

    const { id } = useParams();

    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);

    const [faculties, setFaculties] = useState([]);
    const [departments, setDepartments] = useState([]);

    const [form, setForm] = useState({

        full_name: "",
        email: "",
        gender: "",

        employee_no: "",

        faculty_id: "",
        department_id: "",

        designation: "",
        qualification: "",
        specialization: "",
        office_room: "",
        phone: "",
        joined_date: "",

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

            const lecturerRes = await getLecturer(id);

            setForm(lecturerRes.data);

        }

        catch (err) {

            console.error(err);

            alert("Unable to load lecturer.");

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

            const res = await updateLecturer(id, form);

            alert(res.message);

            navigate("/admin/lecturers");

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

                    <h3>Edit Lecturer</h3>

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

                                <label>Employee No</label>

                                <input
                                    className="form-control"
                                    name="employee_no"
                                    value={form.employee_no}
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

                                <label>Designation</label>

                                <input
                                    className="form-control"
                                    name="designation"
                                    value={form.designation}
                                    onChange={handleChange}
                                />

                            </div>

                                                        <div className="col-md-6 mb-3">

                                <label>Qualification</label>

                                <input
                                    className="form-control"
                                    name="qualification"
                                    value={form.qualification}
                                    onChange={handleChange}
                                />

                            </div>

                            <div className="col-md-6 mb-3">

                                <label>Specialization</label>

                                <input
                                    className="form-control"
                                    name="specialization"
                                    value={form.specialization}
                                    onChange={handleChange}
                                />

                            </div>

                            <div className="col-md-6 mb-3">

                                <label>Office Room</label>

                                <input
                                    className="form-control"
                                    name="office_room"
                                    value={form.office_room}
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

                            <div className="col-md-6 mb-3">

                                <label>Joined Date</label>

                                <input
                                    type="date"
                                    className="form-control"
                                    name="joined_date"
                                    value={form.joined_date}
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

                            Update Lecturer

                        </button>

                    </form>

                </div>

            </div>

        </div>

    );

}

export default EditLecturer;