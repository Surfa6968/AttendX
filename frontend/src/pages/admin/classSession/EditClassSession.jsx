import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
    FaSave,
    FaTimes
} from "react-icons/fa";

import {
    getClassSession,
    updateClassSession
} from "../../../services/classSessionService";

function EditClassSession() {

    const navigate = useNavigate();

    const { id } = useParams();

    const [loading, setLoading] = useState(false);

    const [session, setSession] = useState(null);

    const [formData, setFormData] = useState({

        session_date: "",

        session_status: "",

        remarks: ""

    });

    useEffect(() => {

        loadSession();

    }, []);

    /*
    |--------------------------------------------------------------------------
    | Load Class Session
    |--------------------------------------------------------------------------
    */

    const loadSession = async () => {

        try {

            const res = await getClassSession(id);

            const data = res.data;

            setSession(data);

            setFormData({

                session_date: data.session_date || "",

                session_status: data.session_status || "Scheduled",

                remarks: data.remarks || ""

            });

        }

        catch (err) {

            console.error(err);

            alert("Failed to load class session.");

        }

    };

    /*
    |--------------------------------------------------------------------------
    | Handle Change
    |--------------------------------------------------------------------------
    */

    const handleChange = (e) => {

        setFormData({

            ...formData,

            [e.target.name]: e.target.value

        });

    };

    /*
    |--------------------------------------------------------------------------
    | Submit
    |--------------------------------------------------------------------------
    */

    const handleSubmit = async (e) => {

        e.preventDefault();

        setLoading(true);

        try {

            const res = await updateClassSession(

                id,

                formData

            );

            alert(res.message);

            navigate("/admin/classSession");

        }

        catch (err) {

            console.error(err);

            alert(

                err.response?.data?.message ||

                "Failed to update class session."

            );

        }

        finally {

            setLoading(false);

        }

    };

    return (

    <div className="container py-4">

        <div
            className="card border-0 shadow-lg"
            style={{ borderRadius: "18px" }}
        >

            {/* Header */}

            <div
                className="card-header border-0 d-flex justify-content-between align-items-center"
                style={{
                    background: "linear-gradient(135deg,#2563eb,#1d4ed8)",
                    color: "#fff",
                    borderTopLeftRadius: "18px",
                    borderTopRightRadius: "18px",
                    padding: "18px 24px"
                }}
            >

                <h3 className="mb-0 fw-bold">

                    Edit Class Session

                </h3>

                <div className="d-flex gap-2">

                    <button
                        type="submit"
                        form="editClassSessionForm"
                        className="btn btn-light rounded-circle shadow-sm"
                        title="Save"
                        style={{
                            width: "46px",
                            height: "46px"
                        }}
                        disabled={loading}
                    >

                        <FaSave className="text-success" />

                    </button>

                    <button
                        type="button"
                        className="btn btn-light rounded-circle shadow-sm"
                        title="Cancel"
                        style={{
                            width: "46px",
                            height: "46px"
                        }}
                        onClick={() =>
                            navigate("/admin/classSession")
                        }
                    >

                        <FaTimes className="text-danger" />

                    </button>

                </div>

            </div>

            <div className="card-body p-4">

                <form

                    id="editClassSessionForm"

                    onSubmit={handleSubmit}

                >

                    <div className="row">

                        {/* Course */}

                        <div className="col-md-6 mb-4">

                            <label className="form-label">

                                Course

                            </label>

                            <input
                                className="form-control"
                                readOnly
                                value={
                                    session
                                        ? `${session.course_code} - ${session.course_name}`
                                        : ""
                                }
                            />

                        </div>

                        {/* Lecturer */}

                        <div className="col-md-6 mb-4">

                            <label className="form-label">

                                Lecturer

                            </label>

                            <input
                                className="form-control"
                                readOnly
                                value={session?.lecturer_name || ""}
                            />

                        </div>

                        {/* Room */}

                        <div className="col-md-4 mb-4">

                            <label className="form-label">

                                Room

                            </label>

                            <input
                                className="form-control"
                                readOnly
                                value={session?.room || ""}
                            />

                        </div>

                        {/* Start */}

                        <div className="col-md-4 mb-4">

                            <label className="form-label">

                                Start Time

                            </label>

                            <input
                                className="form-control"
                                readOnly
                                value={session?.start_time || ""}
                            />

                        </div>

                        {/* End */}

                        <div className="col-md-4 mb-4">

                            <label className="form-label">

                                End Time

                            </label>

                            <input
                                className="form-control"
                                readOnly
                                value={session?.end_time || ""}
                            />

                        </div>

                        {/* Session Date */}

                        <div className="col-md-4 mb-4">

                            <label className="form-label">

                                Session Date

                            </label>

                            <input
                                type="date"
                                className="form-control"
                                name="session_date"
                                value={formData.session_date}
                                onChange={handleChange}
                                required
                            />

                        </div>

                        {/* Status */}

                        <div className="col-md-4 mb-4">

                            <label className="form-label">

                                Session Status

                            </label>

                            <select
                                className="form-select"
                                name="session_status"
                                value={formData.session_status}
                                onChange={handleChange}
                                required
                            >

                                <option value="Scheduled">

                                    Scheduled

                                </option>

                                <option value="Started">

                                    Started

                                </option>

                                <option value="Completed">

                                    Completed

                                </option>

                                <option value="Cancelled">

                                    Cancelled

                                </option>

                            </select>

                        </div>

                        {/* Remarks */}

                        <div className="col-md-12 mb-4">

                            <label className="form-label">

                                Remarks

                            </label>

                            <textarea
                                className="form-control"
                                rows="4"
                                name="remarks"
                                value={formData.remarks}
                                onChange={handleChange}
                                placeholder="Remarks"
                            />

                        </div>

                    </div>

                </form>

            </div>

        </div>

    </div>

);

}

export default EditClassSession;