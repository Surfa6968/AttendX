import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
    FaPlus,
    FaEdit,
    FaTrash,
    FaSearch,
    FaCalendarAlt
} from "react-icons/fa";

import {
    getClassSessions,
    deleteClassSession,
    searchClassSessions
} from "../../../services/classSessionService";

function ClassSessionList() {

    const navigate = useNavigate();

    const [sessions, setSessions] = useState([]);

    const [loading, setLoading] = useState(true);

    const [search, setSearch] = useState("");

    useEffect(() => {

        loadSessions();

    }, []);

    /*
    |--------------------------------------------------------------------------
    | Load Sessions
    |--------------------------------------------------------------------------
    */

    const loadSessions = async () => {

        try {

            setLoading(true);

            const res = await getClassSessions();

            setSessions(res.data || []);

        }

        catch (err) {

            console.error(err);

            alert("Failed to load class sessions.");

        }

        finally {

            setLoading(false);

        }

    };

    /*
    |--------------------------------------------------------------------------
    | Search
    |--------------------------------------------------------------------------
    */

    const handleSearch = async (keyword) => {

        setSearch(keyword);

        try {

            if (keyword.trim() === "") {

                loadSessions();

                return;

            }

            const res = await searchClassSessions(keyword);

            setSessions(res.data || []);

        }

        catch (err) {

            console.error(err);

        }

    };

    /*
    |--------------------------------------------------------------------------
    | Delete
    |--------------------------------------------------------------------------
    */

    const handleDelete = async (id) => {

        if (!window.confirm("Delete this class session?")) {

            return;

        }

        try {

            const res = await deleteClassSession(id);

            alert(res.message);

            loadSessions();

        }

        catch (err) {

            console.error(err);

            alert(

                err.response?.data?.message ||

                "Failed to delete class session."

            );

        }

    };

    /*
    |--------------------------------------------------------------------------
    | Status Badge
    |--------------------------------------------------------------------------
    */

    const badgeClass = (status) => {

        switch (status) {

            case "Scheduled":

                return "bg-primary";

            case "Started":

                return "bg-warning text-dark";

            case "Completed":

                return "bg-success";

            case "Cancelled":

                return "bg-danger";

            default:

                return "bg-secondary";

        }

    };

    return (

        <div className="container-fluid py-4">

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

                    <div className="d-flex align-items-center gap-3">

                        <FaCalendarAlt size={28} />

                        <div>

                            <h3 className="mb-0 fw-bold">

                                Class Session Management

                            </h3>

                            <small>

                                Manage all scheduled class sessions

                            </small>

                        </div>

                    </div>

                    <button
                        className="btn btn-light fw-semibold"
                        onClick={() =>
                            navigate("/admin/classSession/create")
                        }
                    >

                        <FaPlus className="me-2" />

                        Create Session

                    </button>

                </div>

                <div className="card-body">

                    {/* Search */}

                    <div className="row mb-4">

                        <div className="col-md-5">

                            <div className="input-group">

                                <span className="input-group-text">

                                    <FaSearch />

                                </span>

                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Search class sessions..."
                                    value={search}
                                    onChange={(e) =>
                                        handleSearch(e.target.value)
                                    }
                                />

                            </div>

                        </div>

                    </div>

                    {/* Table */}

                    <div className="table-responsive">

                        <table className="table table-hover align-middle">

                            <thead className="table-primary">

                                <tr>

                                    <th>Course</th>

                                    <th>Lecturer</th>

                                    <th>Date</th>

                                    <th>Time</th>

                                    <th>Room</th>

                                    <th>Status</th>

                                    <th width="140">

                                        Actions

                                    </th>

                                </tr>

                            </thead>

                            <tbody>

                                {

                                    loading ?

                                        (

                                            <tr>

                                                <td
                                                    colSpan="7"
                                                    className="text-center py-5"
                                                >

                                                    Loading...

                                                </td>

                                            </tr>

                                        )

                                        :

                                        sessions.length === 0 ?

                                            (

                                                <tr>

                                                    <td
                                                        colSpan="7"
                                                        className="text-center py-5"
                                                    >

                                                        No class sessions found.

                                                    </td>

                                                </tr>

                                            )

                                            :

                                            sessions.map((session) => (

                                                <tr key={session.id}>

                                                    <td>

                                                        <div className="fw-semibold">

                                                            {session.course_code}

                                                        </div>

                                                        <small className="text-muted">

                                                            {session.course_name}

                                                        </small>

                                                    </td>

                                                    <td>

                                                        <div>

                                                            {session.lecturer_name}

                                                        </div>

                                                        <small className="text-muted">

                                                            {session.employee_no}

                                                        </small>

                                                    </td>

                                                    <td>

                                                        {session.session_date}

                                                    </td>

                                                    <td>

                                                        {session.start_time}

                                                        {" - "}

                                                        {session.end_time}

                                                    </td>

                                                    <td>

                                                        {session.room}

                                                    </td>

                                                    <td>

                                                        <span
                                                            className={`badge ${badgeClass(session.session_status)}`}
                                                        >

                                                            {session.session_status}

                                                        </span>

                                                    </td>

                                                    <td>

                                                        <div className="d-flex gap-2">
                                                           <button
                                                                className="btn btn-sm btn-warning"
                                                                title="Edit"
                                                                onClick={() =>
                                                                    navigate(
                                                                        `/admin/classSession/edit/${session.id}`
                                                                    )
                                                                }
                                                            >
                                                                <FaEdit />
                                                            </button>

                                                            <button
                                                                className="btn btn-sm btn-danger"
                                                                title="Delete"
                                                                onClick={() =>
                                                                    handleDelete(session.id)
                                                                }
                                                            >
                                                                <FaTrash />
                                                            </button>

                                                        </div>

                                                    </td>

                                                </tr>

                                            ))
                                }

                            </tbody>

                        </table>

                    </div>

                </div>

            </div>

        </div>

    );

}

export default ClassSessionList;