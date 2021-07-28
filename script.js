/*

TO DO:

- display who has which symbol
- make it look better
-add choosing single or multiplayer
-program the AI


- at start both name pickers should be hidden (add a hidden class that then gets removed)
- after picking button they should become visible (only one if against AI - otherwise the computer name is appear)
- then the gameboard -now it is ok

make the code more concise
check what other users made

*/
const gameBoard = (function(){
    let boardArray=[];

    function clearBoardArray(){
        for (i=0;i<9;i++){//set the array to start as empty
            boardArray[i] = null;
        }
    }
    clearBoardArray();
    console.log(boardArray);

    //display the gameBoard on the screen
    let gameBoardElement = document.getElementById('game-board');
    let centerColumnElement = document.getElementById('center-column');

    function setUpBoard(){
        for (i=0;i<9;i++){//add the elements
            let newField = document.createElement('div');
            newField.setAttribute('id',`${i}`);//maybe introduce better naming to specify row and column?
            newField.setAttribute('class','field')
            gameBoardElement.appendChild(newField)
            newField.addEventListener('click',fillClickedField)
            
        }
    }

    function addNewGameButton(){
        let newGameButton = document.createElement('button');
        newGameButton.innerText = "New Game";
        document.getElementById("center-column").appendChild(newGameButton);
        newGameButton.setAttribute('id','new-game-button')
        newGameButton.addEventListener('click',()=>{
            game.startNewGame();
        })
    }

    function removeNewGameButton(){
        centerColumnElement.removeChild(document.getElementById("new-game-button"));
    }

    // let newGameButton = document.createElement('button');//was this needed?
    // newGameButton.innerText = "New Game";

    //gameBoardElement.appendChild(newGameButton)

    ///////////////////////////////////////////////////
    function underlineActivePlayer(){
        let playerO = document.getElementById("O");
        let playerX = document.getElementById("X");
        if (game.getPostGame()){
            document.getElementById("X").classList.remove("underlined");
            document.getElementById("O").classList.remove("underlined");
        }
        else if (players.one.name&&players.two.name){
            if (game.currentPlayer.sign === "O"){
                playerO.classList.add("underlined");
                playerX.classList.remove("underlined");
            }
            else {
                playerX.classList.add("underlined");
                playerO.classList.remove("underlined");
            }
        }
    }

    function fillClickedField (event){//fires when the field is clicked
        console.log(event);
        console.log(game.currentPlayer);
        console.log(game.postGame)
        fillField(event.target);
    }
    
    function fillField(field){//used to click field both when clicked and when the AI does its thing
        if (field.innerText===""&&game.getPostGame()===false){//if field is empty and we are not in the aftermath of a game
            console.log(game.currentPlayer)
            console.log(players.one)
            field.innerText = `${game.currentPlayer.sign}`;
            boardArray[field.getAttribute('id')] = game.currentPlayer.sign;
            (game.currentPlayer===players.one)? game.currentPlayer=players.two : game.currentPlayer=players.one;  
            underlineActivePlayer();///////////////////
            if(game.checkIfSomeoneWon(gameBoard.boardArray)===players.one){
                game.endGame(players.one)
            }
            else if (game.checkIfSomeoneWon(gameBoard.boardArray)===players.two){
                game.endGame(players.two)
            }
            else if (game.checkIfSomeoneWon(gameBoard.boardArray)===null){
                game.endGame(null)
            }
            
            if (game.getPostGame()===false){
                game.AIPlayerActCheck();
            }
        }
        else if (field.innerText!==""){
            game.AIPlayerActCheck();//if the random picker pix a pickd field, it pix again
            return false;
        }

    }





    function clearGameBoard(){
        Array.from(document.getElementsByClassName('field')).forEach((element)=>{
            element.innerText = "";
        })
    }

    let playerOneArea = document.getElementById("player-one-area");
    let playerTwoArea = document.getElementById("player-two-area");

    function toggleHidden(){
        for (i=0;i<arguments.length;i++){
            arguments[i].classList.toggle('hidden');
        }
        console.log(arguments)
    }

    let gameplayButtons = document.getElementsByClassName("gameplay-button");

    for (i=0;i<gameplayButtons.length;i++){
        console.log(gameplayButtons[i])
        gameplayButtons[i].addEventListener('click',(e)=>{
            gameBoardElement.removeChild(e.target.parentNode)
            toggleHidden(playerOneArea, playerTwoArea)
            console.log(e.target.parentNode);
            console.log(e.target)

            //if against each other, do nothing else
            function assignAIAttributes(id){
                console.log(`picks ${id}`);
                players.assignName(id, players.two);
                players.two.named = true;
                players.two.type="AI"
                playerTwoArea.innerHTML=`<h1 class="name" id="${'X'}">${players.two.name}</h1>`;
            }
            //if against dumb AI, set the other player name to dumb AI, leave player 1 not set, have the AI do its thing
            if (e.target.getAttribute('id')==='mindless-ai'){
                assignAIAttributes('mindless-AI');
                // console.log("picks mindless ai");
                // players.assignName('mindless AI', players.two);
                // players.two.named = true;
                // players.two.type="AI"
                // playerTwoArea.innerHTML=`<h1 class="name" id="${'X'}">${players.two.name}</h1>`;
                //ok now have it do something ie it is moves
            }
            else if (e.target.getAttribute('id')==='genius-ai'){
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

    function getBoardArray(){
        return boardArray;
    }

    return {
        fillClickedField,
        boardArray,
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
    }

})();

const players = (function(){


    function playerMaker(number) {
        let player = Object.create(playerMaker.proto);
            player.number = number;
            player.named = false
            player.score = 0

            if (player.number === 1){
                player.sign="O";
            }
            else if (player.number === 2){
                player.sign="X";
            }

            return player;
        }
           
        playerMaker.proto = {
            getNumber: function() {
                return this.number;
            },
        }

        let one = playerMaker(1);
        let two = playerMaker(2);
        console.log(one)

        function assignName(input,playerObject){
            console.log(playerObject)
            playerObject.name = input
        }

        function replaceNameEntryFieldWithName(playerName, event, player){//move to gameBoard?
            console.log(event.target.parentNode)
            event.target.parentNode.innerHTML=`<h1 class="name" id="${player.sign}">${playerName}</h1>`;
            gameBoard.underlineActivePlayer();
        }


        const playerOneButton = document.getElementById("ok-player-one")
        const playerTwoButton = document.getElementById("ok-player-two")
    
        function nameButtonFunctionalityAdder(button, nameField, player){
            button.addEventListener('click',(event)=>{
                assignName(nameField.value,player);
                console.log(player.number)
                replaceNameEntryFieldWithName(nameField.value, event, player);
                player.named=true;
                game.checkIfBoardCanBeCreatedYet();
            })
        }
        nameButtonFunctionalityAdder(playerOneButton,document.getElementById("player-one-name-field"),one)
        nameButtonFunctionalityAdder(playerTwoButton,document.getElementById("player-two-name-field"),two)



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

const game = (function(){
    let currentPlayer=players.one;
    let Xes = [];
    let Os = [];
    let postGame = false; //after the game, you should not be able to fill more fields
    console.log(postGame)
    let winningCombinations =[
        [0,1,2],
        [3,4,5],
        [6,7,8],
        [0,3,6],
        [1,4,7],
        [2,5,8],
        [0,4,8],
        [6,4,2]
    ]
    function getPostGame(){
        return postGame
    }

    function setPostGame(value){
        return postGame = value
    }

    function checkIfSomeoneWon(boardState){//also keeps tally of picked fields
        console.log('check if sb won runs')
        if (!boardState.includes(null)){
            //endGame(null)
            console.log('runs')
            return null;
        }
        for (i=0; i<gameBoard.boardArray.length; i++) {
            if (boardState[i]==="O"&&!Os.includes(i)){
                console.log(i)
                Os.push(i)
            }
            else if (boardState[i]==="X"&&!Xes.includes(i)){
                Xes.push(i)
                console.log(i)
            }
        }
        for (i=0; i<winningCombinations.length;i++){
            if (winningCombinations[i].every(element => Os.includes(element))){
                return players.one
                //endGame(players.one); moved it to fillField so this can be used for the minmax function
            }
            else if (winningCombinations[i].every(element => Xes.includes(element))){
                return players.two
                //endGame(players.two);
            }
        }
    }

    function endGame(winner){

        console.log(postGame);
        setPostGame(true);
        console.log(postGame);
        gameBoard.addNewGameButton();
        gameBoard.underlineActivePlayer();
        
        if (winner!=null){//if it is not a tie
            console.log(`${winner.name} wins`);
            winner.score++;    
        }
        function displayScore(player,playerArea){
            let score = document.createElement('p');
            score.setAttribute('class','score')
            playerArea.appendChild(score);
            score.innerText=`Score: ${player.score}`
        }
        function updateScore(){
            gameBoard.playerOneArea.querySelector('.score').innerText = `Score: ${players.one.score}`
            gameBoard.playerTwoArea.querySelector('.score').innerText = `Score: ${players.two.score}`
        }

        if (!gameBoard.playerOneArea.querySelector('p')){
            displayScore(players.one, gameBoard.playerOneArea);
            displayScore(players.two, gameBoard.playerTwoArea);
        }
        else {
            updateScore();
        }
    }

    function checkIfBoardCanBeCreatedYet(){
        if (players.one.named===true&&players.two.named===true){
            gameBoard.setUpBoard();
        }
    }

    function startNewGame(){
        Xes.splice(0,5);//remove all elements, can't change to empty because it does the thing then
        Os.splice(0,5);
        gameBoard.clearGameBoard();
        gameBoard.clearBoardArray();
        setPostGame(false);
        gameBoard.removeNewGameButton();
        gameBoard.underlineActivePlayer();
        AIPlayerActCheck();
    }

    function AIPlayerActCheck () {//checks if AI player acts and what type & makes the AI action
        if (game.currentPlayer===players.two&&players.two.name==="mindless-AI"&&players.two.type==="AI"){
            let fields = document.getElementsByClassName("field");
            gameBoard.fillField(fields[Math.floor(Math.random()*9)])
        }

        else if (game.currentPlayer===players.two&&players.two.name==="genius-AI"&&players.two.type==="AI"){
            let fields = document.getElementsByClassName("field");
            ////////////////////////////////////////////////////////////////////////////VVV  21.07.2021 additions   VVV
            // let emptyFields = []
            // for (i=0;i<gameBoard.boardArray.length;i++){
            //     if (gameBoard.boardArray[i] === null){
            //         emptyFields.push(i)
            //     }
            // }
            
            //finish genius ai minmax algorithm
            let testBoardState = gameBoard.getBoardArray();
            console.log(`test board state is ${testBoardState}`)
            
            function checkCurrentEmptyFields (boardState){
                let emptyFields = []
                for (i=0;i<boardState.length;i++){
                    if (boardState[i] === null){
                        emptyFields.push(i)
                    }
                }
                return emptyFields;
            }
            
            function minimax(currentBoardState, sign){
                console.log('mimimax starts')
                console.log(`sign is ${sign}`)
                console.log(`test board state is ${testBoardState}`)

                let availableFields = checkCurrentEmptyFields(currentBoardState);
                console.log(availableFields.length)
                console.log(`availableFields is ${availableFields}`)

                function scoreTest (situation){
                    if (checkIfSomeoneWon(situation)===players.one){
                        return {score: -1};
                    }
                    else if (checkIfSomeoneWon(situation)===players.two){
                        return {score: +1};
                    }
                    else if (availableFields.length===0){
                        return {score: 0};
                    }
                }
                // if (checkIfSomeoneWon(currentBoardState)===players.one){
                //     return {score: -1};
                // }
                // else if (checkIfSomeoneWon(currentBoardState)===players.two){
                //     return {score: +1};
                // }
                // else if (availableFields.length===0){
                //     return {score: 0};
                // }
                
                console.log(`before simulation loop sign is ${sign}`)
                for (k=0;k<availableFields.length;k++){//it changes currentboardstate so it is filled by currentsigns :(((())))
                    console.log(`availableFields.length is ${availableFields.length}`)
                    let testedSituation=[];
                    for(j=0;j<currentBoardState.length;j++){//set up the tested  situation through pushing the board state
                        //console.log(`tested situation is ${testedSituation}`)
                        //console.log(`currentBoardState${i} is ${currentBoardState[i]}`)
                        testedSituation.push(currentBoardState[j])
                        //console.log(`tested situation is ${testedSituation}`)
                        //console.log(`currentBoardState${i} is ${currentBoardState[i]}`)
                    }
                    //console.log(`current board state is ${currentBoardState}`)
                    //console.log(i)
                    //testedSituation = testBoardState;
                    //console.log(testedSituation)
                    testedSituation[availableFields[k]]=sign;//check this ~~~~~~~~~~~~~~~~~~~~~~~!!!!!!!!!!!
                    console.log(`sign is ${sign}`)
                    // console.log(`[k] is ${k}`)
                    // console.log(`availableFields$[${k}] is ${availableFields[k]}`)
                    // console.log(`testedSituation[availableFields[k]] is ${testedSituation[availableFields[k]]}`)
                     console.log(`current board state is ${currentBoardState}`)
                     console.log(`tested situation is ${testedSituation}`)
                    //console.log(`current board state is ${currentBoardState}`)
                    console.log(`sign before check if sbwon is ${sign}`)
                    checkIfSomeoneWon(testedSituation)
                    console.log(`sign after check if sbwon is ${sign}`)
///////////////////////////////////////////////////////////////
                    scoreTest(testedSituation)
///////////////////////////////////////////////////////////////
                    // console.log(`availableFields.length is ${availableFields.length}`)
                    // console.log(`[k] is ${k}`)
                    console.log(`sign is ${sign}`)
                    console.log(`tested situation is ${testedSituation}`)
                    if (sign===players.two.sign){
                        minimax(testedSituation, players.one.sign)
                    }
                    else if (sign===players.one.sign){
                        minimax(testedSituation, players.two.sign)
                    }
                    console.log('it ended')
                }
//////// we continue ////"sign is undefined"!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

//z jakimi parametrami nalezy kolejyn minimax zrobic czy w testowanej sytuacji? kurde chyba tak! a score test?



            }

            minimax(testBoardState, players.two.sign)//first minimax invocation


            // Step 7: First minimax invocation
            // Step 8: Store the indexes of all empty cells
            // Step 9: Check if there is a terminal state
            // Step 10: Get ready to test the outcome of playing the current player’s mark on each empty cell
            // Step 11: Test-play the current player’s mark on the empty cell the for-loop is currently processing
            // Step 12: Save the latest terminal score
            // Step 13: Run the active for-loop on the next empty cell
            // Step 14: Plan how to get the object with the best test-play score for the current player
            // Step 15: Create a store for the best test-play’s reference
            // Step 16: Get the reference to the current player’s best test-play
            // Step 17: Get the object with the best test-play score for the current player
            // Step 18: Let’s do a review
            // Step 19: Tracing our steps with a diagram
            // Step 20: The first for-loop moves forward to process the next empty cell
            // Step 21: Tracing our steps with a diagram
            // Step 22: The first for-loop moves forward to process the next empty cell
            // Step 23: Tracing our steps with a diagram
            // Step 24: Get the object with the best test-play score for the AI player
            // Step 25: Use the data inside bestPlayInfo
            // Step 26: A bird’s-eye view of this tutorial’s algorithm


        }
    }

    return {
        currentPlayer,
        Xes,
        Os,
        checkIfSomeoneWon,
        getPostGame,
        setPostGame,
        checkIfBoardCanBeCreatedYet,
        startNewGame,
        AIPlayerActCheck,
        endGame,
    }

})();
