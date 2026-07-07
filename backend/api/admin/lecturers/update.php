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
    error("Invalid lecturer ID.",400);
}

$data = json_decode(file_get_contents("php://input"), true);

$full_name      = trim($data["full_name"] ?? "");
$email          = trim($data["email"] ?? "");
$gender         = $data["gender"] ?? "";

$employee_no    = trim($data["employee_no"] ?? "");

$faculty_id     = intval($data["faculty_id"] ?? 0);
$department_id  = intval($data["department_id"] ?? 0);

$designation    = trim($data["designation"] ?? "");
$qualification  = trim($data["qualification"] ?? "");
$specialization = trim($data["specialization"] ?? "");
$office_room    = trim($data["office_room"] ?? "");
$phone          = trim($data["phone"] ?? "");
$joined_date    = $data["joined_date"] ?? "";

$is_active      = intval($data["is_active"] ?? 1);

if(
    !required($full_name) ||
    !required($email) ||
    !required($employee_no) ||
    !required($designation)
){
    error("Please fill all required fields.",400);
}

$stmt = $mysqli->prepare("
SELECT user_id
FROM lecturers
WHERE id=?
");

$stmt->bind_param("i",$id);

$stmt->execute();

$result = $stmt->get_result();

if($result->num_rows===0){

    error("Lecturer not found.",404);

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
| Duplicate Employee Number
|--------------------------------------------------------------------------
*/

$stmt = $mysqli->prepare("
SELECT id
FROM lecturers
WHERE employee_no=?
AND id<>?
");

$stmt->bind_param(
    "si",
    $employee_no,
    $id
);

$stmt->execute();

if($stmt->get_result()->num_rows>0){

    error("Employee number already exists.",409);

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
| Update Lecturer
|--------------------------------------------------------------------------
*/

$stmt = $mysqli->prepare("
UPDATE lecturers
SET

employee_no=?,
faculty_id=?,
department_id=?,
designation=?,
qualification=?,
specialization=?,
office_room=?,
phone=?,
joined_date=?

WHERE id=?
");

$stmt->bind_param(

"siissssssi",

$employee_no,
$faculty_id,
$department_id,
$designation,
$qualification,
$specialization,
$office_room,
$phone,
$joined_date,
$id

);

if(!$stmt->execute()){

    error("Failed to update lecturer.",500);

}

$stmt->close();

success("Lecturer updated successfully.");