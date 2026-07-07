<?php

session_start();

require_once "../../../config/cors.php";
require_once "../../../config/database.php";
require_once "../../../helpers/response.php";

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

$stmt = $mysqli->prepare("
SELECT
id,
faculty_id,
department_name,
department_code
FROM departments
WHERE id=?
LIMIT 1
");

$stmt->bind_param("i",$id);

$stmt->execute();

$result = $stmt->get_result();

if($result->num_rows===0){
    error("Department not found.",404);
}

$department = $result->fetch_assoc();

$stmt->close();

success(
    "Department loaded successfully.",
    $department
);