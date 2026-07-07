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

$employee_no    = trim($data["employee_no"] ?? "");

$faculty_id     = intval($data["faculty_id"] ?? 0);
$department_id  = intval($data["department_id"] ?? 0);

$designation    = trim($data["designation"] ?? "");
$qualification  = trim($data["qualification"] ?? "");
$specialization = trim($data["specialization"] ?? "");
$office_room    = trim($data["office_room"] ?? "");
$phone          = trim($data["phone"] ?? "");
$joined_date    = $data["joined_date"] ?? "";

/*
|--------------------------------------------------------------------------
| Validation
|--------------------------------------------------------------------------
*/

if (
    !required($full_name) ||
    !required($email) ||
    !required($password) ||
    !required($employee_no) ||
    !required($designation)
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
| Duplicate Employee Number
|--------------------------------------------------------------------------
*/

$stmt = $mysqli->prepare("
SELECT id
FROM lecturers
WHERE employee_no=?
LIMIT 1
");

$stmt->bind_param("s",$employee_no);

$stmt->execute();

if($stmt->get_result()->num_rows>0){

    error("Employee number already exists.",409);

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
2,
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
| Create Lecturer
|--------------------------------------------------------------------------
*/

$stmt = $mysqli->prepare("
INSERT INTO lecturers
(
user_id,
employee_no,
faculty_id,
department_id,
designation,
qualification,
specialization,
office_room,
phone,
joined_date
)
VALUES
(
?,?,?,?,?,?,?,?,?,?
)
");

$stmt->bind_param(

"isiissssss",

$user_id,
$employee_no,
$faculty_id,
$department_id,
$designation,
$qualification,
$specialization,
$office_room,
$phone,
$joined_date

);

if(!$stmt->execute()){

    error("Failed to create lecturer.",500);

}

$stmt->close();

/*
|--------------------------------------------------------------------------
| Success
|--------------------------------------------------------------------------
*/

success(
    "Lecturer created successfully."
);