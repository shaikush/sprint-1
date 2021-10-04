'use strict'
const MINE='💣'


var gBoard
var gGame = {
    isOn: false,
    shownCount: 0,
    markedCount: 0,
    secsPassed: 0
}

var gLevel = {
    SIZE: 4,
    MINES: 2
}

function init() {
    gBoard = createBoard();
    renderBoard(gBoard);
}

function createBoard() {
    var board = [];
    for (var i = 0; i < 4; i++) {
        board.push([]);
        for (var j = 0; j < 4; j++) {
            board[i][j] ={
                minesAroundCount: 0,
                isShown: true,
                isMine: false,
                isMarked: true
            }
        }
    }

    var idxI=getRandomInt(0,board.length)
    var idxJ=getRandomInt(0,board[0].length)

    board[idxI][idxJ].isMine=true

    idxI=getRandomInt(0,board.length)
    idxJ=getRandomInt(0,board[0].length)

    board[idxI][idxJ].isMine=true


    for (var i = 0; i < 4; i++) {
        for (var j = 0; j < 4; j++) {
            var currCell=board[i][j]
            if(!currCell.isMine){
                currCell.minesAroundCount=setMinesNegsCount(i,j,board)
                // currCell={
                //     minesAroundCount: setMinesNegsCount(i,j,board),
                //     isShown: true,
                //     isMine: false,
                //     isMarked: true
                // }
            }
        }
    }
    console.table(board)
    return board;
}


function renderBoard(board) {
    var strHTML = '<table border="1" cellpadding="10"><tbody>';
    for (var i = 0; i < board.length; i++) {
      strHTML += '<tr>';
      for (var j = 0; j < board[0].length; j++) {
        var cell = board[i][j];
        var className = `cell cell ${i}-${j}`
        if(cell.isMine) strHTML+=`<td class="${className}" onclick="cellClicked(this, ${i}, ${j})"><span>${MINE}</span></td>`
        else strHTML += `<td class="${className}" onclick="cellClicked(this, ${i}, ${j})"> <span>${cell.minesAroundCount}</span></td>`
      }
      strHTML += '</tr>'
    }
    strHTML += '</tbody></table>';
    var elContainer = document.querySelector('.board-container');
    elContainer.innerHTML = strHTML;
}


function setMinesNegsCount(cellI, cellJ, board) {
    var minesCount = 0;
    for (var i = cellI - 1; i <= cellI + 1; i++) {
        if (i < 0 || i >= board.length) continue;
        for (var j = cellJ - 1; j <= cellJ + 1; j++) {
            if (i === cellI && j === cellJ) continue;
            if (j < 0 || j >= board[i].length) continue;
            if (board[i][j].isMine) minesCount++;
        }
    }
    console.log(minesCount)
    return minesCount;
}

function cellClicked(elCell,i,j){
    var elSpan=elCell.querySelector('span')
    elSpan.style.display='inline-block'
}


function renderCell(location, value) {
    // Select the elCell and set the value
    var elCell = document.querySelector(`.cell${location.i}-${location.j}`);
    elCell.innerHTML = value;
  }

  