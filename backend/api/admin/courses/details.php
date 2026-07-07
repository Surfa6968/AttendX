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
    error("Invalid course ID.",400);
}

$stmt = $mysqli->prepare("
SELECT
id,
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
FROM courses
WHERE id=?
LIMIT 1
");

$stmt->bind_param("i",$id);

$stmt->execute();

$result = $stmt->get_result();

if($result->num_rows===0){

    error("Course not found.",404);

}

$course = $result->fetch_assoc();

$stmt->close();

success(
    "Course loaded successfully.",
    $course
);