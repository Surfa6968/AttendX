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


if ($_SESSION["user"]["role"] !== "lecturer") {

    error("Access denied.", 403);

}


$userId = (int) $_SESSION["user"]["id"];


/*
|--------------------------------------------------------------------------
| Get Lecturer
|--------------------------------------------------------------------------
*/

$stmt = $mysqli->prepare("
    SELECT id
    FROM lecturers
    WHERE user_id = ?
    LIMIT 1
");

$stmt->bind_param(
    "i",
    $userId
);

$stmt->execute();

$result = $stmt->get_result();


if ($result->num_rows === 0) {

    error(
        "Lecturer profile not found.",
        404
    );

}


$lecturer = $result->fetch_assoc();

$lecturerId = (int) $lecturer["id"];

$stmt->close();


/*
|--------------------------------------------------------------------------
| Search
|--------------------------------------------------------------------------
*/

$keyword = trim(
    $_GET["keyword"] ?? ""
);


/*
|--------------------------------------------------------------------------
| Load Lecturer QR Sessions
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

    cs.room,

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

WHERE

    cs.lecturer_id = ?

";


$params = [$lecturerId];

$types = "i";


/*
|--------------------------------------------------------------------------
| Optional Search
|--------------------------------------------------------------------------
*/

if ($keyword !== "") {

    $sql .= "

        AND (

            c.course_code LIKE ?

            OR c.course_name LIKE ?

            OR cs.session_date LIKE ?

            OR qr.status LIKE ?

        )

    ";

    $search = "%" . $keyword . "%";

    $params[] = $search;
    $params[] = $search;
    $params[] = $search;
    $params[] = $search;

    $types .= "ssss";

}


$sql .= "

    ORDER BY

        qr.generated_at DESC

";


$stmt = $mysqli->prepare($sql);

$stmt->bind_param(
    $types,
    ...$params
);

$stmt->execute();

$result = $stmt->get_result();


$data = [];


while ($row = $result->fetch_assoc()) {

    $data[] = [

        "id" => (int) $row["id"],

        "class_session_id" =>
            (int) $row["class_session_id"],

        "course_code" =>
            $row["course_code"],

        "course_name" =>
            $row["course_name"],

        "lecturer_name" =>
            $row["lecturer_name"],

        "session_date" =>
            $row["session_date"],

        "start_time" =>
            $row["start_time"],

        "end_time" =>
            $row["end_time"],

        "room" =>
            $row["room"],

        "qr_token" =>
            $row["qr_token"],

        "qr_image" =>
            $row["qr_image"],

        "generated_at" =>
            $row["generated_at"],

        "expires_at" =>
            $row["expires_at"],

        "scan_limit" =>
            (int) $row["scan_limit"],

        "total_scans" =>
            (int) $row["total_scans"],

        "status" =>
            $row["status"],

        "is_active" =>
            (int) $row["is_active"]

    ];

}


$stmt->close();


/*
|--------------------------------------------------------------------------
| Response
|--------------------------------------------------------------------------
*/

success(
    "Lecturer QR sessions loaded successfully.",
    $data
);


$mysqli->close();

exit;

?>