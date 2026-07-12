import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
    FaPlus,
    FaSearch,
    FaEdit,
    FaTrash
} from "react-icons/fa";

import {
    getTimetables,
    deleteTimetable,
    searchTimetables
} from "../../../services/timetableService";

function TimetableList() {

    const [timetables, setTimetables] = useState([]);
    const [loading, setLoading] = useState(true);
    const [keyword, setKeyword] = useState("");

    useEffect(() => {

        loadTimetables();

    }, []);

    const loadTimetables = async () => {

        try {

            const res = await getTimetables();

            setTimetables(res.data || []);

        }

        catch (err) {

            console.error(err);

            alert("Failed to load timetable.");

        }

        finally {

            setLoading(false);

        }

    };

    const handleDelete = async (id) => {

        if (!window.confirm("Delete this timetable?")) {

            return;

        }

        try {

            const res = await deleteTimetable(id);

            alert(res.message);

            loadTimetables();

        }

        catch (err) {

            console.error(err);

            alert(

                err.response?.data?.message ||

                "Delete failed."

            );

        }

    };

    const handleSearch = async (value) => {

        setKeyword(value);

        if (value.trim() === "") {

            loadTimetables();

            return;

        }

        try {

            const res = await searchTimetables(value);

            setTimetables(res.data || []);

        }

        catch (err) {

            console.error(err);

        }

    };

    if (loading) {

        return (

            <div className="text-center mt-5">

                <div className="spinner-border text-primary"></div>

            </div>

        );

    }

    return (

        <div className="container-fluid">

            <div className="d-flex justify-content-between align-items-center mb-4">

                <h2>Timetable Management</h2>

                <div className="d-flex gap-2">

                    <div className="input-group">

                        <span className="input-group-text">

                            <FaSearch />

                        </span>

                        <input
                            type="text"
                            className="form-control"
                            placeholder="Search timetable..."
                            value={keyword}
                            onChange={(e)=>handleSearch(e.target.value)}
                        />

                    </div>

                    <Link
                        to="/admin/timetable/add"
                        className="btn btn-primary"
                    >

                        <FaPlus className="me-2"/>

                        Add Timetable

                    </Link>

                </div>

            </div>

            <div className="card shadow-sm">

                <div className="card-body">

                    <table className="table table-hover align-middle">

                        <thead className="table-dark">

                            <tr>

                                <th>Course</th>

                                <th>Lecturer</th>

                                <th>Day</th>

                                <th>Time</th>

                                <th>Room</th>

                                <th>Academic Year</th>

                                <th>Year</th>

                                <th>Semester</th>

                                <th width="150">

                                    Actions

                                </th>

                            </tr>

                        </thead>

                        <tbody>

                            {

                                timetables.length>0 ?

                                timetables.map((item)=>(

                                    <tr key={item.id}>

                                        <td>{item.course_code}</td>

                                        <td>{item.lecturer_name}</td>

                                        <td>{item.day_of_week}</td>

                                        <td>

                                            {item.start_time}

                                            {" - "}

                                            {item.end_time}

                                        </td>

                                        <td>{item.room}</td>

                                        <td>{item.academic_year}</td>

                                        <td>{item.year_of_study}</td>

                                        <td>{item.semester}</td>

                                        <td>

                                            <Link
                                                to={`/admin/timetable/edit/${item.id}`}
                                                className="btn btn-outline-warning btn-sm me-2"
                                                title="Edit"
                                            >

                                                <FaEdit/>

                                            </Link>

                                            <button
                                                className="btn btn-outline-danger btn-sm"
                                                onClick={()=>handleDelete(item.id)}
                                                title="Delete"
                                            >

                                                <FaTrash/>

                                            </button>

                                        </td>

                                    </tr>

                                ))

                                :

                                <tr>

                                    <td
                                        colSpan="9"
                                        className="text-center"
                                    >

                                        No timetable found.

                                    </td>

                                </tr>

                            }

                        </tbody>

                    </table>

                </div>

            </div>

        </div>

    );

}

export default TimetableList;