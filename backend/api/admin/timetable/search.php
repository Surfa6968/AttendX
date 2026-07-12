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
| Search Keyword
|--------------------------------------------------------------------------
*/

$keyword = "%" . trim($_GET["keyword"] ?? "") . "%";

/*
|--------------------------------------------------------------------------
| Search Timetable
|--------------------------------------------------------------------------
*/

$stmt = $mysqli->prepare("

SELECT

    t.id,
    t.course_id,
    t.lecturer_id,

    c.course_code,
    c.course_name,

    l.employee_no,

    u.full_name AS lecturer_name,

    t.day_of_week,
    t.start_time,
    t.end_time,
    t.room,
    t.academic_year,
    t.year_of_study,
    t.semester

FROM timetables t

INNER JOIN courses c
    ON t.course_id = c.id

INNER JOIN lecturers l
    ON t.lecturer_id = l.id

INNER JOIN users u
    ON l.user_id = u.id

WHERE

    c.course_code LIKE ?

    OR c.course_name LIKE ?

    OR u.full_name LIKE ?

    OR l.employee_no LIKE ?

    OR t.day_of_week LIKE ?

    OR t.room LIKE ?

    OR t.academic_year LIKE ?

    OR t.year_of_study LIKE ?

    OR t.semester LIKE ?

ORDER BY

FIELD(
    t.day_of_week,
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
    'Sunday'
),

t.start_time ASC

");

$stmt->bind_param(

    "sssssssss",

    $keyword,
    $keyword,
    $keyword,
    $keyword,
    $keyword,
    $keyword,
    $keyword,
    $keyword,
    $keyword

);

$stmt->execute();

$result = $stmt->get_result();

$data = [];

while ($row = $result->fetch_assoc()) {

    $data[] = [

        "id" => (int)$row["id"],

        "course_id" => (int)$row["course_id"],
        "lecturer_id" => (int)$row["lecturer_id"],

        "course_code" => $row["course_code"],
        "course_name" => $row["course_name"],

        "employee_no" => $row["employee_no"],
        "lecturer_name" => $row["lecturer_name"],

        "day_of_week" => $row["day_of_week"],

        "start_time" => $row["start_time"],
        "end_time" => $row["end_time"],

        "room" => $row["room"],

        "academic_year" => $row["academic_year"],
        "year_of_study" => $row["year_of_study"],
        "semester" => $row["semester"]

    ];

}

$stmt->close();

/*
|--------------------------------------------------------------------------
| Success
|--------------------------------------------------------------------------
*/

success(
    "Timetable loaded successfully.",
    $data
);