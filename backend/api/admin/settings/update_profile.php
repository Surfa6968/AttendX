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
    | Read JSON Request
    |--------------------------------------------------------------------------
    */

    $input = json_decode(
        file_get_contents("php://input"),
        true
    );


    if (!is_array($input)) {

        sendJson(
            false,
            "Invalid request data."
        );
    }


    /*
    |--------------------------------------------------------------------------
    | Get Form Values
    |--------------------------------------------------------------------------
    */

    $fullName = trim(
        $input["full_name"] ?? ""
    );

    $email = trim(
        $input["email"] ?? ""
    );


    /*
    |--------------------------------------------------------------------------
    | Validate Full Name
    |--------------------------------------------------------------------------
    */

    if ($fullName === "") {

        sendJson(
            false,
            "Full name is required."
        );
    }


    /*
    |--------------------------------------------------------------------------
    | Validate Email
    |--------------------------------------------------------------------------
    */

    if ($email === "") {

        sendJson(
            false,
            "Email address is required."
        );
    }


    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {

        sendJson(
            false,
            "Invalid email address."
        );
    }


    /*
    |--------------------------------------------------------------------------
    | Find Active Administrator
    |--------------------------------------------------------------------------
    */

    $findSql = "
        SELECT
            id
        FROM users
        WHERE is_active = 1
        ORDER BY id ASC
        LIMIT 1
    ";


    $findResult = $mysqli->query($findSql);


    if (!$findResult) {

        sendJson(
            false,
            "Failed to find administrator: " .
            $mysqli->error
        );
    }


    if ($findResult->num_rows === 0) {

        sendJson(
            false,
            "Administrator account not found."
        );
    }


    $admin = $findResult->fetch_assoc();

    $adminId = (int) $admin["id"];


    /*
    |--------------------------------------------------------------------------
    | Check Duplicate Email
    |--------------------------------------------------------------------------
    */

    $checkSql = "
        SELECT
            id
        FROM users
        WHERE email = ?
        AND id != ?
        LIMIT 1
    ";


    $checkStmt = $mysqli->prepare(
        $checkSql
    );


    if (!$checkStmt) {

        sendJson(
            false,
            "Failed to prepare email check: " .
            $mysqli->error
        );
    }


    $checkStmt->bind_param(
        "si",
        $email,
        $adminId
    );


    $checkStmt->execute();


    $checkResult = $checkStmt->get_result();


    if ($checkResult->num_rows > 0) {

        $checkStmt->close();

        sendJson(
            false,
            "This email address is already being used."
        );
    }


    $checkStmt->close();


    /*
    |--------------------------------------------------------------------------
    | Update Profile
    |--------------------------------------------------------------------------
    */

    $updateSql = "
        UPDATE users
        SET
            full_name = ?,
            email = ?
        WHERE id = ?
    ";


    $updateStmt = $mysqli->prepare(
        $updateSql
    );


    if (!$updateStmt) {

        sendJson(
            false,
            "Failed to prepare update query: " .
            $mysqli->error
        );
    }


    $updateStmt->bind_param(
        "ssi",
        $fullName,
        $email,
        $adminId
    );


    if (!$updateStmt->execute()) {

        $error = $mysqli->error;

        $updateStmt->close();

        sendJson(
            false,
            "Failed to update administrator profile: " .
            $error
        );
    }


    $updateStmt->close();


    /*
    |--------------------------------------------------------------------------
    | Return Updated Profile
    |--------------------------------------------------------------------------
    */

    $selectSql = "
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
        WHERE id = ?
        LIMIT 1
    ";


    $selectStmt = $mysqli->prepare(
        $selectSql
    );


    if (!$selectStmt) {

        sendJson(
            true,
            "Administrator profile updated successfully."
        );
    }


    $selectStmt->bind_param(
        "i",
        $adminId
    );


    $selectStmt->execute();


    $selectResult =
        $selectStmt->get_result();


    $updatedProfile =
        $selectResult->fetch_assoc();


    $selectStmt->close();


    /*
    |--------------------------------------------------------------------------
    | Success
    |--------------------------------------------------------------------------
    */

    sendJson(
        true,
        "Administrator profile updated successfully.",
        $updatedProfile
    );


} catch (Throwable $e) {

    sendJson(
        false,
        "Server error: " . $e->getMessage()
    );
}