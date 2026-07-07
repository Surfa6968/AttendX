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

$id = intval($_GET["id"] ?? 0);

if($id<=0){
    error("Invalid department ID.",400);
}

$data = json_decode(file_get_contents("php://input"),true);

$department_name = trim($data["department_name"] ?? "");
$department_code = strtoupper(trim($data["department_code"] ?? ""));
$faculty_id = intval($data["faculty_id"] ?? 0);

if(
    !required($department_name) ||
    !required($department_code) ||
    $faculty_id<=0
){
    error("All fields are required.",400);
}

$stmt = $mysqli->prepare("
SELECT id
FROM departments
WHERE
(
department_name=?
OR department_code=?
)
AND id<>?
LIMIT 1
");

$stmt->bind_param(
    "ssi",
    $department_name,
    $department_code,
    $id
);

$stmt->execute();

$result = $stmt->get_result();

if($result->num_rows>0){
    error("Department already exists.",409);
}

$stmt->close();

$stmt = $mysqli->prepare("
UPDATE departments
SET
faculty_id=?,
department_name=?,
department_code=?
WHERE id=?
");

$stmt->bind_param(
    "issi",
    $faculty_id,
    $department_name,
    $department_code,
    $id
);

if(!$stmt->execute()){
    error("Failed to update department.",500);
}

$stmt->close();

success("Department updated successfully.");