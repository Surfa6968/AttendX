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

$keyword = trim($_GET["keyword"] ?? "");

$sql = "
SELECT
    u.id,
    u.full_name,
    u.email,
    u.gender,
    u.is_active,
    r.role_name
FROM users u
INNER JOIN roles r
ON u.role_id = r.id
WHERE
    u.full_name LIKE ?
    OR u.email LIKE ?
    OR r.role_name LIKE ?
ORDER BY u.id DESC
";

$stmt = $mysqli->prepare($sql);

$search = "%{$keyword}%";

$stmt->bind_param(
    "sss",
    $search,
    $search,
    $search
);

$stmt->execute();

$result = $stmt->get_result();

$users = [];

while ($row = $result->fetch_assoc()) {
    $users[] = $row;
}

$stmt->close();

success("Search completed.", $users);