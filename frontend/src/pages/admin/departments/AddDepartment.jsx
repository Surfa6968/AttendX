import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { createDepartment } from "../../../services/departmentService";
import { getFaculties } from "../../../services/facultyService";

function AddDepartment(){

    const navigate = useNavigate();

    const [faculties,setFaculties] = useState([]);

    const [loading,setLoading] = useState(false);

    const [form,setForm] = useState({

        faculty_id:"",
        department_name:"",
        department_code:""

    });

    useEffect(()=>{

        loadFaculties();

    },[]);

    const loadFaculties = async()=>{

        try{

            const res = await getFaculties();

            setFaculties(res.data);

        }catch(err){

            console.error(err);

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

        setLoading(true);

        try{

            const res = await createDepartment(form);

            alert(res.message);

            navigate("/admin/departments");

        }catch(err){

            console.error(err);

            alert(
                err.response?.data?.message ||
                "Failed to create department."
            );

        }finally{

            setLoading(false);

        }

    };

    return(

        <div className="container-fluid">

            <div className="card shadow-sm">

                <div className="card-header">

                    <h3>Add Department</h3>

                </div>

                <div className="card-body">

                    <form onSubmit={handleSubmit}>

                        <div className="mb-3">

                            <label className="form-label">

                                Faculty

                            </label>

                            <select
                                className="form-select"
                                name="faculty_id"
                                value={form.faculty_id}
                                onChange={handleChange}
                                required
                            >

                                <option value="">

                                    Select Faculty

                                </option>

                                {

                                    faculties.map(faculty=>(

                                        <option
                                            key={faculty.id}
                                            value={faculty.id}
                                        >

                                            {faculty.faculty_name}

                                        </option>

                                    ))

                                }

                            </select>

                        </div>

                        <div className="mb-3">

                            <label className="form-label">

                                Department Name

                            </label>

                            <input
                                className="form-control"
                                name="department_name"
                                value={form.department_name}
                                onChange={handleChange}
                                required
                            />

                        </div>

                        <div className="mb-4">

                            <label className="form-label">

                                Department Code

                            </label>

                            <input
                                className="form-control"
                                name="department_code"
                                value={form.department_code}
                                onChange={handleChange}
                                required
                            />

                        </div>

                        <button
                            className="btn btn-primary"
                            disabled={loading}
                        >

                            {

                                loading

                                ?

                                "Saving..."

                                :

                                "Create Department"

                            }

                        </button>

                    </form>

                </div>

            </div>

        </div>

    );

}

export default AddDepartment;