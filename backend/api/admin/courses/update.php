<?php

session_start();

require_once "../../../config/cors.php";
require_once "../../../config/database.php";
require_once "../../../helpers/response.php";
require_once "../../../helpers/validator.php";

/*
|--------------------------------------------------------------------------
| Authorization
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
| Course ID
|--------------------------------------------------------------------------
*/

$id = intval($_GET["id"] ?? 0);

if ($id <= 0) {
    error("Invalid course ID.", 400);
}

/*
|--------------------------------------------------------------------------
| Read JSON
|--------------------------------------------------------------------------
*/

$data = json_decode(file_get_contents("php://input"), true);

$course_code    = strtoupper(trim($data["course_code"] ?? ""));
$course_name    = trim($data["course_name"] ?? "");
$description    = trim($data["description"] ?? "");
$credits        = intval($data["credits"] ?? 0);

$faculty_id     = intval($data["faculty_id"] ?? 0);
$department_id  = intval($data["department_id"] ?? 0);
$lecturer_id    = intval($data["lecturer_id"] ?? 0);

$academic_year  = intval($data["academic_year"] ?? 0);
$semester       = intval($data["semester"] ?? 0);
$is_active      = intval($data["is_active"] ?? 1);

/*
|--------------------------------------------------------------------------
| Validation
|--------------------------------------------------------------------------
*/

if (
    !required($course_code) ||
    !required($course_name)
) {
    error("Course code and course name are required.", 400);
}

if ($faculty_id <= 0) {
    error("Please select a faculty.", 400);
}

if ($department_id <= 0) {
    error("Please select a department.", 400);
}

if ($lecturer_id <= 0) {
    error("Please select a lecturer.", 400);
}

if ($credits <= 0) {
    error("Credits must be greater than zero.", 400);
}

if (!in_array($academic_year, [1,2,3,4])) {
    error("Invalid academic year.", 400);
}

if (!in_array($semester, [1,2])) {
    error("Invalid semester.", 400);
}

/*
|--------------------------------------------------------------------------
| Duplicate Course Code
|--------------------------------------------------------------------------
*/

$stmt = $mysqli->prepare("
SELECT id
FROM courses
WHERE course_code=?
AND id<>?
LIMIT 1
");

$stmt->bind_param(
    "si",
    $course_code,
    $id
);

$stmt->execute();

$result = $stmt->get_result();

if ($result->num_rows > 0) {

    error("Course code already exists.",409);

}

$stmt->close();

/*
|--------------------------------------------------------------------------
| Update Course
|--------------------------------------------------------------------------
*/

$stmt = $mysqli->prepare("
UPDATE courses
SET
course_code=?,
course_name=?,
description=?,
credits=?,
faculty_id=?,
department_id=?,
lecturer_id=?,
academic_year=?,
semester=?,
is_active=?
WHERE id=?
");

$stmt->bind_param(

"sssiiiiiiii",

$course_code,
$course_name,
$description,
$credits,
$faculty_id,
$department_id,
$lecturer_id,
$academic_year,
$semester,
$is_active,
$id

);

if (!$stmt->execute()) {

    error("Failed to update course.",500);

}

$stmt->close();

/*
|--------------------------------------------------------------------------
| Success
|--------------------------------------------------------------------------
*/

success("Course updated successfully.");