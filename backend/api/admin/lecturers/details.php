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

if($id<=0){
    error("Invalid lecturer ID.",400);
}

$stmt = $mysqli->prepare("
SELECT

l.id,
l.user_id,
u.full_name,
u.email,
u.gender,
u.is_active,

l.employee_no,
l.faculty_id,
l.department_id,
l.designation,
l.qualification,
l.specialization,
l.office_room,
l.phone,
l.joined_date

FROM lecturers l

INNER JOIN users u
ON l.user_id=u.id

WHERE l.id=?

LIMIT 1
");

$stmt->bind_param("i",$id);

$stmt->execute();

$result = $stmt->get_result();

if($result->num_rows===0){

    error("Lecturer not found.",404);

}

$data = $result->fetch_assoc();

$stmt->close();

success(
    "Lecturer loaded successfully.",
    $data
);