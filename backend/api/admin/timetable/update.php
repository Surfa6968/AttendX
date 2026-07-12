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
| Validate ID
|--------------------------------------------------------------------------
*/

$id = intval($_GET["id"] ?? 0);

if ($id <= 0) {
    error("Invalid timetable ID.", 400);
}

/*
|--------------------------------------------------------------------------
| Read JSON
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

if (
    $course_id <= 0 ||
    $lecturer_id <= 0 ||
    !required($day_of_week) ||
    !required($start_time) ||
    !required($end_time) ||
    !required($room) ||
    !required($academic_year) ||
    !required($year_of_study) ||
    !required($semester)
) {
    error("Please fill all required fields.", 400);
}

if (strtotime($start_time) >= strtotime($end_time)) {
    error("End time must be after start time.", 400);
}

/*
|--------------------------------------------------------------------------
| Check Record Exists
|--------------------------------------------------------------------------
*/

$stmt = $mysqli->prepare("
SELECT id
FROM timetables
WHERE id=?
");

$stmt->bind_param("i", $id);
$stmt->execute();

if ($stmt->get_result()->num_rows == 0) {
    error("Timetable record not found.", 404);
}

$stmt->close();

/*
|--------------------------------------------------------------------------
| Update Timetable
|--------------------------------------------------------------------------
*/

$stmt = $mysqli->prepare("
UPDATE timetables
SET
    course_id=?,
    lecturer_id=?,
    day_of_week=?,
    start_time=?,
    end_time=?,
    room=?,
    academic_year=?,
    year_of_study=?,
    semester=?
WHERE id=?
");

$stmt->bind_param(
    "iisssssssi",
    $course_id,
    $lecturer_id,
    $day_of_week,
    $start_time,
    $end_time,
    $room,
    $academic_year,
    $year_of_study,
    $semester,
    $id
);

if (!$stmt->execute()) {
    error("Failed to update timetable.", 500);
}

$stmt->close();

/*
|--------------------------------------------------------------------------
| Success
|--------------------------------------------------------------------------
*/

success("Timetable updated successfully.");