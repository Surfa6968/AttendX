<?php

session_start();

require_once "../../../config/cors.php";
require_once "../../../config/database.php";
require_once "../../../helpers/response.php";
require_once "../../../helpers/validator.php";
require_once "../../../helpers/notification.php";

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

$data = json_decode(
    file_get_contents("php://input"),
    true
);

$course_id     = intval($data["course_id"] ?? 0);
$lecturer_id   = intval($data["lecturer_id"] ?? 0);
$day_of_week   = trim($data["day_of_week"] ?? "");
$start_time    = trim($data["start_time"] ?? "");
$end_time      = trim($data["end_time"] ?? "");
$room          = trim($data["room"] ?? "");
$academic_year = trim($data["academic_year"] ?? "");
$year_of_study = trim($data["year_of_study"] ?? "");
$semester      = trim($data["semester"] ?? "");

/*
|--------------------------------------------------------------------------
| Validation
|--------------------------------------------------------------------------
*/

if ($course_id <= 0) {
    error("Course is required.", 400);
}

if ($lecturer_id <= 0) {
    error("Lecturer is required.", 400);
}

if ($day_of_week === "") {
    error("Day is required.", 400);
}

if ($start_time === "") {
    error("Start time is required.", 400);
}

if ($end_time === "") {
    error("End time is required.", 400);
}

if ($room === "") {
    error("Room is required.", 400);
}

if ($academic_year === "") {
    error("Academic year is required.", 400);
}

if ($year_of_study === "") {
    error("Year of study is required.", 400);
}

if ($semester === "") {
    error("Semester is required.", 400);
}

/*
|--------------------------------------------------------------------------
| Start Transaction
|--------------------------------------------------------------------------
*/

$mysqli->begin_transaction();

