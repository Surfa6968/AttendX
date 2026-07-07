<?php

session_start();

require_once "../../../config/cors.php";
require_once "../../../config/database.php";
require_once "../../../helpers/response.php";

/*
|--------------------------------------------------------------------------
| Authorization
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
| Get User ID
|--------------------------------------------------------------------------
*/

$id = intval($_GET["id"] ?? 0);

if ($id <= 0) {
    error("Invalid user ID.", 400);
}

/*
|--------------------------------------------------------------------------
| Prevent deleting yourself
|--------------------------------------------------------------------------
*/

if ($id == $_SESSION["user"]["id"]) {
    error("You cannot delete your own account.", 400);
}

/*
|--------------------------------------------------------------------------
| Check User Exists
|--------------------------------------------------------------------------
*/

$stmt = $mysqli->prepare("
SELECT id
FROM users
WHERE id = ?
LIMIT 1
");

$stmt->bind_param("i", $id);
$stmt->execute();

$result = $stmt->get_result();

if ($result->num_rows === 0) {
    error("User not found.", 404);
}

$stmt->close();

/*
|--------------------------------------------------------------------------
| Delete User
|--------------------------------------------------------------------------
*/

$stmt = $mysqli->prepare("
DELETE FROM users
WHERE id = ?
");

$stmt->bind_param("i", $id);

if (!$stmt->execute()) {
    error("Failed to delete user.", 500);
}

$stmt->close();

/*
|--------------------------------------------------------------------------
| Success
|--------------------------------------------------------------------------
*/

success("User deleted successfully.");