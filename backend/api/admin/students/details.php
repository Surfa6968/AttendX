<?php

session_start();

require_once "../../../config/cors.php";
require_once "../../../config/database.php";
require_once "../../../helpers/response.php";

if (!isset($_SESSION["user"])) {
    error("Unauthorized.",401);
}

if ($_SESSION["user"]["role"] !== "admin") {
    error("Access denied.",403);
}

$id = intval($_GET["id"] ?? 0);

if($id <= 0){
    error("Invalid student ID.",400);
}

$stmt = $mysqli->prepare("
SELECT

s.id,
s.user_id,

u.full_name,
u.email,
u.gender,
u.is_active,

s.registration_no,
s.faculty_id,
s.department_id,
s.year_of_study,
s.semester,
s.intake_year,
s.phone,
s.address,
s.guardian_name,
s.guardian_phone

FROM students s

INNER JOIN users u
ON s.user_id=u.id

WHERE s.id=?

LIMIT 1
");

$stmt->bind_param("i",$id);

$stmt->execute();

$result = $stmt->get_result();

if($result->num_rows===0){

    error("Student not found.",404);

}

$data = $result->fetch_assoc();

$stmt->close();

success(
    "Student loaded successfully.",
    $data
);