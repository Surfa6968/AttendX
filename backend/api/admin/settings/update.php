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
| Read Request
|--------------------------------------------------------------------------
*/

$data = json_decode(
    file_get_contents("php://input"),
    true
);

$settingKey = trim($data["setting_key"] ?? "");
$settingValue = trim($data["setting_value"] ?? "");

/*
|--------------------------------------------------------------------------
| Validation
|--------------------------------------------------------------------------
*/

if ($settingKey === "") {
    error("Setting key is required.", 400);
}

if ($settingValue === "") {
    error("Setting value is required.", 400);
}

/*
|--------------------------------------------------------------------------
| Update Setting
|--------------------------------------------------------------------------
*/

$sql = "
    UPDATE system_settings
    SET
        setting_value = ?,
        updated_at = CURRENT_TIMESTAMP
    WHERE setting_key = ?
    LIMIT 1
";

$stmt = mysqli_prepare($mysqli, $sql);

if (!$stmt) {
    error(
        "Failed to prepare update statement.",
        500
    );
}

mysqli_stmt_bind_param(
    $stmt,
    "ss",
    $settingValue,
    $settingKey
);

if (!mysqli_stmt_execute($stmt)) {

    mysqli_stmt_close($stmt);

    error(
        "Failed to update system setting.",
        500
    );
}

/*
|--------------------------------------------------------------------------
| Check Whether Setting Exists
|--------------------------------------------------------------------------
*/

if (mysqli_stmt_affected_rows($stmt) === 0) {

    mysqli_stmt_close($stmt);

    error(
        "Setting not found or value was not changed.",
        404
    );
}

mysqli_stmt_close($stmt);

/*
|--------------------------------------------------------------------------
| Success
|--------------------------------------------------------------------------
*/

success(
    "System setting updated successfully.",
    [
        "setting_key" => $settingKey,
        "setting_value" => $settingValue
    ]
);