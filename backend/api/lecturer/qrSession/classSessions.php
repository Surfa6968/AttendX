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

/*
|--------------------------------------------------------------------------
| Lecturer Only
|--------------------------------------------------------------------------
*/

if ($_SESSION["user"]["role"] !== "lecturer") {
    error("Access denied.", 403);
}

/*
|--------------------------------------------------------------------------
| Logged-in User
|--------------------------------------------------------------------------
*/

$user_id = intval($_SESSION["user"]["id"] ?? 0);

if ($user_id <= 0) {
    error("Invalid user session.", 401);
}

/*
|--------------------------------------------------------------------------
| Get Lecturer Class Sessions
|--------------------------------------------------------------------------
|
| Only class sessions belonging to the logged-in lecturer are returned.
|
*/

$sql = "

SELECT

    cs.id,

    cs.session_date,

    cs.start_time,

    cs.end_time,

    cs.session_status,

    cs.remarks,

    c.id AS course_id,

    c.course_code,

    c.course_name,

    c.credits,

    l.id AS lecturer_id,

    u.full_name AS lecturer_name,

    u.email AS lecturer_email,

    t.room

FROM class_sessions cs

INNER JOIN courses c
    ON c.id = cs.course_id

INNER JOIN lecturers l
    ON l.id = cs.lecturer_id

INNER JOIN users u
    ON u.id = l.user_id

LEFT JOIN timetables t
    ON t.id = cs.timetable_id

WHERE l.user_id = ?

ORDER BY
    cs.session_date ASC,
    cs.start_time ASC

";

$stmt = $mysqli->prepare($sql);

if (!$stmt) {
    error("Failed to prepare class session query.", 500);
}

$stmt->bind_param("i", $user_id);

$stmt->execute();

$result = $stmt->get_result();

$data = [];

/*
|--------------------------------------------------------------------------
| Build Response
|--------------------------------------------------------------------------
*/

while ($row = $result->fetch_assoc()) {

    $data[] = [

        "id" => (int)$row["id"],

        "course_id" => (int)$row["course_id"],

        "course_code" => $row["course_code"],

        "course_name" => $row["course_name"],

        "credits" => $row["credits"] !== null
            ? (int)$row["credits"]
            : null,

        "lecturer_id" => (int)$row["lecturer_id"],

        "lecturer_name" => $row["lecturer_name"],

        "lecturer_email" => $row["lecturer_email"],

        "session_date" => $row["session_date"],

        "start_time" => $row["start_time"],

        "end_time" => $row["end_time"],

        "room" => $row["room"] ?? "",

        "session_status" => $row["session_status"],

        "remarks" => $row["remarks"] ?? ""

    ];

}

$stmt->close();

$mysqli->close();

/*
|--------------------------------------------------------------------------
| Success
|--------------------------------------------------------------------------
*/

success(
    "Lecturer class sessions loaded successfully.",
    $data
);

exit;

?>