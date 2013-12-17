window.onload=function(){

	var squareList=document.getElementById('squareList');
	var pieceHolder =document.getElementById('pieceHolder');
	//
	alert("Blue player setup");

	squareList.onclick=function(e){
		deleteAllDots();
		boardPiecePlacement(e.target.id, "blue");
	};

	pieceHolder.onclick=function(e){
		deleteAllDots();
		sidePiecePlacement(e.target.id, "blue");
	};
};

function doFunction(){
	flipPieces("red");
	var listTextStr = document.getElementById('squareList').innerHTML;
	localStorage.setItem('testObject', listTextStr);
	window.location.assign("boardlist.html");
	// document.write(pathname.boardlist.html);
}

function sidePiecePlacement(pieceName, playerColor){
	var squareList=document.getElementById('squareList');
	var pieceHolder =document.getElementById('pieceHolder');
	
	squareList.onclick=function(e){
		deleteAllDots();
		boardPiecePlacement(e.target.id, playerColor);
	};

	pieceHolder.onclick=function(e){
		deleteAllDots();
		sidePiecePlacement(e.target.id, playerColor);
	};

	var name = pieceName.split("-")[0].replace("blue", "").replace("red", "");
	var color = colorOfClick(pieceName);
	var square = pieceName.split("-")[1];

	if (color == "blank") //makes sure we don't allow them to click on blank squares
		return;

	if (color == "blue" && playerColor == "blue"){ // if it is a blue piece, only check the top half of the board
	for(var i = 0; i < 40; i++)
	{
	activateDot(square, i, "sideToBoard");
	}
	}

	else if (color == "red" && playerColor == "red"){ // if it is a red piece, check the bottom part
	for (var j = 60; j < 100; j++)
	{
	activateDot(square, j, "sideToBoard");
	}

	}
}

function boardPiecePlacement(pieceName, playerColor){
	var squareList=document.getElementById('squareList');
	var pieceHolder =document.getElementById('pieceHolder');
	
	squareList.onclick=function(e){
		deleteAllDots();
		boardPiecePlacement(e.target.id, playerColor);
	};

	pieceHolder.onclick=function(e){
		deleteAllDots();
		sidePiecePlacement(e.target.id, playerColor);
	};

	var color = colorOfClick(pieceName);
	var square = pieceName.split("-")[1];
	var name = pieceName.split("-")[0].replace("blue", "").replace("red", "");

	if (name == "blankSquare") //makes sure we don't allow them to click on blank squares
		return;
	
	if (color == "blue" && playerColor == "blue"){ // if it is a blue piece, only check the top half of the board
	for(var i = 0; i < 40; i++)
	{
	checkstatus(i, square);

	if(i != square) //check so you don't put a dot on the piece you clicked on
		activateDot(square, i, "boardToBoard");
	}
	}

	else if (color == "red" && playerColor == "red"){ // if it is a red piece, check the bottom part
	for (var j = 60; j < 100; j++)
	{
	checkstatus(j-20, square);

	if(j != square) //check so you don't put a dot on the piece you clicked on
		activateDot(square, j, "boardToBoard");
	}

	}

}



function checkstatus(squareNumber, movedFromSquare){
    var lItems = document.getElementById("pieceHolder").getElementsByTagName("li");
    var currentSquare = (lItems[squareNumber].innerHTML).split('"').reverse()[1];


    if (currentSquare.split("-")[0] == "blankSquare")
        {
            activateDot(movedFromSquare, squareNumber, "boardToSide");
            return 1;
        }

}



function activateDot(movedFromSquare, movedToSquare, type){

	var board = document.getElementById("squareList").getElementsByTagName("li");
	var sideboard =  document.getElementById("pieceHolder").getElementsByTagName("li");
	var currentHTML;
	var newHTML;

	if(type == "sideToBoard"){//if the piece you clicked on was on the side, moving to board
	currentHTML = board[movedToSquare].innerHTML;


	newHTML = currentHTML+'<div class="moveCircle" id="listenForClick'+movedToSquare+'"></div>';

	board[movedToSquare].innerHTML = newHTML;
	document.getElementById("listenForClick"+movedToSquare).onclick = function(){
		dotClicked(movedFromSquare, movedToSquare, "sideToBoard");
	};
	}

	if(type == "boardToBoard"){ // if the piece you clicked on was on the board, moving to board
	currentHTML = board[movedToSquare].innerHTML;
	
	newHTML = currentHTML+'<div class="moveCircle" id="listenForClick'+movedToSquare+'"></div>';

	board[movedToSquare].innerHTML = newHTML;
	document.getElementById("listenForClick"+movedToSquare).onclick = function(){
		dotClicked(movedFromSquare, movedToSquare, "boardToBoard");
	};
	}

	if(type == "boardToSide"){ // if the piece you clicked on was on the board and you want to move it to the side
	currentHTML = sideboard[movedToSquare].innerHTML;
	// add side to this
	newHTML = currentHTML+'<div class="moveCircle" id="listenForClickSide'+movedToSquare+'"></div>';

   
}
}

