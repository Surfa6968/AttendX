import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
    FaSave,
    FaTimes
} from "react-icons/fa";

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
                    <h3 className="mb-0 fw-bold">Edit Lecturer</h3>
    
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
                            onClick={() => navigate("/admin/lecturers")}
                            className="btn btn-light rounded-circle shadow-sm"
                            title="Cancel"
                            style={{ width: "46px", height: "46px" }}
                        >
                            <FaTimes className="text-danger"  />
                        </button>
                    </div>
                </div>

                <div className="card-body py-4">
                    <form id="editLecturerForm" onSubmit={handleSubmit}>

                        <div className="row">
                            <div className="col-md-6 mb-4">
                                <label className="form-label fw-semibold">Full Name</label>

                                <input
                                    className="form-control shadow-sm"
                                    style={{
                                        borderRadius: "10px"
                                    }}
                                        name="full_name"
                                    value={form.full_name}
                                    onChange={handleChange}
                                    required
                                />

                            </div>

                            <div className="col-md-6 mb-4">

                                <label className="form-label fw-semibold">Email</label>

                                <input
                                    type="email"
                                    className="form-control shadow-sm"
                                    style={{
                                        borderRadius: "10px"
                                    }}
                                    name="email"
                                    value={form.email}
                                    onChange={handleChange}
                                    required
                                />

                            </div>

                            <div className="col-md-6 mb-4">

                                <label className="form-label fw-semibold">Gender</label>

                                <select
                                    className="form-select shadow-sm"
                                    style={{
                                        borderRadius: "10px"
                                    }}
                                    name="gender"
                                    value={form.gender}
                                    onChange={handleChange}
                                >

                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>

                                </select>

                            </div>

                            <div className="col-md-6 mb-4">

                                <label className="form-label fw-semibold">Employee No</label>

                                <input
                                    className="form-control shadow-sm"
                                    style={{
                                        borderRadius: "10px"
                                    }}
                                    name="employee_no"
                                    value={form.employee_no}
                                    onChange={handleChange}
                                />

                            </div>

                            <div className="col-md-6 mb-4">

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

                            <div className="col-md-6 mb-4">

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

                            <div className="col-md-6 mb-4">

                                <label className="form-label fw-semibold">Designation</label>

                                <input
                                    className="form-control shadow-sm"
                                    style={{
                                        borderRadius: "10px"
                                    }}
                                    name="designation"
                                    value={form.designation}
                                    onChange={handleChange}
                                />

                            </div>

                            <div className="col-md-6 mb-4">

                                <label className="form-label fw-semibold">Qualification</label>

                                <input
                                    className="form-control shadow-sm"
                                    style={{
                                        borderRadius: "10px"
                                    }}
                                    name="qualification"
                                    value={form.qualification}
                                    onChange={handleChange}
                                />

                            </div>

                            <div className="col-md-6 mb-4">

                                <label className="form-label fw-semibold">Specialization</label>

                                <input
                                    className="form-control shadow-sm"
                                    style={{
                                        borderRadius: "10px"
                                    }}
                                    name="specialization"
                                    value={form.specialization}
                                    onChange={handleChange}
                                />

                            </div>

                            <div className="col-md-6 mb-4">

                                <label className="form-label fw-semibold">Office Room</label>

                                <input
                                    className="form-control shadow-sm"
                                    style={{
                                        borderRadius: "10px"
                                    }}
                                    name="office_room"
                                    value={form.office_room}
                                    onChange={handleChange}
                                />

                            </div>

                            <div className="col-md-6 mb-4">

                                <label className="form-label fw-semibold">Phone</label>

                                <input
                                    className="form-control shadow-sm"
                                    style={{
                                        borderRadius: "10px"
                                    }}
                                    name="phone"
                                    value={form.phone}
                                    onChange={handleChange}
                                />

                            </div>

                            <div className="col-md-6 mb-4">

                                <label className="form-label fw-semibold">Joined Date</label>

                                <input
                                    type="date"
                                    className="form-control shadow-sm"
                                    style={{
                                        borderRadius: "10px"
                                    }}
                                    name="joined_date"
                                    value={form.joined_date}
                                    onChange={handleChange}
                                />

                            </div>

                            <div className="col-md-6 mb-4">

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
                                    <option value="1">
                                        Active
                                    </option>
                                    <option value="0">
                                        Inactive
                                    </option>
                                </select>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default EditLecturer;