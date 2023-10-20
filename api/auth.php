<?php
include("../mysql.php");

if (isset($_POST['username']) && isset($_POST['password'])) {
    $username = mysqli_escape_string(sql_link(), $_POST['username']);
    $password = mysqli_escape_string(sql_link(), $_POST['password']);

    $query = mysqli_query(sql_link(), "SELECT * FROM users WHERE username = '$username' AND password = '$password' LIMIT 1");
    $userdata = mysqli_fetch_assoc($query);

    header('Content-Type: application/json; charset=utf-8');

    if ($userdata) {
        $token = generateCode(64);
        $user_id = $userdata['id'];
        mysqli_query(sql_link(), "UPDATE users SET token = '$token' WHERE id = $user_id");
        echo json_encode(array("result" => 0, "message" => "success", "token" => $token));
    }
    else {
        echo json_encode(array("result" => 1, "message" => "auth problem"));
    }
}