function dotClicked(movedFromSquare, movedToSquare, type){

	var board = document.getElementById("squareList").getElementsByTagName("li");
	var sideboard =  document.getElementById("pieceHolder").getElementsByTagName("li");
	var movedFromHTML;
	var movedToHTML;

	if(type == "boardToSide"){
		movedFromHTML = board[movedFromSquare].innerHTML;
		movedToHTML = sideboard[movedToSquare].innerHTML;
	}
	else if(type == "boardToBoard"){
		movedFromHTML = board[movedFromSquare].innerHTML;
		movedToHTML = board[movedToSquare].innerHTML;
	}
	else if (type == "sideToBoard"){
		movedFromHTML = sideboard[movedFromSquare].innerHTML;
		movedToHTML = board[movedToSquare].innerHTML;
	}

	var squareID1 = (movedFromHTML).split(">")[0].split('"').reverse()[1]; // gets the id
	//alert(squareID1.split("-")[0].replace("blue","").replace("red", ""));

	var squareID2 = (movedToHTML).split(">")[0].split('"').reverse()[1]; // gets the id
	
	var movedToHTMLUpdated = movedToHTML.replace(new RegExp('-[0-9][0-9]"|-[0-9]"','g'),"-"+squareID1+'"');
	var movedFromHTMLUpdated = movedFromHTML.replace(new RegExp('-[0-9][0-9]"|-[0-9]"','g'),"-"+squareID2+'"');

	movedToHTMLUpdated = movedToHTMLUpdated.replace(new RegExp('-(.*)-','g'),"-");
	movedFromHTMLUpdated = movedFromHTMLUpdated.replace(new RegExp('-(.*)-','g'),"-");

	if(type == "sideToBoard"){
		sideboard[movedFromSquare].innerHTML = movedToHTMLUpdated;
		board[movedToSquare].innerHTML = movedFromHTMLUpdated;
	}

	else if(type == "boardToBoard"){
		board[movedFromSquare].innerHTML = movedToHTMLUpdated;
		board[movedToSquare].innerHTML = movedFromHTMLUpdated;
	}

	else if (type == "boardToSide"){
		board[movedFromSquare].innerHTML = movedToHTMLUpdated;
		sideboard[movedToSquare].innerHTML = movedFromHTMLUpdated;
	}

	var squareList=document.getElementById('squareList');
	var pieceHolder =document.getElementById('pieceHolder');
	//sortList(pieceHolder);

	var playerColor = colorOfClick(squareID1); //used to tell whose turn it is
	var sideboardInner= pieceHolder.innerHTML;

	if (((sideboardInner.match(/blankSquare/g)).length) >= 40 && playerColor == "blue"){
		//make button that says, are you ready to submit? It will do these in the onclick
		flipPieces("blue");
		playerColor = "red";
	}

	if (((sideboardInner.match(/blankSquare/g)).length) >= 80){
		var startButton = document.getElementById('startButton');
		startButton.innerHTML = '<input id="startGame" type="button" value="Start Game" onclick="doFunction();" />';
	}

	

	squareList.onclick=function(e){
		deleteAllDots();
		boardPiecePlacement(e.target.id, playerColor);
	};

	pieceHolder.onclick=function(e){
		deleteAllDots();
		sidePiecePlacement(e.target.id, playerColor);
	};


}



function colorOfClick(idname){

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

// function deleteAllDots(){
//     var allHTML = document.documentElement.innerHTML;
//     cleanedHTML = allHTML.replace(new RegExp('(<div class="moveCircle" id="listenForClick.."></div>)|(<div class="moveCircle" id="listenForClick."></div>)|(<div class="moveCircle" id="listenForClickSide.."></div>)|(<div class="moveCircle" id="listenForClickSide."></div>)','g'),"");
//     // add in when youre ready for side dot
//     document.documentElement.innerHTML = cleanedHTML;
// }

//I'm using some JQuery to important deleteAllDots
$.getScript("dots.js", function(){});


/*function sortList(ul){
>>>>>>> 51eed65537d7e5ab99d9e8b1fc4a5c6225567d3f
    var new_ul = ul.cloneNode(false);

    // Add all lis to an array
    var bluelis = []; // the list of all the blue pieces
    var redlis = []; // list of all red pieces
    for(var i = 0; i < ul.childNodes.length/2; i++){ //this part is not working
        if(ul.childNodes[i].nodeName === 'LI'){
            bluelis.push(ul.childNodes[i]);
        }
    }

    for (var j = ul.childNodes.length/2; j < ul.childNodes.length; j++){
        if(ul.childNodes[j].nodeName === 'LI'){
            redlis.push(ul.childNodes[j]);
        }
    }

    // Sort the lis in descending order
    // @TODO combine these two pieces of code using bluelis and redlis as variable
    //              would be a lot cleaner
    bluelis.sort(function(a, b){
        var aID = a.innerHTML.split(">")[0].split('"').reverse()[1].split("-")[0].replace("blue","").replace("red", "");
        var bID = b.innerHTML.split(">")[0].split('"').reverse()[1].split("-")[0].replace("blue","").replace("red", "");

        if(aID==bID)
            return 0;
        else if(aID == "blankSquare")
            return -1;
         else if(bID == "blankSquare")
            return 1;
         else if(aID>bID)
            return 1;
         else 
            return -1;  
       
    });

    redlis.sort(function(a, b){
        var aID = a.innerHTML.split(">")[0].split('"').reverse()[1].split("-")[0].replace("blue","").replace("red", "");
        var bID = b.innerHTML.split(">")[0].split('"').reverse()[1].split("-")[0].replace("blue","").replace("red", "");

        if(aID==bID)
            return 0;
        else if(aID == "blankSquare")
            return -1;
         else if(bID == "blankSquare")
            return 1;
         else if(aID>bID)
            return 1;
         else 
            return -1;  
       
    });
    // Add them into the ul in order
    for(var k = 0; k < 40; k++)
        new_ul.appendChild(bluelis[k]);

    for(var l = 40; l < 80; l++)
        new_ul.appendChild(redlis[l-40])

    ul.parentNode.replaceChild(new_ul, ul);
<<<<<<< HEAD
}

// @TODO not unexpectedly deleteAllDots is not working for sideboard
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

$.getScript("test.js", function(){

   alert("Script loaded and executed.");
   // Here you can use anything you defined in the loaded script
});
=======
}*/

