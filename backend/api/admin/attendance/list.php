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
| Load Attendance Records
|--------------------------------------------------------------------------
*/

$sql = "

SELECT

    a.id,
    a.qr_session_id,
    a.class_session_id,
    a.student_id,
    a.attendance_status,
    a.marked_by,
    a.scanned_at,
    a.latitude,
    a.longitude,
    a.device_info,
    a.ip_address,
    a.remarks,

    cs.session_date,
    cs.start_time,
    cs.end_time,

    c.course_code,
    c.course_name,

    u.full_name AS student_name,
    s.registration_no

FROM attendance a

INNER JOIN students s
ON a.student_id = s.id

INNER JOIN users u
ON s.user_id = u.id

INNER JOIN class_sessions cs
ON a.class_session_id = cs.id

INNER JOIN courses c
ON cs.course_id = c.id

ORDER BY a.scanned_at DESC

";

$result = $mysqli->query($sql);

$data = [];

while ($row = $result->fetch_assoc()) {

    $data[] = [

        "id" => (int)$row["id"],

        "qr_session_id" => (int)$row["qr_session_id"],

        "class_session_id" => (int)$row["class_session_id"],

        "student_id" => (int)$row["student_id"],

        "student_name" => $row["student_name"],

        "registration_no" => $row["registration_no"],

        "course_code" => $row["course_code"],

        "course_name" => $row["course_name"],

        "session_date" => $row["session_date"],

        "start_time" => $row["start_time"],

        "end_time" => $row["end_time"],

        "attendance_status" => $row["attendance_status"],

        "marked_by" => $row["marked_by"],

        "scanned_at" => $row["scanned_at"],

        "latitude" => $row["latitude"],

        "longitude" => $row["longitude"],

        "device_info" => $row["device_info"],

        "ip_address" => $row["ip_address"],

        "remarks" => $row["remarks"]

    ];

}

/*
|--------------------------------------------------------------------------
| Success Response
|--------------------------------------------------------------------------
*/

success(

    "Attendance records loaded successfully.",

    $data

);

$mysqli->close();

exit;

?>