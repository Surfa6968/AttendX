import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
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

        <div className="container-fluid">

            <div className="card shadow-sm">

                <div className="card-header">
                    <h3>Edit Faculty</h3>
                </div>

                <div className="card-body">

                    <form onSubmit={handleSubmit}>

                        <div className="mb-3">

                            <label className="form-label">
                                Faculty Name
                            </label>

                            <input
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
                                className="form-control"
                                name="faculty_code"
                                value={form.faculty_code}
                                onChange={handleChange}
                                required
                            />

                        </div>

                        <button className="btn btn-success">
                            Update Faculty
                        </button>

                    </form>

                </div>

            </div>

        </div>

    );

}

export default EditFaculty;