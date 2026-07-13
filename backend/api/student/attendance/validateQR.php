<?php

session_start();

require_once "../../../config/cors.php";
require_once "../../../config/database.php";
require_once "../../../helpers/response.php";

/*
|--------------------------------------------------------------------------
| Student Authentication
|--------------------------------------------------------------------------
*/

if (!isset($_SESSION["user"])) {
    error("Unauthorized.", 401);
}

if ($_SESSION["user"]["role"] !== "student") {
    error("Access denied.", 403);
}

/*
|--------------------------------------------------------------------------
| Read JSON
|--------------------------------------------------------------------------
*/

$data = json_decode(file_get_contents("php://input"), true);

if (
    empty($data["qr_token"])
) {
    error("QR token is required.");
}

$qrToken = trim($data["qr_token"]);

/*
|--------------------------------------------------------------------------
| Find QR Session
|--------------------------------------------------------------------------
*/

$stmt = $mysqli->prepare("
SELECT
    qr.id,
    qr.class_session_id,
    qr.scan_limit,
    qr.total_scans,
    qr.expires_at,
    qr.status,
    qr.is_active,
    c.course_code,
    c.course_name,
    cs.session_date,
    cs.start_time,
    cs.end_time,
    u.full_name AS lecturer_name
FROM qr_sessions qr
INNER JOIN class_sessions cs
    ON qr.class_session_id = cs.id
INNER JOIN courses c
    ON cs.course_id = c.id
INNER JOIN users u
    ON cs.lecturer_id = u.id
WHERE qr.qr_token = ?
LIMIT 1
");

$stmt->bind_param("s", $qrToken);
$stmt->execute();

$result = $stmt->get_result();

if ($result->num_rows === 0) {
    error("Invalid QR Code.", 404);
}

$qr = $result->fetch_assoc();

/*
|--------------------------------------------------------------------------
| Validate Status
|--------------------------------------------------------------------------
*/

if ($qr["status"] !== "Active") {
    error("QR Session is closed.");
}

if ($qr["is_active"] != 1) {
    error("QR Session is inactive.");
}

if (strtotime($qr["expires_at"]) < time()) {
    error("QR Code has expired.");
}

if ($qr["total_scans"] >= $qr["scan_limit"]) {
    error("Scan limit reached.");
}

/*
|--------------------------------------------------------------------------
| Get Student ID
|--------------------------------------------------------------------------
*/

$stmt = $mysqli->prepare("
SELECT id
FROM students
WHERE user_id = ?
LIMIT 1
");

$stmt->bind_param("i", $_SESSION["user"]["id"]);
$stmt->execute();

$result = $stmt->get_result();

if ($result->num_rows === 0) {
    error("Student not found.");
}

$student = $result->fetch_assoc();

$studentId = $student["id"];

/*
|--------------------------------------------------------------------------
| Prevent Duplicate Attendance
|--------------------------------------------------------------------------
*/

$stmt = $mysqli->prepare("
SELECT id
FROM attendance
WHERE qr_session_id = ?
AND student_id = ?
LIMIT 1
");

$stmt->bind_param(
    "ii",
    $qr["id"],
    $studentId
);

$stmt->execute();

$result = $stmt->get_result();

if ($result->num_rows > 0) {
    error("You have already marked attendance for this session.");
}

/*
|--------------------------------------------------------------------------
| Success
|--------------------------------------------------------------------------
*/

success(
    "QR Code is valid.",
    [
        "qr_session_id" => (int)$qr["id"],
        "class_session_id" => (int)$qr["class_session_id"],
        "course_code" => $qr["course_code"],
        "course_name" => $qr["course_name"],
        "lecturer_name" => $qr["lecturer_name"],
        "session_date" => $qr["session_date"],
        "start_time" => $qr["start_time"],
        "end_time" => $qr["end_time"]
    ]
);

$stmt->close();
$mysqli->close();
exit;