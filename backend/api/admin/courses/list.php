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

$sql = "
SELECT
    c.id,
    c.course_code,
    c.course_name,
    c.credits,
    c.academic_year,
    c.semester,
    c.is_active,
    f.faculty_name,
    d.department_name,
    u.full_name AS lecturer_name
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

$courses = [];

while($row = $result->fetch_assoc()){

    $courses[] = $row;

}

success(
    "Courses loaded successfully.",
    $courses
);