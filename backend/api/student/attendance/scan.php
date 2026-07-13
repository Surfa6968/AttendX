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
    error("Unauthorized.",401);
}

if ($_SESSION["user"]["role"] !== "student") {
    error("Access denied.",403);
}

/*
|--------------------------------------------------------------------------
| Read JSON
|--------------------------------------------------------------------------
*/

$data = json_decode(file_get_contents("php://input"), true);

$qr_token = trim($data["qr_token"] ?? "");

if ($qr_token == "") {
    error("QR Token is required.");
}

/*
|--------------------------------------------------------------------------
| Student
|--------------------------------------------------------------------------
*/

$user_id = $_SESSION["user"]["id"];

$sql = "
SELECT id
FROM students
WHERE user_id=?
LIMIT 1
";

$stmt = $mysqli->prepare($sql);
$stmt->bind_param("i",$user_id);
$stmt->execute();

$result = $stmt->get_result();

if($result->num_rows==0){
    error("Student not found.");
}

$student = $result->fetch_assoc();
$student_id = $student["id"];

/*
|--------------------------------------------------------------------------
| QR Session
|--------------------------------------------------------------------------
*/

$sql = "
SELECT *
FROM qr_sessions
WHERE qr_token=?
LIMIT 1
";

$stmt = $mysqli->prepare($sql);
$stmt->bind_param("s",$qr_token);
$stmt->execute();

$result = $stmt->get_result();

if($result->num_rows==0){
    error("Invalid QR Code.");
}

$qr = $result->fetch_assoc();

/*
|--------------------------------------------------------------------------
| Check Active
|--------------------------------------------------------------------------
*/

if($qr["status"]!="Active"){
    error("QR Session is closed.");
}

if($qr["is_active"]!=1){
    error("QR Session inactive.");
}

if(strtotime($qr["expires_at"]) < time()){
    error("QR has expired.");
}

/*
|--------------------------------------------------------------------------
| Duplicate Attendance
|--------------------------------------------------------------------------
*/

$sql = "
SELECT id
FROM attendance
WHERE qr_session_id=?
AND student_id=?
LIMIT 1
";

$stmt = $mysqli->prepare($sql);
$stmt->bind_param(
    "ii",
    $qr["id"],
    $student_id
);
$stmt->execute();

$result = $stmt->get_result();

if($result->num_rows>0){
    error("Attendance already marked.");
}

/*
|--------------------------------------------------------------------------
| Scan Limit
|--------------------------------------------------------------------------
*/

if(
    $qr["scan_limit"] != null &&
    $qr["total_scans"] >= $qr["scan_limit"]
){
    error("Scan limit reached.");
}

/*
|--------------------------------------------------------------------------
| Insert Attendance
|--------------------------------------------------------------------------
*/

$sql = "
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
";

$stmt = $mysqli->prepare($sql);

$device = $_SERVER["HTTP_USER_AGENT"] ?? "";
$ip = $_SERVER["REMOTE_ADDR"] ?? "";

$stmt->bind_param(
    "iiisss",
    $qr["id"],
    $qr["class_session_id"],
    $student_id,
    $device,
    $ip
);

$stmt->execute();

/*
|--------------------------------------------------------------------------
| Increase Scan Count
|--------------------------------------------------------------------------
*/

$sql="
UPDATE qr_sessions
SET total_scans=total_scans+1
WHERE id=?
";

$stmt=$mysqli->prepare($sql);
$stmt->bind_param("i",$qr["id"]);
$stmt->execute();

/*
|--------------------------------------------------------------------------
| Success
|--------------------------------------------------------------------------
*/

success(
    "Attendance marked successfully."
);

$mysqli->close();

?>