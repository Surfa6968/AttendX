import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
    FaSave,
    FaTimes
} from "react-icons/fa";

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
                    <h3 className="mb-0 fw-bold">Edit Department</h3>
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
                            onClick={() => navigate("/admin/departments")}
                            className="btn btn-light rounded-circle shadow-sm"
                            title="Cancel"
                            style={{ width: "46px", height: "46px" }}
                        >
                            <FaTimes className="text-danger"  />
                        </button>
                    </div>
                </div>

                <div className="card-body py-4">
                    <form id="editDepartmentForm" onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <label className="form-label fw-semibold">
                                Faculty
                            </label>

                            <select

                               className="form-select shadow-sm"
                                    style={{
                                        borderRadius: "10px"
                                    }}

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

                        <div className="mb-4">

                            <label className="form-label fw-semibold">

                                Department Name

                            </label>

                            <input

                                className="form-control shadow-sm"
                                style={{
                                    borderRadius: "10px"
                                }}

                                name="department_name"

                                value={form.department_name}

                                onChange={handleChange}

                                required

                            />

                        </div>

                        <div className="mb-4">

                            <label className="form-label fw-semibold">

                                Department Code

                            </label>

                            <input

                                className="form-control shadow-sm"
                                style={{
                                    borderRadius: "10px"
                                }}

                                name="department_code"

                                value={form.department_code}

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

export default EditDepartment;