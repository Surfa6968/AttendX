<?php

error_reporting(E_ALL);
ini_set("display_errors", 1);

session_start();

require_once "../../config/cors.php";
require_once "../../config/database.php";
require_once "../../helpers/response.php";


/*
|--------------------------------------------------------------------------
| Authentication
|--------------------------------------------------------------------------
*/

if (!isset($_SESSION["user"])) {
    error("Unauthorized.", 401);
}

if ($_SESSION["user"]["role"] !== "lecturer") {
    error("Access denied.", 403);
}


$userId = intval(
    $_SESSION["user"]["id"] ?? 0
);

if ($userId <= 0) {
    error("Invalid lecturer user.", 401);
}


/*
|--------------------------------------------------------------------------
| Get Lecturer
|--------------------------------------------------------------------------
*/

$stmt = $mysqli->prepare("
    SELECT
        l.id AS lecturer_id,
        l.user_id,
        u.full_name,
        u.email
    FROM lecturers l

    INNER JOIN users u
        ON u.id = l.user_id

    WHERE l.user_id = ?

    LIMIT 1
");

$stmt->bind_param(
    "i",
    $userId
);

$stmt->execute();

$result = $stmt->get_result();

if ($result->num_rows === 0) {

    $stmt->close();

    error(
        "Lecturer record not found.",
        404
    );
}

$lecturer = $result->fetch_assoc();

$stmt->close();

$lecturerId = intval(
    $lecturer["lecturer_id"]
);


/*
|--------------------------------------------------------------------------
| Get Lecturer Timetable
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

        c.course_name

    FROM timetables t

    INNER JOIN courses c
        ON t.course_id = c.id

    WHERE t.lecturer_id = ?

    ORDER BY

        CASE t.day_of_week

            WHEN 'Monday' THEN 1
            WHEN 'Tuesday' THEN 2
            WHEN 'Wednesday' THEN 3
            WHEN 'Thursday' THEN 4
            WHEN 'Friday' THEN 5
            WHEN 'Saturday' THEN 6
            WHEN 'Sunday' THEN 7

            ELSE 8

        END,

        t.start_time
");

$stmt->bind_param(
    "i",
    $lecturerId
);

$stmt->execute();

$result = $stmt->get_result();

$timetable = [];

while ($row = $result->fetch_assoc()) {

    $timetable[] = [

        "id" =>
            (int)$row["id"],

        "course_id" =>
            (int)$row["course_id"],

        "lecturer_id" =>
            (int)$row["lecturer_id"],

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
| Calculate Statistics
|--------------------------------------------------------------------------
*/

$totalCourses = count(
    array_unique(
        array_column(
            $timetable,
            "course_id"
        )
    )
);


$dayOfWeek = date("l");


$todayClasses = 0;

foreach ($timetable as $item) {

    if (
        $item["day_of_week"] === $dayOfWeek
    ) {

        $todayClasses++;

    }

}


/*
|--------------------------------------------------------------------------
| Success
|--------------------------------------------------------------------------
*/

success(
    "Lecturer dashboard loaded successfully.",
    [

        "lecturer" => [

            "lecturer_id" =>
                $lecturerId,

            "user_id" =>
                $userId,

            "full_name" =>
                $lecturer["full_name"],

            "email" =>
                $lecturer["email"]

        ],

        "statistics" => [

            "totalCourses" =>
                $totalCourses,

            "todayClasses" =>
                $todayClasses,

            "activeQRSession" =>
                0,

            "todayAttendance" =>
                0

        ],

        "upcomingClasses" =>
            array_slice(
                $timetable,
                0,
                10
            ),

        "recentAttendance" =>
            []

    ]
);