<?php
session_start();

require_once "../../config/cors.php";
require_once "../../config/database.php";
require_once "../../helpers/response.php";
require_once "../../helpers/validator.php";

/*
|--------------------------------------------------------------------------
| Read JSON Input
|--------------------------------------------------------------------------
*/

$data = json_decode(file_get_contents("php://input"), true);

$email = trim($data["email"] ?? "");
$password = $data["password"] ?? "";

/*
|--------------------------------------------------------------------------
| Validation
|--------------------------------------------------------------------------
*/

if (!required($email) || !required($password)) {
    error("Email and password are required.", 400);
}

if (!isEmail($email)) {
    error("Invalid email address.", 400);
}

/*
|--------------------------------------------------------------------------
| Find User
|--------------------------------------------------------------------------
*/

$sql = "
SELECT
    u.id,
    u.role_id,
    u.full_name,
    u.email,
    u.password_hash,
    u.gender,
    u.profile_photo,
    u.is_active,
    r.role_name
FROM users u
INNER JOIN roles r
ON u.role_id = r.id
WHERE u.email = ?
LIMIT 1
";

$stmt = $mysqli->prepare($sql);

if (!$stmt) {
    error("Database error.", 500);
}

$stmt->bind_param("s", $email);
$stmt->execute();

$result = $stmt->get_result();

if ($result->num_rows === 0) {
    error("Invalid email or password.", 401);
}

$user = $result->fetch_assoc();

$stmt->close();

/*
|--------------------------------------------------------------------------
| Account Status
|--------------------------------------------------------------------------
*/

if (!$user["is_active"]) {
    error("Your account has been disabled.", 403);
}

/*
|--------------------------------------------------------------------------
| Verify Password
|--------------------------------------------------------------------------
*/

if (!password_verify($password, $user["password_hash"])) {
    error("Invalid email or password.", 401);
}

/*
|--------------------------------------------------------------------------
| Update Last Login
|--------------------------------------------------------------------------
*/

$update = $mysqli->prepare("
UPDATE users
SET last_login = NOW()
WHERE id = ?
");

$update->bind_param("i", $user["id"]);
$update->execute();
$update->close();

/*
|--------------------------------------------------------------------------
| Create Session
|--------------------------------------------------------------------------
*/

$_SESSION["user"] = [

    "id" => $user["id"],

    "role_id" => $user["role_id"],

    "role" => $user["role_name"],

    "full_name" => $user["full_name"],

    "email" => $user["email"],

    "gender" => $user["gender"],

    "profile_photo" => $user["profile_photo"]

];

/*
|--------------------------------------------------------------------------
| Response
|--------------------------------------------------------------------------
*/

success("Login successful.", [

    "user" => $_SESSION["user"]

]);