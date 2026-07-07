<?php

session_start();

require_once "../../../config/cors.php";
require_once "../../../config/database.php";
require_once "../../../helpers/response.php";
require_once "../../../helpers/validator.php";

if (!isset($_SESSION["user"])) {
    error("Unauthorized.",401);
}

if ($_SESSION["user"]["role"] !== "admin") {
    error("Access denied.",403);
}

$data = json_decode(file_get_contents("php://input"), true);

$department_name = trim($data["department_name"] ?? "");
$department_code = strtoupper(trim($data["department_code"] ?? ""));
$faculty_id = intval($data["faculty_id"] ?? 0);

if (
    !required($department_name) ||
    !required($department_code) ||
    $faculty_id <= 0
){
    error("All fields are required.",400);
}

$stmt = $mysqli->prepare("
SELECT id
FROM departments
WHERE department_name=?
OR department_code=?
LIMIT 1
");

$stmt->bind_param(
    "ss",
    $department_name,
    $department_code
);

$stmt->execute();

$result = $stmt->get_result();

if($result->num_rows>0){
    error("Department already exists.",409);
}

$stmt->close();

$stmt = $mysqli->prepare("
INSERT INTO departments
(
faculty_id,
department_name,
department_code
)
VALUES
(
?,?,?
)
");

$stmt->bind_param(
    "iss",
    $faculty_id,
    $department_name,
    $department_code
);

if(!$stmt->execute()){
    error("Failed to create department.",500);
}

$id = $stmt->insert_id;

$stmt->close();

success("Department created successfully.",[
    "id"=>$id
]);