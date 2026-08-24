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
| Get Notifications
|--------------------------------------------------------------------------
*/

$sql = "
SELECT
    id,
    title,
    message,
    notification_type,
    action_url,
    is_read,
    created_at
FROM notifications
WHERE user_id = ?
ORDER BY created_at DESC
";

$stmt = mysqli_prepare($mysqli, $sql);

if (!$stmt) {
    error("Failed to prepare statement.", 500);
}

mysqli_stmt_bind_param($stmt, "i", $userId);

mysqli_stmt_execute($stmt);

$result = mysqli_stmt_get_result($stmt);

$notifications = [];

while ($row = mysqli_fetch_assoc($result)) {
    $notifications[] = $row;
}

mysqli_stmt_close($stmt);

success(
    "Notifications loaded successfully.",
    $notifications
);