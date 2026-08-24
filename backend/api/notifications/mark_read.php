<?php

session_start();

require_once __DIR__ . "/../../config/cors.php";
require_once __DIR__ . "/../../config/database.php";
require_once __DIR__ . "/../../helpers/response.php";

/*
|--------------------------------------------------------------------------
| Authentication
|--------------------------------------------------------------------------
*/

if (!isset($_SESSION["user"])) {
    error("Unauthorized.", 401);
}

$userId = $_SESSION["user"]["id"];

/*
|--------------------------------------------------------------------------
| Read JSON Request
|--------------------------------------------------------------------------
*/

$data = json_decode(
    file_get_contents("php://input"),
    true
);

$id = intval($data["id"] ?? 0);

/*
|--------------------------------------------------------------------------
| Request Validation
|--------------------------------------------------------------------------
*/

if ($id <= 0) {
    error("Notification ID is required.", 400);
}

/*
|--------------------------------------------------------------------------
| Mark Notification as Read
|--------------------------------------------------------------------------
*/

$sql = "
UPDATE notifications
SET is_read = 1
WHERE id = ?
AND user_id = ?
";

$stmt = mysqli_prepare($mysqli, $sql);

if (!$stmt) {
    error("Failed to prepare statement.", 500);
}

mysqli_stmt_bind_param(
    $stmt,
    "ii",
    $id,
    $userId
);

mysqli_stmt_execute($stmt);

if (mysqli_stmt_affected_rows($stmt) > 0) {

    mysqli_stmt_close($stmt);

    success(
        "Notification marked as read.",
        [
            "id" => $id
        ]
    );
}

mysqli_stmt_close($stmt);

error(
    "Notification not found or already marked as read.",
    404
);