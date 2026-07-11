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
    error("Unauthorized.", 401);
}

if ($_SESSION["user"]["role"] !== "admin") {
    error("Access denied.", 403);
}

/*
|--------------------------------------------------------------------------
| Get Student List
|--------------------------------------------------------------------------
*/

$stmt = $mysqli->prepare("
SELECT
    s.id,
    s.registration_no,
    s.faculty_id,
    s.department_id,
    s.academic_year,
    s.year_of_study,
    s.semester,

    u.full_name,
    u.email,
    u.gender,
    u.is_active,

    f.faculty_name,
    d.department_name

FROM students s

INNER JOIN users u
    ON s.user_id = u.id

LEFT JOIN faculties f
    ON s.faculty_id = f.id

LEFT JOIN departments d
    ON s.department_id = d.id

ORDER BY u.full_name ASC
");

if (!$stmt) {
    error($mysqli->error, 500);
}

$stmt->execute();

$result = $stmt->get_result();

$students = [];

while ($row = $result->fetch_assoc()) {

    $students[] = [

        "id" => (int)$row["id"],

        "registration_no" => $row["registration_no"],

        "full_name" => $row["full_name"],

        "email" => $row["email"],

        "gender" => $row["gender"],

        "faculty_id" => (int)$row["faculty_id"],

        "department_id" => (int)$row["department_id"],

        "faculty_name" => $row["faculty_name"],

        "department_name" => $row["department_name"],

        "academic_year" => $row["academic_year"],

        "year_of_study" => $row["year_of_study"],

        "semester" => $row["semester"],

        "is_active" => (int)$row["is_active"]

    ];
}

$stmt->close();

success(
    "Students loaded successfully.",
    $students
);