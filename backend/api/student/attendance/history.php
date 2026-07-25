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

if ($_SESSION["user"]["role"] !== "student") {
    error("Access denied.", 403);
}

/*
|--------------------------------------------------------------------------
| Get Student ID
|--------------------------------------------------------------------------
*/

$user_id = $_SESSION["user"]["id"];

$sql = "
SELECT id
FROM students
WHERE user_id = ?
LIMIT 1
";

$stmt = $mysqli->prepare($sql);
$stmt->bind_param("i", $user_id);
$stmt->execute();

$result = $stmt->get_result();

if ($result->num_rows == 0) {
    error("Student not found.");
}

$student = $result->fetch_assoc();
$student_id = $student["id"];

$stmt->close();

/*
|--------------------------------------------------------------------------
| Attendance History
|--------------------------------------------------------------------------
*/

$sql = "

SELECT

    a.id,
    a.attendance_status,
    a.scanned_at AS marked_at,

    c.course_code,
    c.course_name,

    cs.session_date,
    cs.start_time,
    cs.end_time,

    u.full_name AS lecturer_name

FROM attendance a

INNER JOIN class_sessions cs
    ON a.class_session_id = cs.id

INNER JOIN courses c
    ON cs.course_id = c.id

INNER JOIN lecturers l
    ON cs.lecturer_id = l.id

INNER JOIN users u
    ON l.user_id = u.id

WHERE a.student_id = ?

ORDER BY
    cs.session_date DESC,
    cs.start_time DESC
";

$stmt = $mysqli->prepare($sql);

$stmt->bind_param("i", $student_id);

$stmt->execute();

$result = $stmt->get_result();

$data = [];

while ($row = $result->fetch_assoc()) {

    $data[] = [

        "attendance_id"      => (int)$row["id"],
        "course_code"        => $row["course_code"],
        "course_name"        => $row["course_name"],
        "lecturer_name"      => $row["lecturer_name"],
        "session_date"       => $row["session_date"],
        "start_time"         => $row["start_time"],
        "end_time"           => $row["end_time"],
        "attendance_status"  => $row["attendance_status"],
        "marked_at"          => $row["marked_at"]

    ];

}

$stmt->close();

/*
|--------------------------------------------------------------------------
| Success
|--------------------------------------------------------------------------
*/

success(
    "Attendance history loaded successfully.",
    $data
);

$mysqli->close();

exit;