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
| Get Student ID
|--------------------------------------------------------------------------
*/

$stmt = $mysqli->prepare("
SELECT id
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

$studentId = $student["id"];

/*
|--------------------------------------------------------------------------
| Recent Attendance
|--------------------------------------------------------------------------
*/

$stmt = $mysqli->prepare("
SELECT

    a.attendance_status,

    c.course_code,
    c.course_name,

    cs.session_date

FROM attendance a

INNER JOIN class_sessions cs
    ON a.class_session_id = cs.id

INNER JOIN courses c
    ON cs.course_id = c.id

WHERE a.student_id = ?

ORDER BY cs.session_date DESC

LIMIT 5
");

$stmt->bind_param("i", $studentId);
$stmt->execute();

$result = $stmt->get_result();

$data = [];

while ($row = $result->fetch_assoc()) {

    $data[] = [
        "course_code" => $row["course_code"],
        "course_name" => $row["course_name"],
        "session_date" => $row["session_date"],
        "attendance_status" => $row["attendance_status"]
    ];

}

success(
    "Recent attendance loaded successfully.",
    $data
);

$stmt->close();
$mysqli->close();
exit;