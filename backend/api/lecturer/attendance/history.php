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


/*
|--------------------------------------------------------------------------
| Lecturer Access
|--------------------------------------------------------------------------
*/

if ($_SESSION["user"]["role"] !== "lecturer") {
    error("Access denied.", 403);
}


/*
|--------------------------------------------------------------------------
| Get Logged-in User ID
|--------------------------------------------------------------------------
*/

$user_id = (int) $_SESSION["user"]["id"];


/*
|--------------------------------------------------------------------------
| Find Lecturer
|--------------------------------------------------------------------------
|
| lecturers.id is the lecturer ID.
| lecturers.user_id connects the lecturer to users.id.
|
*/

$sql = "
    SELECT
        l.id,
        l.user_id
    FROM lecturers l
    WHERE l.user_id = ?
    LIMIT 1
";

$stmt = $mysqli->prepare($sql);

if (!$stmt) {
    error("Database error.", 500);
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
| Get Lecturer Attendance
|--------------------------------------------------------------------------
|
| Relationship:
|
| lecturers
|     ↓
| class_sessions
|     ↓
| attendance
|     ↓
| students
|     ↓
| users
|
*/

$sql = "
    SELECT

        a.id AS attendance_id,

        a.student_id,

        a.attendance_status,

        a.scanned_at AS marked_at,

        s.user_id AS student_user_id,

        u_student.full_name AS student_name,

        u_student.email AS student_email,

        c.id AS course_id,

        c.course_code,

        c.course_name,

        cs.id AS class_session_id,

        cs.session_date,

        cs.start_time,

        cs.end_time

    FROM attendance a

    INNER JOIN class_sessions cs
        ON a.class_session_id = cs.id

    INNER JOIN courses c
        ON cs.course_id = c.id

    INNER JOIN students s
        ON a.student_id = s.id

    INNER JOIN users u_student
        ON s.user_id = u_student.id

    WHERE cs.lecturer_id = ?

    ORDER BY
        cs.session_date DESC,
        cs.start_time DESC,
        u_student.full_name ASC
";


$stmt = $mysqli->prepare($sql);

if (!$stmt) {
    error(
        "Failed to prepare attendance query: " .
        $mysqli->error,
        500
    );
}

$stmt->bind_param("i", $lecturer_id);

$stmt->execute();

$result = $stmt->get_result();

$data = [];


/*
|--------------------------------------------------------------------------
| Build Attendance Response
|--------------------------------------------------------------------------
*/

while ($row = $result->fetch_assoc()) {

    $data[] = [

        "attendance_id" =>
            (int) $row["attendance_id"],

        "student_id" =>
            (int) $row["student_id"],

        "student_user_id" =>
            (int) $row["student_user_id"],

        "student_name" =>
            $row["student_name"],

        "student_email" =>
            $row["student_email"],

        "course_id" =>
            (int) $row["course_id"],

        "course_code" =>
            $row["course_code"],

        "course_name" =>
            $row["course_name"],

        "class_session_id" =>
            (int) $row["class_session_id"],

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

$stmt->close();

$mysqli->close();


/*
|--------------------------------------------------------------------------
| Success Response
|--------------------------------------------------------------------------
*/

success(
    "Lecturer attendance loaded successfully.",
    $data
);

exit;