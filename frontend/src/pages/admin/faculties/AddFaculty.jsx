import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createFaculty } from "../../../services/facultyService";

function AddFaculty() {

    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);

    const [form, setForm] = useState({
        faculty_name: "",
        faculty_code: ""
    });

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

            const res = await createFaculty(form);

            alert(res.message);

            navigate("/admin/faculties");

        } catch (err) {

            console.error(err);

            alert(
                err.response?.data?.message ||
                "Failed to create faculty."
            );

        } finally {

            setLoading(false);

        }

    };

    return (

        <div className="container-fluid">

            <div className="card shadow-sm">

                <div className="card-header">

                    <h3>Add Faculty</h3>

                </div>

                <div className="card-body">

                    <form onSubmit={handleSubmit}>

                        <div className="mb-3">

                            <label className="form-label">
                                Faculty Name
                            </label>

                            <input
                                type="text"
                                className="form-control"
                                name="faculty_name"
                                value={form.faculty_name}
                                onChange={handleChange}
                                required
                            />

                        </div>

                        <div className="mb-4">

                            <label className="form-label">
                                Faculty Code
                            </label>

                            <input
                                type="text"
                                className="form-control"
                                name="faculty_code"
                                value={form.faculty_code}
                                onChange={handleChange}
                                required
                            />

                        </div>

                        <button
                            type="submit"
                            className="btn btn-primary"
                            disabled={loading}
                        >

                            {loading
                                ? "Saving..."
                                : "Create Faculty"}

                        </button>

                    </form>

                </div>

            </div>

        </div>

    );

}

export default AddFaculty;