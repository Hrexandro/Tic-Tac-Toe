/*
TO DO:
-stop the elements on the site from twitching when score gets displayed/when player name is picked
-winning/tie messages
-BUG: Can't start new game despite clicking New Game Button - was not able to replicate
*/
const gameBoard = (function () {
    let boardArray = [];

    function clearBoardArray() {
        for (i = 0; i < 9; i++) {//set the array to start as empty
            boardArray[i] = null;
        }
    }
    clearBoardArray();
    console.log(`boardArray at start is ${boardArray}`);

    function changeBoardArrayElement(ordinal, symbol) {
        console.log("changeBoardArray Element Runs")
        console.log(`boardArray before change is ${boardArray}`);
        boardArray[ordinal] = symbol;
        console.log(`boardArray after change is ${boardArray}`);
    }

    let gameBoardElement = document.getElementById('game-board');
    let centerColumnElement = document.getElementById('center-column');

    function setUpBoard() {
        for (i = 0; i < 9; i++) {//add the elements
            let newField = document.createElement('div');
            newField.setAttribute('id', `${i}`);
            newField.setAttribute('class', 'field')
            gameBoardElement.appendChild(newField)
            newField.addEventListener('click', fillClickedField)

        }
    }
    function addNewGameButton() {
        let newGameButton = document.createElement('button');
        newGameButton.innerText = "New Game";
        document.getElementById("center-column").appendChild(newGameButton);
        newGameButton.setAttribute('id', 'new-game-button')
        newGameButton.addEventListener('click', () => {
            game.startNewGame();
        })
    }
    function highlightFields(fieldsArray) {
        for (i = 0; i < fieldsArray.length; i++) {
            fieldsArray[i].classList.add('winning-combination')
        }
        console.log("highlight fields finishes")
    }

    function removeNewGameButton() {
        centerColumnElement.removeChild(document.getElementById("new-game-button"));
    }
    function underlineActivePlayer() {
        let playerO = document.getElementById("O");
        let playerX = document.getElementById("X");
        if (game.getPostGame()) {
            document.getElementById("X").classList.remove("underlined");
            document.getElementById("O").classList.remove("underlined");
        }
        else if (players.one.name && players.two.name) {
            if (game.currentPlayer.sign === "O") {
                playerO.classList.add("underlined");
                playerX.classList.remove("underlined");
            }
            else {
                playerX.classList.add("underlined");
                playerO.classList.remove("underlined");
            }
        }
    }

    function fillClickedField(event) {//fires when the field is clicked
        fillField(event.target);
    }

    function fillField(field) {
        if (field.innerText === "" && game.getPostGame() === false) {//if field is empty and we are not in the aftermath of a game
            field.innerText = `${game.currentPlayer.sign}`;
            changeBoardArrayElement(field.getAttribute('id'), game.currentPlayer.sign);
            (game.currentPlayer === players.one) ? game.currentPlayer = players.two : game.currentPlayer = players.one;
            underlineActivePlayer();
            if (game.checkIfSomeoneWon(gameBoard.getBoardArray()) === players.one) {
                game.endGame(players.one)
            }
            else if (game.checkIfSomeoneWon(gameBoard.getBoardArray()) === players.two) {
                game.endGame(players.two)
            }
            else if (game.checkIfSomeoneWon(gameBoard.getBoardArray()) === null) {
                game.endGame(null)
            }

            if (game.getPostGame() === false) {
                game.AIPlayerActCheck();
            }
        }
        else if (field.innerText !== "") {
            game.AIPlayerActCheck();//if the random picker pix a pickd field, it pix again
            return false;
        }

    }
    function clearGameBoard() {
        Array.from(document.getElementsByClassName('field')).forEach((element) => {
            element.innerText = "";
            element.classList.remove("winning-combination");
        })
    }

    let playerOneArea = document.getElementById("player-one-area");
    let playerTwoArea = document.getElementById("player-two-area");

    function toggleHidden() {
        for (i = 0; i < arguments.length; i++) {
            arguments[i].classList.toggle('hidden');
        }
        console.log(arguments)
    }

    let gameplayButtons = document.getElementsByClassName("gameplay-button");

    for (i = 0; i < gameplayButtons.length; i++) {
        console.log(gameplayButtons[i])
        gameplayButtons[i].addEventListener('click', (e) => {
            gameBoardElement.removeChild(e.target.parentNode)
            toggleHidden(playerOneArea, playerTwoArea)
            console.log(e.target.parentNode);
            console.log(e.target)

            function assignAIAttributes(id) {
                console.log(`picks ${id}`);
                players.assignName(id, players.two);
                players.two.named = true;
                players.two.type = "AI"
                playerTwoArea.innerHTML = `<h1 class="name" id="${'X'}">${players.two.name}</h1>`;
            }

            if (e.target.getAttribute('id') === 'Easy Opponent') {
                assignAIAttributes('Easy Opponent');
            }
            else if (e.target.getAttribute('id') === 'Medium Opponent') {
                assignAIAttributes('Medium Opponent');
            }
            else if (e.target.getAttribute('id') === 'Hard Opponent') {
                assignAIAttributes('Hard Opponent');

            }
        })
    }

    function getBoardArray() {
        return boardArray;

    }

    return {
        setUpBoard,
        addNewGameButton,
        clearGameBoard,
        clearBoardArray,
        removeNewGameButton,
        underlineActivePlayer,
        playerOneArea,
        playerTwoArea,
        fillField,
        getBoardArray,
        highlightFields,
    }

})();

