



const ANIMATION_PLAYER_STEPS = 20;

let pos = 0;

let stepCount = 0;
let timerStep;

let elPlayer;
let elGame;

let cellSize;
let suCellSize;

let movePlayerAnimation = {"enabled": false, "from": null, "to": null, "count": 0}
let playerPosition = "r_01_0";

//==============================================================================================================
// server variables

let map_cells_ids;

let map_cells_size;

let MAP_MAX;

let players_position = [];
let map_cells_owners = [];
let map_cells_level = [];

let player_animate_steps = [];





let map_cells_types = [
    {
        "id": "r_02",
        "type": "CELL_BUILDING",
        "cost": 1000,
        "tax": 200,
    },
    {
        "id": "r_03",
        "type": "CELL_BUILDING",
    }
]

function getNextPos() {
    pos = pos < MAP_MAX ? pos + 1 : 0;
}

function animateStep(count = 0) {
    if (!count) {
        console.log(stepCount);

        if (movePlayerAnimation.enabled) {
            animatePlayerStep();
            return;
        }
        if (stepCount) {
            stepCount--;
            //document.getElementById(ids[pos]).classList.remove("show");
            getNextPos();
            while (!getFreeSubCell(document.getElementById(map_cells_ids[pos]))) getNextPos();
            //document.getElementById(ids[pos]).classList.add("show");
            console.log("Target: " + getFreeSubCell(document.getElementById(map_cells_ids[pos])));
            startAnimatePlayer(playerPosition, getFreeSubCell(document.getElementById(map_cells_ids[pos])));
        } else {
            clearInterval(timerStep);
        }
    } else {
        console.log(count);
        stepCount = count;
        timerStep = setInterval(animateStep, 20);
    }
}

function getFreeSubCell(cell) {
    for (let i = 0; i < cell.childNodes.length; i++) {
        if (cell.childNodes[i].innerHTML === "") return cell.childNodes[i].id;
    }
    return false;
}

function startAnimatePlayer(from_id, to_id) {
    //elPlayer.style.width =
    movePlayerAnimation.from = document.getElementById(from_id);
    movePlayerAnimation.to = document.getElementById(to_id);
    movePlayerAnimation.count = ANIMATION_PLAYER_STEPS;
    movePlayerAnimation.enabled = true;
    elPlayer.appendChild(movePlayerAnimation.from.childNodes[0]);
    let sizes = movePlayerAnimation.from.getBoundingClientRect();
    console.log(sizes);
    elPlayer.style.width = sizes.width + "px";
    elPlayer.style.height = sizes.height + "px";
    elPlayer.style.left = sizes.left + "px";
    elPlayer.style.top = sizes.top + "px";
    console.log(elPlayer);
}

// https://easings.net/
function easeInOutExpo(x) {
    return x === 0
        ? 0
        : x === 1
            ? 1
            : x < 0.5 ? Math.pow(2, 20 * x - 10) / 2
                : (2 - Math.pow(2, -20 * x + 10)) / 2;

}

function easeOutBack(x) {
    const c1 = 1.70158;
    const c3 = c1 + 1;

    return 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2);

}

function linear(x) {
    return x;
}

function animatePlayerStep(decrement = true) {
    //console.log(movePlayerAnimation);
    if (!movePlayerAnimation.enabled) return;
    let start = movePlayerAnimation.from.getBoundingClientRect();
    let end = movePlayerAnimation.to.getBoundingClientRect();

    //console.log("Count: " + movePlayerAnimation.count);
    //console.log(elPlayer);
    let pos_x = window.scrollX + start.left + Math.floor((end.left - start.left) * easeOutBack((ANIMATION_PLAYER_STEPS - movePlayerAnimation.count) / ANIMATION_PLAYER_STEPS));
    let pos_y = window.scrollY + start.top + Math.floor((end.top - start.top) * easeOutBack((ANIMATION_PLAYER_STEPS - movePlayerAnimation.count) / ANIMATION_PLAYER_STEPS));
    if (decrement) movePlayerAnimation.count--;
    if (movePlayerAnimation.count < 0) {
        movePlayerAnimation.enabled = false;

        playerPosition = movePlayerAnimation.to.id;

        movePlayerAnimation.to.appendChild(elPlayer.children[0]);
        elPlayer.innerHTML = "";
        elPlayer.style.top = "-1000px";
        return;
    }

    //console.log("end: " + end.left);
    //console.log("pos_x: " + pos_x);

    elPlayer.style.left = pos_x + "px";
    elPlayer.style.top = pos_y + "px";
}

function aaa() {
    timerStep = setInterval(animatePlayerStep, 100);
}

function test() {
    animateStep(Math.floor(Math.random() * 6) + 1);
    //animateStep();
}


function main_menu() {

}

window.onload = (event) => {
    console.log("test");
    elPlayer = document.getElementById("player");
    elGame = document.getElementById("game");
    console.log(elPlayer.getBoundingClientRect());
    console.log(elGame.getBoundingClientRect());

    // for (let i = 0; i < map_cells_ids.length; i++) {
    //     let cell = map_cells_ids[i];
    //     let el = document.getElementById(cell);
    //     for (let j = 0; j < map_cells_size[i]; j++) {
    //         let newEl = document.createElement("div");
    //         newEl.id = `${cell}_${j}`;
    //         el.appendChild(newEl);
    //     }
    // }

    // let mp = document.createElement("div");
    // mp.classList.add("player")
    // document.getElementById("r_01_0").appendChild(mp);
    //document.getElementById("r_01_0").getBoundingClientRect();

}

onresize = (event) => {
    animatePlayerStep(false);
};


//==============================================================================================================
//============================================- API -===========================================================
//==============================================================================================================
function auth() {
    $.post("/api/auth.php", {"username": document.getElementById("username").value,
        "password": document.getElementById("password").value}, function(data) {
        console.log(data);
        if (data.result === 0) {
            localStorage.setItem("token", data.token);
            document.getElementById("auth").style.display = "none";
            document.getElementById("user_actions").style.display = "";
        } else {
            document.getElementById("auth_message").innerText = data.message;
        }
    });
}

function load_map(html, js) {
    $.get(html, function (data) {
        document.getElementById("game").innerHTML = data;
    });

    $.get(js, function (data) {
        map_cells_ids = data.map_cells_ids;
        map_cells_size = data.map_cells_size;
        MAP_MAX = map_cells_ids.length - 1;

        for (let i = 0; i < map_cells_ids.length; i++) {
            let cell = map_cells_ids[i];
            let el = document.getElementById(cell);
            for (let j = 0; j < map_cells_size[i]; j++) {
                let newEl = document.createElement("div");
                newEl.id = `${cell}_${j}`;
                el.appendChild(newEl);
            }
        }

        let mp = document.createElement("div");
        mp.classList.add("player")
        document.getElementById("r_01_0").appendChild(mp);
    });

}

function create_session() {
    $.post("/api/create_game.php", {"token": localStorage.getItem("token")}, function(data) {
        console.log(data);
        if (data.result === 0) {
            document.getElementById("session_id").value = data.code;
            load_map(data.html, data.json);
        } else {
            //document.getElementById("auth_message").innerText = data.message;
            get_game_info();
        }
    });
}

function get_game_info() {
    $.post("/api/user_game_info.php", {"token": localStorage.getItem("token")}, function(data) {
        console.log(data);
        load_map(data.html, data.json);
    });
}

