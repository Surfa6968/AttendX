<?php

session_start();

require_once "../../../config/cors.php";
require_once "../../../config/database.php";
require_once "../../../helpers/response.php";

if (!isset($_SESSION["user"])) {
    error("Unauthorized.", 401);
}

if ($_SESSION["user"]["role"] !== "admin") {
    error("Access denied.", 403);
}

$sql = "
SELECT
    id,
    faculty_name,
    faculty_code
FROM faculties
ORDER BY faculty_name ASC
";

$result = $mysqli->query($sql);

$faculties = [];

while ($row = $result->fetch_assoc()) {
    $faculties[] = $row;
}

success("Faculty list loaded successfully.", $faculties);