try {

    /*
    |--------------------------------------------------------------------------
    | Get Course
    |--------------------------------------------------------------------------
    */

    $stmt = $mysqli->prepare("
        SELECT
            id,
            course_code,
            course_name
        FROM courses
        WHERE id = ?
        LIMIT 1
    ");

    if (!$stmt) {
        throw new Exception("Failed to prepare course query.");
    }

    $stmt->bind_param("i", $course_id);
    $stmt->execute();

    $result = $stmt->get_result();

    if ($result->num_rows === 0) {
        $stmt->close();
        throw new Exception("Invalid course selected.");
    }

    $course = $result->fetch_assoc();

    $stmt->close();

    /*
    |--------------------------------------------------------------------------
    | Get Lecturer + User ID
    |--------------------------------------------------------------------------
    |
    | Lecturer table contains the lecturer record.
    | Notifications require users.id.
    |
    */

    $stmt = $mysqli->prepare("
        SELECT
            l.id,
            l.user_id,
            u.full_name
        FROM lecturers l
        INNER JOIN users u
            ON u.id = l.user_id
        WHERE l.id = ?
        LIMIT 1
    ");

    if (!$stmt) {
        throw new Exception("Failed to prepare lecturer query.");
    }

    $stmt->bind_param("i", $lecturer_id);
    $stmt->execute();

    $result = $stmt->get_result();

    if ($result->num_rows === 0) {
        $stmt->close();
        throw new Exception("Invalid lecturer selected.");
    }

    $lecturer = $result->fetch_assoc();

    $stmt->close();

    $lecturerUserId = (int)$lecturer["user_id"];
    $lecturerName   = $lecturer["full_name"];

    /*
    |--------------------------------------------------------------------------
    | Prevent Duplicate Room Booking
    |--------------------------------------------------------------------------
    */

    $stmt = $mysqli->prepare("
        SELECT id
        FROM timetables
        WHERE
            day_of_week = ?
            AND room = ?
            AND start_time = ?
            AND end_time = ?
        LIMIT 1
    ");

    if (!$stmt) {
        throw new Exception("Failed to prepare room booking query.");
    }

    $stmt->bind_param(
        "ssss",
        $day_of_week,
        $room,
        $start_time,
        $end_time
    );

    $stmt->execute();

    $result = $stmt->get_result();

    if ($result->num_rows > 0) {
        $stmt->close();

        throw new Exception(
            "This room is already booked during the selected time."
        );
    }

    $stmt->close();

    /*
    |--------------------------------------------------------------------------
    | Insert Timetable
    |--------------------------------------------------------------------------
    */

    $stmt = $mysqli->prepare("
        INSERT INTO timetables
        (
            course_id,
            lecturer_id,
            day_of_week,
            start_time,
            end_time,
            room,
            academic_year,
            year_of_study,
            semester
        )
        VALUES
        (
            ?, ?, ?, ?, ?, ?, ?, ?, ?
        )
    ");

    if (!$stmt) {
        throw new Exception("Failed to prepare timetable insertion.");
    }

    $stmt->bind_param(
        "iisssssss",
        $course_id,
        $lecturer_id,
        $day_of_week,
        $start_time,
        $end_time,
        $room,
        $academic_year,
        $year_of_study,
        $semester
    );

    if (!$stmt->execute()) {
        $stmt->close();

        throw new Exception("Failed to create timetable.");
    }

    $timetableId = $stmt->insert_id;

    $stmt->close();

    /*
    |--------------------------------------------------------------------------
    | Create Notification for Lecturer
    |--------------------------------------------------------------------------
    */

    $lecturerTitle = "New Timetable Assigned";

    $lecturerMessage =
        $course["course_code"] . " - " .
        $course["course_name"] .
        " has been scheduled on " .
        $day_of_week .
        " from " .
        date("h:i A", strtotime($start_time)) .
        " to " .
        date("h:i A", strtotime($end_time)) .
        " in " .
        $room .
        ".";

    $actionUrl = "/lecturer/timetable";

    $notificationType = "Course";

    $lecturerNotificationCreated = createNotification(
        $mysqli,
        $lecturerUserId,
        $lecturerTitle,
        $lecturerMessage,
        $notificationType,
        $actionUrl
    );

    if (!$lecturerNotificationCreated) {
        throw new Exception(
            "Failed to create lecturer notification."
        );
    }

    /*
    |--------------------------------------------------------------------------
    | Find Students
    |--------------------------------------------------------------------------
    |
    | Current students table does not have course_id.
    |
    | Therefore we notify students matching:
    |
    |   year_of_study
    |   semester
    |   academic_year
    |
    */

    $stmt = $mysqli->prepare("
        SELECT user_id
        FROM students
        WHERE
            year_of_study = ?
            AND semester = ?
            AND academic_year = ?
            AND user_id IS NOT NULL
    ");

    if (!$stmt) {
        throw new Exception(
            "Failed to prepare student query."
        );
    }

    $stmt->bind_param(
        "sss",
        $year_of_study,
        $semester,
        $academic_year
    );

    $stmt->execute();

    $result = $stmt->get_result();

    $studentUserIds = [];

    while ($student = $result->fetch_assoc()) {
        $studentUserIds[] = (int)$student["user_id"];
    }

    $stmt->close();

    /*
    |--------------------------------------------------------------------------
    | Create Student Notifications
    |--------------------------------------------------------------------------
    */

    $studentTitle = "New Timetable Added";

    $studentMessage =
        $course["course_code"] . " - " .
        $course["course_name"] .
        " has been scheduled on " .
        $day_of_week .
        " from " .
        date("h:i A", strtotime($start_time)) .
        " to " .
        date("h:i A", strtotime($end_time)) .
        " in " .
        $room .
        ".";

    $studentActionUrl = "/student/timetable";

    if (count($studentUserIds) > 0) {
        foreach ($studentUserIds as $studentUserId) {

            $notificationCreated = createNotification(
                $mysqli,
                $studentUserId,
                $studentTitle,
                $studentMessage,
                $notificationType,
                $studentActionUrl
            );

            if (!$notificationCreated) {
                throw new Exception(
                    "Failed to create student notification."
                );
            }
        }
    }

    /*
    |--------------------------------------------------------------------------
    | Commit Transaction
    |--------------------------------------------------------------------------
    */

    $mysqli->commit();

    /*
    |--------------------------------------------------------------------------
    | Success Response
    |--------------------------------------------------------------------------
    */

    success(
        "Timetable created successfully.",
        [
            "timetable_id" => $timetableId,
            "course_id" => $course_id,
            "lecturer_id" => $lecturer_id,
            "lecturer_notified" => true,
            "students_notified" => count($studentUserIds)
        ]
    );

} catch (Exception $e) {

    /*
    |--------------------------------------------------------------------------
    | Rollback
    |--------------------------------------------------------------------------
    */

    $mysqli->rollback();

    error(
        $e->getMessage(),
        500
    );
}