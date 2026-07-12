import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
    FaSave,
    FaTimes
} from "react-icons/fa";

import {
    getTimetable,
    updateTimetable
} from "../../../services/timetableService";

import {
    getCourses
} from "../../../services/courseService";

import {
    getLecturers
} from "../../../services/lecturerService";

function EditTimetable() {

    const navigate = useNavigate();

    const { id } = useParams();

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

        loadTimetable();

        loadCourses();

        loadLecturers();

    }, []);

    /*
    |--------------------------------------------------------------------------
    | Load Timetable
    |--------------------------------------------------------------------------
    */

    const loadTimetable = async () => {

       try {

              const res = await getTimetable(id);

              console.log(res);

              const timetable = res.data;

              setFormData({

              course_id: timetable.course_id || "",

              lecturer_id: timetable.lecturer_id || "",

              day_of_week: timetable.day_of_week || "",

              start_time: timetable.start_time || "",

              end_time: timetable.end_time || "",

              room: timetable.room || "",

              academic_year: timetable.academic_year || "",

              year_of_study: timetable.year_of_study || "",

              semester: timetable.semester || ""

              });

       }

       catch (err) {

              console.error(err);

              alert("Failed to load timetable.");

       }

       };

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

            const res = await updateTimetable(id, formData);

            alert(res.message);

            navigate("/admin/timetable");

        }

        catch (err) {

            console.error(err);

            alert(

                err.response?.data?.message ||

                "Failed to update timetable."

            );

        }

        finally {

            setLoading(false);

        }

    };

    return (

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

                     <h3 className="mb-0 fw-bold">Edit Timetable</h3>

                     <div className="d-flex gap-2">

                            <button
                                   type="submit"
                                   form="editTimetableForm"
                                   className="btn btn-light rounded-circle shadow-sm"
                                   title="Save Changes"
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
                                          width: "42px",
                                          height: "42px"
                                   }}
                                   onClick={() => navigate("/admin/timetable")}
                            >
                                   <FaTimes className="text-danger" />
                            </button>

                     </div>

              </div>

              <div className="card-body p-4">

                     <form
                     id="editTimetableForm"
                     onSubmit={handleSubmit}
                     >

                     <div className="row">

                            {/* Course */}

                            <div className="col-md-6 mb-4">

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

                                          courses.map((course) => (

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

                            <div className="col-md-6 mb-4">

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

                                          lecturers.map((lecturer) => (

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

                            <div className="col-md-4 mb-4">

                                   <label className="form-label">

                                   Day of Week

                                   </label>

                                   <select
                                   className="form-select"
                                   name="day_of_week"
                                   value={formData.day_of_week}
                                   onChange={handleChange}
                                   required
                                   >

                                   <option value="">Select Day</option>

                                   <option value="Monday">Monday</option>
                                   <option value="Tuesday">Tuesday</option>
                                   <option value="Wednesday">Wednesday</option>
                                   <option value="Thursday">Thursday</option>
                                   <option value="Friday">Friday</option>
                                   <option value="Saturday">Saturday</option>
                                   <option value="Sunday">Sunday</option>

                                   </select>

                            </div>

                            {/* Start Time */}

                            <div className="col-md-4 mb-4">

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

                            <div className="col-md-4 mb-4">

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

                            <div className="col-md-4 mb-4">

                                   <label className="form-label">

                                   Room

                                   </label>

                                   <input
                                   type="text"
                                   className="form-control"
                                   name="room"
                                   value={formData.room}
                                   onChange={handleChange}
                                   required
                                   />

                            </div>

                            {/* Academic Year */}

                            <div className="col-md-4 mb-4">

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

                            {/* Year of Study */}

                            <div className="col-md-2 mb-4">

                                   <label className="form-label">

                                   Year

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

                            <div className="col-md-2 mb-4">

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
                                   <option value="1">Semester 1</option>
                                   <option value="2">Semester 2</option>

                                   </select>

                            </div>

                     </div>

                     </form>

              </div>

              </div>

       </div>

       );
}

export default EditTimetable;