function setupClick(){
    "use strict";
    var squareList=document.getElementById("squareList");
    // These are for once we have setup completely set up 
    // alert("Blue goes first, don't look red!");
    // flipPieces("blue");

    squareList.onclick=function(e){
        deleteAllDots();
        if(colorOfClick(e.target.id) == localStorage.getItem("turn")){
            posmoves(e.target.id);
        }
        else{
            setupClick();
        }
    };
}

window.onload=function(){
    // // ENABLE START GAME BUTTON RETRIEVE FROM SETUP.HTML
    // var setupResults = localStorage.getItem('testObject')
    // squareList.innerHTML = setupResults;

    // flipSinglePiece("red5-67");
    "use strict";
    localStorage.setItem("turn", "blue");
    setupClick();
};

function posmoves(pieceName){
    "use strict";
    var name = pieceName.split("-")[0].replace("blue", "").replace("red", ""); // the name of the piece (Spy, Bomb, 9 etc..)
    var square = pieceName.split("-")[1]; // the position on the board
    square = parseInt(square, 10);
    var color = colorOfClick(pieceName);

    setupClick();
    // activateDot(33, 34); // we need to call in the the variables moveTo and moveFrom

    if (name == "Bomb" || name == "Flag" || name == "lakeSquare" || name == "blankSquare")
        return; // if it's a piece that can't move

    if (name != "9") // movement for everything except 9
    {
        if (square % 10 != 9) // Move to the right
            checkstatus(square+1, color, square);
        if (square % 10 !== 0) // Move to the left
            checkstatus(square-1, color, square);
        if (square - 10 >= 0) // Move up
            checkstatus(square-10, color, square);
        if (square + 10 < 100) // Move down
            checkstatus(square+10, color, square);
    }

    if (name == "9") // movement for 9
    {

        if (square % 10 != 9) // check to the right
            if (checkstatus(square + 1, color, square) == 1 && (square + 1) % 10 != 9)
                recursive(square+2, "r", square);

        if (square % 10 !== 0) // check to the left
            if (checkstatus(square-1, color, square) == 1 && (square-1) % 10 !== 0  )
                recursive(square-2, "l", square);
            
        if (square - 10 > 0) // check up
            if (square - 20 > 0 && checkstatus(square-10, color, square) == 1)
                recursive(square-20, "u", square);

        if (square + 10 < 100) // check down
            if (square + 20 < 100 && checkstatus(square+10, color, square) == 1)
                recursive(square+20, "d", square);
    }
}

function colorOfClick(idname){
        "use strict";
        if ((idname).indexOf("blue") != -1){
            return "blue";
        }
        else if ((idname).indexOf("red") != -1){
            return "red";
        }
        else{
            return "blank";
        }
    }

function checkstatus(squareNumber, color, movedFromSquare){
    "use strict";
    var lItems = document.getElementById("squareList").getElementsByTagName("li");
    var currentSquare = (lItems[squareNumber].innerHTML).split("\"").reverse()[1];

    var squareColor = colorOfClick(currentSquare); // Finds the color of the piece on this square

    if (currentSquare.split("-")[0] == "blankSquare")
        {
            activateDot(movedFromSquare, squareNumber, "blank");
            return 1;
        }
    else if(currentSquare.split("-")[0] == "lakeSquare")
        return;

    else if(color != squareColor) // If the color of the piece being moved is different from the color of the piece on the square
        activateDot(movedFromSquare, squareNumber, "combat");
}

function checkSideboard (color){
    var redLItems = document.getElementById("redPieceHolder").getElementsByTagName("li");
    var blueLItems = document.getElementById("bluePieceHolder").getElementsByTagName("li");
    var currentSquare;
    
    if (color == "blue"){

        for (var i = 0; i < 40; i++){
           currentSquare = (blueLItems[i].innerHTML).split("\"").reverse()[1];
           if (currentSquare.split("-")[0] == "blankSquare")
            {
                return i;
            }
        }
    }

    if(color == "red"){
        for (var j = 0; j < 40; j++){
           currentSquare = (redLItems[j].innerHTML).split("\"").reverse()[1];
           if (currentSquare.split("-")[0] == "blankSquare")
            {
                return j;
            }
        }
    }

}

function activateDot(movedFromSquare, movedToSquare, type){
    "use strict";
    var lItems = document.getElementById("squareList").getElementsByTagName("li");
    var currentHTML = lItems[movedToSquare].innerHTML;
    var newHTML = "";
    if (type == "combat")
        newHTML = currentHTML+"<div class=\"moveCircleCombat\" id=\"listenForClick"+movedToSquare+"\"></div>";
    else if (type == "blank")
        newHTML = currentHTML+"<div class=\"moveCircle\" id=\"listenForClick"+movedToSquare+"\"></div>";
    lItems[movedToSquare].innerHTML = newHTML;
    lItems = document.getElementById("squareList").getElementsByTagName("li");
    
    document.getElementById("listenForClick"+movedToSquare).onclick = function(){
        dotClicked(movedFromSquare, movedToSquare);
    };
}
function sleep(milliseconds) {
    "use strict";
    var start = new Date().getTime();
    for (var i = 0; i < 1e7; i++) {
        if ((new Date().getTime() - start) > milliseconds){
            break;
        }
    }
}

