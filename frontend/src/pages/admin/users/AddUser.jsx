import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createUser } from "../../../services/userService";

function AddUser() {

    const navigate = useNavigate();

    const [form, setForm] = useState({
        full_name: "",
        email: "",
        password: "",
        gender: "Male",
        role_id: "3"
    });

    const handleChange = (e) => {

        setForm({
            ...form,
            [e.target.name]: e.target.value
        });

    };

    const handleSubmit = async (e) => {

       e.preventDefault();

       try {
              const result = await createUser(form);
              if (result.success) {
              alert(result.message);
              navigate("/admin/users");
              } else {
              alert(result.message);
              }
       } catch (error) {
              console.error(error);
              alert("Something went wrong.");
       }
    };

    return (

        <div className="container-fluid">

            <div className="card shadow-sm">

                <div className="card-header">

                    <h3>Add User</h3>

                </div>

                <div className="card-body">

                    <form onSubmit={handleSubmit}>

                        <div className="mb-3">

                            <label className="form-label">

                                Full Name

                            </label>

                            <input
                                type="text"
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

                                Password

                            </label>

                            <input
                                type="password"
                                className="form-control"
                                name="password"
                                value={form.password}
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

                        <div className="mb-4">

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

                        <button
                            className="btn btn-primary"
                        >

                            Save User

                        </button>

                    </form>

                </div>

            </div>

        </div>

    );

}

export default AddUser;