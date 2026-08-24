<?php

session_start();

require_once __DIR__ . "/../../config/cors.php";
require_once __DIR__ . "/../../config/database.php";
require_once __DIR__ . "/../../helpers/response.php";
require_once __DIR__ . "/../../helpers/createNotification.php";

/*
|--------------------------------------------------------------------------
| Authentication
|--------------------------------------------------------------------------
*/

if (!isset($_SESSION["user"])) {
    error("Unauthorized.", 401);
}

$userId = (int) $_SESSION["user"]["id"];

/*
|--------------------------------------------------------------------------
| Create Test Notification
|--------------------------------------------------------------------------
*/

$result = createNotification(
    $mysqli,
    $userId,
    "Test Notification",
    "This is a test notification from the AttendX notification system.",
    "System",
    null
);

if (!$result) {
    error("Failed to create notification.", 500);
}

success(
    "Test notification created successfully.",
    [
        "user_id" => $userId
    ]
);