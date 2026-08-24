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
| Mark All Notifications As Read
|--------------------------------------------------------------------------
*/

$sql = "
UPDATE notifications
SET is_read = 1
WHERE user_id = ?
AND is_read = 0
";

$stmt = mysqli_prepare($mysqli, $sql);

if (!$stmt) {
    error("Failed to prepare statement.", 500);
}

mysqli_stmt_bind_param(
    $stmt,
    "i",
    $userId
);

if (!mysqli_stmt_execute($stmt)) {

    mysqli_stmt_close($stmt);

    error(
        "Failed to mark notifications as read.",
        500
    );
}

$updatedRows = mysqli_stmt_affected_rows($stmt);

mysqli_stmt_close($stmt);

/*
|--------------------------------------------------------------------------
| Success
|--------------------------------------------------------------------------
*/

success(
    "All notifications marked as read.",
    [
        "updated" => $updatedRows
    ]
);