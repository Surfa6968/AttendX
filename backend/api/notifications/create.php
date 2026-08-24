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

/*
|--------------------------------------------------------------------------
| Admin Authorization
|--------------------------------------------------------------------------
*/

if ($_SESSION["user"]["role"] !== "admin") {
    error("Access denied.", 403);
}

/*
|--------------------------------------------------------------------------
| Read JSON Request
|--------------------------------------------------------------------------
*/

$data = json_decode(
    file_get_contents("php://input"),
    true
);

$userId = (int)($data["user_id"] ?? 0);
$title = trim($data["title"] ?? "");
$message = trim($data["message"] ?? "");
$notificationType = trim(
    $data["notification_type"] ?? "System"
);
$actionUrl = trim(
    $data["action_url"] ?? ""
);

/*
|--------------------------------------------------------------------------
| Validation
|--------------------------------------------------------------------------
*/

if ($userId <= 0) {
    error("User ID is required.", 400);
}

if ($title === "") {
    error("Notification title is required.", 400);
}

if ($message === "") {
    error("Notification message is required.", 400);
}

$allowedTypes = [
    "System",
    "Attendance",
    "Course",
    "Reminder",
    "Announcement"
];

if (!in_array($notificationType, $allowedTypes, true)) {
    error("Invalid notification type.", 400);
}

/*
|--------------------------------------------------------------------------
| Check User Exists
|--------------------------------------------------------------------------
*/

$checkSql = "
SELECT id
FROM users
WHERE id = ?
LIMIT 1
";

$checkStmt = mysqli_prepare(
    $mysqli,
    $checkSql
);

if (!$checkStmt) {
    error("Database error.", 500);
}

mysqli_stmt_bind_param(
    $checkStmt,
    "i",
    $userId
);

mysqli_stmt_execute($checkStmt);

$result = mysqli_stmt_get_result($checkStmt);

if (mysqli_num_rows($result) === 0) {

    mysqli_stmt_close($checkStmt);

    error("User not found.", 404);
}

mysqli_stmt_close($checkStmt);

/*
|--------------------------------------------------------------------------
| Insert Notification
|--------------------------------------------------------------------------
*/

$sql = "
INSERT INTO notifications
(
    user_id,
    title,
    message,
    notification_type,
    action_url,
    is_read
)
VALUES
(
    ?,
    ?,
    ?,
    ?,
    ?,
    0
)
";

$stmt = mysqli_prepare(
    $mysqli,
    $sql
);

if (!$stmt) {
    error("Failed to prepare notification.", 500);
}

mysqli_stmt_bind_param(
    $stmt,
    "issss",
    $userId,
    $title,
    $message,
    $notificationType,
    $actionUrl
);

if (!mysqli_stmt_execute($stmt)) {

    mysqli_stmt_close($stmt);

    error(
        "Failed to create notification.",
        500
    );
}

$notificationId = mysqli_insert_id($mysqli);

mysqli_stmt_close($stmt);

/*
|--------------------------------------------------------------------------
| Success
|--------------------------------------------------------------------------
*/

success(
    "Notification created successfully.",
    [
        "id" => (int)$notificationId
    ]
);