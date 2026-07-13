<?php

session_start();

require_once "../../../config/cors.php";
require_once "../../../config/database.php";
require_once "../../../helpers/response.php";

if (!isset($_SESSION["user"])) {
    error("Unauthorized.", 401);
}

if ($_SESSION["user"]["role"] !== "student") {
    error("Access denied.", 403);
}

$data = json_decode(file_get_contents("php://input"), true);

$qr_token = trim($data["qr_token"] ?? "");

if ($qr_token === "") {
    error("QR Token is required.", 422);
}

/*
|--------------------------------------------------------------------------
| Get Student
|--------------------------------------------------------------------------
*/

$user_id = $_SESSION["user"]["id"];

$stmt = $mysqli->prepare("
SELECT id
FROM students
WHERE user_id = ?
LIMIT 1
");

$stmt->bind_param("i", $user_id);
$stmt->execute();

$student = $stmt->get_result()->fetch_assoc();

if (!$student) {
    error("Student not found.", 404);
}

$student_id = $student["id"];

/*
|--------------------------------------------------------------------------
| Get QR Session
|--------------------------------------------------------------------------
*/

$stmt = $mysqli->prepare("
SELECT
    id,
    class_session_id,
    status,
    is_active,
    expires_at,
    scan_limit,
    total_scans
FROM qr_sessions
WHERE qr_token=?
LIMIT 1
");

$stmt->bind_param("s", $qr_token);
$stmt->execute();

$qr = $stmt->get_result()->fetch_assoc();

if (!$qr) {
    error("Invalid QR.", 404);
}

if ($qr["status"] !== "Active" || !$qr["is_active"]) {
    error("QR Session Closed.", 409);
}

if (strtotime($qr["expires_at"]) < time()) {
    error("QR Expired.", 409);
}

if ($qr["total_scans"] >= $qr["scan_limit"]) {
    error("Scan limit reached.", 409);
}

/*
|--------------------------------------------------------------------------
| Prevent Duplicate Attendance
|--------------------------------------------------------------------------
*/

$stmt = $mysqli->prepare("
SELECT id
FROM attendance
WHERE
qr_session_id=?
AND student_id=?
LIMIT 1
");

$stmt->bind_param(
    "ii",
    $qr["id"],
    $student_id
);

$stmt->execute();

if ($stmt->get_result()->num_rows > 0) {
    error("Attendance already marked.", 409);
}

/*
|--------------------------------------------------------------------------
| Insert Attendance
|--------------------------------------------------------------------------
*/

$device_info = $_SERVER["HTTP_USER_AGENT"] ?? "";

$ip =
$_SERVER["REMOTE_ADDR"] ?? "";

$stmt = $mysqli->prepare("
INSERT INTO attendance
(
qr_session_id,
class_session_id,
student_id,
attendance_status,
marked_by,
device_info,
ip_address
)
VALUES
(
?,
?,
?,
'Present',
'QR',
?,
?
)
");

$stmt->bind_param(
    "iiiss",
    $qr["id"],
    $qr["class_session_id"],
    $student_id,
    $device_info,
    $ip
);

$stmt->execute();

/*
|--------------------------------------------------------------------------
| Increase Scan Count
|--------------------------------------------------------------------------
*/

$stmt = $mysqli->prepare("
UPDATE qr_sessions
SET total_scans = total_scans + 1
WHERE id=?
");

$stmt->bind_param("i", $qr["id"]);
$stmt->execute();

success("Attendance marked successfully.");

?>