<?php

session_start();

require_once "../../../config/cors.php";
require_once "../../../config/database.php";
require_once "../../../helpers/response.php";
require_once "../../../helpers/validator.php";

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
| Read Request
|--------------------------------------------------------------------------
*/

$data = json_decode(file_get_contents("php://input"), true);

$course_id      = intval($data["course_id"] ?? 0);
$lecturer_id    = intval($data["lecturer_id"] ?? 0);
$day_of_week    = trim($data["day_of_week"] ?? "");
$start_time     = trim($data["start_time"] ?? "");
$end_time       = trim($data["end_time"] ?? "");
$room           = trim($data["room"] ?? "");
$academic_year  = trim($data["academic_year"] ?? "");
$year_of_study  = trim($data["year_of_study"] ?? "");
$semester       = trim($data["semester"] ?? "");

/*
|--------------------------------------------------------------------------
| Validation
|--------------------------------------------------------------------------
*/

if ($course_id <= 0) error("course_id missing",400);

if ($lecturer_id <= 0) error("lecturer_id missing",400);

if (empty($day_of_week)) error("day missing",400);

if (empty($start_time)) error("start time missing",400);

if (empty($end_time)) error("end time missing",400);

if (empty($room)) error("room missing",400);

if (empty($academic_year)) error("academic year missing",400);

if (empty($year_of_study)) error("year missing",400);

if (empty($semester)) error("semester missing",400); 

/*
|--------------------------------------------------------------------------
| Check Course
|--------------------------------------------------------------------------
*/

$stmt = $mysqli->prepare("
SELECT id
FROM courses
WHERE id = ?
LIMIT 1
");

$stmt->bind_param("i", $course_id);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows == 0) {
    error("Invalid course selected.", 400);
}

$stmt->close();

/*
|--------------------------------------------------------------------------
| Check Lecturer
|--------------------------------------------------------------------------
*/

$stmt = $mysqli->prepare("
SELECT id
FROM lecturers
WHERE id = ?
LIMIT 1
");

$stmt->bind_param("i", $lecturer_id);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows == 0) {
    error("Invalid lecturer selected.", 400);
}

$stmt->close();

/*
|--------------------------------------------------------------------------
| Prevent Duplicate Room Booking
|--------------------------------------------------------------------------
*/

$stmt = $mysqli->prepare("
SELECT id
FROM timetables
WHERE
    day_of_week = ?
AND room = ?
AND start_time = ?
AND end_time = ?
LIMIT 1
");

$stmt->bind_param(
    "ssss",
    $day_of_week,
    $room,
    $start_time,
    $end_time
);

$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows > 0) {
    error("This room is already booked during the selected time.", 409);
}

$stmt->close();

/*
|--------------------------------------------------------------------------
| Insert Timetable
|--------------------------------------------------------------------------
*/

$stmt = $mysqli->prepare("
INSERT INTO timetables
(
    course_id,
    lecturer_id,
    day_of_week,
    start_time,
    end_time,
    room,
    academic_year,
    year_of_study,
    semester
)
VALUES
(
    ?, ?, ?, ?, ?, ?, ?, ?, ?
)
");

$stmt->bind_param(
    "iisssssss",
    $course_id,
    $lecturer_id,
    $day_of_week,
    $start_time,
    $end_time,
    $room,
    $academic_year,
    $year_of_study,
    $semester
);

if (!$stmt->execute()) {
    error("Failed to create timetable.", 500);
}

$stmt->close();

/*
|--------------------------------------------------------------------------
| Success
|--------------------------------------------------------------------------
*/

success("Timetable created successfully.");