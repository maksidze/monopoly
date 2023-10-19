
let ids = [
    "r_01",
    "r_02", "r_03", "r_04", "r_05", "r_06", "r_07", "r_08", "r_09", "r_10",
    "r_11",
    "r_12", "r_13", "r_14", "r_15", "r_16", "r_17", "r_18", "r_19", "r_20",
    "r_21",
    "r_22", "r_23", "r_24", "r_25", "r_26", "r_27", "r_28", "r_29", "r_30",
    "r_31",
    "r_32", "r_33", "r_34", "r_35", "r_36", "r_37", "r_38", "r_39", "r_40"];

let ids_low = [
    "r_01", "r_11", "r_21", "r_31"
]
const MAP_MAX = ids.length - 1;
const ANIMATION_PLAYER_STEPS = 20;

let players = []

let pos = 0;

let stepCount = 0;
let timerStep;

let elPlayer;
let elGame;

let cellSize;
let suCellSize;

let movePlayerAnimation = {"enabled": false, "from": null, "to": null, "count": 0}
let playerPosition = "r_01_0";

let cells = [
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
            while (!getFreeSubCell(document.getElementById(ids[pos]))) getNextPos();
            //document.getElementById(ids[pos]).classList.add("show");
            console.log("Target: " + getFreeSubCell(document.getElementById(ids[pos])));
            startAnimatePlayer(playerPosition, getFreeSubCell(document.getElementById(ids[pos])));
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


window.onload = (event) => {
    console.log("test");
    elPlayer = document.getElementById("player");
    elGame = document.getElementById("game");
    console.log(elPlayer.getBoundingClientRect());
    console.log(elGame.getBoundingClientRect());

    for (let cell of ids) {
        let el = document.getElementById(cell);
        for (let i = 0; i < 4; i++) {
            if (ids_low.indexOf(cell) === -1 && i > 1) break;
            let newEl = document.createElement("div");
            newEl.id = `${cell}_${i}`;
            el.appendChild(newEl);
        }
    }

    let mp = document.createElement("div");
    mp.classList.add("player")
    document.getElementById("r_01_0").appendChild(mp);

}

onresize = (event) => {
    animatePlayerStep(false);
};
