<?php
include("../mysql.php");
$link = sql_link();

$token = mysqli_escape_string($link, $_POST['token']);
$userdata = mysqli_fetch_assoc(mysqli_query($link, "SELECT * FROM users WHERE token = '$token' LIMIT 1"));
header('Content-Type: application/json; charset=utf-8');

if ($userdata) {
    if ($userdata["game_id"] == null) {
        $code = generateCode(8);
        $map = 1;
        $req = "INSERT INTO `game_sessions`(`map_id`, `code`) VALUES ($map, '$code')";

        mysqli_query($link, $req);
        $new_id = mysqli_insert_id($link);

        $req = "UPDATE users SET `game_id` = $new_id WHERE id = ".$userdata["id"];
        mysqli_query($link, $req);

        $req = "SELECT * FROM `maps` WHERE id = $map LIMIT 1";
        $map_info = mysqli_fetch_assoc(mysqli_query($link, $req));
        echo json_encode(array("result" => 0, "message" => "success", "code" => $code, "html" => $map_info["html"],
            "json" => $map_info["json"]));
    } else {
        echo json_encode(array("result" => 2, "message" => "User already in game"));
    }
}
