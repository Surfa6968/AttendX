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
    error("Unauthorized.",401);
}

if ($_SESSION["user"]["role"] !== "admin") {
    error("Access denied.",403);
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

/*
|--------------------------------------------------------------------------
| Validation
|--------------------------------------------------------------------------
*/

if(
    !required($course_code) ||
    !required($course_name)
){
    error("Course code and course name are required.",400);
}

if($faculty_id<=0){
    error("Select a faculty.",400);
}

if($department_id<=0){
    error("Select a department.",400);
}

if($lecturer_id<=0){
    error("Select a lecturer.",400);
}

if($credits<=0){
    error("Credits must be greater than zero.",400);
}

if(!in_array($academic_year,[1,2,3,4])){
    error("Invalid academic year.",400);
}

if(!in_array($semester,[1,2])){
    error("Invalid semester.",400);
}

/*
|--------------------------------------------------------------------------
| Duplicate Check
|--------------------------------------------------------------------------
*/

$stmt = $mysqli->prepare("
SELECT id
FROM courses
WHERE course_code=?
LIMIT 1
");

$stmt->bind_param(
    "s",
    $course_code
);

$stmt->execute();

$result = $stmt->get_result();

if($result->num_rows>0){

    error("Course code already exists.",409);

}

$stmt->close();

/*
|--------------------------------------------------------------------------
| Insert Course
|--------------------------------------------------------------------------
*/

$stmt = $mysqli->prepare("
INSERT INTO courses
(
course_code,
course_name,
description,
credits,
faculty_id,
department_id,
lecturer_id,
academic_year,
semester,
is_active
)
VALUES
(
?,?,?,?,?,?,?,?,?,1
)
");

$stmt->bind_param(

"sssiiiiii",

$course_code,
$course_name,
$description,
$credits,
$faculty_id,
$department_id,
$lecturer_id,
$academic_year,
$semester

);

if(!$stmt->execute()){

    error("Failed to create course.",500);

}

$id = $stmt->insert_id;

$stmt->close();

/*
|--------------------------------------------------------------------------
| Success
|--------------------------------------------------------------------------
*/

success(

    "Course created successfully.",

    [

        "id"=>$id

    ]

);