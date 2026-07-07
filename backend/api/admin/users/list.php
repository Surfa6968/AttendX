<?php

session_start();

require_once "../../../config/cors.php";
require_once "../../../config/database.php";
require_once "../../../helpers/response.php";

if (!isset($_SESSION["user"])) {
    error("Unauthorized", 401);
}

if ($_SESSION["user"]["role"] !== "admin") {
    error("Access denied", 403);
}

$sql = "
SELECT
    u.id,
    u.full_name,
    u.email,
    r.role_name,
    u.gender,
    u.is_active,
    u.created_at
FROM users u
INNER JOIN roles r
ON u.role_id = r.id
ORDER BY u.id DESC
";

$result = $mysqli->query($sql);

$users = [];

while ($row = $result->fetch_assoc()) {
    $users[] = $row;
}

success("Users loaded successfully.", $users);