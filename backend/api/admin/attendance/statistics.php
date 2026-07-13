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
| Total Attendance
|--------------------------------------------------------------------------
*/

$totalAttendance = 0;

$result = $mysqli->query("SELECT COUNT(*) AS total FROM attendance");

if ($result) {
    $totalAttendance = (int)$result->fetch_assoc()["total"];
}

/*
|--------------------------------------------------------------------------
| Present
|--------------------------------------------------------------------------
*/

$present = 0;

$result = $mysqli->query("
SELECT COUNT(*) AS total
FROM attendance
WHERE attendance_status='Present'
");

if ($result) {
    $present = (int)$result->fetch_assoc()["total"];
}

/*
|--------------------------------------------------------------------------
| Absent
|--------------------------------------------------------------------------
*/

$absent = 0;

$result = $mysqli->query("
SELECT COUNT(*) AS total
FROM attendance
WHERE attendance_status='Absent'
");

if ($result) {
    $absent = (int)$result->fetch_assoc()["total"];
}

/*
|--------------------------------------------------------------------------
| Late
|--------------------------------------------------------------------------
*/

$late = 0;

$result = $mysqli->query("
SELECT COUNT(*) AS total
FROM attendance
WHERE attendance_status='Late'
");

if ($result) {
    $late = (int)$result->fetch_assoc()["total"];
}

/*
|--------------------------------------------------------------------------
| Today's Attendance
|--------------------------------------------------------------------------
*/

$today = 0;

$result = $mysqli->query("
SELECT COUNT(*) AS total
FROM attendance
WHERE DATE(scanned_at)=CURDATE()
");

if ($result) {
    $today = (int)$result->fetch_assoc()["total"];
}

/*
|--------------------------------------------------------------------------
| Attendance Percentage
|--------------------------------------------------------------------------
*/

$percentage = 0;

if ($totalAttendance > 0) {

    $percentage = round(

        ($present / $totalAttendance) * 100,

        2

    );

}

/*
|--------------------------------------------------------------------------
| Success
|--------------------------------------------------------------------------
*/

success(

    "Attendance statistics loaded successfully.",

    [

        "total_attendance" => $totalAttendance,

        "present" => $present,

        "absent" => $absent,

        "late" => $late,

        "today" => $today,

        "attendance_percentage" => $percentage

    ]

);

$mysqli->close();

exit;

?>