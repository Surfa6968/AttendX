<?php

session_start();

require_once "../../../config/cors.php";
require_once "../../../config/database.php";
require_once "../../../helpers/response.php";

/*
|--------------------------------------------------------------------------
| Authentication
|--------------------------------------------------------------------------
*/

if (!isset($_SESSION["user"])) {
    error("Unauthorized.", 401);
}

if (
    !isset($_SESSION["user"]["role"]) ||
    $_SESSION["user"]["role"] !== "lecturer"
) {
    error("Access denied.", 403);
}


/*
|--------------------------------------------------------------------------
| Get Logged-in User
|--------------------------------------------------------------------------
*/

$user_id = (int) $_SESSION["user"]["id"];


/*
|--------------------------------------------------------------------------
| Find Lecturer
|--------------------------------------------------------------------------
*/

$sql = "
    SELECT
        id
    FROM lecturers
    WHERE user_id = ?
    LIMIT 1
";

$stmt = $mysqli->prepare($sql);

if (!$stmt) {
    error("Database error while finding lecturer.", 500);
}

$stmt->bind_param("i", $user_id);
$stmt->execute();

$result = $stmt->get_result();

if ($result->num_rows === 0) {

    $stmt->close();

    error("Lecturer not found.", 404);
}

$lecturer = $result->fetch_assoc();

$lecturer_id = (int) $lecturer["id"];

$stmt->close();


/*
|--------------------------------------------------------------------------
| Read Filters
|--------------------------------------------------------------------------
*/

$course_id = trim($_GET["course_id"] ?? "");

$date_from = trim($_GET["date_from"] ?? "");

$date_to = trim($_GET["date_to"] ?? "");

$status = trim($_GET["status"] ?? "");

$search = trim($_GET["search"] ?? "");


/*
|--------------------------------------------------------------------------
| Base Attendance Query
|--------------------------------------------------------------------------
|
| Relationships:
|
| attendance
|     ↓
| class_sessions
|     ↓
| courses
|
| attendance
|     ↓
| students
|     ↓
| users
|
| Lecturer ownership is determined by:
|
| class_sessions.lecturer_id
|
|--------------------------------------------------------------------------
*/

$sql = "
    SELECT

        a.id AS attendance_id,

        a.attendance_status,

        a.scanned_at AS marked_at,

        cs.id AS session_id,

        cs.session_date,

        cs.start_time,

        cs.end_time,

        c.id AS course_id,

        c.course_code,

        c.course_name,

        s.id AS student_id,

        u.full_name AS student_name

    FROM attendance a

    INNER JOIN class_sessions cs
        ON a.class_session_id = cs.id

    INNER JOIN courses c
        ON cs.course_id = c.id

    INNER JOIN students s
        ON a.student_id = s.id

    INNER JOIN users u
        ON s.user_id = u.id

    WHERE cs.lecturer_id = ?
";


/*
|--------------------------------------------------------------------------
| Query Parameters
|--------------------------------------------------------------------------
*/

$params = [$lecturer_id];

$types = "i";


/*
|--------------------------------------------------------------------------
| Course Filter
|--------------------------------------------------------------------------
*/

if ($course_id !== "") {

    $sql .= "
        AND c.id = ?
    ";

    $params[] = (int) $course_id;

    $types .= "i";
}


/*
|--------------------------------------------------------------------------
| Date From
|--------------------------------------------------------------------------
*/

if ($date_from !== "") {

    $sql .= "
        AND cs.session_date >= ?
    ";

    $params[] = $date_from;

    $types .= "s";
}


/*
|--------------------------------------------------------------------------
| Date To
|--------------------------------------------------------------------------
*/

if ($date_to !== "") {

    $sql .= "
        AND cs.session_date <= ?
    ";

    $params[] = $date_to;

    $types .= "s";
}


/*
|--------------------------------------------------------------------------
| Attendance Status
|--------------------------------------------------------------------------
*/

if ($status !== "") {

    $sql .= "
        AND LOWER(a.attendance_status) = LOWER(?)
    ";

    $params[] = $status;

    $types .= "s";
}


/*
|--------------------------------------------------------------------------
| Search
|--------------------------------------------------------------------------
|
| Search by:
|
| - Student name
| - Course code
| - Course name
|
|--------------------------------------------------------------------------
*/

