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
| Read Request
|--------------------------------------------------------------------------
*/

$data = json_decode(file_get_contents("php://input"), true);

$id = intval($data["id"] ?? 0);

if ($id <= 0) {
    error("Invalid class session ID.", 400);
}

/*
|--------------------------------------------------------------------------
| Check Class Session Exists
|--------------------------------------------------------------------------
*/

$stmt = $mysqli->prepare("

SELECT id

FROM class_sessions

WHERE id = ?

LIMIT 1

");

$stmt->bind_param("i", $id);

$stmt->execute();

$result = $stmt->get_result();

if ($result->num_rows == 0) {

    error("Class session not found.", 404);

}

$stmt->close();

/*
|--------------------------------------------------------------------------
| Check QR Sessions
|--------------------------------------------------------------------------
*/

$stmt = $mysqli->prepare("

SELECT id

FROM qr_sessions

WHERE class_session_id = ?

LIMIT 1

");

$stmt->bind_param("i", $id);

$stmt->execute();

$result = $stmt->get_result();

if ($result->num_rows > 0) {

    error(
        "Cannot delete this class session because a QR session already exists.",
        409
    );

}

$stmt->close();

/*
|--------------------------------------------------------------------------
| Delete Class Session
|--------------------------------------------------------------------------
*/

$stmt = $mysqli->prepare("

DELETE FROM class_sessions

WHERE id = ?

");

$stmt->bind_param("i", $id);

if (!$stmt->execute()) {

    error("Failed to delete class session.", 500);

}

$stmt->close();

/*
|--------------------------------------------------------------------------
| Success
|--------------------------------------------------------------------------
*/

success("Class session deleted successfully.");