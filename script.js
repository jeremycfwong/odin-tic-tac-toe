const GameBoard = (() => {
    var board = []
    var getBoard = () => board;
    const createBoard = function(){
        for (var i=0; i < 9; i++){
            board.push('')
        }
    }

    const resetBoard = function() {
        board.forEach(function(_, index) {
            board[index] = ""
        })
    }

    const markBoard = function(position, mark) {
        board[position] = mark
    }

    const availableMoves = function() {
        var availableSet = []
        board.forEach(function(element,index){
             if (element == ""){
                availableSet.push(index)
             }
        })

        return availableSet
    }
    
    return { createBoard, markBoard, getBoard, resetBoard, availableMoves}
})();

const Player = (mark, name) => {return {mark, name}};

const GameFlow = (() => {
    var blockElements = document.getElementsByClassName('block');
    var alert = document.getElementById('alert-message')
    var playerOne;
    var playerTwo;
    var currentPlayer = playerOne;
    var boardObj = GameBoard;
    boardObj.createBoard()


    const getName = function() {
        playerOneName = document.getElementById('player-one').value;
        playerOne = Player('X', playerOneName);
        playerTwoName = document.getElementById('player-two').value;
        playerTwo = Player('O', playerTwoName);

        document.getElementById('modal').style.display = "none";

        startGame();
    }
    
    const startGame = function(){
        Array.from(blockElements).forEach(function(block, index){
            block.setAttribute('id',index)
        })
        startRound();
    }

    const startRound = function(){
        Array.from(blockElements).forEach(function(block){
            block.innerText = '';
            currentPlayer = playerOne;
            block.addEventListener('click', playerMove)
        })
    }

    const newRound = function(){
        boardObj.resetBoard()
        document.getElementById('alert').style.display = "none";
        startRound()
    }

    const nextPlayer = function() {
        Array.from(blockElements).forEach(function(block){
            currentPlayer = (currentPlayer == playerOne)? playerTwo : playerOne;
            block.addEventListener('click', playerMove)
        })
    }

    const playerMove = function() {
        if (this.innerText == ''){
            this.innerText = currentPlayer.mark
            boardObj.markBoard(this.id, currentPlayer.mark);
            console.log(boardObj.availableMoves())
            checkGame(boardObj.getBoard())
            nextPlayer();
        }
    }

    const checkGame = function(board) {
        console.log(tester.minmax(boardObj))

        if(checkColumn(board)||checkDiag(board)||checkRow(board)){
            if(currentPlayer == playerOne){
                alert.innerText = "You Win!"
            } else {
                alert.innerText = "You Lose!"
            }
            document.getElementById('alert').style.display = "block";

        } else if (board.every((value) => value != '')){
            // game tie
            alert.innerText = "Its a Tie!"
            document.getElementById('alert').style.display = "block";
        } 
    }

    const endCheck = function(board) {
        if(checkColumn(board)||checkDiag(board)||checkRow(board)){
            return true
        } else if (board.every((value) => value != '')){
           return {'winner' : 'tie'}
        } 
    }

    function checkRow (board) {
        for (var i = 0; i < 9; i+= 3){
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

        diag = [];
        for (var i = 2; i<= 6; i+=2){
            diag.push(board[i])
        }

        if (diag.every((value) => value == diag[0] && diag[0] != '')){
            return true
        }
        
        return false
        }


    return {getName, newRound, endCheck}
})();

const tester = (() => {
    function bestMove(moves, findingMax){
        var optimal;
        if(findingMax){
            let max = -100;
            for (let i = 0; i < moves.length; i++){
                if (moves[i].score > max){
                    max = moves[i].score;
                    optimal = i
                }
            }
        } else {
            let min = 100;
            for (let i = 0; i < moves.length; i++){
                if (moves[i].score < min){
                    min = moves[i].score;
                    optimal = i
                }
            }
        }
        return moves[optimal];
    }

    function minmax(board, findingMax = true, depth = 0){
        if (GameFlow.endCheck(board.getBoard())) {
            if (GameFlow.endCheck(board.getBoard()).winner == "tie"){
                return {score: 0}
            } else if (!findingMax){
                return {score: 10 - depth}
            } else {
                return {score: -10 + depth}
            }
        }

        let moves = [];
        board.availableMoves().forEach(index =>{
            let move = {};
            move.index = index;

            if(!findingMax){
                board.markBoard(index, 'O');
                var rating = minmax(board, true, depth + 1)
                move.score = rating.score
            } else {
                board.markBoard(index, 'X');
                var rating = minmax(board, false, depth + 1)
                move.score = rating.score
            }

            board.markBoard(index, '')

            moves.push(move)
        })

        return bestMove(moves, findingMax)
}

return {minmax}
    
})();