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

$id = intval($_GET["id"] ?? 0);

if ($id <= 0) {
    error("Invalid user ID.", 400);
}

$sql = "
SELECT
    u.id,
    u.full_name,
    u.email,
    u.gender,
    u.role_id,
    u.is_active,
    r.role_name
FROM users u
INNER JOIN roles r
ON u.role_id = r.id
WHERE u.id = ?
LIMIT 1
";

$stmt = $mysqli->prepare($sql);

$stmt->bind_param("i", $id);

$stmt->execute();

$result = $stmt->get_result();

if ($result->num_rows === 0) {
    error("User not found.", 404);
}

$user = $result->fetch_assoc();

$stmt->close();

success("User loaded successfully.", $user);