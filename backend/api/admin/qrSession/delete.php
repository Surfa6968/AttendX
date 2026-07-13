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
| Read JSON
|--------------------------------------------------------------------------
*/

$data = json_decode(file_get_contents("php://input"), true);

$id = intval($data["id"] ?? 0);

if ($id <= 0) {
    error("Invalid QR Session ID.", 400);
}

/*
|--------------------------------------------------------------------------
| Get QR Image Path
|--------------------------------------------------------------------------
*/

$stmt = $mysqli->prepare("
    SELECT qr_image
    FROM qr_sessions
    WHERE id = ?
    LIMIT 1
");

$stmt->bind_param("i", $id);
$stmt->execute();

$result = $stmt->get_result();

if ($result->num_rows == 0) {
    error("QR Session not found.", 404);
}

$row = $result->fetch_assoc();

$stmt->close();

/*
|--------------------------------------------------------------------------
| Delete Image
|--------------------------------------------------------------------------
*/

$imagePath = "../../../../" . $row["qr_image"];

if (file_exists($imagePath)) {
    unlink($imagePath);
}

/*
|--------------------------------------------------------------------------
| Delete Database Record
|--------------------------------------------------------------------------
*/

$stmt = $mysqli->prepare("
    DELETE FROM qr_sessions
    WHERE id = ?
");

$stmt->bind_param("i", $id);

if (!$stmt->execute()) {
    error("Failed to delete QR Session.", 500);
}

$stmt->close();

/*
|--------------------------------------------------------------------------
| Success
|--------------------------------------------------------------------------
*/

success(
    "QR Session deleted successfully.",
    [
        "id" => $id
    ]
);

$mysqli->close();