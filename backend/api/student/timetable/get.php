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
| Student Details
|--------------------------------------------------------------------------
*/

$stmt = $mysqli->prepare("
SELECT
    year_of_study,
    semester,
    academic_year
FROM students
WHERE user_id=?
LIMIT 1
");

$stmt->bind_param("i", $userId);
$stmt->execute();

$student = $stmt->get_result()->fetch_assoc();

if (!$student) {
    error("Student not found.");
}

/*
|--------------------------------------------------------------------------
| Timetable
|--------------------------------------------------------------------------
*/

$stmt = $mysqli->prepare("
SELECT

    t.id,

    t.day_of_week,

    t.start_time,

    t.end_time,

    t.room,

    c.course_code,

    c.course_name,

    u.full_name AS lecturer_name

FROM timetables t

INNER JOIN courses c
    ON t.course_id = c.id

INNER JOIN lecturers l
    ON t.lecturer_id = l.id

INNER JOIN users u
    ON l.user_id = u.id

WHERE

t.year_of_study = ?
AND t.semester = ?
AND t.academic_year = ?

ORDER BY

FIELD(
    t.day_of_week,
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
    'Sunday'
),

t.start_time
");

$stmt->bind_param(
    "sss",
    $student["year_of_study"],
    $student["semester"],
    $student["academic_year"]
);

$stmt->execute();

$result = $stmt->get_result();

$data = [];

while ($row = $result->fetch_assoc()) {

    $data[] = $row;

}

success(
    "Timetable loaded successfully.",
    $data
);

$stmt->close();
$mysqli->close();