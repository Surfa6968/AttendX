import { useEffect, useState } from "react";

import {
    FaQrcode,
    FaCalendarAlt,
    FaClock,
    FaMapMarkerAlt,
    FaPlay,
    FaTimes,
    FaSyncAlt,
    FaExclamationCircle,
    FaUsers
} from "react-icons/fa";

import {
    getLecturerClassSessions,
    getLecturerQRSessions,
    createLecturerQRSession,
    closeLecturerQRSession
} from "../../services/lecturerQRSessionService.js";

import "../../css/LecturerQRSession.css";


function QRSession() {

    /*
    |--------------------------------------------------------------------------
    | State
    |--------------------------------------------------------------------------
    */

    const [classSessions, setClassSessions] = useState([]);

    const [qrSessions, setQRSessions] = useState([]);

    const [loadingClasses, setLoadingClasses] = useState(true);

    const [loadingQR, setLoadingQR] = useState(true);

    const [startingQR, setStartingQR] = useState(null);

    const [error, setError] = useState("");

    const [scanLimit, setScanLimit] = useState(100);


    /*
    |--------------------------------------------------------------------------
    | Load Lecturer Class Sessions
    |--------------------------------------------------------------------------
    */

    const loadClassSessions = async () => {

        try {

            setLoadingClasses(true);

            const response =
                await getLecturerClassSessions();

            console.log(
                "LECTURER CLASS SESSIONS:",
                response
            );

            if (response?.success === true) {

                setClassSessions(
                    Array.isArray(response.data)
                        ? response.data
                        : []
                );

            } else {

                setClassSessions([]);

            }

        }

        catch (error) {

            console.error(
                "Failed to load lecturer class sessions:",
                error
            );

            setError(
                error?.response?.data?.message ||
                "Failed to load your class sessions."
            );

        }

        finally {

            setLoadingClasses(false);

        }

    };


    /*
    |--------------------------------------------------------------------------
    | Load Lecturer QR Sessions
    |--------------------------------------------------------------------------
    */

    const loadQRSessions = async () => {

        try {

            setLoadingQR(true);

            const response =
                await getLecturerQRSessions();

            console.log(
                "LECTURER QR SESSIONS:",
                response
            );

            if (response?.success === true) {

                setQRSessions(
                    Array.isArray(response.data)
                        ? response.data
                        : []
                );

            } else {

                setQRSessions([]);

            }

        }

        catch (error) {

            console.error(
                "Failed to load QR sessions:",
                error
            );

        }

        finally {

            setLoadingQR(false);

        }

    };


    /*
    |--------------------------------------------------------------------------
    | Load Everything
    |--------------------------------------------------------------------------
    */

    const loadDashboard = async () => {

        setError("");

        await Promise.all([
            loadClassSessions(),
            loadQRSessions()
        ]);

    };


    /*
    |--------------------------------------------------------------------------
    | Initial Load
    |--------------------------------------------------------------------------
    */

    useEffect(() => {

        loadDashboard();

    }, []);


    /*
    |--------------------------------------------------------------------------
    | Check Existing QR
    |--------------------------------------------------------------------------
    */

    const getActiveQRForClass = (classSessionId) => {

        return qrSessions.find(
            (qr) =>
                Number(qr.class_session_id) ===
                    Number(classSessionId) &&
                (
                    qr.status === "Active" ||
                    Number(qr.is_active) === 1
                )
        );

    };


    /*
    |--------------------------------------------------------------------------
    | Start QR
    |--------------------------------------------------------------------------
    */

    const handleStartQR = async (classSession) => {

        if (!classSession?.id) {

            return;

        }

        const existingQR =
            getActiveQRForClass(classSession.id);

        if (existingQR) {

            alert(
                "This class already has an active QR session."
            );

            return;

        }


        const confirmed = window.confirm(

            `Start QR attendance for ${classSession.course_code}?\n\n` +

            `Date: ${classSession.session_date}\n` +

            `Time: ${classSession.start_time} - ${classSession.end_time}\n` +

            `Room: ${classSession.room}`

        );


        if (!confirmed) {

            return;

        }


        try {

            setStartingQR(classSession.id);

            setError("");


            const response =
                await createLecturerQRSession({

                    class_session_id:
                        Number(classSession.id),

                    scan_limit:
                        Number(scanLimit)

                });


            console.log(
                "CREATE QR RESPONSE:",
                response
            );


            if (response?.success === true) {

                alert(
                    response.message ||
                    "QR Session started successfully."
                );

                await loadQRSessions();

            } else {

                setError(
                    response?.message ||
                    "Failed to start QR session."
                );

            }

        }

        catch (error) {

            console.error(
                "Failed to start QR session:",
                error
            );


            setError(

                error?.response?.data?.message ||

                "Failed to start QR session."

            );

        }

        finally {

            setStartingQR(null);

        }

    };


    /*
    |--------------------------------------------------------------------------
    | Close QR
    |--------------------------------------------------------------------------
    */

    const handleCloseQR = async (id) => {

        if (!window.confirm(
            "Close this QR session?"
        )) {

            return;

        }


        try {

            const response =
                await closeLecturerQRSession(id);


            if (response?.success === true) {

                alert(
                    response.message ||
                    "QR session closed successfully."
                );

                await loadQRSessions();

            } else {

                alert(
                    response?.message ||
                    "Failed to close QR session."
                );

            }

        }

        catch (error) {

            console.error(
                "Failed to close QR session:",
                error
            );


            alert(

                error?.response?.data?.message ||

                "Failed to close QR session."

            );

        }

    };


    /*
    |--------------------------------------------------------------------------
    | Format Date
    |--------------------------------------------------------------------------
    */

    const formatDate = (date) => {

        if (!date) {

            return "-";

        }

        const parsedDate =
            new Date(`${date}T00:00:00`);

        if (Number.isNaN(parsedDate.getTime())) {

            return date;

        }

        return parsedDate.toLocaleDateString(
            "en-GB",
            {
                day: "2-digit",
                month: "short",
                year: "numeric"
            }
        );

    };


    /*
    |--------------------------------------------------------------------------
    | Format Time
    |--------------------------------------------------------------------------
    */

    const formatTime = (time) => {

        if (!time) {

            return "-";

        }

        return time.substring(0, 5);

    };


    /*
    |--------------------------------------------------------------------------
    | QR Image URL
    |--------------------------------------------------------------------------
    */

    const getQRImageURL = (path) => {

        if (!path) {

            return "";

        }

        if (
            path.startsWith("http://") ||
            path.startsWith("https://")
        ) {

            return path;

        }

        return `http://localhost/AttendX/${path}`;

    };


    /*
    |--------------------------------------------------------------------------
    | Render
    |--------------------------------------------------------------------------
    */

    return (

        <div className="container-fluid lecturer-qr-page py-4">


            {/* ============================================================
                PAGE HEADER
            ============================================================ */}

            <div className="lecturer-qr-header">

                <div>

                    <div className="lecturer-qr-breadcrumb">

                        Lecturer Portal / QR Session

                    </div>

                    <h2>

                        QR Attendance Session

                    </h2>

                    <p>

                        Start attendance QR sessions for your
                        scheduled classes.

                    </p>

                </div>


                <button
                    type="button"
                    className="lecturer-qr-refresh"
                    onClick={loadDashboard}
                    disabled={
                        loadingClasses ||
                        loadingQR
                    }
                >

                    <FaSyncAlt />

                    Refresh

                </button>

            </div>


            {/* ============================================================
                ERROR
            ============================================================ */}

            {error && (

                <div className="lecturer-qr-error">

                    <FaExclamationCircle />

                    <div>

                        <strong>
                            QR Session Error
                        </strong>

                        <p>
                            {error}
                        </p>

                    </div>

                    <button
                        type="button"
                        onClick={() => setError("")}
                    >

                        <FaTimes />

                    </button>

                </div>

            )}


            {/* ============================================================
                SETTINGS
            ============================================================ */}

            <div className="lecturer-qr-settings">

                <div>

                    <FaUsers />

                    <div>

                        <strong>
                            Scan Limit
                        </strong>

                        <small>
                            Maximum number of students
                            allowed to scan this QR.
                        </small>

                    </div>

                </div>


                <input
                    type="number"
                    min="1"
                    value={scanLimit}
                    onChange={(e) =>
                        setScanLimit(
                            Number(e.target.value)
                        )
                    }
                />

                <span>
                    students
                </span>

            </div>


            {/* ============================================================
                AVAILABLE CLASS SESSIONS
            ============================================================ */}

            <div className="lecturer-qr-panel">

                <div className="lecturer-qr-panel-header">

                    <div>

                        <h5>

                            <FaCalendarAlt />

                            Today's / Upcoming Classes

                        </h5>

                        <p>

                            Start attendance for a class
                            created by the administrator.

                        </p>

                    </div>

                </div>


                {loadingClasses ? (

                    <div className="lecturer-qr-loading">

                        <div className="spinner-border text-primary">
                        </div>

                        <p>
                            Loading your class sessions...
                        </p>

                    </div>

                ) : classSessions.length === 0 ? (

                    <div className="lecturer-qr-empty">

                        <div className="lecturer-qr-empty-icon">

                            <FaCalendarAlt />

                        </div>

                        <h6>
                            No Class Sessions
                        </h6>

                        <p>

                            You currently have no class sessions
                            assigned to you.

                        </p>

                    </div>

                ) : (

                    <div className="lecturer-class-list">

                        {classSessions.map(
                            (classSession) => {

                                const activeQR =
                                    getActiveQRForClass(
                                        classSession.id
                                    );


                                const isStarting =
                                    Number(startingQR) ===
                                    Number(classSession.id);


                                return (

                                    <div
                                        className="lecturer-class-card"
                                        key={classSession.id}
                                    >

                                        {/* Course */}

                                        <div className="lecturer-class-main">

                                            <div className="lecturer-course-icon">

                                                <FaQrcode />

                                            </div>

                                            <div>

                                                <strong>

                                                    {
                                                        classSession.course_code
                                                    }

                                                </strong>

                                                <span>

                                                    {
                                                        classSession.course_name
                                                    }

                                                </span>

                                            </div>

                                        </div>


                                        {/* Date */}

                                        <div className="lecturer-class-detail">

                                            <FaCalendarAlt />

                                            <div>

                                                <small>
                                                    Date
                                                </small>

                                                <strong>

                                                    {
                                                        formatDate(
                                                            classSession.session_date
                                                        )
                                                    }

                                                </strong>

                                            </div>

                                        </div>


                                        {/* Time */}

                                        <div className="lecturer-class-detail">

                                            <FaClock />

                                            <div>

                                                <small>
                                                    Time
                                                </small>

                                                <strong>

                                                    {
                                                        formatTime(
                                                            classSession.start_time
                                                        )
                                                    }

                                                    {" - "}

                                                    {
                                                        formatTime(
                                                            classSession.end_time
                                                        )
                                                    }

                                                </strong>

                                            </div>

                                        </div>


                                        {/* Room */}

                                        <div className="lecturer-class-detail">

                                            <FaMapMarkerAlt />

                                            <div>

                                                <small>
                                                    Room
                                                </small>

                                                <strong>

                                                    {
                                                        classSession.room ||
                                                        "-"
                                                    }

                                                </strong>

                                            </div>

                                        </div>


                                        {/* Status */}

                                        <div className="lecturer-class-action">

                                            {activeQR ? (

                                                <span className="qr-active-badge">

                                                    <span className="qr-active-dot">
                                                    </span>

                                                    QR Active

                                                </span>

                                            ) : (

                                                <button
                                                    type="button"
                                                    className="start-qr-btn"
                                                    onClick={() =>
                                                        handleStartQR(
                                                            classSession
                                                        )
                                                    }
                                                    disabled={
                                                        isStarting ||
                                                        classSession.session_status ===
                                                        "Cancelled" ||
                                                        classSession.session_status ===
                                                        "Completed"
                                                    }
                                                >

                                                    {isStarting ? (

                                                        <>

                                                            <span
                                                                className="spinner-border spinner-border-sm"
                                                            />

                                                            Starting...

                                                        </>

                                                    ) : (

                                                        <>

                                                            <FaPlay />

                                                            Start QR

                                                        </>

                                                    )}

                                                </button>

                                            )}

                                        </div>

                                    </div>

                                );

                            }
                        )}

                    </div>

                )}

            </div>


            {/* ============================================================
                ACTIVE / RECENT QR SESSIONS
            ============================================================ */}

            <div className="lecturer-qr-panel">

                <div className="lecturer-qr-panel-header">

                    <div>

                        <h5>

                            <FaQrcode />

                            My QR Sessions

                        </h5>

                        <p>

                            QR sessions that you have started.

                        </p>

                    </div>

                </div>


                {loadingQR ? (

                    <div className="lecturer-qr-loading">

                        <div className="spinner-border text-primary">
                        </div>

                        <p>
                            Loading QR sessions...
                        </p>

                    </div>

                ) : qrSessions.length === 0 ? (

                    <div className="lecturer-qr-empty">

                        <div className="lecturer-qr-empty-icon">

                            <FaQrcode />

                        </div>

                        <h6>
                            No QR Sessions
                        </h6>

                        <p>

                            Start a QR session from one of
                            your classes above.

                        </p>

                    </div>

                ) : (

                    <div className="table-responsive">

                        <table className="table lecturer-qr-table align-middle">

                            <thead>

                                <tr>

                                    <th>
                                        Course
                                    </th>

                                    <th>
                                        Date
                                    </th>

                                    <th>
                                        Time
                                    </th>

                                    <th>
                                        Room
                                    </th>

                                    <th>
                                        Generated
                                    </th>

                                    <th>
                                        Expires
                                    </th>

                                    <th>
                                        Scans
                                    </th>

                                    <th>
                                        Status
                                    </th>

                                    <th>
                                        QR
                                    </th>

                                    <th>
                                        Action
                                    </th>

                                </tr>

                            </thead>

                            <tbody>

                                {qrSessions.map(
                                    (session) => (

                                        <tr
                                            key={session.id}
                                        >

                                            <td>

                                                <strong>
                                                    {
                                                        session.course_code
                                                    }
                                                </strong>

                                                <small>
                                                    {
                                                        session.course_name
                                                    }
                                                </small>

                                            </td>

                                            <td>

                                                {
                                                    formatDate(
                                                        session.session_date
                                                    )
                                                }

                                            </td>

                                            <td>

                                                {
                                                    formatTime(
                                                        session.start_time
                                                    )
                                                }

                                                {" - "}

                                                {
                                                    formatTime(
                                                        session.end_time
                                                    )
                                                }

                                            </td>

                                            <td>

                                                {
                                                    session.room ||
                                                    "-"
                                                }

                                            </td>

                                            <td>

                                                {
                                                    session.generated_at ||
                                                    "-"
                                                }

                                            </td>

                                            <td>

                                                {
                                                    session.expires_at ||
                                                    "-"
                                                }

                                            </td>

                                            <td>

                                                {
                                                    session.total_scans ??
                                                    0
                                                }

                                                {" / "}

                                                {
                                                    session.scan_limit ??
                                                    0
                                                }

                                            </td>

                                            <td>

                                                <span
                                                    className={
                                                        `qr-status-badge ${
                                                            session.status ===
                                                            "Active"

                                                            ? "active"

                                                            : session.status ===
                                                            "Expired"

                                                            ? "expired"

                                                            : "closed"
                                                        }`
                                                    }
                                                >

                                                    {
                                                        session.status
                                                    }

                                                </span>

                                            </td>

                                            <td>

                                                {session.qr_image ? (

                                                    <img
                                                        src={
                                                            getQRImageURL(
                                                                session.qr_image
                                                            )
                                                        }
                                                        alt="Attendance QR"
                                                        className="lecturer-qr-image"
                                                    />

                                                ) : (

                                                    <span>
                                                        -
                                                    </span>

                                                )}

                                            </td>

                                            <td>

                                                {
                                                    session.status ===
                                                    "Active"

                                                    ? (

                                                        <button
                                                            type="button"
                                                            className="close-qr-btn"
                                                            onClick={() =>
                                                                handleCloseQR(
                                                                    session.id
                                                                )
                                                            }
                                                        >

                                                            <FaTimes />

                                                            Close

                                                        </button>

                                                    )

                                                    : (

                                                        <span className="text-muted">
                                                            —
                                                        </span>

                                                    )
                                                }

                                            </td>

                                        </tr>

                                    )
                                )}

                            </tbody>

                        </table>

                    </div>

                )}

            </div>

        </div>

    );

}


export default QRSession;