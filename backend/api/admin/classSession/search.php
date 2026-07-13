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
| Search Class Sessions
|--------------------------------------------------------------------------
*/

$stmt = $mysqli->prepare("

SELECT

    cs.id,
    cs.timetable_id,
    cs.course_id,
    cs.lecturer_id,

    cs.session_date,
    cs.start_time,
    cs.end_time,
    cs.room,
    cs.session_status,
    cs.remarks,

    c.course_code,
    c.course_name,

    l.employee_no,

    u.full_name AS lecturer_name

FROM class_sessions cs

INNER JOIN courses c
    ON cs.course_id = c.id

INNER JOIN lecturers l
    ON cs.lecturer_id = l.id

INNER JOIN users u
    ON l.user_id = u.id

WHERE

    c.course_code LIKE ?

OR  c.course_name LIKE ?

OR  u.full_name LIKE ?

OR  cs.session_date LIKE ?

OR  cs.room LIKE ?

OR  cs.session_status LIKE ?

OR  cs.remarks LIKE ?

ORDER BY

    cs.session_date DESC,
    cs.start_time ASC

");

$stmt->bind_param(

    "sssssss",

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

        "timetable_id" => (int)$row["timetable_id"],

        "course_id" => (int)$row["course_id"],

        "lecturer_id" => (int)$row["lecturer_id"],

        "course_code" => $row["course_code"],

        "course_name" => $row["course_name"],

        "employee_no" => $row["employee_no"],

        "lecturer_name" => $row["lecturer_name"],

        "session_date" => $row["session_date"],

        "start_time" => $row["start_time"],

        "end_time" => $row["end_time"],

        "room" => $row["room"],

        "session_status" => $row["session_status"],

        "remarks" => $row["remarks"]

    ];

}

$stmt->close();

/*
|--------------------------------------------------------------------------
| Success
|--------------------------------------------------------------------------
*/

success(

    "Class sessions loaded successfully.",

    $data

);