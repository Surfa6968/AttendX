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

if ($_SESSION["user"]["role"] !== "student") {
    error("Access denied.", 403);
}

$userId = $_SESSION["user"]["id"];

/*
|--------------------------------------------------------------------------
| Read JSON
|--------------------------------------------------------------------------
*/

$data = json_decode(file_get_contents("php://input"), true);

$currentPassword = trim($data["current_password"] ?? "");
$newPassword = trim($data["new_password"] ?? "");
$confirmPassword = trim($data["confirm_password"] ?? "");

if (
    empty($currentPassword) ||
    empty($newPassword) ||
    empty($confirmPassword)
) {
    error("All fields are required.");
}

if ($newPassword !== $confirmPassword) {
    error("New passwords do not match.");
}

if (strlen($newPassword) < 6) {
    error("Password must be at least 6 characters.");
}

/*
|--------------------------------------------------------------------------
| Get Current Password
|--------------------------------------------------------------------------
*/

$stmt = $mysqli->prepare("
SELECT password_hash
FROM users
WHERE id=?
LIMIT 1
");

$stmt->bind_param("i", $userId);
$stmt->execute();

$result = $stmt->get_result();

if ($result->num_rows == 0) {
    error("User not found.");
}

$user = $result->fetch_assoc();

/*
|--------------------------------------------------------------------------
| Verify Password
|--------------------------------------------------------------------------
*/

if (!password_verify($currentPassword, $user["password_hash"])) {
    error("Current password is incorrect.");
}

/*
|--------------------------------------------------------------------------
| Update Password
|--------------------------------------------------------------------------
*/

$newHash = password_hash($newPassword, PASSWORD_DEFAULT);

$stmt = $mysqli->prepare("
UPDATE users
SET password_hash=?
WHERE id=?
");

$stmt->bind_param(
    "si",
    $newPasswordHash,
    $userId
);

$stmt->execute();

success("Password changed successfully.");

$stmt->close();
$mysqli->close();
exit;