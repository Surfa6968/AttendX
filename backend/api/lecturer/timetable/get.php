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

if (
    !isset($_SESSION["user"]["role"]) ||
    $_SESSION["user"]["role"] !== "lecturer"
) {
    error("Access denied.", 403);
}


/*
|--------------------------------------------------------------------------
| Logged-in User
|--------------------------------------------------------------------------
*/

$user_id = (int) $_SESSION["user"]["id"];


/*
|--------------------------------------------------------------------------
| Find Lecturer
|--------------------------------------------------------------------------
|
| users.id
|    ↓
| lecturers.user_id
|    ↓
| lecturers.id
|
|--------------------------------------------------------------------------
*/

$stmt = $mysqli->prepare("
    SELECT
        l.id AS lecturer_id,
        l.employee_no,
        u.full_name AS lecturer_name

    FROM lecturers l

    INNER JOIN users u
        ON l.user_id = u.id

    WHERE l.user_id = ?

    LIMIT 1
");

if (!$stmt) {
    error(
        "Failed to prepare lecturer query.",
        500
    );
}

$stmt->bind_param("i", $user_id);

$stmt->execute();

$result = $stmt->get_result();

if ($result->num_rows === 0) {

    $stmt->close();

    error(
        "Lecturer profile not found.",
        404
    );
}

$lecturer = $result->fetch_assoc();

$lecturer_id = (int) $lecturer["lecturer_id"];

$stmt->close();


/*
|--------------------------------------------------------------------------
| Get Lecturer Timetable
|--------------------------------------------------------------------------
|
| IMPORTANT:
|
| We use `timetables`, matching the Admin timetable API.
|
| Only records belonging to the logged-in lecturer are returned.
|
|--------------------------------------------------------------------------
*/

$stmt = $mysqli->prepare("
    SELECT

        t.id AS timetable_id,

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
        c.course_name

    FROM timetables t

    INNER JOIN courses c
        ON t.course_id = c.id

    WHERE t.lecturer_id = ?

    ORDER BY

        CASE LOWER(t.day_of_week)

            WHEN 'monday' THEN 1
            WHEN 'tuesday' THEN 2
            WHEN 'wednesday' THEN 3
            WHEN 'thursday' THEN 4
            WHEN 'friday' THEN 5
            WHEN 'saturday' THEN 6
            WHEN 'sunday' THEN 7

            ELSE 8

        END,

        t.start_time ASC
");

if (!$stmt) {
    error(
        "Failed to prepare timetable query.",
        500
    );
}

$stmt->bind_param(
    "i",
    $lecturer_id
);

$stmt->execute();

$result = $stmt->get_result();


/*
|--------------------------------------------------------------------------
| Build Timetable Data
|--------------------------------------------------------------------------
*/

$data = [];

while ($row = $result->fetch_assoc()) {

    $data[] = [

        "timetable_id" =>
            (int) $row["timetable_id"],

        "course_id" =>
            (int) $row["course_id"],

        "lecturer_id" =>
            (int) $row["lecturer_id"],

        "course_code" =>
            $row["course_code"],

        "course_name" =>
            $row["course_name"],

        "day_of_week" =>
            $row["day_of_week"],

        "start_time" =>
            $row["start_time"],

        "end_time" =>
            $row["end_time"],

        "room" =>
            $row["room"],

        "academic_year" =>
            $row["academic_year"],

        "year_of_study" =>
            $row["year_of_study"],

        "semester" =>
            $row["semester"]

    ];
}

$stmt->close();


/*
|--------------------------------------------------------------------------
| Response
|--------------------------------------------------------------------------
*/

success(
    "Lecturer timetable loaded successfully.",
    [
        "lecturer" => [

            "lecturer_id" =>
                $lecturer_id,

            "employee_no" =>
                $lecturer["employee_no"],

            "lecturer_name" =>
                $lecturer["lecturer_name"]

        ],

        "timetable" =>
            $data,

        "total" =>
            count($data)

    ]
);


/*
|--------------------------------------------------------------------------
| Close
|--------------------------------------------------------------------------
*/

$mysqli->close();

exit;