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
| Read JSON
|--------------------------------------------------------------------------
*/

$data = json_decode(file_get_contents("php://input"), true);

$full_name = trim($data["full_name"] ?? "");
$email     = trim($data["email"] ?? "");
$password  = $data["password"] ?? "";
$gender     = $data["gender"] ?? "";
$role_id    = intval($data["role_id"] ?? 0);

/*
|--------------------------------------------------------------------------
| Validation
|--------------------------------------------------------------------------
*/

if (
    !required($full_name) ||
    !required($email) ||
    !required($password)
) {
    error("All required fields must be filled.", 400);
}

if (!isEmail($email)) {
    error("Invalid email address.", 400);
}

if (strlen($password) < 6) {
    error("Password must be at least 6 characters.", 400);
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
WHERE email=?
LIMIT 1
");

$stmt->bind_param("s",$email);

$stmt->execute();

$result = $stmt->get_result();

if($result->num_rows>0){

    error("Email already exists.",409);

}

$stmt->close();

/*
|--------------------------------------------------------------------------
| Password Hash
|--------------------------------------------------------------------------
*/

$password_hash = password_hash($password,PASSWORD_DEFAULT);

/*
|--------------------------------------------------------------------------
| Insert User
|--------------------------------------------------------------------------
*/

$stmt = $mysqli->prepare("
INSERT INTO users
(
role_id,
full_name,
email,
password_hash,
gender,
is_active
)
VALUES
(
?,?,?,?,?,
1
)
");

$stmt->bind_param(

"issss",

$role_id,
$full_name,
$email,
$password_hash,
$gender

);

if(!$stmt->execute()){

    error("Failed to create user.",500);

}

$user_id = $stmt->insert_id;

$stmt->close();

/*
|--------------------------------------------------------------------------
| Create Lecturer / Student Record
|--------------------------------------------------------------------------
*/

if ($role_id == 2) {

    $employee_no = "EMP" . str_pad($user_id, 4, "0", STR_PAD_LEFT);

    $stmt = $mysqli->prepare("
    INSERT INTO lecturers
    (user_id, employee_no)
    VALUES (?, ?)
    ");

    $stmt->bind_param("is", $user_id, $employee_no);
    $stmt->execute();
    $stmt->close();
}

if ($role_id == 3) {

    $registration_no = "STU" . str_pad($user_id, 5, "0", STR_PAD_LEFT);

    $stmt = $mysqli->prepare("
    INSERT INTO students
    (user_id, registration_no)
    VALUES (?, ?)
    ");

    $stmt->bind_param("is", $user_id, $registration_no);
    $stmt->execute();
    $stmt->close();
}

/*
|--------------------------------------------------------------------------
| Success
|--------------------------------------------------------------------------
*/

success("User created successfully.",[

"user_id"=>$user_id

]);