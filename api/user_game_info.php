<?php
include("../mysql.php");
$link = sql_link();



$token = mysqli_escape_string($link, $_POST['token']);
$userdata = mysqli_fetch_assoc(mysqli_query($link, "SELECT * FROM users WHERE token = '$token' LIMIT 1"));
header('Content-Type: application/json; charset=utf-8');

if ($userdata) {
    if ($userdata["game_id"] != null) {
        $req = "SELECT game_sessions.id, game_sessions.code, game_sessions.started, game_sessions.completed, maps.name, 
            maps.html, maps.json FROM `game_sessions` LEFT JOIN `maps` ON game_sessions.map_id = maps.id WHERE 
            game_sessions.id = ".$userdata["game_id"];
        $res = mysqli_fetch_assoc(mysqli_query($link, $req));
        echo json_encode($res);
    }
}

