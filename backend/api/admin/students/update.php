<?php

session_start();

require_once "../../../config/cors.php";
require_once "../../../config/database.php";
require_once "../../../helpers/response.php";
require_once "../../../helpers/validator.php";

if (!isset($_SESSION["user"])) {
    error("Unauthorized.",401);
}

if ($_SESSION["user"]["role"] !== "admin") {
    error("Access denied.",403);
}

$id = intval($_GET["id"] ?? 0);

if($id<=0){
    error("Invalid student ID.",400);
}

$data = json_decode(file_get_contents("php://input"), true);

$full_name = trim($data["full_name"] ?? "");
$email = trim($data["email"] ?? "");
$gender = $data["gender"] ?? "";

$registration_no = trim($data["registration_no"] ?? "");

$faculty_id = intval($data["faculty_id"] ?? 0);
$department_id = intval($data["department_id"] ?? 0);

$year_of_study = $data["year_of_study"] ?? "";
$semester = $data["semester"] ?? "";
$intake_year = intval($data["intake_year"] ?? 0);

$phone = trim($data["phone"] ?? "");
$address = trim($data["address"] ?? "");
$guardian_name = trim($data["guardian_name"] ?? "");
$guardian_phone = trim($data["guardian_phone"] ?? "");

$is_active = intval($data["is_active"] ?? 1);

if(
    !required($full_name) ||
    !required($email) ||
    !required($registration_no)
){
    error("Please fill all required fields.",400);
}

/*
|--------------------------------------------------------------------------
| Get User ID
|--------------------------------------------------------------------------
*/

$stmt = $mysqli->prepare("
SELECT user_id
FROM students
WHERE id=?
");

$stmt->bind_param("i",$id);

$stmt->execute();

$result = $stmt->get_result();

if($result->num_rows===0){

    error("Student not found.",404);

}

$user_id = $result->fetch_assoc()["user_id"];

$stmt->close();

/*
|--------------------------------------------------------------------------
| Duplicate Email
|--------------------------------------------------------------------------
*/

$stmt = $mysqli->prepare("
SELECT id
FROM users
WHERE email=?
AND id<>?
");

$stmt->bind_param(
    "si",
    $email,
    $user_id
);

$stmt->execute();

if($stmt->get_result()->num_rows>0){

    error("Email already exists.",409);

}

$stmt->close();

/*
|--------------------------------------------------------------------------
| Duplicate Registration Number
|--------------------------------------------------------------------------
*/

$stmt = $mysqli->prepare("
SELECT id
FROM students
WHERE registration_no=?
AND id<>?
");

$stmt->bind_param(
    "si",
    $registration_no,
    $id
);

$stmt->execute();

if($stmt->get_result()->num_rows>0){

    error("Registration number already exists.",409);

}

$stmt->close();

/*
|--------------------------------------------------------------------------
| Update User
|--------------------------------------------------------------------------
*/

$stmt = $mysqli->prepare("
UPDATE users
SET

full_name=?,
email=?,
gender=?,
is_active=?

WHERE id=?
");

$stmt->bind_param(

"sssii",

$full_name,
$email,
$gender,
$is_active,
$user_id

);

$stmt->execute();

$stmt->close();

/*
|--------------------------------------------------------------------------
| Update Student
|--------------------------------------------------------------------------
*/

$stmt = $mysqli->prepare("
UPDATE students
SET

registration_no=?,
faculty_id=?,
department_id=?,
year_of_study=?,
semester=?,
intake_year=?,
phone=?,
address=?,
guardian_name=?,
guardian_phone=?

WHERE id=?
");

$stmt->bind_param(

"siississssi",

$registration_no,
$faculty_id,
$department_id,
$year_of_study,
$semester,
$intake_year,
$phone,
$address,
$guardian_name,
$guardian_phone,
$id

);

if(!$stmt->execute()){

    error("Failed to update student.",500);

}

$stmt->close();

success("Student updated successfully.");