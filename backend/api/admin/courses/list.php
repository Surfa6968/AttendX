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
| Get Courses
|--------------------------------------------------------------------------
*/

$sql = "

SELECT

    c.id,
    c.course_code,
    c.course_name,
    c.description,
    c.credits,

    c.faculty_id,
    f.faculty_name,

    c.department_id,
    d.department_name,

    c.lecturer_id,
    u.full_name AS lecturer_name,

    c.year_of_study,
    c.semester,
    c.is_active

FROM courses c

INNER JOIN faculties f
    ON c.faculty_id = f.id

INNER JOIN departments d
    ON c.department_id = d.id

INNER JOIN lecturers l
    ON c.lecturer_id = l.id

INNER JOIN users u
    ON l.user_id = u.id

ORDER BY
    c.course_code ASC

";

$result = $mysqli->query($sql);

if (!$result) {
    error("Failed to load courses.", 500);
}

$courses = [];

while ($row = $result->fetch_assoc()) {

    $courses[] = [

        "id" => (int)$row["id"],

        "course_code" => $row["course_code"],
        "course_name" => $row["course_name"],
        "description" => $row["description"],

        "credits" => (int)$row["credits"],

        "faculty_id" => (int)$row["faculty_id"],
        "faculty_name" => $row["faculty_name"],

        "department_id" => (int)$row["department_id"],
        "department_name" => $row["department_name"],

        "lecturer_id" => (int)$row["lecturer_id"],
        "lecturer_name" => $row["lecturer_name"],

        "year_of_study" => (int)$row["year_of_study"],
        "semester" => (int)$row["semester"],

        "is_active" => (int)$row["is_active"]

    ];

}

success(
    "Courses loaded successfully.",
    $courses
);