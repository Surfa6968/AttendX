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

$result = $mysqli->query("
    SELECT COUNT(*) AS total
    FROM attendance
");

if ($result) {
    $row = $result->fetch_assoc();
    $totalAttendance = (int)$row["total"];
}

/*
|--------------------------------------------------------------------------
| Present Today
|--------------------------------------------------------------------------
*/

$presentToday = 0;

$result = $mysqli->query("
    SELECT COUNT(*) AS total
    FROM attendance
    WHERE DATE(scanned_at) = CURDATE()
    AND attendance_status = 'Present'
");

if ($result) {
    $row = $result->fetch_assoc();
    $presentToday = (int)$row["total"];
}

/*
|--------------------------------------------------------------------------
| Absent Today
|--------------------------------------------------------------------------
*/

$absentToday = 0;

$result = $mysqli->query("
    SELECT COUNT(*) AS total
    FROM attendance
    WHERE DATE(scanned_at) = CURDATE()
    AND attendance_status = 'Absent'
");

if ($result) {
    $row = $result->fetch_assoc();
    $absentToday = (int)$row["total"];
}

/*
|--------------------------------------------------------------------------
| Attendance Percentage
|--------------------------------------------------------------------------
*/

$attendanceRate = 0;

if ($totalAttendance > 0) {

    $presentResult = $mysqli->query("
        SELECT COUNT(*) AS total
        FROM attendance
        WHERE attendance_status = 'Present'
    ");

    $presentRow = $presentResult->fetch_assoc();

    $presentCount = (int)$presentRow["total"];

    $attendanceRate = round(
        ($presentCount / $totalAttendance) * 100,
        2
    );
}

/*
|--------------------------------------------------------------------------
| Response
|--------------------------------------------------------------------------
*/

success(
    "Dashboard statistics loaded successfully.",
    [
        "totalAttendance" => $totalAttendance,
        "presentToday" => $presentToday,
        "absentToday" => $absentToday,
        "attendanceRate" => $attendanceRate
    ]
);