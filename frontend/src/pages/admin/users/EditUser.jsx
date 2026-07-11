import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getUser, updateUser } from "../../../services/userService";
import {
    FaSave,
    FaTimes
} from "react-icons/fa";

function EditUser() {

    const { id } = useParams();

    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);

    const [form, setForm] = useState({
        full_name: "",
        email: "",
        gender: "Male",
        role_id: "3",
        is_active: 1
    });

    useEffect(() => {
        loadUser();
    }, []);

    const loadUser = async () => {

        try {

            const res = await getUser(id);

            setForm({
                full_name: res.data.full_name,
                email: res.data.email,
                gender: res.data.gender,
                role_id: String(res.data.role_id),
                is_active: res.data.is_active
            });

        } catch (err) {

            console.error(err);

            alert("Unable to load user.");

        } finally {

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

            const res = await updateUser(id, form);

            alert(res.message);

            navigate("/admin/users");

        } catch (err) {

            console.error(err);

            alert("Update failed.");

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
                    <h3 className="mb-0 fw-bold">Edit User</h3>
    
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
                            onClick={() => navigate("/admin/users")}
                            className="btn btn-light rounded-circle shadow-sm"
                            title="Cancel"
                            style={{ width: "46px", height: "46px" }}
                        >
                            <FaTimes className="text-danger"  />
                        </button>
                    </div>
                </div>

                <div className="card-body p-4">
                    <form id="editUserForm" onSubmit={handleSubmit}>

                        <div className="mb-4">
                            <label className="form-label fw-semibold"> Full Name </label>

                            <input
                                type="text"
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

                        <div className="mb-4">
                            <label className="form-label fw-semibold"> Email </label>

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

                        <div className="row">
                            <div className="col-md-6 mb-4">
                                <label className="form-label fw-semibold"> Gender </label>

                                <select
                                    className="form-select shadow-sm"
                                    style={{
                                        borderRadius: "10px"
                                    }}
                                    name="gender"
                                    value={form.gender}
                                    onChange={handleChange}
                                >
                                    <option>Male</option>
                                    <option>Female</option>
                                    <option>Other</option>
                                </select>
                            </div>

                            <div className="col-md-6 mb-4">
                                <label className="form-label fw-semibold"> Role </label>

                                <select
                                    className="form-select shadow-sm"
                                    style={{
                                        borderRadius: "10px"
                                    }}
                                    name="role_id"
                                    value={form.role_id}
                                    onChange={handleChange}
                                >

                                    <option value="1">Administrator</option>
                                    <option value="2">Lecturer</option>
                                    <option value="3">Student</option>

                                </select>

                            </div>

                            <div className="col-md-6 mb-4">
                                <label className="form-label fw-semibold"> Status </label>

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
                                    <option value="0">Disabled</option>
                                </select>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default EditUser;