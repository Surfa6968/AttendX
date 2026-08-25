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

    error(
        "Unauthorized.",
        401
    );

}


if ($_SESSION["user"]["role"] !== "lecturer") {

    error(
        "Access denied.",
        403
    );

}


$userId =
    (int) $_SESSION["user"]["id"];


/*
|--------------------------------------------------------------------------
| Find Lecturer
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

$result =
    $stmt->get_result();


if ($result->num_rows === 0) {

    error(
        "Lecturer profile not found.",
        404
    );

}


$lecturer =
    $result->fetch_assoc();

$lecturerId =
    (int) $lecturer["id"];

$stmt->close();


/*
|--------------------------------------------------------------------------
| Request
|--------------------------------------------------------------------------
*/

$data = json_decode(
    file_get_contents("php://input"),
    true
);


$id =
    (int) ($data["id"] ?? 0);


if ($id <= 0) {

    error(
        "Invalid QR Session ID.",
        400
    );

}


/*
|--------------------------------------------------------------------------
| Verify Ownership
|--------------------------------------------------------------------------
*/

$stmt = $mysqli->prepare("

    SELECT

        qr.id,

        qr.status

    FROM qr_sessions qr

    INNER JOIN class_sessions cs

        ON qr.class_session_id = cs.id

    WHERE

        qr.id = ?

        AND cs.lecturer_id = ?

    LIMIT 1

");


$stmt->bind_param(
    "ii",
    $id,
    $lecturerId
);

$stmt->execute();

$result =
    $stmt->get_result();


if ($result->num_rows === 0) {

    error(
        "QR Session not found or access denied.",
        404
    );

}


$row =
    $result->fetch_assoc();

$stmt->close();


/*
|--------------------------------------------------------------------------
| Already Closed
|--------------------------------------------------------------------------
*/

if (
    $row["status"] === "Closed"
) {

    success(

        "QR Session already closed.",

        [
            "id" => $id,
            "status" => "Closed"
        ]

    );

}


/*
|--------------------------------------------------------------------------
| Close
|--------------------------------------------------------------------------
*/

$status = "Closed";

$is_active = 0;


$stmt = $mysqli->prepare("

    UPDATE qr_sessions

    SET

        status = ?,

        is_active = ?,

        closed_at = NOW()

    WHERE id = ?

");


$stmt->bind_param(
    "sii",
    $status,
    $is_active,
    $id
);


if (!$stmt->execute()) {

    error(
        "Failed to close QR Session.",
        500
    );

}


$stmt->close();


/*
|--------------------------------------------------------------------------
| Response
|--------------------------------------------------------------------------
*/

success(

    "QR Session closed successfully.",

    [

        "id" => $id,

        "status" => "Closed"

    ]

);


$mysqli->close();

exit;

?>