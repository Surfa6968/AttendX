<?php

session_start();

require_once "../../../config/cors.php";
require_once "../../../config/database.php";
require_once "../../../helpers/response.php";
require_once "../../../helpers/validator.php";

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
| Read Request
|--------------------------------------------------------------------------
*/

$data = json_decode(file_get_contents("php://input"), true);

$timetable_id = intval($data["timetable_id"] ?? 0);

$session_date = trim($data["session_date"] ?? "");

$remarks = trim($data["remarks"] ?? "");

/*
|--------------------------------------------------------------------------
| Validation
|--------------------------------------------------------------------------
*/

if (

    $timetable_id <= 0 ||

    !required($session_date)

) {

    error("Please select a timetable and session date.", 400);

}

/*
|--------------------------------------------------------------------------
| Check Timetable
|--------------------------------------------------------------------------
*/

$stmt = $mysqli->prepare("

SELECT

    id,
    course_id,
    lecturer_id,
    day_of_week,
    start_time,
    end_time,
    room,
    academic_year,
    year_of_study,
    semester

FROM timetables

WHERE id = ?

LIMIT 1

");

$stmt->bind_param("i", $timetable_id);

$stmt->execute();

$result = $stmt->get_result();

if ($result->num_rows == 0) {

    error("Selected timetable not found.", 404);

}

$timetable = $result->fetch_assoc();

$stmt->close();

/*
|--------------------------------------------------------------------------
| Prevent Duplicate Class Session
|--------------------------------------------------------------------------
*/

$stmt = $mysqli->prepare("

SELECT id

FROM class_sessions

WHERE

    timetable_id = ?

AND session_date = ?

LIMIT 1

");

$stmt->bind_param(

    "is",

    $timetable_id,

    $session_date

);

$stmt->execute();

$result = $stmt->get_result();

if ($result->num_rows > 0) {

    error("A class session already exists for this timetable and date.", 409);

}

$stmt->close();

/*
|--------------------------------------------------------------------------
| Values copied from Timetable
|--------------------------------------------------------------------------
*/

$course_id = $timetable["course_id"];

$lecturer_id = $timetable["lecturer_id"];

$start_time = $timetable["start_time"];

$end_time = $timetable["end_time"];

$room = $timetable["room"];

/*
|--------------------------------------------------------------------------
| Default Status
|--------------------------------------------------------------------------
*/

$session_status = "Scheduled";

/*
|--------------------------------------------------------------------------
| Insert Class Session
|--------------------------------------------------------------------------
*/

$stmt = $mysqli->prepare("

INSERT INTO class_sessions
(

    timetable_id,
    course_id,
    lecturer_id,
    session_date,
    start_time,
    end_time,
    room,
    session_status,
    remarks

)

VALUES
(

    ?, ?, ?, ?, ?, ?, ?, ?, ?

)

");

$stmt->bind_param(

    "iiissssss",

    $timetable_id,
    $course_id,
    $lecturer_id,
    $session_date,
    $start_time,
    $end_time,
    $room,
    $session_status,
    $remarks

);

if (!$stmt->execute()) {

    error("Failed to create class session.", 500);

}

$classSessionId = $stmt->insert_id;

$stmt->close();

/*
|--------------------------------------------------------------------------
| Success Response
|--------------------------------------------------------------------------
*/

success(

    "Class session created successfully.",

    [

        "id" => $classSessionId,

        "timetable_id" => $timetable_id,

        "course_id" => $course_id,

        "lecturer_id" => $lecturer_id,

        "session_date" => $session_date,

        "start_time" => $start_time,

        "end_time" => $end_time,

        "room" => $room,

        "session_status" => $session_status,

        "remarks" => $remarks

    ]

);