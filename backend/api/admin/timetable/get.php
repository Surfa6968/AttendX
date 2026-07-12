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
    error("Invalid timetable ID.", 400);
}

/*
|--------------------------------------------------------------------------
| Get Timetable
|--------------------------------------------------------------------------
*/

$stmt = $mysqli->prepare("

SELECT

    t.id,
    t.course_id,
    t.lecturer_id,
    t.day_of_week,
    t.start_time,
    t.end_time,
    t.room,
    t.academic_year,
    t.year_of_study,
    t.semester,

    c.course_code,
    c.course_name,

    l.employee_no,

    u.full_name AS lecturer_name

FROM timetables t

INNER JOIN courses c
    ON t.course_id = c.id

INNER JOIN lecturers l
    ON t.lecturer_id = l.id

INNER JOIN users u
    ON l.user_id = u.id

WHERE t.id = ?

LIMIT 1

");

$stmt->bind_param("i", $id);

$stmt->execute();

$result = $stmt->get_result();

if ($result->num_rows === 0) {
    $stmt->close();
    error("Timetable record not found.", 404);
}

$row = $result->fetch_assoc();

$stmt->close();

/*
|--------------------------------------------------------------------------
| Success Response
|--------------------------------------------------------------------------
*/

success(
    "Timetable loaded successfully.",
    [

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

    ]
);