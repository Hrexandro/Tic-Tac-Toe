/*

TO DO:

TO DO: 07.09.2021
- check which conditionals are redundant and delete appropriately
- move the getBestPickAvailable() outside of medium difficulty
- add impossible difficulty
- throw away the minimax function which doesn't work anyway
- set getBestPickAvailable() to serve as both medium and impossible difficulty

make the code more concise
check what other users made

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

    function getBoardArrayLength() {
        return boardArray.length;
    }

    //display the gameBoard on the screen
    let gameBoardElement = document.getElementById('game-board');
    let centerColumnElement = document.getElementById('center-column');

    function setUpBoard() {
        for (i = 0; i < 9; i++) {//add the elements
            let newField = document.createElement('div');
            newField.setAttribute('id', `${i}`);//maybe introduce better naming to specify row and column?
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

    function highlightFields(fieldsArray) {//make sure this works, needs to get the array of DOM elements
        for (i = 0; i < fieldsArray.length; i++) {
            fieldsArray[i].classList.add('winning-combination')
        }
        console.log("highlight fields finishes")
    }

    function removeNewGameButton() {
        centerColumnElement.removeChild(document.getElementById("new-game-button"));
    }

    // let newGameButton = document.createElement('button');//was this needed?
    // newGameButton.innerText = "New Game";

    //gameBoardElement.appendChild(newGameButton)

    ///////////////////////////////////////////////////
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
        console.log(event);
        console.log(game.currentPlayer);
        console.log(game.postGame)
        fillField(event.target);
    }

    let lastFilledField = {};

    function getLastFilledField() {
        return lastFilledField
    }

    function resetLastFilledField() {
        lastFilledField.sign = null
        lastFilledField.field = null
    }

    function fillField(field) {//used to click field both when clicked and when the AI does its thing
        if (field.innerText === "" && game.getPostGame() === false) {//if field is empty and we are not in the aftermath of a game
            lastFilledField.field = field.getAttribute('id');
            lastFilledField.sign = game.currentPlayer.sign
            console.log(JSON.stringify(lastFilledField))
            console.log(game.currentPlayer)
            console.log(players.one)
            field.innerText = `${game.currentPlayer.sign}`;
            changeBoardArrayElement(field.getAttribute('id'), game.currentPlayer.sign);
            //boardArray[field.getAttribute('id')] = game.currentPlayer.sign;
            (game.currentPlayer === players.one) ? game.currentPlayer = players.two : game.currentPlayer = players.one;
            underlineActivePlayer();///////////////////
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

            //if against each other, do nothing else
            function assignAIAttributes(id) {
                console.log(`picks ${id}`);
                players.assignName(id, players.two);
                players.two.named = true;
                players.two.type = "AI"
                playerTwoArea.innerHTML = `<h1 class="name" id="${'X'}">${players.two.name}</h1>`;
            }
            //if against dumb AI, set the other player name to dumb AI, leave player 1 not set, have the AI do its thing
            if (e.target.getAttribute('id') === 'mindless-ai') {
                assignAIAttributes('mindless-AI');
                // console.log("picks mindless ai");
                // players.assignName('mindless AI', players.two);
                // players.two.named = true;
                // players.two.type="AI"
                // playerTwoArea.innerHTML=`<h1 class="name" id="${'X'}">${players.two.name}</h1>`;
                //ok now have it do something ie it is moves
            }
            else if (e.target.getAttribute('id') === 'medium') {
                assignAIAttributes('medium');
                // console.log("picks genius ai");
                // players.assignName('genius AI', players.two);
                // players.two.named = true;
                // players.two.type="AI"
                // playerTwoArea.innerHTML=`<h1 class="name" id="${'X'}">${players.two.name}</h1>`;
            }
            else if (e.target.getAttribute('id') === 'genius-ai') {
                assignAIAttributes('genius-AI');
                // console.log("picks genius ai");
                // players.assignName('genius AI', players.two);
                // players.two.named = true;
                // players.two.type="AI"
                // playerTwoArea.innerHTML=`<h1 class="name" id="${'X'}">${players.two.name}</h1>`;
            }
            //if agains genius AI, the same but the AI behaves differently
        })
    }
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    function getBoardArray() {
        console.log("getboardarray runs");
        console.log(`boardArray when getting is ${boardArray}`)
        return boardArray;

    }
    // function getBoardArray(){
    //     let newArrayIdenticalToBoardArray = [];
    //     for (x=0;x<boardArray.length;x++){
    //         newArrayIdenticalToBoardArray.push(boardArray[x])
    //     }
    //     return newArrayIdenticalToBoardArray;
    // }
    function getActualBoardArrayForTesting() {
        console.log("getboardarray runs");
        console.log(`boardArray when getting is ${boardArray}`)
        return boardArray;

    }
    //change to return a new thing so it perhaps would not keep filling the actual boardArray when testing
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    return {
        fillClickedField,
        //boardArray, //restrict access because something is fucking it up
        //changeBoardArrayElement, //only used inside gameBoard module apparently
        getBoardArrayLength,
        setUpBoard,
        addNewGameButton,
        clearGameBoard,
        clearBoardArray,
        removeNewGameButton,
        getActualBoardArrayForTesting,//
        underlineActivePlayer,
        playerOneArea,
        playerTwoArea,
        fillField,
        getBoardArray,
        highlightFields,
        getLastFilledField,
        resetLastFilledField,
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

    function replaceNameEntryFieldWithName(playerName, event, player) {//move to gameBoard?
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



    // playerOneButton.addEventListener('click',()=>{
    //     assignName(document.getElementById("player-one-name-field").value,players.one)
    // })
    // playerTwoButton.addEventListener('click',()=>{
    //     assignName(document.getElementById("player-two-name-field").value,players.two)
    // })

    return {
        one,
        two,
        assignName,
        replaceNameEntryFieldWithName,
    }
})();

const game = (function () {

    let testing = false;
    console.log(`testing after starting game is ${testing}`)
    let currentPlayer = players.one;

    let postGame = false; //after the game, you should not be able to fill more fields
    console.log(postGame)
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

    function checkIfSomeoneWon(boardState) {//also keeps tally of picked fields
        let Xes = [];//those were outside of the function before, I am trying to change it to enable using it in the minimax function
        let Os = [];//without having to worry about it ending the actual game

        // console.log('check if sb won runs')
        // console.log(`teesting when checking if someone won is ${testing}`)

        // if (checkCurrentEmptyFields(boardState).length===0){
        // //endGame(null)
        // console.log('no one wins')
        // return null;

        // }
        console.log(`boardState when checking if someone won is ${boardState}`)
        //console.log(`boardArray before loop pushing xes and os is ${gameBoard.boardArray}`)
        for (i = 0; i < boardState.length; i++) {//should not use the ACTUAL BOARD ARRAY but the currently tested boardState
            if (boardState[i] === "O" && !Os.includes(i)) {
                //console.log(i)
                //console.log(`Os is ${Os}`);
                Os.push(i);
                //console.log(`Os is ${Os}`);
            }
            else if (boardState[i] === "X" && !Xes.includes(i)) {
                //console.log(`Xes is ${Xes}`);
                Xes.push(i);
                //console.log(`Xes is ${Xes}`);
                //console.log(i)
            }
        }
        //console.log(`boardArray after loop pushing xes and os is ${gameBoard.boardArray}`)


        for (i = 0; i < winningCombinations.length; i++) {//check winners & highlight fields
            let fieldsToHighlight = [];
            if (winningCombinations[i].every(element => Os.includes(element))) {//condense this code later into a single function because code is repeated
                if (!testing) {//highlight fields
                    console.log(`teesting is ${testing}`)
                    //console.log(`boardArray when highlighting runs ${gameBoard.boardArray}`)
                    console.log("HIGHLIGHTS THE FIELDS ON THE SCREEN")
                    winningCombinations[i].forEach(element => fieldsToHighlight.push(document.getElementById(element)));
                    gameBoard.highlightFields(fieldsToHighlight)
                }
                //console.log(winningCombinations[i].every(element => Os.includes(element)))
                console.log("one wins")
                //extract the numbers that make the winning combination
                //console.log(`boardArray right before declaring winner 1 ${gameBoard.boardArray}`)
                return players.one
                //endGame(players.one); moved it to fillField so this can be used for the minmax function
            }
            else if (winningCombinations[i].every(element => Xes.includes(element))) {
                if (!testing) {//highlight fields
                    //console.log(`boardArray when highlighting runs ${gameBoard.boardArray}`)
                    console.log(`teesting is ${testing}`)
                    console.log("HIGHLIGHTS THE FIELDS ON THE SCREEN")
                    winningCombinations[i].forEach(element => fieldsToHighlight.push(document.getElementById(element)));
                    gameBoard.highlightFields(fieldsToHighlight)
                }
                // winningCombinations[i].forEach(element => fieldsToHighlight.push(document.getElementById(element)));
                // gameBoard.highlightFields(fieldsToHighlight)
                console.log("two wins")
                // console.log(`boardArray right before declaring winner 2 ${gameBoard.boardArray}`)
                return players.two
                //endGame(players.two);
            }
        }
        if (!boardState.includes(null)) {//if board state doesn't include null, hence no fields to pick, put this after checking the player-specific outcomes
            //endGame(null)
            console.log('no one wins')
            return null;

        }
    }

    function endGame(winner) {

        console.log(postGame);
        console.log(`last filled field before reset is ${JSON.stringify(gameBoard.getLastFilledField())}`);
        gameBoard.resetLastFilledField();
        console.log(`last filled field after reset is ${JSON.stringify(gameBoard.getLastFilledField())}`);
        console.log(`last filled field after reset equals {} ${gameBoard.getLastFilledField() == {}}`);
        setPostGame(true);
        console.log(postGame);
        gameBoard.addNewGameButton();
        gameBoard.underlineActivePlayer();

        if (winner != null) {//if it is not a tie
            console.log(`${winner.name} wins`);
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
        //changed Xes and Os to being checked inside the checkIfSomeoneWon() function, so they are not used outside and need not be cleared
        // Xes.splice(0,5);//remove all elements, can't change to empty because it does the thing then
        // Os.splice(0,5);
        gameBoard.clearGameBoard();
        gameBoard.clearBoardArray();
        setPostGame(false);
        gameBoard.removeNewGameButton();
        gameBoard.underlineActivePlayer();
        AIPlayerActCheck();
    }


    function checkCurrentEmptyFields(boardState) {
        let emptyFields = []
        console.log(`boardstate is ${boardState}`)
        console.log(boardState.length)
        for (i = 0; i < boardState.length; i++) {
            if (boardState[i] === null) {
                emptyFields.push(i)
            }
        }
        return emptyFields;
    }
    
    function getBestPickAvailable(difficulty) {
        let testedSituation = gameBoard.getBoardArray()
        let goodPick=[];
        let betterPick=[];
        let bestPick=[];
        let corners = [0, 2, 6, 8];
        let nonCorners = [1, 3, 4, 5, 7];
        console.log("check if somebody is one step runs")
        for (i = 0; i < winningCombinations.length; i++) {//goes through tested sets //Pick to be updated if a better pick is found
            let currentTestedSet = winningCombinations[i];
            for (j = 0, Xes = [], Os = [], empties = []; j < currentTestedSet.length; j++) {//test the current set for being near winning currenttestedset ex [0,1,2]
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
        //console.log(`betterPick= ${betterPick} betterPick!==[] ${betterPick!==[]};(goodPickPick!==[]) ${(goodPick!==[])} ; goodPick= ${goodPick}`)
        console.log(`betterPick.length is ${betterPick.length}`)
        console.log(`betterPick.length is ${goodPick.length}`)
        if (bestPick.length>0){
            //return betterPick;
            console.log(`bestPick is ${bestPick}`)
            gameBoard.fillField(fields[bestPick[0]])
        }
        if (betterPick.length>0){
            //return betterPick;
            console.log(`betterPick is ${betterPick}`)
            gameBoard.fillField(fields[betterPick[0]])
        }
        else if (gameBoard.getLastFilledField().sign === null && gameBoard.getLastFilledField().field === null) {//no field filled start with corner
            gameBoard.fillField(fields[corners[Math.floor(Math.random() * corners.length)]]);
        }
        else if (testedSituation[4] === null) {// if second move after first pick being corner & center empty fill center
            gameBoard.fillField(fields[4])//might be redudant with the noncorners and blocking active
        }//Vthis one should test if the opponent has two picked corners


        /////NECESSARY FOR UNBEATABILITYvvvv
        else if (difficulty==="hard"&&corners.filter((element)=>{return gameBoard.getBoardArray()[element]==="O"}).length>1){//if opponent has two corners, and center is picked, blocking is solved earlier
            //also THE NON corner has to be empty
            //let availableNonCorners = checkCurrentEmptyFields(gameBoard.getBoardArray()).filter((element)=>{return !corners.includes(element)})
            let availableNonCorners = nonCorners.filter((element)=>{return gameBoard.getBoardArray()[element]===null})
            console.log(`availableNonCorners is ${availableNonCorners}`)
            gameBoard.fillField(fields[availableNonCorners[Math.floor(Math.random() * availableNonCorners.length)]])
        }
        else if (goodPick.length>0){//this goes after the anti-double tactics, build your line, perhaps this is unnecessary
            //return goodPick;
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
            console.log("medium AI is doing random for some reason")
            gameBoard.fillField(fields[Math.floor(Math.random() * 9)])
        }

        // else {
        //     console.log("getbestpickAvailable did not fill any fields for some reason")
        //     return false;
        // }
    }//here ends getBestPickAvailable///////////////////////////////////////////////////////
    let fields = document.getElementsByClassName("field");
    function AIPlayerActCheck() {//checks if AI player acts and what type & makes the AI action
        if (game.currentPlayer === players.two && players.two.name === "mindless-AI" && players.two.type === "AI") {//mindless, selects at random
            //repeats, move before either option
            gameBoard.fillField(fields[Math.floor(Math.random() * 9)])
        }
        else if (game.currentPlayer === players.two && players.two.name === "medium" && players.two.type === "AI") {//beatable only if you can win two ways at the same time
            //let fields = document.getElementsByClassName("field");//repeats, move before either option
            //let testedSituation = gameBoard.getBoardArray()
           // console.log(`testedsituation is ${testedSituation}`)
            getBestPickAvailable("medium");


        }
        else if (game.currentPlayer === players.two && players.two.name === "genius-AI" && players.two.type === "AI") {//should be unbeatable - currently is NOT
            //let testedSituation = gameBoard.getBoardArray()
            //console.log(`testedsituation is ${testedSituation}`)
            getBestPickAvailable("hard");
        }
    }

    return {
        currentPlayer,
        //Xes,
        //Os,
        checkIfSomeoneWon,
        getPostGame,
        setPostGame,
        checkIfBoardCanBeCreatedYet,
        startNewGame,
        AIPlayerActCheck,
        endGame,

    }

})();


/////////
