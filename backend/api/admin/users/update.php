<?php

session_start();

require_once "../../../config/cors.php";
require_once "../../../config/database.php";
require_once "../../../helpers/response.php";
require_once "../../../helpers/validator.php";

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
| Read JSON
|--------------------------------------------------------------------------
*/

$data = json_decode(file_get_contents("php://input"), true);

$full_name = trim($data["full_name"] ?? "");
$email = trim($data["email"] ?? "");
$gender = $data["gender"] ?? "";
$role_id = intval($data["role_id"] ?? 0);
$is_active = intval($data["is_active"] ?? 1);

/*
|--------------------------------------------------------------------------
| Validation
|--------------------------------------------------------------------------
*/

if (
    !required($full_name) ||
    !required($email)
) {
    error("Name and email are required.", 400);
}

if (!isEmail($email)) {
    error("Invalid email address.", 400);
}

if (!in_array($role_id, [1,2,3])) {
    error("Invalid role selected.", 400);
}

/*
|--------------------------------------------------------------------------
| Duplicate Email Check
|--------------------------------------------------------------------------
*/

$stmt = $mysqli->prepare("
SELECT id
FROM users
WHERE email = ?
AND id <> ?
LIMIT 1
");

$stmt->bind_param("si", $email, $id);

$stmt->execute();

$result = $stmt->get_result();

if ($result->num_rows > 0) {

    error("Email already exists.", 409);

}

$stmt->close();

/*
|--------------------------------------------------------------------------
| Update User
|--------------------------------------------------------------------------
*/

$stmt = $mysqli->prepare("
UPDATE users
SET
    full_name = ?,
    email = ?,
    gender = ?,
    role_id = ?,
    is_active = ?
WHERE id = ?
");

$stmt->bind_param(
    "sssiii",
    $full_name,
    $email,
    $gender,
    $role_id,
    $is_active,
    $id
);

if (!$stmt->execute()) {

    error("Failed to update user.", 500);

}

$stmt->close();

/*
|--------------------------------------------------------------------------
| Success
|--------------------------------------------------------------------------
*/

success("User updated successfully.");