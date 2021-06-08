/*
what should the player and game objects do?
*/
const gameBoard = (function(){
    let boardArray=[];

    for (i=0;i<9;i++){//set the array to start as empty
        boardArray.push(null)
    }
    console.log(boardArray);

    //display the gameBoard on the screen
    let gameBoardElement = document.getElementById('game-board');

    for (i=0;i<9;i++){//add the elements
        let newField = document.createElement('div');
        newField.setAttribute('id',`${i}`);//maybe introduce better naming to specify row and column?
        newField.setAttribute('class','field')
        gameBoardElement.appendChild(newField)
        newField.addEventListener('click',fillField)
        
    }

    function fillField (event){
        console.log(event);
        console.log(game.currentPlayer);
        console.log(game.currentPlayer);
        if (event.target.innerText===""){
            console.log(game.currentPlayer)
            console.log(players.one)
            event.target.innerText = `${game.currentPlayer.sign}`;
            boardArray[event.target.getAttribute('id')] = game.currentPlayer.sign;
            (game.currentPlayer===players.one)? game.currentPlayer=players.two : game.currentPlayer=players.one;  
            game.checkIfSomeoneWon();
            
        }
    }
    return {
        fillField,
        boardArray,
    }

})();

const players = (function(){


    function playerMaker(number) {
        let player = Object.create(playerMaker.proto);
            player.number = number;

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
    let winner;
    let Xes =[];
    let Os = [];
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
                console.log("O wins")
            }
            else if (winningCombinations[i].every(element => Xes.includes(element))){
                console.log("X wins")
            }
        }
    }



    return {
        currentPlayer,
        winner,
        Xes,
        Os,
        checkIfSomeoneWon,
        
    }

})();
