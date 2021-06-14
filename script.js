/*
what should the player and game objects do?

add elements after players set themselves up

choosing X or O

block from filling fields after winning

display score

reset board and play another round

BUGS: when new game starts Xes and Os are empty but as soon as one of the fields is clicked, they are filled again with all the numbers from the previous game
->added gameBoard.clearBoardArray(); - should take care of it
*/
const gameBoard = (function(){
    let boardArray=[];

    function clearBoardArray(){
        for (i=0;i<9;i++){//set the array to start as empty
            boardArray.push(null)
        }
    }
    clearBoardArray();
    console.log(boardArray);

    //display the gameBoard on the screen
    let gameBoardElement = document.getElementById('game-board');

    function setUpBoard(){
        for (i=0;i<9;i++){//add the elements
            let newField = document.createElement('div');
            newField.setAttribute('id',`${i}`);//maybe introduce better naming to specify row and column?
            newField.setAttribute('class','field')
            gameBoardElement.appendChild(newField)
            newField.addEventListener('click',fillField)
            
        }
    }

    function addNewGameButton(){
        let newGameButton = document.createElement('button');
        newGameButton.innerText = "New Game";
        gameBoardElement.appendChild(newGameButton);
        newGameButton.setAttribute('id','new-game-button')
        newGameButton.addEventListener('click',()=>{
            game.startNewGame();
        })
    }

    let newGameButton = document.createElement('button');
    newGameButton.innerText = "New Game";

    //gameBoardElement.appendChild(newGameButton)

    function fillField (event){
        console.log(event);
        console.log(game.currentPlayer);
        console.log(game.postGame)
        if (event.target.innerText===""&&game.getPostGame()===false){//if field is empty and we are not in the aftermath of a game
            console.log(game.currentPlayer)
            console.log(players.one)
            event.target.innerText = `${game.currentPlayer.sign}`;
            boardArray[event.target.getAttribute('id')] = game.currentPlayer.sign;
            (game.currentPlayer===players.one)? game.currentPlayer=players.two : game.currentPlayer=players.one;  
            game.checkIfSomeoneWon();
            
        }
    }
    function clearGameBoard(){
        Array.from(document.getElementsByClassName('field')).forEach((element)=>{
            element.innerText = "";
        })
    }


    return {
        fillField,
        boardArray,
        setUpBoard,
        addNewGameButton,
        clearGameBoard,
        clearBoardArray,
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

        function replaceNameEntryFieldWithName(playerName, event){
            event.target.parentNode.innerHTML=`<h1>${playerName}</h1>`;
        }

        const playerOneButton = document.getElementById("ok-player-one")
        const playerTwoButton = document.getElementById("ok-player-two")
    
        function nameButtonFunctionalityAdder(button, nameField, player){
            button.addEventListener('click',(event)=>{
                assignName(nameField.value,player);
                console.log(player.number)
                replaceNameEntryFieldWithName(nameField.value, event);
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

    function checkIfSomeoneWon(){
        for (i=0; i<gameBoard.boardArray.length; i++) {
            if (gameBoard.boardArray[i]==="O"&&!Os.includes(i)){
                console.log(i)
                Os.push(i)
            }
            else if (gameBoard.boardArray[i]==="X"&&!Xes.includes(i)){
                Xes.push(i)
                console.log(i)
            }
        }
        for (i=0; i<winningCombinations.length;i++){
            if (winningCombinations[i].every(element => Os.includes(element))){
                endGame(players.one);
            }
            else if (winningCombinations[i].every(element => Xes.includes(element))){
                endGame(players.two);
            }
        }
    }

    function endGame(winner){
        console.log(`${winner.name} wins`)
        winner.score++;
        console.log(postGame);
        setPostGame(true);
        console.log(postGame);
        gameBoard.addNewGameButton();
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
    }

})();
