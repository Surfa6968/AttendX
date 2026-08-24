<?php

session_start();

require_once "../../../config/cors.php";
require_once "../../../config/database.php";
require_once "../../../helpers/response.php";

/*
|--------------------------------------------------------------------------
| Authentication
|--------------------------------------------------------------------------
*/

if (!isset($_SESSION["user"])) {
    error("Unauthorized.", 401);
}

/*
|--------------------------------------------------------------------------
| Admin Authorization
|--------------------------------------------------------------------------
*/

if (
    !isset($_SESSION["user"]["role"]) ||
    $_SESSION["user"]["role"] !== "admin"
) {
    error("Access denied.", 403);
}

/*
|--------------------------------------------------------------------------
| Get System Settings
|--------------------------------------------------------------------------
*/

$sql = "
    SELECT
        id,
        setting_key,
        setting_value,
        description,
        updated_at
    FROM system_settings
    ORDER BY id ASC
";

$result = mysqli_query($mysqli, $sql);

if (!$result) {
    error(
        "Failed to load system settings: " .
        mysqli_error($mysqli),
        500
    );
}

/*
|--------------------------------------------------------------------------
| Build Settings Array
|--------------------------------------------------------------------------
*/

$settings = [];

while ($row = mysqli_fetch_assoc($result)) {

    $settings[] = [
        "id" => (int) $row["id"],
        "setting_key" => $row["setting_key"],
        "setting_value" => $row["setting_value"],
        "description" => $row["description"],
        "updated_at" => $row["updated_at"]
    ];
}

/*
|--------------------------------------------------------------------------
| Success Response
|--------------------------------------------------------------------------
*/

success(
    "System settings loaded successfully.",
    $settings
);