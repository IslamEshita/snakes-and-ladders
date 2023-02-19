function drawBoard()
{
    const gameBoard = document.getElementById('gameBoard');

    for(let i=0; i<100; i++)
    {
        const numberElem = document.createElement('div');
        let value = String(100 - i);
        numberElem.textContent = value;
        numberElem.setAttribute('class', 'boardGrid');
        numberElem.setAttribute('id', `boardGrid${value}`);
        gameBoard.append(numberElem);
    }
}

document.body.onload = function()
{
    drawBoard();
}