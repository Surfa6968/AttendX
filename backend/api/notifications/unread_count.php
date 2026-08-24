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
| Count Unread Notifications
|--------------------------------------------------------------------------
*/

$sql = "
SELECT COUNT(*) AS unread_count
FROM notifications
WHERE user_id = ?
AND is_read = 0
";

$stmt = mysqli_prepare($mysqli, $sql);

if (!$stmt) {
    error("Failed to prepare statement.", 500);
}

mysqli_stmt_bind_param($stmt, "i", $userId);

mysqli_stmt_execute($stmt);

$result = mysqli_stmt_get_result($stmt);

$row = mysqli_fetch_assoc($result);

mysqli_stmt_close($stmt);

success(
    "Unread count loaded successfully.",
    [
        "unread_count" => (int)$row["unread_count"]
    ]
);