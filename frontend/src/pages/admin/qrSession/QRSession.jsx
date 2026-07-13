import { useEffect, useState } from "react";

import {
    getQRSessions,
    createQRSession,
    closeQRSession,
    deleteQRSession,
    searchQRSessions
} from "../../../services/qrSessionService";

function QRSession() {

    const [sessions, setSessions] = useState([]);
    const [classSessions, setClassSessions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [keyword, setKeyword] = useState("");

    const [formData, setFormData] = useState({
        class_session_id: "",
        scan_limit: 100
    });

    const loadQRSessions = async () => {
        try {
            const response = await getQRSessions();
            setSessions(response.data.data || []);
        } catch (error) {
            console.error(error);
        }
        setLoading(false);
    };

    const handleSearch = async (value) => {
       setKeyword(value);
       try {
              if (value.trim() === "") {
              loadQRSessions();
              return;
              }
              const response = await searchQRSessions(value);
              setSessions(response.data.data || []);
       }
       catch (error) {
              console.error(error);
       }
    };

    const loadClassSessions = async () => {

        try {

            const response = await fetch(

                "http://localhost/AttendX/backend/api/admin/classSession/list.php",

                {
                    credentials: "include"
                }

            );

            const result = await response.json();

            setClassSessions(result.data || []);

        }

        catch (error) {

            console.error(error);

        }

    };

    const handleClose = async (id) => {

       if (!window.confirm("Close this QR Session?")) return;

       try {
              const response = await closeQRSession(id);
              alert(response.data.message);
              loadQRSessions();
       } catch (error) {
              alert(
              error.response?.data?.message ||
              "Failed to close QR Session."
              );
       }
    };

    const handleDelete = async (id) => {

       if (!window.confirm("Delete this QR Session?")) return;

       try {

              const response = await deleteQRSession(id);

              alert(response.data.message);

              loadQRSessions();

       } catch (error) {

              alert(
              error.response?.data?.message ||
              "Failed to delete QR Session."
              );

       }
     };

    useEffect(() => {

        loadQRSessions();

        loadClassSessions();

    }, []);

        const handleChange = (e) => {

        setFormData({

            ...formData,

            [e.target.name]: e.target.value

        });

    };

    const handleGenerate = async (e) => {

        e.preventDefault();

        try {

            await createQRSession(formData);

            alert("QR Session Generated Successfully.");

            setFormData({

                class_session_id: "",

                scan_limit: 100

            });

            loadQRSessions();

        }

        catch (error) {

            alert(

                error.response?.data?.message ||

                "Failed to generate QR."

            );

        }

    };

    return (

    <div className="container-fluid py-4">
        <div className="card shadow-sm">
            <div className="card-header bg-primary text-white">
                <h4 className="mb-0">
                    QR Session Management
                </h4>
            </div>
  
            <div className="card-body">

                {/* Generate QR */}

                <form
                    className="row g-3 mb-4"
                    onSubmit={handleGenerate}
                >

                    <div className="col-md-6">

                        <label className="form-label">
                            Class Session
                        </label>

                        <select
                            className="form-select"
                            name="class_session_id"
                            value={formData.class_session_id}
                            onChange={handleChange}
                            required
                        >

                            <option value="">
                                Select Class Session
                            </option>

                            {

                                classSessions.map((session) => (

                                    <option
                                        key={session.id}
                                        value={session.id}
                                    >

                                        {session.course_code}
                                        {" | "}
                                        {session.session_date}
                                        {" | "}
                                        {session.start_time}

                                    </option>

                                ))

                            }

                        </select>

                    </div>

                    <div className="col-md-3">

                        <label className="form-label">
                            Scan Limit
                        </label>

                        <input

                            type="number"

                            className="form-control"

                            name="scan_limit"

                            value={formData.scan_limit}

                            onChange={handleChange}

                            min="1"

                        />

                    </div>

                    <div className="col-md-3 d-flex align-items-end">

                        <button
                            className="btn btn-success w-100"
                            type="submit"
                        >

                            Generate QR

                        </button>

                    </div>

                </form>

                <hr />

                <div className="row mb-3">

                     <div className="col-md-4">

                            <input

                            type="text"

                            className="form-control"

                            placeholder="Search Course / Lecturer / Status"

                            value={keyword}

                            onChange={(e) => handleSearch(e.target.value)}

                            />

                     </div>

                </div>

                {/* Table */}

                {

                    loading ?

                    (

                        <div className="text-center">

                            Loading...

                        </div>

                    )

                    :

                    (

                        <div className="table-responsive">

                            <table className="table table-bordered table-hover">

                                <thead className="table-dark">

                                    <tr>

                                        <th>#</th>

                                        <th>Course</th>

                                        <th>Lecturer</th>

                                        <th>Date</th>

                                        <th>Generated</th>

                                        <th>Expires</th>

                                        <th>Status</th>

                                        <th>QR</th>

                                        <th>Actions</th>

                                    </tr>

                                </thead>

                                <tbody>

                                    {

                                        sessions.length === 0 ?

                                        (

                                            <tr>

                                                <td
                                                    colSpan="9"
                                                    className="text-center"
                                                >

                                                    No QR Sessions Found

                                                </td>

                                            </tr>

                                        )

                                        :

                                        (

                                            sessions.map((session,index)=>(

                                                <tr key={session.id}>

                                                    <td>

                                                        {index+1}

                                                    </td>

                                                    <td>

                                                        {session.course_code}

                                                    </td>

                                                    <td>

                                                        {session.lecturer_name}

                                                    </td>

                                                    <td>

                                                        {session.session_date}

                                                    </td>

                                                    <td>

                                                        {session.generated_at}

                                                    </td>

                                                    <td>

                                                        {session.expires_at}

                                                    </td>

                                                    <td>

                                                        <span
                                                            className={`badge ${
                                                               session.status === "Active"
                                                                      ? "bg-success"
                                                                      : session.status === "Expired"
                                                                      ? "bg-warning text-dark"
                                                                      : "bg-danger"
                                                               }`}
                                                        >

                                                            {session.status}

                                                        </span>

                                                    </td>

                                                    <td>
                                                        {
                                                            session.qr_image &&
                                                            <img
                                                                src={`http://localhost/AttendX/${session.qr_image}`}
                                                                alt="QR"
                                                                width="70"
                                                            />
                                                        }
                                                    </td>

                                                    <td>

                                                        <button className="btn btn-warning btn-sm me-2"
                                                               onClick={() => handleClose(session.id) }>

                                                            Close

                                                        </button>

                                                        <button className="btn btn-danger btn-sm"
                                                               onClick={() => handleDelete(session.id)}
                                                        >

                                                            Delete

                                                        </button>

                                                    </td>

                                                </tr>

                                            ))

                                        )

                                    }

                                </tbody>

                            </table>

                        </div>

                    )

                }

            </div>

        </div>

    </div>

);
}
export default QRSession;