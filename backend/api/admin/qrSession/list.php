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
| Load QR Sessions
|--------------------------------------------------------------------------
*/

$sql = "

SELECT

    qr.id,

    qr.class_session_id,

    qr.qr_token,

    qr.qr_image,

    qr.generated_at,

    qr.expires_at,

    qr.scan_limit,

    qr.total_scans,

    qr.status,

    qr.is_active,

    cs.session_date,

    cs.start_time,

    cs.end_time,

    c.course_code,

    c.course_name,

    u.full_name AS lecturer_name

FROM qr_sessions qr

INNER JOIN class_sessions cs
    ON qr.class_session_id = cs.id

INNER JOIN courses c
    ON cs.course_id = c.id

INNER JOIN lecturers l
    ON cs.lecturer_id = l.id

INNER JOIN users u
    ON l.user_id = u.id

ORDER BY qr.generated_at DESC

";

$result = $mysqli->query($sql);

$data = [];

while ($row = $result->fetch_assoc()) {

    $data[] = [

        "id" => (int)$row["id"],

        "class_session_id" => (int)$row["class_session_id"],

        "course_code" => $row["course_code"],

        "course_name" => $row["course_name"],

        "lecturer_name" => $row["lecturer_name"],

        "session_date" => $row["session_date"],

        "start_time" => $row["start_time"],

        "end_time" => $row["end_time"],

        "qr_token" => $row["qr_token"],

        "qr_image" => $row["qr_image"],

        "generated_at" => $row["generated_at"],

        "expires_at" => $row["expires_at"],

        "scan_limit" => (int)$row["scan_limit"],

        "total_scans" => (int)$row["total_scans"],

        "status" => $row["status"],

        "is_active" => (int)$row["is_active"]

    ];

}

/*
|--------------------------------------------------------------------------
| Success Response
|--------------------------------------------------------------------------
*/

success(

    "QR sessions loaded successfully.",

    $data

);

$mysqli->close();

exit;

?>