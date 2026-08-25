<?php

session_start();

require_once "../../../config/cors.php";
require_once "../../../config/database.php";
require_once "../../../helpers/response.php";


/*
|--------------------------------------------------------------------------
| Check Login
|--------------------------------------------------------------------------
*/

if (
    !isset($_SESSION["user"]) ||
    !isset($_SESSION["user"]["id"])
) {
    error("Unauthorized. Please login first.", 401);
}


$userId = (int) $_SESSION["user"]["id"];


/*
|--------------------------------------------------------------------------
| Check Lecturer Role
|--------------------------------------------------------------------------
*/

if (
    !isset($_SESSION["user"]["role"]) ||
    strtolower($_SESSION["user"]["role"]) !== "lecturer"
) {
    error("Access denied. Lecturer access required.", 403);
}


/*
|--------------------------------------------------------------------------
| Get Courses Assigned To Logged-in Lecturer
|--------------------------------------------------------------------------
|
| users.id
|     ↓
| lecturers.user_id
|     ↓
| lecturers.id
|     ↓
| courses.lecturer_id
|
*/

$sql = "
    SELECT
        c.id,
        c.course_code,
        c.course_name,
        c.description,
        c.credits,
        c.faculty_id,
        c.department_id,
        c.lecturer_id,
        c.year_of_study,
        c.semester,
        c.is_active,
        c.created_at

    FROM courses c

    INNER JOIN lecturers l
        ON c.lecturer_id = l.id

    WHERE l.user_id = ?

    AND c.is_active = 1

    ORDER BY c.course_code ASC
";


$stmt = $mysqli->prepare($sql);


if (!$stmt) {

    error(
        "Database error: " . $mysqli->error,
        500
    );
}


$stmt->bind_param(
    "i",
    $userId
);


if (!$stmt->execute()) {

    error(
        "Failed to retrieve lecturer courses.",
        500
    );
}


$result = $stmt->get_result();


/*
|--------------------------------------------------------------------------
| Build Response
|--------------------------------------------------------------------------
*/

$courses = [];


while ($row = $result->fetch_assoc()) {

    $courses[] = [

        "id" =>
            (int) $row["id"],

        "course_code" =>
            $row["course_code"],

        "course_name" =>
            $row["course_name"],

        "description" =>
            $row["description"],

        "credits" =>
            $row["credits"] !== null
                ? (int) $row["credits"]
                : null,

        "faculty_id" =>
            (int) $row["faculty_id"],

        "department_id" =>
            (int) $row["department_id"],

        "lecturer_id" =>
            (int) $row["lecturer_id"],

        "year_of_study" =>
            $row["year_of_study"],

        "semester" =>
            $row["semester"],

        "is_active" =>
            (int) $row["is_active"],

        "created_at" =>
            $row["created_at"],

    ];
}


$stmt->close();


/*
|--------------------------------------------------------------------------
| Response
|--------------------------------------------------------------------------
*/

success(
    "Lecturer courses retrieved successfully.",
    $courses
);