function dotClicked(movedFromSquare, movedToSquare){
    "use strict";
    var lItems = document.getElementById("squareList").getElementsByTagName("li");
    var redSideLItems = document.getElementById("redPieceHolder").getElementsByTagName("li");
    var blueSideLItems = document.getElementById("bluePieceHolder").getElementsByTagName("li");

    var movedFromHTML = lItems[movedFromSquare].innerHTML;
    var movedToHTML = lItems[movedToSquare].innerHTML;

    var squareID1 = (lItems[movedFromSquare].innerHTML).split(">")[0].split("\"").reverse()[1]; // gets the id
    var pieceA = squareID1.split("-")[0].replace("blue", "").replace("red", ""); // gets the name from the id
    var pieceAColor = colorOfClick(squareID1);

    var squareID2 = (lItems[movedToSquare].innerHTML).split(">")[0].split("\"").reverse()[1]; // gets the id
    var pieceB = squareID2.split("-")[0].replace("blue", "").replace("red", ""); // gets the name from the id
    var pieceBColor = colorOfClick(squareID2);

    var result = combat(pieceA, pieceB);
    // -1 do nothing 
    if(result != 3)
    {
        // alert(squareID2); // doesnt like alerts
        flipSinglePiece(squareID2);
        alert("RAAAAAHHHAHAHAHAHHHHHAAHHHHH");
    }
    var openSideSquareA;
    var openSideSquareB;
    // 3 is for when you attack a blank square
    if (result == 1){
        // The squareID2 needs to be moved to the sideboard
        openSideSquareB = checkSideboard(pieceBColor); //The first spot on the side where the captured piece can be put
        if(pieceBColor == "red")
        {
            redSideLItems[openSideSquareB].innerHTML = movedToHTML;
        }
        else if(pieceBColor == "blue"){
            blueSideLItems[openSideSquareB].innerHTML = movedToHTML;
        }


        var colorAndStuff = movedFromHTML.split("=")[2].replace("\"","").split("-")[0]+"-";
        var innerHTMLList = movedFromHTML.split("\"");
        var newHTMLInner = (innerHTMLList[0]+"\""+innerHTMLList[1]+"\""+innerHTMLList[2]+"\""+colorAndStuff+movedToSquare+"\">");
        lItems[movedToSquare].innerHTML = newHTMLInner;
    }

    else if(result == 3){ // for when you attack a blank square
        var colorAndStuff = movedFromHTML.split("=")[2].replace("\"","").split("-")[0]+"-";
        var innerHTMLList = movedFromHTML.split("\"");
        var newHTMLInner = (innerHTMLList[0]+"\""+innerHTMLList[1]+"\""+innerHTMLList[2]+"\""+colorAndStuff+movedToSquare+"\">");
        lItems[movedToSquare].innerHTML = newHTMLInner;
    }

    else if(result == -1){
        // squareID1 needs to be moved to the sideboard
        openSideSquareA = checkSideboard(pieceAColor);
        if(pieceAColor == "red")
        {
            redSideLItems[openSideSquareA].innerHTML = movedFromHTML;
        }
        else if(pieceAColor == "blue"){
            blueSideLItems[openSideSquareA].innerHTML = movedFromHTML;
        }

    }

    else if (result === 0){// If they tie
        // Both squareids need to be moved to the sideboard
        openSideSquareA = checkSideboard(pieceAColor);
        openSideSquareB = checkSideboard(pieceBColor);
        if(pieceAColor == "red")
        {
            redSideLItems[openSideSquareA].innerHTML = movedFromHTML;
            blueSideLItems[openSideSquareB].innerHTML = movedToHTML;
        }
        else if(pieceAColor == "blue"){
            blueSideLItems[openSideSquareA].innerHTML = movedFromHTML;
            redSideLItems[openSideSquareB].innerHTML = movedToHTML;
        }

        lItems[movedToSquare].innerHTML = "<div id=\"blankSquare-"+movedToSquare+"\">";

    }

    else if (result == 2){ // End the game (Call an endgame(playerX) function)
        // alert("Game!"); doesnt like alerts
        // lItems[movedFromSquare].innerHTML = '<div id="blankSquare-'+movedFromSquare+'">'; 
        // deleteAllDots();
    }
    
    lItems[movedFromSquare].innerHTML = "<div id=\"blankSquare-"+movedFromSquare+"\">"; // blank square leaving piece
    deleteAllDots();
    var currentTurn = localStorage.getItem("turn");
    if(currentTurn == "blue"){
        localStorage.setItem("turn", "red");
    }
    else{localStorage.setItem("turn", "blue");}

    
    if(pieceAColor == "blue"){
        if (result == 1)
        {
            flipSinglePiece(squareID1);
        }
        flipPieces("blue");
        
        alert("switch people");
        sleep(10);
        // renable this latter
        
        if (result == 1)
        {
            flipSinglePiece(squareID1);
        }
        flipPieces("red");
        if (result == -1)
        {
            flipSinglePiece(squareID2);
        }
    }

    else if(pieceAColor == "red"){
        if (result == 1)
        {
            flipSinglePiece(squareID1);  //This squareid is no longer correct since the piece has moved to a new square, so we need to get the new square name from somewhere
        }
        flipPieces("red");
        
        alert("switch people");
        sleep(10);
        //renable this latter
        
        if (result == 1)
        {
            flipSinglePiece(squareID1);
        }
        flipPieces("blue");
        if (result == -1)
        {
            flipSinglePiece(squareID2);
        }
    }
    setupClick();
}

