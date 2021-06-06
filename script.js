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

        //newField.innerText="X"//to remove later when they are empty
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
    for (i=0; i<gameBoard.boardArray.length; i++) {
        if (gameBoard.boardArray[i]==="O"){
            console.log(i)
            Os.push(i)
        }
        else if (gameBoard.boardArray[i]==="X"){
            Xes.push(i)
            console.log(i)
        }
    }

    //nie odpala bo music byc po machnieciu pola
    //a jak tam sie zrobi to jest game nie jest jestzcze zinicjalizowane


    return {
        currentPlayer,
        winner,
        Xes,
        Os,
        
    }

})();