const players = (function () {

    function playerMaker(number) {
        let player = Object.create(playerMaker.proto);
        player.number = number;
        player.named = false
        player.score = 0

        if (player.number === 1) {
            player.sign = "O";
        }
        else if (player.number === 2) {
            player.sign = "X";
        }

        return player;
    }

    playerMaker.proto = {
        getNumber: function () {
            return this.number;
        },
    }

    let one = playerMaker(1);
    let two = playerMaker(2);
    console.log(one)

    function assignName(input, playerObject) {
        console.log(playerObject)
        playerObject.name = input
    }

    function replaceNameEntryFieldWithName(playerName, event, player) {
        console.log(event.target.parentNode)
        event.target.parentNode.innerHTML = `<h1 class="name" id="${player.sign}">${playerName}</h1>`;
        gameBoard.underlineActivePlayer();
    }

    const playerOneButton = document.getElementById("ok-player-one")
    const playerTwoButton = document.getElementById("ok-player-two")

    function nameButtonFunctionalityAdder(button, nameField, player) {
        button.addEventListener('click', (event) => {
            assignName(nameField.value, player);
            console.log(player.number)
            replaceNameEntryFieldWithName(nameField.value, event, player);
            player.named = true;
            game.checkIfBoardCanBeCreatedYet();
        })
    }
    nameButtonFunctionalityAdder(playerOneButton, document.getElementById("player-one-name-field"), one)
    nameButtonFunctionalityAdder(playerTwoButton, document.getElementById("player-two-name-field"), two)

    return {
        one,
        two,
        assignName,
    }
})();

