import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
    FaSave,
    FaTimes
} from "react-icons/fa";

import {
    getFaculty,
    updateFaculty
} from "../../../services/facultyService";

function EditFaculty() {

    const { id } = useParams();
    const navigate = useNavigate();

    const [loading,setLoading] = useState(true);

    const [form,setForm] = useState({
        faculty_name:"",
        faculty_code:""
    });

    useEffect(()=>{
        loadFaculty();
    },[]);

    const loadFaculty = async()=>{

        try{

            const res = await getFaculty(id);

            setForm(res.data);

        }catch(err){

            console.error(err);

            alert("Unable to load faculty.");

        }finally{

            setLoading(false);

        }

    };

    const handleChange=(e)=>{

        setForm({
            ...form,
            [e.target.name]:e.target.value
        });

    };

    const handleSubmit=async(e)=>{

        e.preventDefault();

        try{

            const res = await updateFaculty(id,form);

            alert(res.message);

            navigate("/admin/faculties");

        }catch(err){

            console.error(err);

            alert(
                err.response?.data?.message ||
                "Update failed."
            );

        }

    };

    if(loading){

        return(
            <div className="text-center mt-5">
                <div className="spinner-border text-primary"></div>
            </div>
        );

    }

    return(

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
                    <h3 className="mb-0 fw-bold">Edit Faculty</h3>

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
                            onClick={() => navigate("/admin/faculties")}
                            className="btn btn-light rounded-circle shadow-sm"
                            title="Cancel"
                            style={{ width: "46px", height: "46px" }}
                        >
                            <FaTimes className="text-danger"  />
                        </button>
                    </div>
                </div>

                <div className="card-body py-4">
                    <form id="editFacultyForm" onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <label className="form-label fw-semibold"> Faculty Name </label>

                            <input
                                className="form-control shadow-sm"
                                style={{
                                    borderRadius: "10px"
                                }}
                                name="faculty_name"
                                value={form.faculty_name}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="mb-4">
                            <label className="form-label fw-semibold"> Faculty Code </label>

                            <input
                                className="form-control shadow-sm"
                                style={{
                                    borderRadius: "10px"
                                }}
                                name="faculty_code"
                                value={form.faculty_code}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default EditFaculty;