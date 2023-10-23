<?php

const ACTION_LOG_TO_SESSION = 0;
const ACTION_READY = 1;
const ACTION_MAKE_STEP = 2;

class Game
{
    private $connection;
    private $user_id;
    private $in_game;
    private $game_position;
    private $players;
    private $order_step;

    function __construct($conn, $token) {
        $this->connection = $conn;
        $_token = mysqli_real_escape_string($this->connection, $token);
        $resp = mysqli_fetch_assoc(mysqli_query($this->connection, "SELECT id, game_id, game_position FROM users WHERE token = '$_token'"));
        if ($resp) {
            $this->user_id = $resp["id"];
            $this->in_game = $resp["game_id"];
            if ($this->inGame()) {
                $this->game_position = $resp["game_position"];

                $resp = mysqli_query($this->connection, "SELECT id, username FROM users WHERE game_id = ".$this->in_game);
                $this->players = array();
                while ($row = mysqli_fetch_assoc($resp)) {
                    array_push($this->players, array("id" => $row["id"], "username" => $row["username"]));
                }

                $resp = mysqli_query($this->connection, "SELECT * FROM game_session_steps WHERE action_type = ".ACTION_LOG_TO_SESSION);

            }
        } else {
            $this->user_id = false;
        }
    }

    // ID игры, если в игре
    function inGame() {
        return $this->in_game != null;
    }

    // Позиция в игре
    function myPos() {
        if (!$this->inGame()) return false;
        if ($this->game_position == null) return false;
        return $this->game_position;
    }

    // Данные о ячейках
    function cellsData() {
        if (!$this->inGame()) return false;
        $resp = mysqli_query($this->connection, "SELECT * FROM game_session_cell_data WHERE game_session_id = ".$this->in_game);
        $result = array();
        while ($row = mysqli_fetch_assoc($resp)) {
            array_push($result, array("cell" => $row["cell_num"], "user_id" => $row["owner_id"],
                "level" => $row["level"]));
        }
        return $result;
    }

    // Список игроков в игре
    function players() {
        if (!$this->inGame()) return false;
        return $this->players;
    }
}