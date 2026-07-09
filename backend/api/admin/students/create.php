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
    error("Unauthorized.",401);
}

if ($_SESSION["user"]["role"] !== "admin") {
    error("Access denied.",403);
}

/*
|--------------------------------------------------------------------------
| Read JSON
|--------------------------------------------------------------------------
*/

$data = json_decode(file_get_contents("php://input"), true);

$full_name      = trim($data["full_name"] ?? "");
$email          = trim($data["email"] ?? "");
$password       = $data["password"] ?? "";
$gender         = $data["gender"] ?? "";

$registration_no = trim($data["registration_no"] ?? "");

$faculty_id     = intval($data["faculty_id"] ?? 0);
$department_id  = intval($data["department_id"] ?? 0);

$year_of_study  = $data["year_of_study"] ?? "";
$semester       = $data["semester"] ?? "";
$intake_year    = intval($data["intake_year"] ?? 0);

$phone          = trim($data["phone"] ?? "");
$address        = trim($data["address"] ?? "");
$guardian_name  = trim($data["guardian_name"] ?? "");
$guardian_phone = trim($data["guardian_phone"] ?? "");

/*
|--------------------------------------------------------------------------
| Validation
|--------------------------------------------------------------------------
*/

if (
    !required($full_name) ||
    !required($email) ||
    !required($password) ||
    !required($registration_no)
) {
    error("Please fill all required fields.",400);
}

if (!isEmail($email)) {
    error("Invalid email address.",400);
}

/*
|--------------------------------------------------------------------------
| Duplicate Email
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

if($stmt->get_result()->num_rows>0){
    error("Email already exists.",409);
}

$stmt->close();

/*
|--------------------------------------------------------------------------
| Duplicate Registration Number
|--------------------------------------------------------------------------
*/

$stmt = $mysqli->prepare("
SELECT id
FROM students
WHERE registration_no=?
LIMIT 1
");

$stmt->bind_param("s",$registration_no);
$stmt->execute();

if($stmt->get_result()->num_rows>0){
    error("Registration number already exists.",409);
}

$stmt->close();

/*
|--------------------------------------------------------------------------
| Create User
|--------------------------------------------------------------------------
*/

$password_hash = password_hash(
    $password,
    PASSWORD_DEFAULT
);

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
3,
?,?,?,?,1
)
");

$stmt->bind_param(
    "ssss",
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
| Create Student
|--------------------------------------------------------------------------
*/

$stmt = $mysqli->prepare("
INSERT INTO students
(
user_id,
registration_no,
faculty_id,
department_id,
year_of_study,
semester,
intake_year,
phone,
address,
guardian_name,
guardian_phone
)
VALUES
(
?,?,?,?,?,?,?,?,?,?,?
)
");

$stmt->bind_param(

"isiississss",

$user_id,
$registration_no,
$faculty_id,
$department_id,
$year_of_study,
$semester,
$intake_year,
$phone,
$address,
$guardian_name,
$guardian_phone

);

if(!$stmt->execute()){
    error("Failed to create student.",500);
}

$stmt->close();

/*
|--------------------------------------------------------------------------
| Success
|--------------------------------------------------------------------------
*/

success(
    "Student created successfully."
);