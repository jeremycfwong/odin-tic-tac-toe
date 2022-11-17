const GameBoard = (() => {
    var board = []
    var getBoard = () => board;

    const createBoard = function(){
        board = [...Array(9)];
    }

    const resetBoard = function() {
        board.forEach(function(_, index) {
            board[index] = undefined
        })
    }

    const markBoard = function(position, mark) {
        board[position] = mark
    }

    const availableMoves = function() {
        var availableSet = []
        board.forEach(function(element,index){
             if (element == undefined){
                availableSet.push(index)
             }
        })

        return availableSet
    }
    
    return { getBoard, createBoard, resetBoard, markBoard, availableMoves}
})();

const Player = (mark, name) => {return {mark, name}};

const GameFlow = (() => {
    var blockElements = document.getElementsByClassName('block');
    var alert = document.getElementById('alert-message')
    var playerOne;
    var playerTwo;
    var currentPlayer = playerOne;
    var againstBot;

    GameBoard.createBoard();

    const initGame = function() {
        againstBot = document.getElementById('versusBot').checked
        var playerOneName = document.getElementById('player-one').value;
        
        if (againstBot){
            var playerOneChoice = (document.getElementById('cross').checked)? 'X':'O';
            playerOne = Player(playerOneChoice, playerOneName);

            var playerTwoChoice = (playerOneChoice == 'X')? 'O':'X';
            var playerTwoName = "Min-max Bot"
            playerTwo = Player(playerTwoChoice, playerTwoName)
        } else {
            playerOne = Player('X', playerOneName);
            var playerTwoName = document.getElementById('player-two').value;
            playerTwo = Player('O', playerTwoName);
        }
 
        startGame();
    }

    const startGame = function(){
        document.getElementById('modal').style.display = "none";

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

        if (playerOne.mark == 'O'){
            AIMove()
        }
    }

    const newRound = function(){
        GameBoard.resetBoard()
        document.getElementById('alert').style.display = "none";
        startRound()
    }

    const playerMove = function() {
        if (this.innerText == ''){
            this.innerText = currentPlayer.mark
            GameBoard.markBoard(this.id, currentPlayer.mark);
            checkGame(GameBoard.getBoard())
            
            if(againstBot){
                AIMove();
            } else {
                nextPlayer();
            }
        }
    }

    const nextPlayer = function() {
        Array.from(blockElements).forEach(function(block){
            currentPlayer = (currentPlayer == playerOne)? playerTwo : playerOne;
            block.addEventListener('click', playerMove)
        })
    }

    const AIMove = function() {
        currentPlayer = playerTwo
        var marks = {
            "AI" : playerTwo.mark,
            "Player" : playerOne.mark
        };

        let index = AILogic.minmax(GameBoard, marks).index
        GameBoard.markBoard(index, playerTwo.mark)
        blockElements[index].innerText = playerTwo.mark
        checkGame(GameBoard.getBoard())
        currentPlayer = playerOne
    }

    const checkGame = function(board) {
        if(checkColumn(board)||checkDiag(board)||checkRow(board)){
            if(currentPlayer == playerOne){
                alert.innerText = "You Win!"
            } else {
                alert.innerText = "You Lose!"
            }
            document.getElementById('alert').style.display = "block";

        } else if (board.every((value) => value != undefined)){
            alert.innerText = "Its a Tie!"
            document.getElementById('alert').style.display = "block";
        } 
    }

    const endCheck = function(board) {
        if(checkColumn(board)||checkDiag(board)||checkRow(board)){
            return true
        } else if (board.every((value) => value != undefined)){
           return {'winner' : 'tie'}
        } 
    }

    function checkRow (board) {
        // [0,1,2], [3,4,5], [6,7,8]
        for (var i = 0; i < 9; i+= 3){
            var row = []
            for (var j = i; j < i+3; j++){
                row.push(board[j])
            }
            if (row.every((value) => value == row[0] && row[0] != undefined)){
                return true
            }
        }
        return false;
    }

    function checkColumn (board) {
         // [0,3,6], [1,4,7], [2,5,8]
        for(var i = 0; i < 3; i++){
            var column = []
            for(var j = i; j <= i+6; j += 3){
                column.push(board[j])
            }
            if(column.every((value) => value == column[0] && column[0] != undefined)){
                return true
            }
        }

        return false;
    }

    function checkDiag(board) {
        var diag = [];
        // [0,4,8]
        for(var i = 0; i <= 8; i += 4){
            diag.push(board[i])
        }
        if (diag.every((value) => value == diag[0] && diag[0] != undefined)){
            return true
        }

        diag = [];
        // [2,4,6]
        for (var i = 2; i<= 6; i+=2){
            diag.push(board[i])
        }

        if (diag.every((value) => value == diag[0] && diag[0] != undefined)){
            return true
        }
        
        return false
        }

    return {initGame, newRound, endCheck}
})();

const AILogic = (() => {
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

    function minmax(board, marks , findingMax = true, depth = 0){
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
                board.markBoard(index, marks.Player);
                var rating = minmax(board, marks, true, depth + 1)
                move.score = rating.score
            } else {
                board.markBoard(index, marks.AI);
                var rating = minmax(board, marks, false, depth + 1)
                move.score = rating.score
            }

            board.markBoard(index, undefined)

            moves.push(move)
        })

        return bestMove(moves, findingMax)
}

return {minmax}
    
})();

const ModalController = (() => {
    var player2field = document.getElementById('player-two-option')
    var choiceField = document.getElementById('player-choice')

    function togglePlayerTwo(toggle){
        player2field.style.display = toggle? 'block': 'none';
        choiceField.style.display = toggle? 'none': 'block';
        return
    }

    return {togglePlayerTwo}
})();