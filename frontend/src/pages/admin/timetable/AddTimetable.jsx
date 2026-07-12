import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { createTimetable } from "../../../services/timetableService";
import { getCourses } from "../../../services/courseService";
import { getLecturers } from "../../../services/lecturerService";

function AddTimetable() {

    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [courses, setCourses] = useState([]);
    const [lecturers, setLecturers] = useState([]);

    const [formData, setFormData] = useState({

        course_id: "",
        lecturer_id: "",
        day_of_week: "",
        start_time: "",
        end_time: "",
        room: "",
        academic_year: "",
        year_of_study: "",
        semester: ""
    });

    useEffect(() => {
        loadCourses();
        loadLecturers();
    }, []);

    /*
    |--------------------------------------------------------------------------
    | Load Courses
    |--------------------------------------------------------------------------
    */

    const loadCourses = async () => {

        try {

            const res = await getCourses();

            setCourses(res.data || []);

        }

        catch (err) {
              console.error(err);
              console.log(err.response);
              console.log(err.response?.data);
              alert(err.response?.data?.message || "Failed to create timetable.");
        }
    };

    /*
    |--------------------------------------------------------------------------
    | Load Lecturers
    |--------------------------------------------------------------------------
    */

    const loadLecturers = async () => {

        try {

            const res = await getLecturers();

            setLecturers(res.data || []);

        }

        catch (err) {

            console.error(err);

            alert("Failed to load lecturers.");

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
    | Handle Submit
    |--------------------------------------------------------------------------
    */

    const handleSubmit = async (e) => {

        e.preventDefault();

        setLoading(true);

        try {

            const res = await createTimetable(formData);

            alert(res.message);

            navigate("/admin/timetable");

        }

        catch (err) {

            console.error(err);

            alert(

                err.response?.data?.message ||

                "Failed to create timetable."

            );

        }

        finally {

            setLoading(false);

        }

    };

    return (

    <div className="container-fluid">

        <div className="card shadow-sm">

            <div className="card-header bg-primary text-white">

                <h3>Add Timetable</h3>

            </div>

            <div className="card-body">

                <form onSubmit={handleSubmit}>

                    <div className="row">

                        {/* Course */}

                        <div className="col-md-6 mb-3">

                            <label className="form-label">

                                Course

                            </label>

                            <select
                                className="form-select"
                                name="course_id"
                                value={formData.course_id}
                                onChange={handleChange}
                                required
                            >

                                <option value="">

                                    Select Course

                                </option>

                                {

                                    courses.map((course)=>(

                                        <option
                                            key={course.id}
                                            value={course.id}
                                        >

                                            {course.course_code} - {course.course_name}

                                        </option>

                                    ))

                                }

                            </select>

                        </div>

                        {/* Lecturer */}

                        <div className="col-md-6 mb-3">

                            <label className="form-label">

                                Lecturer

                            </label>

                            <select
                                className="form-select"
                                name="lecturer_id"
                                value={formData.lecturer_id}
                                onChange={handleChange}
                                required
                            >

                                <option value="">

                                    Select Lecturer

                                </option>

                                {

                                    lecturers.map((lecturer)=>(

                                        <option
                                            key={lecturer.id}
                                            value={lecturer.id}
                                        >

                                            {lecturer.full_name}

                                        </option>

                                    ))

                                }

                            </select>

                        </div>

                        {/* Day */}

                        <div className="col-md-4 mb-3">

                            <label className="form-label">

                                Day

                            </label>

                            <select
                                className="form-select"
                                name="day_of_week"
                                value={formData.day_of_week}
                                onChange={handleChange}
                                required
                            >

                                <option value="">Select Day</option>

                                <option>Monday</option>

                                <option>Tuesday</option>

                                <option>Wednesday</option>

                                <option>Thursday</option>

                                <option>Friday</option>

                                <option>Saturday</option>

                                <option>Sunday</option>

                            </select>

                        </div>

                        {/* Start Time */}

                        <div className="col-md-4 mb-3">

                            <label className="form-label">

                                Start Time

                            </label>

                            <input
                                type="time"
                                className="form-control"
                                name="start_time"
                                value={formData.start_time}
                                onChange={handleChange}
                                required
                            />

                        </div>

                        {/* End Time */}

                        <div className="col-md-4 mb-3">

                            <label className="form-label">

                                End Time

                            </label>

                            <input
                                type="time"
                                className="form-control"
                                name="end_time"
                                value={formData.end_time}
                                onChange={handleChange}
                                required
                            />

                        </div>

                        {/* Room */}

                        <div className="col-md-4 mb-3">

                            <label className="form-label">

                                Room

                            </label>

                            <input
                                type="text"
                                className="form-control"
                                name="room"
                                value={formData.room}
                                onChange={handleChange}
                                placeholder="ICT Lab 01"
                                required
                            />

                        </div>

                        {/* Academic Year */}

                        <div className="col-md-4 mb-3">

                            <label className="form-label">

                                Academic Year

                            </label>

                            <input
                                type="text"
                                className="form-control"
                                name="academic_year"
                                value={formData.academic_year}
                                onChange={handleChange}
                                placeholder="2025/2026"
                                required
                            />

                        </div>

                        {/* Year */}

                        <div className="col-md-4 mb-3">

                            <label className="form-label">

                                Year of Study

                            </label>

                            <select
                                className="form-select"
                                name="year_of_study"
                                value={formData.year_of_study}
                                onChange={handleChange}
                                required
                            >

                                <option value="">Select</option>

                                <option value="1">Year 1</option>

                                <option value="2">Year 2</option>

                                <option value="3">Year 3</option>

                                <option value="4">Year 4</option>

                            </select>

                        </div>

                        {/* Semester */}

                        <div className="col-md-4 mb-3">

                            <label className="form-label">

                                Semester

                            </label>

                            <select
                                className="form-select"
                                name="semester"
                                value={formData.semester}
                                onChange={handleChange}
                                required
                            >

                                <option value="">Select</option>

                                <option value="1">

                                    Semester 1

                                </option>

                                <option value="2">

                                    Semester 2

                                </option>

                            </select>

                        </div>

                        <div className="col-12 mt-4">

                            <button
                                type="submit"
                                className="btn btn-primary me-2"
                                disabled={loading}
                            >

                                {

                                    loading

                                    ? "Saving..."

                                    : "Save Timetable"

                                }

                            </button>

                            <button
                                type="button"
                                className="btn btn-secondary"
                                onClick={() => navigate("/admin/timetable")}
                            >

                                Cancel

                            </button>

                        </div>

                    </div>

                </form>

            </div>

        </div>

    </div>

);

}

export default AddTimetable;