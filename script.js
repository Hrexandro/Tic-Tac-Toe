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
            event.target.innerText = `${game.currentPlayer}`;
            boardArray[event.target.getAttribute('id')] = game.currentPlayer;
            (game.currentPlayer==="O")? game.currentPlayer="X" : game.currentPlayer="O";   
        }
    }
    return {
        fillField,
        boardArray,
    }

})();

const game = (function(){
    let currentPlayer="O";




    return {
        currentPlayer,
    }

})();

const players = (function(){
    function playerMaker(number) {
        let player = Object.create(playerMaker.proto);
        player.number = number;
        return player;
        }
           
        playerMaker.proto = {
        getNumber: function() {
            return this.number;
        }
        }
        
        let one = playerMaker(1);
        let two = playerMaker(2);

        return {
            one,
            two,
        }
})();
