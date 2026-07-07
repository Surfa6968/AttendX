import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getUser, updateUser } from "../../../services/userService";

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

        <div className="container-fluid">

            <div className="card shadow-sm">

                <div className="card-header">

                    <h3>Edit User</h3>

                </div>

                <div className="card-body">

                    <form onSubmit={handleSubmit}>

                        <div className="mb-3">

                            <label className="form-label">

                                Full Name

                            </label>

                            <input
                                className="form-control"
                                name="full_name"
                                value={form.full_name}
                                onChange={handleChange}
                                required
                            />

                        </div>

                        <div className="mb-3">

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

                        <div className="mb-3">

                            <label className="form-label">

                                Gender

                            </label>

                            <select
                                className="form-select"
                                name="gender"
                                value={form.gender}
                                onChange={handleChange}
                            >

                                <option>Male</option>
                                <option>Female</option>
                                <option>Other</option>

                            </select>

                        </div>

                        <div className="mb-3">

                            <label className="form-label">

                                Role

                            </label>

                            <select
                                className="form-select"
                                name="role_id"
                                value={form.role_id}
                                onChange={handleChange}
                            >

                                <option value="1">Administrator</option>
                                <option value="2">Lecturer</option>
                                <option value="3">Student</option>

                            </select>

                        </div>

                        <div className="mb-4">

                            <label className="form-label">

                                Status

                            </label>

                            <select
                                className="form-select"
                                name="is_active"
                                value={form.is_active}
                                onChange={handleChange}
                            >

                                <option value="1">Active</option>

                                <option value="0">Disabled</option>

                            </select>

                        </div>

                        <button className="btn btn-success">

                            Update User

                        </button>

                    </form>

                </div>

            </div>

        </div>

    );

}

export default EditUser;