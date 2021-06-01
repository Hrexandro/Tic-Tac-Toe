const gameBoard = (function(){
    let board=[];
    for (i=0;i<9;i++){
        if (i%2!==0){
            board[i]="X"
        }
        else {
            board[i]="O"
        }
    }
    console.log(board)


})();