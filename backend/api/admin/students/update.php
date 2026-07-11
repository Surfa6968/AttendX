<?php

session_start();

require_once "../../../config/cors.php";
require_once "../../../config/database.php";
require_once "../../../helpers/response.php";
require_once "../../../helpers/validator.php";

if (!isset($_SESSION["user"])) {
    error("Unauthorized.", 401);
}

if ($_SESSION["user"]["role"] !== "admin") {
    error("Access denied.", 403);
}

$id = intval($_GET["id"] ?? 0);

if ($id <= 0) {
    error("Invalid student ID.", 400);
}

$data = json_decode(file_get_contents("php://input"), true);

$registration_no = trim($data["registration_no"] ?? "");
$full_name       = trim($data["full_name"] ?? "");
$email           = trim($data["email"] ?? "");
$gender          = trim($data["gender"] ?? "");

$faculty_id      = intval($data["faculty_id"] ?? 0);
$department_id   = intval($data["department_id"] ?? 0);

$academic_year   = trim($data["academic_year"] ?? "");
$year_of_study   = trim($data["year_of_study"] ?? "");
$semester        = trim($data["semester"] ?? "");

$phone           = trim($data["phone"] ?? "");
$address         = trim($data["address"] ?? "");
$guardian_name   = trim($data["guardian_name"] ?? "");
$guardian_phone  = trim($data["guardian_phone"] ?? "");

$is_active       = intval($data["is_active"] ?? 1);

if (
    !required($registration_no) ||
    !required($full_name) ||
    !required($email)
) {
    error("Please fill all required fields.", 400);
}

/* Get user id */

$stmt = $mysqli->prepare("
SELECT user_id
FROM students
WHERE id=?
");

$stmt->bind_param("i",$id);
$stmt->execute();

$result=$stmt->get_result();

if($result->num_rows==0){
    error("Student not found.",404);
}

$user_id=$result->fetch_assoc()["user_id"];
$stmt->close();

/* Update users */

$stmt=$mysqli->prepare("
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

/* Update students */

$stmt=$mysqli->prepare("
UPDATE students
SET
registration_no=?,
faculty_id=?,
department_id=?,
academic_year=?,
year_of_study=?,
semester=?,
phone=?,
address=?,
guardian_name=?,
guardian_phone=?
WHERE id=?
");

$stmt->bind_param(
"siisssssssi",
$registration_no,
$faculty_id,
$department_id,
$academic_year,
$year_of_study,
$semester,
$phone,
$address,
$guardian_name,
$guardian_phone,
$id
);

if(!$stmt->execute()){
    error($stmt->error,500);
}

$stmt->close();

success("Student updated successfully.");