import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
    FaSave,
    FaTimes
} from "react-icons/fa";

import {
    createClassSession
} from "../../../services/classSessionService";

import {
    getTimetables
} from "../../../services/timetableService";

function CreateClassSession() {

    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);

    const [timetables, setTimetables] = useState([]);

    const [selectedTimetable, setSelectedTimetable] = useState(null);

    const [formData, setFormData] = useState({

        timetable_id: "",

        session_date: "",

        remarks: ""

    });

    useEffect(() => {

        loadTimetables();

    }, []);

    /*
    |--------------------------------------------------------------------------
    | Load Timetables
    |--------------------------------------------------------------------------
    */

    const loadTimetables = async () => {

        try {

            const res = await getTimetables();

            setTimetables(res.data || []);

        }

        catch (err) {

            console.error(err);

            alert("Failed to load timetables.");

        }

    };

    /*
    |--------------------------------------------------------------------------
    | Handle Timetable Selection
    |--------------------------------------------------------------------------
    */

    const handleTimetableChange = (e) => {

        const timetableId = Number(e.target.value);

        const timetable = timetables.find(

            t => t.id === timetableId

        );

        setSelectedTimetable(timetable);

        setFormData({

            ...formData,

            timetable_id: timetableId

        });

    };

    /*
    |--------------------------------------------------------------------------
    | Handle Input Change
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
    | Handle Submit
    |--------------------------------------------------------------------------
    */

    const handleSubmit = async (e) => {

        e.preventDefault();

        setLoading(true);

        try {

            const res = await createClassSession(formData);

            alert(res.message);

            navigate("/admin/classSession");

        }

        catch (err) {

            console.error(err);

            alert(

                err.response?.data?.message ||

                "Failed to create class session."

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

                    Create Class Session

                </h3>

                <div className="d-flex gap-2">

                    <button
                        type="submit"
                        form="createClassSessionForm"
                        className="btn btn-light rounded-circle shadow-sm"
                        title="Save"
                        style={{
                            width: "46px",
                            height: "46px"
                        }}
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

                    id="createClassSessionForm"

                    onSubmit={handleSubmit}

                >

                    <div className="row">

                        {/* Timetable */}

                        <div className="col-md-12 mb-4">

                            <label className="form-label">

                                Timetable

                            </label>

                            <select

                                className="form-select"

                                value={formData.timetable_id}

                                onChange={handleTimetableChange}

                                required

                            >

                                <option value="">

                                    Select Timetable

                                </option>

                                {

                                    timetables.map((timetable) => (

                                        <option

                                            key={timetable.id}

                                            value={timetable.id}

                                        >

                                            {timetable.course_code} | {timetable.day_of_week} | {timetable.start_time} - {timetable.end_time}

                                        </option>

                                    ))

                                }

                            </select>

                        </div>

                        {/* Course */}

                        <div className="col-md-6 mb-4">

                            <label className="form-label">

                                Course

                            </label>

                            <input

                                className="form-control"

                                readOnly

                                value={

                                    selectedTimetable

                                        ? `${selectedTimetable.course_code} - ${selectedTimetable.course_name}`

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

                                value={

                                    selectedTimetable?.lecturer_name || ""

                                }

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

                                value={

                                    selectedTimetable?.room || ""

                                }

                            />

                        </div>

                        {/* Start Time */}

                        <div className="col-md-4 mb-4">

                            <label className="form-label">

                                Start Time

                            </label>

                            <input

                                className="form-control"

                                readOnly

                                value={

                                    selectedTimetable?.start_time || ""

                                }

                            />

                        </div>

                        {/* End Time */}

                        <div className="col-md-4 mb-4">

                            <label className="form-label">

                                End Time

                            </label>

                            <input

                                className="form-control"

                                readOnly

                                value={

                                    selectedTimetable?.end_time || ""

                                }

                            />

                        </div>

                        {/* Session Date */}

                        <div className="col-md-6 mb-4">

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

                        {/* Remarks */}

                        <div className="col-md-6 mb-4">

                            <label className="form-label">

                                Remarks

                            </label>

                            <textarea

                                className="form-control"

                                rows="3"

                                name="remarks"

                                value={formData.remarks}

                                onChange={handleChange}

                                placeholder="Optional remarks"

                            />

                        </div>

                    </div>

                </form>

            </div>

        </div>

    </div>

);
}

export default CreateClassSession;