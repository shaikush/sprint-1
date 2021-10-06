'use strict'
const MINE='💣'
const FLAG='🎌'
const NORMAL='😁'
const SAD= '🤕'
const WINNER='🤑'

var gLives=3
var gIdInterval
var gHint=false
var gHintCount=3
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
    gBoard = createBoard(4);
    renderBoard(gBoard);
}

function createBoard(size) {
    var board = [];
    for (var i = 0; i < size; i++) {
        board.push([]);
        for (var j = 0; j < size; j++) {
            board[i][j] ={
                minesAroundCount: null,
                isShown: false,
                isMine: false,
                isMarked: false
            }
        }
    }

    placeRandMine(board,gLevel.MINES,gLevel.SIZE)

    for (var i = 0; i < size; i++) {
        for (var j = 0; j < size; j++) {
            var currCell=board[i][j]
            if(!currCell.isMine){
                currCell.minesAroundCount=setMinesNegsCount(i,j,board)
                if(currCell.minesAroundCount===0) currCell.minesAroundCount=''
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
        var className = `cell cell${i}-${j}`
        if(cell.isMine) strHTML+=`<td class="${className}" onMousedown="checkClick(event,this, ${i}, ${j})"><span>${MINE}</span></td>`
        else strHTML += `<td class="${className}" onMousedown="checkClick(event,this, ${i}, ${j})"><span>${cell.minesAroundCount}</span></td>`
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
    return minesCount;
}

function cellClicked(elCell,i,j){
    
    if(gGame.shownCount===0 && gGame.markedCount===0 && !gIdInterval){
        gGame.isOn=true
        timer()
    } 


    if(gGame.isOn && gBoard[i][j].isShown===false && !gBoard[i][j].isMarked){
        var currCell=gBoard[i][j]
        if(gHint){
            expandShownTemp(gBoard,i,j)
            return
        } 
        if(currCell.minesAroundCount===''){
            expandShown(gBoard,i,j)
        }else if(currCell.minesAroundCount>=1){
            currCell.isShown=true
            elCell.classList.add('mark')
            var elSpan=elCell.querySelector('span')
            elSpan.style.display='inline-block'
            gGame.shownCount++
        }else if(currCell.isMine){
            if(gLives===1){
                var elFace=document.querySelector('.face')
                elFace.innerText=SAD
                revelMines()
                gGame.shownCount++
                gGame.isOn=false
                clearInterval(gIdInterval)
                alert('You Lost!')
                return
            }else{
                gLives--
                var elLives=document.querySelector('.lives span')
                elLives.innerText=gLives
                alert('CARFULL! you stepped on a MINE!')
            }
        }
    }

    console.log('cells shown: ',gGame.shownCount)
    checkVictory()
}

function cellFlag(elCell,i,j){
    if(gGame.shownCount===0 && gGame.markedCount===0 && !gIdInterval){
        gGame.isOn=true
        timer()
    } 

    if(gGame.isOn && !gBoard[i][j].isMarked && !gBoard[i][j].isShown){
       
        if(gGame.markedCount===gLevel.MINES){ // check if you still have flags first
            alert('no more flags!')
            return
        }
        
        gGame.markedCount++
        gBoard[i][j].isMarked=true
        var elSpan=elCell.querySelector('span')
        elSpan.innerHTML=FLAG
        elSpan.style.display='inline-block'
        var elFlag=document.querySelector('.score span')
        elFlag.innerHTML=gGame.markedCount
        checkVictory()
        return
    }

    if(gBoard[i][j].isMarked){
        gGame.markedCount--
        gBoard[i][j].isMarked=false
        var elSpan=elCell.querySelector('span')
        if(gBoard[i][j].isMine){
            elSpan.innerHTML=MINE
            elSpan.style.display='none'
            var elFlag=document.querySelector('.score span')
            elFlag.innerHTML=gGame.markedCount
        }else{
            elSpan.innerHTML=gBoard[i][j].minesAroundCount
            elSpan.style.display='none'
            var elFlag=document.querySelector('.score span')
            elFlag.innerHTML=gGame.markedCount
        }
    }
}


function expandShown(board, cellI, cellJ){
    for (var i = cellI - 1; i <= cellI + 1; i++) {
        if (i < 0 || i >= board.length) continue;
        for (var j = cellJ - 1; j <= cellJ + 1; j++){
            if (j < 0 || j >= board[i].length) continue;
            if(board[i][j].isShown===false && !board[i][j].isMarked){
                board[i][j].isShown=true
                var elCell=document.querySelector(`.cell${i}-${j}`)
                elCell.classList.add('mark')
                var elSpan=elCell.querySelector('span')
                elSpan.style.display='inline-block'
                gGame.shownCount++
            }
        }
    }
}


function expandShownTemp(board, cellI, cellJ){
    console.log('bbbbb')
    gHint=false
    for (var i = cellI - 1; i <= cellI + 1; i++) {
        if (i < 0 || i >= board.length) continue;
        for (var j = cellJ - 1; j <= cellJ + 1; j++){
            if (j < 0 || j >= board[i].length) continue;
            if(board[i][j].isShown===false && !board[i][j].isMarked){
                var elCell=document.querySelector(`.cell${i}-${j}`)
                elCell.classList.add('mark')
                var elSpan=elCell.querySelector('span')
                elSpan.style.display='inline-block'
            }
        }
    }
    setTimeout(() => {
        for (var i = cellI - 1; i <= cellI + 1; i++) {
            if (i < 0 || i >= board.length) continue;
            for (var j = cellJ - 1; j <= cellJ + 1; j++){
                if (j < 0 || j >= board[i].length ) continue;
                if(board[i][j].isShown===false && !board[i][j].isMarked){
                    var elCell=document.querySelector(`.cell${i}-${j}`)
                    elCell.classList.remove('mark')
                    var elSpan=elCell.querySelector('span')
                    elSpan.style.display='none'
                }
            }
        }

    }, 1000);
}

function timer(){
    if(gGame.isOn){
        gIdInterval=setInterval(function(){
            gGame.secsPassed+=1
            var elTimer=document.querySelector(".timer span")
            elTimer.innerText=gGame.secsPassed
        },1000)
    }
}
    
document.addEventListener("contextmenu", function(event){
    event.preventDefault();
    }, false);

// function checkGameOver(){
//     if()
// }

function restart(boardSize,minesNum){
 
    clearInterval(gIdInterval)
    gIdInterval=false
    gHint=false
    gHintCount=3
    
    gGame = {
        isOn: false,
        shownCount: 0,
        markedCount: 0,
        secsPassed: 0
    }

    gLevel = {
        SIZE: boardSize,
        MINES: minesNum
    }

    gLives=3
    var elLives=document.querySelector('.lives span')
    elLives.innerText=gLives

    var elHint=document.querySelector('.hint')
    elHint.innerText='💡💡💡'
    
    var elMarkedFlags=document.querySelector('.score span')
    elMarkedFlags.innerText=gGame.markedCount

   
    var elTimer=document.querySelector('.timer span')
    elTimer.innerText=gGame.secsPassed

    var elFace=document.querySelector('.face')
    elFace.innerText=NORMAL

    gBoard = createBoard(boardSize);
    renderBoard(gBoard);
}


function placeRandMine(board,mineNum){
    for(var i=1;i<=mineNum;i++){
        var idxI=getRandomInt(0,board.length)
        var idxJ=getRandomInt(0,board[0].length)
        // (!board[idxI][idxJ].isMine)?board[idxI][idxJ].isMine=true : i-- // short if dont work... why?????
        if(!board[idxI][idxJ].isMine){
            board[idxI][idxJ].isMine=true
        }else{
            i--
        }
    }
}

function revelMines(){
    for(var i=0;i<gBoard.length;i++){
        for(var j=0;j<gBoard[0].length;j++){
            if(gBoard[i][j].isMine){
            var elCell=document.querySelector(`.cell${i}-${j}`)
            elCell.classList.add('markRed')
            var elSpan=elCell.querySelector('span')
            elSpan.style.display='inline-block'
            }
        }
    }
}

function checkClick(ev,elCell,i,j){
    console.log(ev)
    switch (ev.which) {
        case 1:
            cellClicked(elCell,i,j);
            break;
        case 3:
            cellFlag(elCell,i,j);
            break;
    }
}

function checkVictory(){
    if((gGame.shownCount===14 && gGame.markedCount===2) || (gGame.shownCount===52 && gGame.markedCount===12) || (gGame.shownCount===114 && gGame.markedCount===30)){
        var elFace=document.querySelector('.face')
        elFace.innerText=WINNER
        clearInterval(gIdInterval)
        gGame.isOn===false
        alert('You ROCk!')
    } 
}

function hint(){
    var elHint=document.querySelector('.hint')
    if(gHintCount===3){
        elHint.innerText='💡💡'
        gHintCount--
    }else if(gHintCount===2){
        elHint.innerText='💡'
        gHintCount--
    }else if(gHintCount===1){
        elHint.innerText=''
        gHintCount--
    }
    
    console.log(elHint.innerText)
    gHint=true
    console.log(gHint)
}

    


