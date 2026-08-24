<?php

/*
|--------------------------------------------------------------------------
| Create Notification
|--------------------------------------------------------------------------
|
| Reusable helper for inserting notifications.
|
*/

function createNotification(
    mysqli $mysqli,
    int $userId,
    string $title,
    string $message,
    string $notificationType = "System",
    ?string $actionUrl = null
) {

    if ($userId <= 0) {
        return false;
    }

    $allowedTypes = [
        "System",
        "Attendance",
        "Course",
        "Reminder",
        "Announcement"
    ];

    if (!in_array($notificationType, $allowedTypes, true)) {
        $notificationType = "System";
    }

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
            ?, ?, ?, ?, ?, 0
        )
    ";

    $stmt = mysqli_prepare($mysqli, $sql);

    if (!$stmt) {
        return false;
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

    $success = mysqli_stmt_execute($stmt);

    mysqli_stmt_close($stmt);

    return $success;
}