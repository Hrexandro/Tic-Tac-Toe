/*

TO DO:

- display who has which symbol
- make it look better
-add choosing single or multiplayer
-program the AI

- animate symbols appearing
- highlight successful combination


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

    function highlightFields(fieldsArray){//make sure this works, needs to get the array of DOM elements
        for (i=0;i<fieldsArray.length;i++){
            fieldsArray[i].classList.add('winning-combination')
        }
        console.log("highlight fields finishes")
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
            element.classList.remove("winning-combination");
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
        highlightFields,
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
            console.log('no one wins')
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
            let fieldsToHighlight = [];
            // if (winningCombinations[i].every(element => Os.includes(element))||winningCombinations[i].every(element => Xes.includes(element))){
            //     console.log("now is the combo");
            //     console.log(winningCombinations[i]);
            
            //     let fieldsToHighlight = [];
            //     winningCombinations[i].forEach(element => fieldsToHighlight.push(document.getElementById(element)));
            //     console.log(fieldsToHighlight);
            //     gameBoard.highlightFields(fieldsToHighlight);
            //     //highlightFields(array)
            // };
            if (winningCombinations[i].every(element => Os.includes(element))){//condense this code later into a single function because code is repeated
                console.log("it says the thing now")
                console.log(winningCombinations[i].every(element => Os.includes(element)))
                winningCombinations[i].forEach(element => fieldsToHighlight.push(document.getElementById(element)));
                gameBoard.highlightFields(fieldsToHighlight)
                //extract the numbers that make the winning combination
                return players.one
                //endGame(players.one); moved it to fillField so this can be used for the minmax function
            }
            else if (winningCombinations[i].every(element => Xes.includes(element))){
                winningCombinations[i].forEach(element => fieldsToHighlight.push(document.getElementById(element)));
                gameBoard.highlightFields(fieldsToHighlight)
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
            console.log("genius ai starts acting")
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
            let allTestedPlays = [];
            let minimaxCounter=0; //after finishing game reset this counter
            function minimax(currentBoardState, sign){
                console.log('minimax starts')
                //it rather makes sense to test at the beginning, ok
                console.log("starts checking if someone won + scoring")
                console.log(`checkIfSomeoneWon(currentBoardState) is ${JSON.stringify(checkIfSomeoneWon(currentBoardState))}`)
                console.log(`players.one is ${JSON.stringify(players.one)}`)
                console.log(`players.two is ${JSON.stringify(players.two)}`)
                console.log(`checkIfSomeoneWon(currentBoardState) is ${JSON.stringify(checkIfSomeoneWon(currentBoardState))}`)
                console.log(checkIfSomeoneWon(currentBoardState)===players.one)
                console.log(checkIfSomeoneWon(currentBoardState)===players.two)
                console.log(checkIfSomeoneWon(currentBoardState)===null)
                console.log('starts actually checking')

                if (checkIfSomeoneWon(currentBoardState)===players.one){
                    console.log('returns {score: -1}')
                    return {score: -1};
                }
                else if (checkIfSomeoneWon(currentBoardState)===players.two){
                    console.log('returns {score: +1}')
                    return {score: +1};
                }
                else if (checkIfSomeoneWon(currentBoardState)===null){
                    console.log("returns {score: 0}")
                    return {score: 0};
                }


                let availableFields = checkCurrentEmptyFields(currentBoardState);
                console.log(`availableFields/lenght is ${availableFields.length}`)
                console.log(`availableFields is ${availableFields}`)

                

                // else if (availableFields.length===0){
                //     return {score: 0};
                // }

                console.log('mimimax starts')
                console.log(`sign is ${sign}`)
                console.log(`test board state is ${testBoardState}`)

                
                console.log(`before simulation loop sign is ${sign}`)
                for (k=0;k<availableFields.length;k++){// CHECKS ALL THE AVAILABLE FIELDS TO PUT IN THE SIGN///////////////////////////////////////////////////////////////
                    console.log(`k is ${k}`)//WHY IS K ZERO ALL THE TIMEEEEEEE - it is 0 because it does not update until the whole recurrent function unravels
                    console.log(`availableFields is ${availableFields}`)
                    console.log(`availableFields.length is ${availableFields.length}`)
                    let testedSituation=[];
                    for(j=0;j<currentBoardState.length;j++){//set up the tested situation through pushing the board state
                        //console.log(`tested situation is ${testedSituation}`)
                        //console.log(`currentBoardState${i} is ${currentBoardState[i]}`)
                        testedSituation.push(currentBoardState[j])  //puts the current board state in the tested situation array, the current board state is the parameter of the minimax func
                        //console.log(`tested situation is ${testedSituation}`)
                        //console.log(`currentBoardState${i} is ${currentBoardState[i]}`)
                    }
                    let currentTestedPlay={};
                    currentTestedPlay.index=availableFields[k];
                    console.log(`currentTestedPlay is ${JSON.stringify(currentTestedPlay)}`)
                    //console.log(`currentTestedPlay.score is ${console.log(JSON.stringify(currentTestedPlay.score))}`)
                    //console.log(`current board state is ${currentBoardState}`)
                    //console.log(i)
                    //testedSituation = testBoardState;
                    //console.log(testedSituation)
                    testedSituation[availableFields[k]]=sign;// TESTS THE SITUATION///////////////////////////////////////////////////////////////
                    //console.log(`[sign, k] is ${[sign, k]}`)
                    //allTestedPlays.push([sign, k])//does not work because k keeps being 0
                    //console.log(`k is ${k}`)
                    //console.log(`allTestedPlays is ${allTestedPlays}`)
                    //console.log(`sign is ${sign}`)
                    // console.log(`[k] is ${k}`)
                    // console.log(`availableFields$[${k}] is ${availableFields[k]}`)
                    // console.log(`testedSituation[availableFields[k]] is ${testedSituation[availableFields[k]]}`)
                     //console.log(`current board state is ${currentBoardState}`)
                     //console.log(`tested situation is ${testedSituation}`)
                    //console.log(`current board state is ${currentBoardState}`)
                    //console.log(`sign before check if sbwon is ${sign}`)

                   

                    //checkIfSomeoneWon(testedSituation)//CHECKS IF SOMEONE WINS IN THIS SITUATOON///////////////////////////////////////////////////////////////
                    //console.log(`sign after check if sbwon is ${sign}`)
///////////////////////////////////////////////////////////////
                    //scoreTest(testedSituation)

///////////////////////////////////////////////////////////////
                    // console.log(`availableFields.length is ${availableFields.length}`)
                    // console.log(`[k] is ${k}`)
                    console.log(`sign is ${sign}`)
                    // console.log(`tested situation is ${testedSituation}`)
                    console.log(`before recurrence sorting`)
                    ///////////////////////////////////////////////////////////////THIS IS WHERE IT BREAKS, RESULT IS UNDEFINED FOR SOME REASON
                    ////////////////////////////CHECK OUT WHAT HAPPENS AFTER returns {score: 0}
                    ////////////////////////////CHECK OUT THE ORDER, PERHAPS THE ALLTESTEDPLAYS.PUSH MUST BE MOVED SOMETHWARE DAMNIT
                    if (sign===players.two.sign){
                        console.log("recurrence sorting === players.two")
                       const result = minimax(testedSituation, players.one.sign);
                       console.log(`result is ${JSON.stringify(result)}`)
                       console.log("postrecurrence sorting === players.two")
                       console.log("recurrence sorting post mimimax")
                       console.log(`result is ${JSON.stringify(result)}`)
                       currentTestedPlay.score=result.score;
                    }
                    else if (sign===players.one.sign){
                        console.log("recurrence sorting === players.one")
        
                        const result = minimax(testedSituation, players.two.sign);
                        console.log("postrecurrence sorting === players.one")
                        console.log("recurrence sorting post mimimax")
                        console.log(`result is ${JSON.stringify(result)}`)
                        currentTestedPlay.score=result.score;
                    }
                    ///////////////////////////////////////////////////////////////
                     console.log('START OF POST RECURRENTIAL MINIMAX')
                     console.log(`k is ${k}`)
                    // console.log(`[sign, k] is ${[sign, k]}`)
                    // allTestedPlays.push([sign, k])//does not work because k keeps being 0
                    // console.log(`k is ${k}`)
                    // console.log(`allTestedPlays is ${allTestedPlays}`)
                    // console.log('it ended')
                    // console.log(`k is ${k}`) 
                    // console.log(`allTestedPlays is ${allTestedPlays}`)
                    // console.log('END  OF POST RECURRENTIAL MINIMAX')
                    console.log(`allTestedPlays is ${JSON.stringify(allTestedPlays)}`)
                    console.log(`currentTestedPlay is ${JSON.stringify(currentTestedPlay)}`)
                    allTestedPlays.push(currentTestedPlay);//is this the right place?
                    console.log('after pushing current tested plays into alltestedplayss')
                    console.log(`allTestedPlays is ${JSON.stringify(allTestedPlays)}`)
                    console.log(`currentTestedPlay is ${JSON.stringify(currentTestedPlay)}`)
                    console.log(`k is ${k}`)
                }
                
                console.log("after the loop that is supposed to check all possible field entreis")
//////// we continue ////"sign is undefined"!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

//z jakimi parametrami nalezy kolejyn minimax zrobic czy w testowanej sytuacji? kurde chyba tak! a score test?

                
                console.log("TEST THIS TO CHECK IF FILL FIELD")
                console.log(allTestedPlays)
                console.log(allTestedPlays[0].score)
                console.log((allTestedPlays.reduce((highest,checked)=>{return Math.max(checked.score,highest)},0)))
                console.log(`DOM element to be filled is ${document.getElementById(String(allTestedPlays.reduce((highest,checked)=>{return Math.max(checked.score,highest)},0).index))}`)
                //gameBoard.fillField(document.getElementById(allTestedPlays.reduce((a,b)=>{return Math.max(a.score,b.score)},0).index))//?????
                return {score: 0};//has to return SOMETHING
            }//the problem is apparently because it does not return anything in the end, cheking returning of whatever
            console.log("before first minimax invoaction")
            minimax(testBoardState, players.two.sign)//first minimax invocation
            console.log("after first minimax invoaction")

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
