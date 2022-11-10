const GameBoard = (() => {
    var board = []
    const getBoard = board;
    const createBoard = function(){
        for (var i=0; i < 9; i++){
            board.push('')
        }

        return board
    }

    const markBoard = function(position, mark) {
        board[position] = mark
    }
    
    return { createBoard, markBoard, getBoard}
})();

const Player = (mark) => {
    let playerMark = mark;
    return {playerMark}
};

const GameFlow = (() => {
    var blockElements = document.getElementsByClassName('block');
    var playerOne = Player('X');
    var playerTwo = Player('O');
    var currentPlayer = playerOne;
    var board = GameBoard;
    board.createBoard()
    
    const startRound = function(){
        Array.from(blockElements).forEach(function(block, index){
            block.innerText = '';
            block.addEventListener('click', playerMove)
            block.setAttribute('id',index)
            currentPlayer = playerOne;
        })
    }

    const nextPlayer = function() {
        Array.from(blockElements).forEach(function(block){
            currentPlayer = (currentPlayer == playerOne)? playerTwo : playerOne;
            block.addEventListener('click', playerMove)
        })
    }

    const playerMove = function() {
        if (this.innerText == ''){
            this.innerText = currentPlayer.playerMark
            board.markBoard(this.id, currentPlayer.playerMark);
            checkRow(board.getBoard)
            checkColumn(board.getBoard)
            checkDiag(board.getBoard)
            nextPlayer();
        }
    }

    const checkGame = function() {
        board.getBoard

    }

    function checkRow (board){
        for (var i = 0; i <= 9; i+= 3){
            var row = []
            for (var j = i; j < i+3; j++){
                row.push(board[j])
            }
   
            if (row.every((value) => value == row[0] && row[0] != '')){
                return true
            }
        }
        return false;
    }

    function checkColumn (board) {
        for(var i = 0; i < 3; i++){
            var column = []
            for(var j = i; j <= i+6; j += 3){
                column.push(board[j])
            }
            
            if(column.every((value) => value == column[0] && column[0] != '')){
                return true
            }
        }

        return false;
    }

    function checkDiag(board) {
        var diag = [];
        for(var i = 0; i <= 8; i += 4){
            diag.push(board[i])
        }
        if (diag.every((value) => value == diag[0] && diag[0] != '')){
            return true
        }

        console.log(diag)
        diag = [];
        for (var i = 2; i<= 6; i+=2){
            diag.push(board[i])
        }

        if (diag.every((value) => value == diag[0] && diag[0] != '')){
            return true
        }

        console.log(diag)
        
        return false
        }


    return {startRound}
})();