function recursive(movedToSquare, direction, movedFromSquare){
    "use strict";
    var lItems = document.getElementById("squareList").getElementsByTagName("li");
    var currentSquare = (lItems[movedToSquare].innerHTML).split("\"").reverse()[1];

    if (currentSquare.split("-")[0] == "blankSquare"){
            activateDot(movedFromSquare, movedToSquare, "blank");
            switch(direction){
                case "l":
                    if (movedToSquare % 10 !== 0)
                        recursive(movedToSquare-1, "l", movedFromSquare);
                    break;

                case "r":
                    if(movedToSquare % 10 != 9)
                        recursive(movedToSquare+1,"r", movedFromSquare);
                    break;

                case "d":
                    if(movedToSquare + 10 < 100)
                        recursive(movedToSquare+10, "d", movedFromSquare);
                    break;

                case "u":
                    if(movedToSquare - 10 > 0)
                        recursive(movedToSquare-10, "u", movedFromSquare);
                    break;
            }
        }
    else
    return;
}


function combat(a, b){ // a is the attacking piece, if a wins the function returns 1, if b wins it returns -1, otherwise returns 0 if they tie both die, or 2 if its a flag
    "use strict";
    if (a == b) // If they tie
        return 0;

    if (b == "blankSquare")
        return 3;

    if (a == "Spy") // If the spy attacks
        if(b == "1") // and it hits the 1
            return 1; // the spy wins
        else
            return -1;
    
    if(b == "Spy")
        return 1;

    if(b == "Bomb")
        if(a == "8")
            return 1;
        else
            return -1;

    if(b == "Flag")
        return 2;

    if(parseInt(a, 10) < parseInt(b, 10)) // checks to see if both strings are ints
        return 1; // if a's number is less than b's
    else
        return -1;
}


// a function to switch the backs of the pieces
function flipPieces(color){
    "use strict";
    var lines = document.getElementById("squareList").getElementsByTagName("li");
    // var currentSquare = (lItems[squareNumber].innerHTML).split("\"").reverse()[1];

    for (var i = 0; i < 100; i++){
        var line = lines[i].innerHTML;
        if (line.indexOf(color) != -1){
            if (line.indexOf(color+"Back") != -1){
                // change to pieceIMG
                var lineID = line.split("-")[0].split("id=\"")[1];
                lines[i].innerHTML = line.replace(new RegExp("/(.*)png","g"),"/images/pieces/"+lineID+".png");
            }
            else{
                // change to backIMG
                lines[i].innerHTML = line.replace(new RegExp("/(.*)png","g"),"/images/pieces/"+color+"Back.png");
            }
        }
    }
}

// a function to switch the backs of the pieces
function flipSinglePiece(pieceName){
    "use strict";
    var lines = document.getElementById("squareList").getElementsByTagName("li");
    // var currentSquare = (lItems[squareNumber].innerHTML).split("\"").reverse()[1];

    for (var i = 0; i < 100; i++){
        var line = lines[i].innerHTML;
        if (line.indexOf(pieceName) != -1){
            // get the color of the piece
            var color = "";
            if (pieceName.indexOf("red") != -1)
                {color = "red";}
            else{color = "blue";}

            if (line.indexOf(color+"Back") != -1){
                // change to pieceIMG
                var lineID = line.split("-")[0].split("id=\"")[1];
                lines[i].innerHTML = line.replace(new RegExp("/(.*)png","g"),"/images/pieces/"+lineID+".png");
            }
            else{
                // change to backIMG
                lines[i].innerHTML = line.replace(new RegExp("/(.*)png","g"),"/images/pieces/"+color+"Back.png");
            }
        }
    }
}

function deleteAllDots(){
    "use strict";
    var lines = document.getElementById("squareList").getElementsByTagName("li");
    for (var i = 0; i < 100; i++){
        var line = lines[i].innerHTML;
        if (line.indexOf("moveCircle") != -1){ // section to change
            lines[i].innerHTML = line.replace(new RegExp("(<div class=\"moveCircle\" id=\"listenForClick..\"></div>)|(<div class=\"moveCircle\" id=\"listenForClick.\"></div>)|(<div class=\"moveCircleCombat\" id=\"listenForClick..\"></div>)|(<div class=\"moveCircleCombat\" id=\"listenForClick.\"></div>)","g"),"");
            }
    }
}

