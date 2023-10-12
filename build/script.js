"use strict";
const gameBoard = document.getElementById('gameBoard');
const gameResult = document.getElementById('gameResult');
const rollButton = document.getElementById('rollButton');
const newGameButton = document.getElementById('newGameButton');
const diceValueImage = document.getElementById('diceValueImage');
const lastRoll = document.getElementById('lastRoll');
let lastClearID = -1;
const specialGrids = [
    { gridNum: 6, type: 'ladder', newPos: 45 },
    { gridNum: 18, type: 'ladder', newPos: 64 },
    { gridNum: 31, type: 'snake', newPos: 16 },
    { gridNum: 35, type: 'ladder', newPos: 87 },
    { gridNum: 38, type: 'ladder', newPos: 79 },
    { gridNum: 41, type: 'snake', newPos: 26 },
    { gridNum: 49, type: 'ladder', newPos: 93 },
    { gridNum: 70, type: 'snake', newPos: 5 },
    { gridNum: 84, type: 'snake', newPos: 14 },
    { gridNum: 99, type: 'snake', newPos: 44 },
];
let player1Pos = 0;
let player2Pos = 0;
let turn = "None";
function adjustIfSpecialGrid(pos) {
    let newPos = pos;
    for (let i = 0; i < specialGrids.length; i++) {
        if (specialGrids[i].gridNum == pos) {
            newPos = specialGrids[i].newPos;
            if (specialGrids[i].type == "ladder") {
                console.log(`Climbing ladder to ${newPos} from ${pos}`);
            }
            else {
                console.log(`Bitten by snake at ${pos}. Going down to ${newPos}.`);
            }
        }
    }
    return newPos;
}
function checkForWin() {
    let gameOver = false;
    if (player1Pos == 100) {
        gameResult.textContent = "Player 1 Wins!";
        gameOver = true;
    }
    else if (player2Pos == 100) {
        gameResult.textContent = "Player 2 Wins!";
        gameOver = true;
    }
    if (gameOver) {
        gameResult.style.display = "block";
        newGameButton.style.display = "block";
        rollButton.style.display = "none";
    }
}
function getNextTurn() {
    if (turn === "Player1") {
        turn = "Player2";
    }
    else {
        turn = "Player1";
    }
}
function getRow(gridNum) {
    let row = 0;
    if (gridNum >= 91 && gridNum <= 100) {
        row = 0;
    }
    else if (gridNum >= 81 && gridNum <= 90) {
        row = 1;
    }
    else if (gridNum >= 71 && gridNum <= 80) {
        row = 2;
    }
    else if (gridNum >= 61 && gridNum <= 70) {
        row = 3;
    }
    else if (gridNum >= 51 && gridNum <= 60) {
        row = 4;
    }
    else if (gridNum >= 41 && gridNum <= 50) {
        row = 5;
    }
    else if (gridNum >= 31 && gridNum <= 40) {
        row = 6;
    }
    else if (gridNum >= 21 && gridNum <= 30) {
        row = 7;
    }
    else if (gridNum >= 11 && gridNum <= 20) {
        row = 8;
    }
    else {
        row = 9;
    }
    return row;
}
function getColumn(gridNum) {
    let column = 0;
    let row = getRow(gridNum);
    if (row % 2 == 0) {
        let gridAtcol0 = (10 - row) * 10;
        column = gridAtcol0 - gridNum;
    }
    else {
        let gridAtcol9 = (10 - row) * 10;
        column = 9 - (gridAtcol9 - gridNum);
    }
    return column;
}
function getDiceValue() {
    const dice = 1 + Math.floor(Math.random() * 6);
    let color;
    if (turn == "Player1") {
        color = "red";
    }
    else {
        color = "blue";
    }
    diceValueImage.src = `assets/dice/dice_${color}_${dice}.png`;
    diceValueImage.style.visibility = "visible";
    return dice;
}
function rollButtonClicked(ev) {
    const num = getDiceValue();
    updateLastRoll(num);
    clearTimeout(lastClearID);
    lastClearID = setTimeout(clearDiceValue, 2000);
    if (turn === "Player1") {
        newPos = player1Pos + num;
        newPos = adjustIfSpecialGrid(newPos);
        if (newPos <= 100) {
            player1Pos = newPos;
            movePlayerToGrid(1, player1Pos);
        }
    }
    else {
        newPos = player2Pos + num;
        newPos = adjustIfSpecialGrid(newPos);
        if (newPos <= 100) {
            player2Pos = newPos;
            movePlayerToGrid(2, player2Pos);
        }
    }
    getNextTurn();
    checkForWin();
}
function clearDiceValue() {
    diceValueImage.style.visibility = "hidden";
}
function drawPlayer(playerNum) {
    const player = document.createElement('img');
    player.setAttribute('id', `player${playerNum}`);
    player.setAttribute('src', `assets/tokens/player${playerNum}.png`);
    player.setAttribute('class', 'player');
    gameBoard.append(player);
}
function drawPlayers() {
    drawPlayer(1);
    drawPlayer(2);
}
function movePlayerToGrid(playerNum, gridNum) {
    const playerElement = document.getElementById(`player${playerNum}`);
    const numRows = 10;
    const numCols = 10;
    const numGrids = numRows * numCols;
    const boardWidth = 750;
    const boardHeight = 750;
    const gridWidth = boardWidth / numCols;
    const gridHeight = boardHeight / numRows;
    // Get the row, col
    let row = getRow(gridNum);
    let col = getColumn(gridNum);
    // Get the top, bottom
    let top = (row * gridHeight);
    let left = (col * gridWidth);
    // Adjust top and left for the player
    if (playerNum == 1) {
        top += 2;
        left += 2;
    }
    else if (playerNum == 2) {
        top += 27;
        left += 27;
    }
    // Set the top and left styles
    playerElement.style.display = "block";
    playerElement.style.top = `${top}px`;
    playerElement.style.left = `${left}px`;
}
function drawBoard() {
    for (let i = 1; i <= 10; i++) {
        for (let j = 1; j <= 10; j++) {
            let gridNum;
            if (i % 2 == 0) {
                gridNum = ((10 - i) * 10) + j;
            }
            else {
                gridNum = ((10 - i) * 10) + (11 - j);
            }
            const boardGridItemElement = document.createElement('div');
            boardGridItemElement.textContent = gridNum;
            boardGridItemElement.setAttribute('class', 'boardGridItem');
            boardGridItemElement.setAttribute('id', `boardGridNum${gridNum}`);
            gameBoard.append(boardGridItemElement);
        }
    }
}
function drawSnake(id) {
    const snake = document.createElement('img');
    const snakeID = `snake${id}`;
    snake.setAttribute('class', 'snake');
    snake.setAttribute('id', snakeID);
    snake.setAttribute('src', `assets/snakes/${snakeID}.png`);
    gameBoard.append(snake);
}
function drawSnakes() {
    for (let i = 1; i <= 5; i++) {
        drawSnake(i);
    }
}
function drawLadder(id) {
    const ladder = document.createElement('img');
    const ladderID = `ladder${id}`;
    ladder.setAttribute('class', 'ladder');
    ladder.setAttribute('id', ladderID);
    ladder.setAttribute('src', `assets/ladders/${ladderID}.png`);
    gameBoard.append(ladder);
}
function drawLadders() {
    for (let i = 1; i <= 5; i++) {
        drawLadder(i);
    }
}
function updateLastRoll(roll) {
    let player;
    if (turn == "Player1") {
        player = "Player #1";
    }
    else {
        player = "Player #2";
    }
    lastRoll.textContent = `${player} rolled a ${roll}`;
}
function startNewGame() {
    // Reset player position
    player1Pos = 0;
    player2Pos = 0;
    turn = "None";
    // Hide Player 1 token
    document.getElementById('player1').style.display = "none";
    // Hide Player 2 token
    document.getElementById('player2').style.display = "none";
    // Clear out the last roll
    lastRoll.textContent = "";
    // Hide the new game button
    newGameButton.style.display = "none";
    // Hide the game result
    gameResult.style.display = "none";
    // Show the roll button
    rollButton.style.display = "inline-block";
    getNextTurn();
}
document.body.onload = function () {
    // Draw the board, snakes, ladders and icons
    drawBoard();
    drawSnakes();
    drawLadders();
    drawPlayers();
    // Hide the new game button
    gameResult.style.display = "none";
    // Hide the roll button
    rollButton.style.display = "none";
    // Hide Player 1 token
    document.getElementById('player1').style.display = "none";
    // Hide Player 2 token
    document.getElementById('player2').style.display = "none";
    // Add the roll button listener
    rollButton.onclick = rollButtonClicked;
    // Add new game button listener
    newGameButton.onclick = startNewGame;
};