if ($search !== "") {

    $sql .= "
        AND (
            u.full_name LIKE ?
            OR c.course_code LIKE ?
            OR c.course_name LIKE ?
        )
    ";

    $search_value = "%" . $search . "%";

    $params[] = $search_value;
    $params[] = $search_value;
    $params[] = $search_value;

    $types .= "sss";
}


/*
|--------------------------------------------------------------------------
| Ordering
|--------------------------------------------------------------------------
*/

$sql .= "
    ORDER BY
        cs.session_date DESC,
        cs.start_time DESC,
        u.full_name ASC
";


/*
|--------------------------------------------------------------------------
| Prepare Query
|--------------------------------------------------------------------------
*/

$stmt = $mysqli->prepare($sql);

if (!$stmt) {
    error(
        "Failed to prepare attendance report query.",
        500
    );
}


/*
|--------------------------------------------------------------------------
| Bind Parameters
|--------------------------------------------------------------------------
*/

$stmt->bind_param(
    $types,
    ...$params
);


/*
|--------------------------------------------------------------------------
| Execute
|--------------------------------------------------------------------------
*/

$stmt->execute();

$result = $stmt->get_result();


/*
|--------------------------------------------------------------------------
| Initialize Statistics
|--------------------------------------------------------------------------
*/

$data = [];

$session_ids = [];

$total_records = 0;

$total_present = 0;

$total_late = 0;

$total_absent = 0;


/*
|--------------------------------------------------------------------------
| Process Attendance Records
|--------------------------------------------------------------------------
*/

while ($row = $result->fetch_assoc()) {

    /*
    |----------------------------------------------------------------------
    | Session
    |----------------------------------------------------------------------
    */

    $session_id =
        (int) $row["session_id"];

    $session_ids[$session_id] = true;


    /*
    |----------------------------------------------------------------------
    | Status
    |----------------------------------------------------------------------
    */

    $attendance_status =
        strtolower(
            trim(
                $row["attendance_status"] ?? ""
            )
        );


    if ($attendance_status === "present") {

        $total_present++;

    } elseif ($attendance_status === "late") {

        $total_late++;

    } elseif ($attendance_status === "absent") {

        $total_absent++;

    }


    $total_records++;


    /*
    |----------------------------------------------------------------------
    | Attendance Data
    |----------------------------------------------------------------------
    */

    $data[] = [

        "attendance_id" =>
            (int) $row["attendance_id"],

        "session_id" =>
            $session_id,

        "course_id" =>
            (int) $row["course_id"],

        "course_code" =>
            $row["course_code"],

        "course_name" =>
            $row["course_name"],

        "student_id" =>
            (int) $row["student_id"],

        "student_name" =>
            $row["student_name"],

        "session_date" =>
            $row["session_date"],

        "start_time" =>
            $row["start_time"],

        "end_time" =>
            $row["end_time"],

        "attendance_status" =>
            $row["attendance_status"],

        "marked_at" =>
            $row["marked_at"]

    ];
}


/*
|--------------------------------------------------------------------------
| Total Sessions
|--------------------------------------------------------------------------
*/

$total_sessions =
    count($session_ids);


/*
|--------------------------------------------------------------------------
| Attendance Percentage
|--------------------------------------------------------------------------
|
| Present + Late = Attended
|
|--------------------------------------------------------------------------
*/

$attendance_percentage = 0;

if ($total_records > 0) {

    $attendance_percentage =
        round(
            (
                (
                    $total_present
                    +
                    $total_late
                )
                /
                $total_records
            ) * 100,
            2
        );
}


/*
|--------------------------------------------------------------------------
| Response
|--------------------------------------------------------------------------
*/

$stmt->close();

success(
    "Attendance report loaded successfully.",
    [

        "statistics" => [

            "total_sessions" =>
                $total_sessions,

            "total_records" =>
                $total_records,

            "present" =>
                $total_present,

            "late" =>
                $total_late,

            "absent" =>
                $total_absent,

            "attendance_percentage" =>
                $attendance_percentage

        ],

        "data" =>
            $data

    ]
);


/*
|--------------------------------------------------------------------------
| Close Database
|--------------------------------------------------------------------------
*/

$mysqli->close();

exit;