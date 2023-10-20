<?php

function sql_link() {
    return mysqli_connect("localhost", "root", "", "monopoly");
}

function generateCode($length=8) {
    $chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPRQSTUVWXYZ0123456789";
    $code = "";
    $clen = strlen($chars) - 1;
    while (strlen($code) < $length) {
        $code .= $chars[mt_rand(0,$clen)];
    }
    return $code;
}

function verify_auth_by_cookie() {
    if (isset($_COOKIE['token'])) {
        $token = mysqli_escape_string(sql_link(), $_COOKIE['token']);
        return verify_auth_by_value($token);
    }
    else
        return false;
}

function verify_auth_by_post() {
    if (isset($_POST['token'])) {
        $token = mysqli_escape_string(sql_link(), $_POST['token']);
        return verify_auth_by_value($token);
    }
    return false;
}

function verify_auth_by_value($token) {
    $query = mysqli_query(sql_link(), "SELECT * FROM users WHERE token = '$token' LIMIT 1");
    $userdata = mysqli_fetch_assoc($query);

    if ($userdata)
        return $userdata;
    else
        return false;
}