const game = (function () {

    let currentPlayer = players.one;

    let postGame = false; //if true, you should not be able to fill more fields

    let winningCombinations = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [6, 4, 2]
    ]
    function getPostGame() {
        return postGame
    }

    function setPostGame(value) {
        return postGame = value
    }

    function checkIfSomeoneWon(boardState) {
        let Xes = [];
        let Os = [];
        console.log(`boardState when checking if someone won is ${boardState}`)
        for (i = 0; i < boardState.length; i++) {
            if (boardState[i] === "O" && !Os.includes(i)) {
                Os.push(i);
            }
            else if (boardState[i] === "X" && !Xes.includes(i)) {
                Xes.push(i);
            }
        }
    
        for (i = 0; i < winningCombinations.length; i++) {//check winners & highlight fields
            let fieldsToHighlight = [];
            if (winningCombinations[i].every(element => Os.includes(element))) {
                winningCombinations[i].forEach(element => fieldsToHighlight.push(document.getElementById(element)));
                gameBoard.highlightFields(fieldsToHighlight)
                return players.one
            }
            else if (winningCombinations[i].every(element => Xes.includes(element))) {
                winningCombinations[i].forEach(element => fieldsToHighlight.push(document.getElementById(element)));
                gameBoard.highlightFields(fieldsToHighlight)
                return players.two

            }
        }
        if (!boardState.includes(null)) {//if board state doesn't include null, hence no fields to pick, the game ends with a tie
            return null;
        }
    }

    function endGame(winner) {
        setPostGame(true);
        gameBoard.addNewGameButton();
        gameBoard.underlineActivePlayer();

        if (winner != null) {//if it is not a tie
            winner.score++;
        }
        function displayScore(player, playerArea) {
            let score = document.createElement('p');
            score.setAttribute('class', 'score')
            playerArea.appendChild(score);
            score.innerText = `Score: ${player.score}`
        }
        function updateScore() {
            gameBoard.playerOneArea.querySelector('.score').innerText = `Score: ${players.one.score}`
            gameBoard.playerTwoArea.querySelector('.score').innerText = `Score: ${players.two.score}`
        }

        if (!gameBoard.playerOneArea.querySelector('p')) {
            displayScore(players.one, gameBoard.playerOneArea);
            displayScore(players.two, gameBoard.playerTwoArea);
        }
        else {
            updateScore();
        }
    }

    function checkIfBoardCanBeCreatedYet() {
        if (players.one.named === true && players.two.named === true) {
            gameBoard.setUpBoard();
        }
    }

    function startNewGame() {
        gameBoard.clearGameBoard();
        gameBoard.clearBoardArray();
        setPostGame(false);
        gameBoard.removeNewGameButton();
        gameBoard.underlineActivePlayer();
        AIPlayerActCheck();
    }
    
    function getBestPickAvailable(difficulty) {
        let testedSituation = gameBoard.getBoardArray()
        let goodPick=[];
        let betterPick=[];
        let bestPick=[];
        let corners = [0, 2, 6, 8];
        let nonCorners = [1, 3, 4, 5, 7];
        console.log("check if somebody is one step runs")
        for (i = 0; i < winningCombinations.length; i++) {
            let currentTestedSet = winningCombinations[i];
            for (j = 0, Xes = [], Os = [], empties = []; j < currentTestedSet.length; j++) {
                console.log(`current tested set is ${currentTestedSet}`)
                if (gameBoard.getBoardArray()[currentTestedSet[j]] === "X") {
                    Xes.push(currentTestedSet[j])
                }
                else if (gameBoard.getBoardArray()[currentTestedSet[j]] === "O") {
                    Os.push(currentTestedSet[j])
                }
                else if (gameBoard.getBoardArray()[currentTestedSet[j]] === null) {
                    console.log(`${currentTestedSet[j]} is pushed into empties`)
                    empties.push(currentTestedSet[j])
                }
                console.log(`one step check x ${Xes}, o ${Os}, empties ${empties},`)
                if (Xes.length > 1 && empties.length > 0) {//the best option, you pick the winning field
                    console.log(`emptties is ${empties}`)
                    bestPick=empties//empties are the field to fill for correct gaming

                }
                else if (Os.length > 1 && empties.length > 0) {//second best option, you block the opponent
                    console.log(`emptties is ${empties}`)
                    betterPick=empties//empties are the field to fill for correct gaming

                }
                else if (Xes.length===1 && empties.length > 1) {//you arrange a row of your symbols, empties longer than 1 ensures that the enemy does not occupy your way
                    console.log(`emptties is ${empties}`)
                    goodPick=empties//empties are the field to fill for correct gaming
                }
            }
        }
        console.log(`betterPick.length is ${betterPick.length}`)
        console.log(`betterPick.length is ${goodPick.length}`)
        if (bestPick.length>0){
            console.log(`bestPick is ${bestPick}`)
            gameBoard.fillField(fields[bestPick[0]])
        }
        if (betterPick.length>0){
            console.log(`betterPick is ${betterPick}`)
            gameBoard.fillField(fields[betterPick[0]])
        }

        else if (testedSituation[4] === null) {// if second move after first pick being corner & center empty fill center
            gameBoard.fillField(fields[4])//might be redudant with the noncorners and blocking active
        }

        /////NECESSARY FOR UNBEATABILITYvvvv
        else if (difficulty==="hard"&&corners.filter((element)=>{return gameBoard.getBoardArray()[element]==="O"}).length>1&&nonCorners.filter((element)=>{return gameBoard.getBoardArray()[element]===null}).length>0){//if opponent has two corners, and center is picked, blocking is solved earlier
            let availableNonCorners = nonCorners.filter((element)=>{return gameBoard.getBoardArray()[element]===null})
            console.log(`availableNonCorners is ${availableNonCorners}`)
            gameBoard.fillField(fields[availableNonCorners[Math.floor(Math.random() * availableNonCorners.length)]])
        }
        else if (goodPick.length>0){//this goes after the anti-double tactics, build your line, perhaps this is unnecessary
            console.log(`goodPick is ${goodPick}`)
            gameBoard.fillField(fields[goodPick[0]])
        }
        /////NECESSARY FOR UNBEATABILITYvvvv
        else if (difficulty==="hard"&&corners.some((element)=>{return gameBoard.getBoardArray()[element]===null})){//if there is an empty corner, pick a corner
            console.log("it found an empty corner")
            let availableCorners = corners.filter((element)=>{return gameBoard.getBoardArray()[element]===null})
            console.log(`availablecorners is ${availableCorners}`)
            gameBoard.fillField(fields[availableCorners[Math.floor(Math.random() * availableCorners.length)]])
        }

        else {//if all else fails, just do random
            gameBoard.fillField(fields[Math.floor(Math.random() * 9)])
        }

    }//getBestPickAvailable end///////////////////////////////////////////////////////
    let fields = document.getElementsByClassName("field");
    function AIPlayerActCheck() {//checks if AI player acts and what type & makes the AI action
        if (game.currentPlayer === players.two && players.two.name === "Easy Opponent" && players.two.type === "AI") {//mindless, selects at random
            gameBoard.fillField(fields[Math.floor(Math.random() * 9)])
        }
        else if (game.currentPlayer === players.two && players.two.name === "Medium Opponent" && players.two.type === "AI") {//beatable only if you can win two ways at the same time
            getBestPickAvailable("Medium Opponent");
        }
        else if (game.currentPlayer === players.two && players.two.name === "Hard Opponent" && players.two.type === "AI") {//unbeatable
            getBestPickAvailable("hard");
        }
    }
    return {
        currentPlayer,
        checkIfSomeoneWon,
        getPostGame,
        checkIfBoardCanBeCreatedYet,
        startNewGame,
        AIPlayerActCheck,
        endGame,
    }
})();