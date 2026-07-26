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

if ($_SESSION["user"]["role"] !== "student") {
    error("Access denied.", 403);
}

$userId = $_SESSION["user"]["id"];

/*
|--------------------------------------------------------------------------
| Get Student Details
|--------------------------------------------------------------------------
*/

$sql = "
SELECT
    s.id AS student_id,
    u.full_name
FROM students s
INNER JOIN users u
    ON s.user_id = u.id
WHERE s.user_id = ?
LIMIT 1
";

$stmt = $mysqli->prepare($sql);
$stmt->bind_param("i", $userId);
$stmt->execute();

$result = $stmt->get_result();

if ($result->num_rows == 0) {
    error("Student not found.");
}

$student = $result->fetch_assoc();

$studentId = $student["student_id"];
$studentName = $student["full_name"];

$stmt->close();

/*
|--------------------------------------------------------------------------
| Total Attendance Records
|--------------------------------------------------------------------------
*/

$sql = "
SELECT COUNT(*) AS total_classes
FROM attendance
WHERE student_id = ?
";

$stmt = $mysqli->prepare($sql);
$stmt->bind_param("i", $studentId);
$stmt->execute();

$totalClasses = $stmt->get_result()->fetch_assoc()["total_classes"];

$stmt->close();

/*
|--------------------------------------------------------------------------
| Present
|--------------------------------------------------------------------------
*/

$sql = "
SELECT COUNT(*) AS present
FROM attendance
WHERE
student_id = ?
AND attendance_status='Present'
";

$stmt = $mysqli->prepare($sql);
$stmt->bind_param("i", $studentId);
$stmt->execute();

$present = $stmt->get_result()->fetch_assoc()["present"];

$stmt->close();

/*
|--------------------------------------------------------------------------
| Absent
|--------------------------------------------------------------------------
*/

$sql = "
SELECT COUNT(*) AS absent
FROM attendance
WHERE
student_id = ?
AND attendance_status='Absent'
";

$stmt = $mysqli->prepare($sql);
$stmt->bind_param("i", $studentId);
$stmt->execute();

$absent = $stmt->get_result()->fetch_assoc()["absent"];

$stmt->close();

/*
|--------------------------------------------------------------------------
| Late
|--------------------------------------------------------------------------
*/

$sql = "
SELECT COUNT(*) AS late
FROM attendance
WHERE
student_id = ?
AND attendance_status='Late'
";

$stmt = $mysqli->prepare($sql);
$stmt->bind_param("i", $studentId);
$stmt->execute();

$late = $stmt->get_result()->fetch_assoc()["late"];

$stmt->close();

/*
|--------------------------------------------------------------------------
| Attendance Percentage
|--------------------------------------------------------------------------
*/

$attendancePercentage = 0;

if ($totalClasses > 0) {

    $attendancePercentage =
        round((($present + $late) / $totalClasses) * 100, 2);

}

/*
|--------------------------------------------------------------------------
| Response
|--------------------------------------------------------------------------
*/

success(

    "Dashboard summary loaded successfully.",

    [

        "student_name" => $studentName,

        "total_classes" => (int)$totalClasses,

        "present" => (int)$present,

        "absent" => (int)$absent,

        "late" => (int)$late,

        "attendance_percentage" => $attendancePercentage

    ]

);

$mysqli->close();

exit;