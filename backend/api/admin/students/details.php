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
| Validate ID
|--------------------------------------------------------------------------
*/

$id = intval($_GET["id"] ?? 0);

if ($id <= 0) {
    error("Invalid student ID.", 400);
}

/*
|--------------------------------------------------------------------------
| Get Student Details
|--------------------------------------------------------------------------
*/

$stmt = $mysqli->prepare("
SELECT

    s.id,
    s.user_id,
    s.registration_no,
    s.faculty_id,
    s.department_id,
    s.academic_year,
    s.year_of_study,
    s.semester,
    s.phone,
    s.address,
    s.guardian_name,
    s.guardian_phone,

    u.full_name,
    u.email,
    u.gender,
    u.is_active

FROM students s

INNER JOIN users u
ON s.user_id = u.id

WHERE s.id = ?

LIMIT 1
");

$stmt->bind_param("i", $id);

$stmt->execute();

$result = $stmt->get_result();

if ($result->num_rows == 0) {
    error("Student not found.", 404);
}

$student = $result->fetch_assoc();

$stmt->close();

/*
|--------------------------------------------------------------------------
| Success
|--------------------------------------------------------------------------
*/

success(
    "Student loaded successfully.",
    $student
);