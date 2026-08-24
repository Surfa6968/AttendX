<?php

require_once "../../../config/cors.php";
require_once "../../../config/database.php";

header("Content-Type: application/json; charset=UTF-8");


function sendJson($success, $message, $data = null)
{
    echo json_encode([
        "success" => $success,
        "message" => $message,
        "data" => $data
    ]);

    exit;
}


try {

    /*
    |--------------------------------------------------------------------------
    | Find Administrator
    |--------------------------------------------------------------------------
    |
    | We identify the logged-in/admin account by role_id.
    | For now we select the first active user whose role_id exists.
    |
    */

    $sql = "
        SELECT
            id,
            role_id,
            full_name,
            email,
            gender,
            profile_photo,
            is_active,
            email_verified,
            last_login,
            created_at,
            updated_at
        FROM users
        WHERE is_active = 1
        ORDER BY id ASC
        LIMIT 1
    ";


    $result = $mysqli->query($sql);


    if (!$result) {

        sendJson(
            false,
            "Database query failed: " . $mysqli->error
        );
    }


    /*
    |--------------------------------------------------------------------------
    | Check Admin
    |--------------------------------------------------------------------------
    */

    if ($result->num_rows === 0) {

        sendJson(
            false,
            "Administrator account not found."
        );
    }


    /*
    |--------------------------------------------------------------------------
    | Get User
    |--------------------------------------------------------------------------
    */

    $admin = $result->fetch_assoc();


    /*
    |--------------------------------------------------------------------------
    | Return Profile
    |--------------------------------------------------------------------------
    */

    sendJson(
        true,
        "Administrator profile loaded successfully.",
        $admin
    );


} catch (Throwable $e) {

    sendJson(
        false,
        "Server error: " . $e->getMessage()
    );
}