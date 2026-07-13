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
| Read Keyword
|--------------------------------------------------------------------------
*/

$keyword = trim($_GET["keyword"] ?? "");

$search = "%" . $keyword . "%";

/*
|--------------------------------------------------------------------------
| Search QR Sessions
|--------------------------------------------------------------------------
*/

$stmt = $mysqli->prepare("

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

INNER JOIN users u
ON cs.lecturer_id = u.id

WHERE

c.course_code LIKE ?

OR c.course_name LIKE ?

OR u.full_name LIKE ?

OR cs.session_date LIKE ?

OR qr.status LIKE ?

ORDER BY qr.generated_at DESC

");

$stmt->bind_param(
    "sssss",
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

$stmt->close();

success(
    "Search completed successfully.",
    $data
);

$mysqli->close();

?>