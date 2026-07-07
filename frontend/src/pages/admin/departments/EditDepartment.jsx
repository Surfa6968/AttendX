import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
    getDepartment,
    updateDepartment
} from "../../../services/departmentService";

import {
    getFaculties
} from "../../../services/facultyService";

function EditDepartment(){

    const { id } = useParams();

    const navigate = useNavigate();

    const [loading,setLoading] = useState(true);

    const [faculties,setFaculties] = useState([]);

    const [form,setForm] = useState({

        faculty_id:"",
        department_name:"",
        department_code:""

    });

    useEffect(()=>{

        loadData();

    },[]);

    const loadData = async()=>{

        try{

            const facultyRes = await getFaculties();

            setFaculties(facultyRes.data);

            const departmentRes = await getDepartment(id);

            setForm(departmentRes.data);

        }catch(err){

            console.error(err);

            alert("Unable to load department.");

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

            const res = await updateDepartment(id,form);

            alert(res.message);

            navigate("/admin/departments");

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

                    <h3>Edit Department</h3>

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

                        <button className="btn btn-success">

                            Update Department

                        </button>

                    </form>

                </div>

            </div>

        </div>

    );

}

export default EditDepartment;