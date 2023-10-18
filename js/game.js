
let ids = ["r_01", "r_02", "r_03", "r_04", "r_05", "r_06", "r_07", "r_08", "r_09", "r_10",
    "r_11", "r_12", "r_13", "r_14", "r_15", "r_16", "r_17", "r_18", "r_19", "r_20", "r_21",
    "r_22", "r_23", "r_24", "r_25", "r_26", "r_27", "r_28", "r_29", "r_30", "r_31", "r_32"];
const MAP_MAX = ids.length - 1;
const ANIMATION_PLAYER_STEPS = 200;

let players = []

let pos = 0;

let stepCount = 0;
let timerStep;

let elPlayer;
let elGame;

let cellSize;
let suCellSize;

let movePlayerAnimation = {"enabled": false, "from": null, "to": null, "count": 0}

function getNextPos() {
    pos = pos < MAP_MAX ? pos + 1 : 0;
}

function animateStep(count = 0) {
    if (!count) {
        if (stepCount) {
            document.getElementById(ids[pos]).classList.remove("show");
            getNextPos();
            document.getElementById(ids[pos]).classList.add("show");
        } else {
            clearInterval(timerStep);
        }
        stepCount--;
    } else {
        console.log(count);
        stepCount = count;
        timerStep = setInterval(animateStep, 250);
    }
}

function getFreeSubCell(cell) {
    for (let i = 0; i < cell.childNodes.length; i++) {
        if (cell.childNodes[i].innerHTML === "") return cell.childNodes[i];
    }
    return false;
}

function animate1() {
    //elPlayer.style.width =
    movePlayerAnimation.from = document.getElementById("r_01_1");
    movePlayerAnimation.to = document.getElementById("r_18_2");
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

function animateStep1() {
    console.log(movePlayerAnimation);
    if (!movePlayerAnimation.enabled) return;
    let start = movePlayerAnimation.from.getBoundingClientRect();
    let end = movePlayerAnimation.to.getBoundingClientRect();

    console.log("Count: " + movePlayerAnimation.count);
    console.log(elPlayer);
    let pos_x = start.left + Math.floor((end.left - start.left) / ANIMATION_PLAYER_STEPS * (ANIMATION_PLAYER_STEPS - movePlayerAnimation.count));
    let pos_y = start.top + Math.floor((end.top - start.top) / ANIMATION_PLAYER_STEPS * (ANIMATION_PLAYER_STEPS - movePlayerAnimation.count));
    movePlayerAnimation.count--;
    if (movePlayerAnimation.count < 0) {
        movePlayerAnimation.enabled = false;

        movePlayerAnimation.to.appendChild(elPlayer.children[0]);
        elPlayer.innerHTML = "";
        elPlayer.style.top = "-1000px";
        return;
    }

    console.log("end: " + end.left);
    console.log("pos_x: " + pos_x);

    elPlayer.style.left = pos_x + "px";
    elPlayer.style.top = pos_y + "px";
}

function aaa() {
    timerStep = setInterval(animateStep1, 10);
}

function test() {
    //animateStep(Math.floor(Math.random() * 7));
    animateStep();
}


window.onload = (event) => {
    console.log("test");
    elPlayer = document.getElementById("player");
    elGame = document.getElementById("game");
    console.log(elPlayer.getBoundingClientRect());
    console.log(elGame.getBoundingClientRect());

    for (let cell of ids) {
        let el = document.getElementById(cell);
        for (let i = 0; i < 8; i++) {
            let newEl = document.createElement("div");
            newEl.id = `${cell}_${i}`;
            el.appendChild(newEl);
        }
    }

    let mp = document.createElement("div");
    mp.classList.add("player")
    document.getElementById("r_01_1").appendChild(mp);
    //animate(mp, document.getElementById("r_01_1"));
}

onresize = (event) => {
    let sizes = movePlayerAnimation.from.getBoundingClientRect();
    console.log(sizes);
    elPlayer.style.width = sizes.width + "px";
    elPlayer.style.height = sizes.height + "px";
    elPlayer.style.left = sizes.left + "px";
    elPlayer.style.top = sizes.top + "px";
};
