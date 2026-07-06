<?php

function loadEnv($path)
{
    if (!file_exists($path)) {
        die("Missing .env file");
    }

    $lines = file($path, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);

    foreach ($lines as $line) {

        if (trim($line) === '' || str_starts_with(trim($line), '#')) {
            continue;
        }

        if (!str_contains($line, '=')) {
            continue;
        }

        list($key, $value) = explode('=', $line, 2);

        $_ENV[trim($key)] = trim($value);
    }
}

loadEnv(__DIR__ . '/../.env');