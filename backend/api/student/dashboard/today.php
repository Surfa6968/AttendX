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

$userId = $_SESSION["user"]["id"];

/*
|--------------------------------------------------------------------------
| Get Student Details
|--------------------------------------------------------------------------
*/

$stmt = $mysqli->prepare("
SELECT
    department_id,
    year_of_study,
    semester,
    academic_year
FROM students
WHERE user_id = ?
LIMIT 1
");

$stmt->bind_param("i", $userId);
$stmt->execute();

$result = $stmt->get_result();

if ($result->num_rows == 0) {
    error("Student not found.");
}

$student = $result->fetch_assoc();

$today = date("Y-m-d");

/*
|--------------------------------------------------------------------------
| Today's Classes
|--------------------------------------------------------------------------
*/

$stmt = $mysqli->prepare("
SELECT

    cs.id,
    c.course_code,
    c.course_name,
    u.full_name AS lecturer_name,

    cs.session_date,
    cs.start_time,
    cs.end_time,
    cs.room,
    cs.session_status

FROM class_sessions cs

INNER JOIN courses c
    ON cs.course_id = c.id

INNER JOIN lecturers l
    ON cs.lecturer_id = l.id

INNER JOIN users u
    ON l.user_id = u.id

WHERE

    cs.session_date = ?
    AND c.department_id = ?
    AND c.year_of_study = ?
    AND c.semester = ?

ORDER BY cs.start_time ASC
");

$stmt->bind_param(
    "siii",
    $today,
    $student["department_id"],
    $student["year_of_study"],
    $student["semester"]
);

$stmt->execute();

$result = $stmt->get_result();

$data = [];

while ($row = $result->fetch_assoc()) {

    $data[] = [
        "class_session_id" => (int)$row["id"],
        "course_code"      => $row["course_code"],
        "course_name"      => $row["course_name"],
        "lecturer_name"    => $row["lecturer_name"],
        "session_date"     => $row["session_date"],
        "start_time"       => $row["start_time"],
        "end_time"         => $row["end_time"],
        "room"             => $row["room"],
        "session_status"   => $row["session_status"]
    ];
}

/*
|--------------------------------------------------------------------------
| Response
|--------------------------------------------------------------------------
*/

success(
    "Today's classes loaded successfully.",
    $data
);

$stmt->close();
$mysqli->close();
exit;