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
| Search Keyword
|--------------------------------------------------------------------------
*/

$keyword = trim($_GET["keyword"] ?? "");

if ($keyword === "") {
    error("Search keyword is required.", 400);
}

$search = "%{$keyword}%";

/*
|--------------------------------------------------------------------------
| Search Attendance
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

WHERE

u.full_name LIKE ?

OR s.registration_no LIKE ?

OR c.course_code LIKE ?

OR c.course_name LIKE ?

OR a.attendance_status LIKE ?

OR cs.session_date LIKE ?

ORDER BY a.scanned_at DESC

";

$stmt = $mysqli->prepare($sql);

$stmt->bind_param(
    "ssssss",
    $search,
    $search,
    $search,
    $search,
    $search,
    $search
);

$stmt->execute();

$result = $stmt->get_result();

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

$stmt->close();

/*
|--------------------------------------------------------------------------
| Success
|--------------------------------------------------------------------------
*/

success(

    "Attendance search completed.",

    $data

);

$mysqli->close();

exit;

?>