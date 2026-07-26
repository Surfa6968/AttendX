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
    error("Unauthorized.",401);
}

if ($_SESSION["user"]["role"] !== "student") {
    error("Access denied.",403);
}

$userId = $_SESSION["user"]["id"];

/*
|--------------------------------------------------------------------------
| Student Profile
|--------------------------------------------------------------------------
*/

$stmt = $mysqli->prepare("
SELECT

u.full_name,
u.email,
u.gender,
u.profile_photo,
u.is_active,

s.registration_no,
s.year_of_study,
s.semester,
s.academic_year,
s.phone,
s.address,
s.guardian_name,
s.guardian_phone,

f.faculty_name,
d.department_name

FROM users u

INNER JOIN students s
ON u.id=s.user_id

LEFT JOIN faculties f
ON s.faculty_id=f.id

LEFT JOIN departments d
ON s.department_id=d.id

WHERE u.id=?

LIMIT 1
");

$stmt->bind_param("i",$userId);

$stmt->execute();

$result=$stmt->get_result();

if($result->num_rows==0){

    error("Student not found.");

}

$data=$result->fetch_assoc();

success(
    "Student profile loaded successfully.",
    $data
);

$mysqli->close();