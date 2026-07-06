<?php

function isEmail($email)
{
    return filter_var($email, FILTER_VALIDATE_EMAIL);
}

function required($value)
{
    return isset($value) && trim($value) !== '';
}

function minLength($text, $length)
{
    return strlen(trim($text)) >= $length;
}