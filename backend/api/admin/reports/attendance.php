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

if ($_SESSION["user"]["role"] !== "admin") {
    error("Access denied.", 403);
}

/*
|--------------------------------------------------------------------------
| Filters
|--------------------------------------------------------------------------
*/

$dateFrom = $_GET["date_from"] ?? "";
$dateTo = $_GET["date_to"] ?? "";
$status = $_GET["status"] ?? "";
$course = $_GET["course"] ?? "";
$lecturer = $_GET["lecturer"] ?? "";
$student = $_GET["student"] ?? "";

/*
|--------------------------------------------------------------------------
| SQL
|--------------------------------------------------------------------------
*/

$sql = "
SELECT

    a.id,
    a.attendance_status,
    a.scanned_at,

    s.registration_no,
    su.full_name AS student_name,

    c.course_code,
    c.course_name,

    lu.full_name AS lecturer_name,

    cs.session_date,
    cs.start_time,
    cs.end_time

FROM attendance a

INNER JOIN students s
ON a.student_id = s.id

INNER JOIN users su
ON s.user_id = su.id

INNER JOIN class_sessions cs
ON a.class_session_id = cs.id

INNER JOIN courses c
ON cs.course_id = c.id

INNER JOIN lecturers l
ON cs.lecturer_id = l.id

INNER JOIN users lu
ON l.user_id = lu.id

WHERE 1=1
";

if ($dateFrom != "") {
    $sql .= " AND DATE(a.scanned_at) >= '".$mysqli->real_escape_string($dateFrom)."'";
}

if ($dateTo != "") {
    $sql .= " AND DATE(a.scanned_at) <= '".$mysqli->real_escape_string($dateTo)."'";
}

if ($status != "") {
    $sql .= " AND a.attendance_status='".$mysqli->real_escape_string($status)."'";
}

if ($course != "") {
    $sql .= " AND c.id=".$mysqli->real_escape_string($course);
}

if ($lecturer != "") {
    $sql .= " AND l.id=".$mysqli->real_escape_string($lecturer);
}

if ($student != "") {
    $sql .= " AND s.id=".$mysqli->real_escape_string($student);
}

$sql .= " ORDER BY a.scanned_at DESC";

$result = $mysqli->query($sql);

$data = [];

while ($row = $result->fetch_assoc()) {
    $data[] = $row;
}

success(
    "Attendance report loaded successfully.",
    $data
);