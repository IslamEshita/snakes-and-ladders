const gameBoard = document.getElementById('gameBoard');
const rollButton = document.getElementById('rollButton');
const diceValue = document.getElementById('diceValue');
const gameResult = document.getElementById('gameResult');

const specialGrids = [
    { gridNum: 18, type: 'ladder', newPos: 67 },
    { gridNum: 35, type: 'ladder', newPos: 84 },
    { gridNum: 61, type: 'snake', newPos: 6 },
    { gridNum: 99, type: 'snake', newPos: 47 },
]

let player1Pos = 0;
let player2Pos = 0;
let turn = "None";

function adjustIfSpecialGrid(pos) {
    let newPos = pos;

    for(let i=0; i<specialGrids.length; i++) {
        if(specialGrids[i].gridNum == pos) {
            newPos = specialGrids[i].newPos;
            if(specialGrids[i].type == "ladder") {
                console.log(`Climbing ladder to ${newPos} from ${pos}`);
            }
            else
            {
                console.log(`Bitten by snake at ${pos}. Going down to ${newPos}.`);
            }
        }
    }

    return newPos;
}

function checkForWin() {
    if(player1Pos == 100) {
        gameResult.textContent = "Player 1 Wins!";
    }
    else if(player2Pos == 100) {
        gameResult.textContent = "Player 2 Wins!";
    }
}

function getNextTurn() {
    if(turn === "Player1") {
        turn = "Player2";
        rollButton.value="Roll Dice (Player 2)";
    }
    else {
        turn = "Player1";
        rollButton.value="Roll Dice (Player 1)";
    }
}

function getRow(gridNum) {
    let row = 0;

    if(gridNum >= 91 && gridNum <= 100) {
        row = 0;
    }
    else if(gridNum >= 81 && gridNum <= 90) {
        row = 1;
    }
    else if(gridNum >= 71 && gridNum <= 80) {
        row = 2;
    }
    else if(gridNum >= 61 && gridNum <= 70) {
        row = 3;
    }
    else if(gridNum >= 51 && gridNum <= 60) {
        row = 4;
    }
    else if(gridNum >= 41 && gridNum <= 50) {
        row = 5;
    }
    else if(gridNum >= 31 && gridNum <= 40) {
        row = 6;
    }
    else if(gridNum >= 21 && gridNum <= 30) {
        row = 7;
    }
    else if(gridNum >= 11 && gridNum <= 20) {
        row = 8;
    }
    else {
        row = 9;
    }

    return row;
}

function getColumn(gridNum) {
    let column = 0;

    switch(gridNum) {
        case 10:
        case 20:
        case 30:
        case 40:
        case 50:
        case 60:
        case 70:
        case 80:
        case 90:
        case 100:
            column = 0;            
            break;
        default:            
            column = 10 - gridNum % 10;
            break;
    }
    
    return column;
}


function getDiceValue() {
    const dice = 1 + Math.floor(Math.random()*6);
    diceValue.textContent = dice;

    return dice;
}

function rollButtonClicked(ev) {    

    const num = getDiceValue();

    if(turn === "Player1")
    {
        newPos = player1Pos + num;
        newPos = adjustIfSpecialGrid(newPos);
        if(newPos <= 100)
        {
            player1Pos = newPos;
            movePlayer(1, player1Pos);
        }
    }
    else
    {
        newPos = player2Pos + num;
        newPos = adjustIfSpecialGrid(newPos);
        if(newPos <= 100)
        {
            player2Pos = newPos;
            movePlayer(2, player2Pos);
        }
    }
    
    getNextTurn();
    checkForWin();
}

function drawPlayer(playerNum) {    
    const player = document.createElement('img');
    player.style.display = "none";
    player.setAttribute('id', `player${playerNum}`);
    player.setAttribute('src', `assets/token_player_${playerNum}.png`);
    player.setAttribute('class', 'player');

    gameBoard.append(player);
}

function movePlayer(playerNum, gridNum) {
    const playerElement = document.getElementById(`player${playerNum}`);

    const numGrids = 100;
    const numRows = 10;
    const numCols = 10;
    const boardWidth = 750;
    const boardHeight = 750;
    const gridWidth = boardWidth / numCols;
    const gridHeight = boardHeight / numRows; 

    // Get the row, col
    let row = getRow(gridNum);
    let col = getColumn(gridNum);
    // Get the top, bottom
    const top = (row * gridHeight);
    const left = (col * gridWidth);

    playerElement.style.display = "block";
    playerElement.style.top = `${top}px`;
    playerElement.style.left = `${left}px`;
}

function drawBoard() {
    for(let i=100; i>=1; i--) {
        let value = String(i);
        
        const boardGridItemElement = document.createElement('div');
        boardGridItemElement.textContent = value;
        boardGridItemElement.setAttribute('class', 'boardGridItem');
        boardGridItemElement.setAttribute('id', `boardGridNum${value}`);

        gameBoard.append(boardGridItemElement);
    }
}

function drawSnakes() {
    // Add the first snake
    const snake01 = document.createElement('img');
    snake01.setAttribute('id', 'snake01');
    snake01.setAttribute('class', 'snake');
    snake01.setAttribute('src', 'assets/snake01.png');
    gameBoard.append(snake01);
    // Add the second snake
    const snake02 = document.createElement('img');
    snake02.setAttribute('id', 'snake02');
    snake02.setAttribute('class', 'snake');
    snake02.setAttribute('src', 'assets/snake02.png');
    gameBoard.append(snake02);
}

function drawLadders() {
    const ladder01 = document.createElement('img');
    ladder01.setAttribute('id', 'ladder01');
    ladder01.setAttribute('class', 'ladder');
    ladder01.setAttribute('src', 'assets/ladder01.png');
    gameBoard.append(ladder01);

    const ladder02 = document.createElement('img');
    ladder02.setAttribute('id', 'ladder02');
    ladder02.setAttribute('class', 'ladder');
    ladder02.setAttribute('src', 'assets/ladder01.png');
    gameBoard.append(ladder02);
}

document.body.onload = function() {    
    rollButton.onclick = rollButtonClicked;

    drawBoard();
    drawSnakes();
    drawLadders();
    drawPlayer(1);
    drawPlayer(2);
    getNextTurn();
}