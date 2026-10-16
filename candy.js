// From https://www.youtube.com/watch?v=8yIKZQMGi0A&t=2s
// 10/9/26- stopped at 30:34
//var candies = ["Blue", "Orange", "Green", "Yellow", "Red", "Purple"];
var candies = ["evil-bunny-blue-1", "evil-bunny-red-1", "evil-bunny-cabbage-1", "evil-bunny-carrot-1", "evil-bunny-cabbage-1"];
var board = [];
var rows = 12;
var columns = 20;
var score = 0;

var currTile;
var otherTile;
var clusterlist = [];
//var newSource;


window.onload = function() {
    startGame();

    window.setInterval(function(){
        //crushCandy();
        slideCandy();
        //generateCandy();
    }, 100);
}

function randomCandy() {
    return candies[Math.floor(Math.random() * candies.length)]; //0-5.99
}

function startGame() {
    for (let r = 0; r < rows; r++) {
        let row = [];
        for (let c = 0; c < columns; c++) {
            // Create an image tag
            let tile = document.createElement("img");
            tile.id = r.toString() + "-" + c.toString();
            tile.src = "./images/" + randomCandy() + ".png";

            // Drag functionality
            tile.addEventListener("dragstart", dragStart); //click on a candy, initialize drag process
            tile.addEventListener("dragover", dragOver); // clicking on a candy, moving mouse to drag the candy
            tile.addEventListener("dragenter", dragEnter); // dragging candy onto another candy
            tile.addEventListener("dragleave", dragLeave); // leave candy over another candy
            tile.addEventListener("drop", dragDrop); // dropping a candy over another candy
            tile.addEventListener("dragend", dragEnd); // after drag process completed, we swap candies

            tile.addEventListener("mouseenter", mouseEnter);
            tile.addEventListener("mouseleave", mouseLeave);
            tile.addEventListener("click", mouseClick);


            document.getElementById("board").append(tile);
            row.push(tile);
        }
        board.push(row);
    }

    console.log(board)
}

function mouseEnter() {
    console.log(this.id);
    let hovCoords = this.id.split("-");  //id = "0-0" -> ["0", "0"]
    let hovr = parseInt(hovCoords[0]);
    let hovc = parseInt(hovCoords[1]);
    if (!board[hovr][hovc].src.includes("blank")) {
        clusterlist = findClusters2(hovr, hovc);
        if (clusterlist.length > 1) {
            console.log(clusterlist);
            highlightCluster(clusterlist);
        }
    }
}

function mouseLeave() {
    console.log(this.id);
    let hovCoords = this.id.split("-");  //id = "0-0" -> ["0", "0"]
    let hovr = parseInt(hovCoords[0]);
    let hovc = parseInt(hovCoords[1]);
    if (!board[hovr][hovc].src.includes("blank")) {
        clusterlist = findClusters2(hovr, hovc);
        if (clusterlist.length > 1) {
            console.log(clusterlist);
            unhighlightCluster(clusterlist);
        }
    }


}

function mouseClick() {
    if (clusterlist.length > 1) {
        console.log("time to crush");
        crushCluster(clusterlist);
        clusterlist = [];
    }


}

function dragStart() {
    // "this" refers to the tile that was clicked on for dragging
    currTile = this;
}

function dragOver(e) {
    e.preventDefault();
}

function dragEnter(e) {
    e.preventDefault();
}

function dragLeave() {

}

function dragDrop() {
    // "this" refers to the target tile that was dropped on
    otherTile = this;
}

function dragEnd() {

    if (currTile.src.includes("blank") || otherTile.src.includes("blank")) {
        return;
    } 

    let currCoords = currTile.id.split("-");  //id = "0-0" -> ["0", "0"]
    let r = parseInt(currCoords[0]);
    let c = parseInt(currCoords[1]);

    let otherCoords = otherTile.id.split("-");  //id = "0-0" -> ["0", "0"]
    let r2 = parseInt(otherCoords[0]);
    let c2 = parseInt(otherCoords[1]);

    let moveLeft = c2 == c-1 && r == r2;
    let moveRight = c2 == c+1 && r == r2;

    let moveUp = r2 == r-1 && c == c2;
    let moveDown = r2 == r+1 && c == c2;

    let isAdjacent = moveLeft || moveRight || moveUp || moveDown;

    if (isAdjacent) {
        let currImg = currTile.src;
        let otherImg = otherTile.src;
        currTile.src = otherImg;
        otherTile.src = currImg;

        let validMove = checkValid();
        if (!validMove) {
            let currImg = currTile.src;
            let otherImg = otherTile.src;
            currTile.src = otherImg;
            otherTile.src = currImg;
        }
    }
    
}

function crushCluster(clusterlist) {
    for (let i = 0; i < clusterlist.length; i++) {
        board[clusterlist[i][0]][clusterlist[i][1]].src = "./images/blank.png";
    }
    score += (clusterlist.length - 2) ** 2;
    console.log(score);
    document.getElementById("score").innerText = score;
}

function crushCandy() {
    crushThree();
    document.getElementById("score").innerText = score;
}

function crushThree() {
    // check rows
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns-2; c++) {
            let candy1 = board[r][c];
            let candy2 = board[r][c+1];
            let candy3 = board[r][c+2];
            if (candy1.src == candy2.src && candy2.src == candy3.src && !candy1.src.includes("blank")) {
                candy1.src = "./images/blank.png";
                candy2.src = "./images/blank.png";
                candy3.src = "./images/blank.png";
                score += 30;
            }
        }
    }

    // Check columns
    for (let c = 0; c < columns; c++) {
        for (let r = 0; r < rows-2; r++) {
            let candy1 = board[r][c];
            let candy2 = board[r+1][c];
            let candy3 = board[r+2][c];
            if (candy1.src == candy2.src && candy2.src == candy3.src && !candy1.src.includes("blank")) {
                candy1.src = "./images/blank.png";
                candy2.src = "./images/blank.png";
                candy3.src = "./images/blank.png";
                score += 30;
            }
        }
    }
}

function checkValid() {
    // check rows
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns-2; c++) {
            let candy1 = board[r][c];
            let candy2 = board[r][c+1];
            let candy3 = board[r][c+2];
            if (candy1.src == candy2.src && candy2.src == candy3.src && !candy1.src.includes("blank")) {
                return true;
            }
        }
    }

    // Check columns
    for (let c = 0; c < columns; c++) {
        for (let r = 0; r < rows-2; r++) {
            let candy1 = board[r][c];
            let candy2 = board[r+1][c];
            let candy3 = board[r+2][c];
            if (candy1.src == candy2.src && candy2.src == candy3.src && !candy1.src.includes("blank")) {
                return true;
            }
        }
    }

    return false;
}

function slideCandy() {
    for (let c = 0; c < columns; c++) {
        let ind = rows - 1;
        for (let r = rows-1; r >= 0; r--) {
            if (!board[r][c].src.includes("blank")) {
                board[ind][c].src = board[r][c].src;
                ind -= 1;
            }
        }
        for (let r = ind; r >= 0; r--) {
            board[r][c].src = "./images/blank.png";
        }
    }
}

function generateCandy() {
    for (let c = 0; c < columns; c++) {
        if (board[0][c].src.includes("blank")) {
            board[0][c].src = "./images/" + randomCandy() + ".png";
        }
    }
}

// Find valid neighbors
function findNeighborTiles(r, c) {
    neighbors = [];
    // up
    if (r-1 >= 0) {
        neighbors.push([r-1, c])
    }

    // down
    if (r+1 <= rows-1) {
        neighbors.push([r+1, c])
    }

    // left
    if (c-1 >= 0) {
        neighbors.push([r, c-1])
    }

    // right
    if (c+1 <= columns-1) {
        neighbors.push([r, c+1])
    }

    return neighbors;
}

// Find clusters of matching tiles 
function findClusters2(r, c) {
    // Start the cluster list with the tile under the mouse
    clusterlist = [[r, c]];
    // Get the type of the current tile
    currenttype = board[r][c].src;

    for (let j = 0; j < clusterlist.length; j++) {
        neighbors = findNeighborTiles(clusterlist[j][0], clusterlist[j][1]);

        for (let i = 0; i < neighbors.length; i++) {
            // Check if neighboring tile matches center tile
            if (board[neighbors[i][0]][neighbors[i][1]].src == currenttype) {
                // Check if the neighboring tile is already in the cluster list
                if (!clusterlist.map(JSON.stringify).includes(JSON.stringify(neighbors[i]))) {
                    clusterlist.push([neighbors[i][0], neighbors[i][1]])
                }
            }
        }
    }
    return clusterlist;
}

// Highlight the clusters
function highlightCluster(clusterlist) {
    for (let i = 0; i < clusterlist.length; i++) {
        let origSource = board[clusterlist[i][0]][clusterlist[i][1]].src;
        let newSource = origSource.replace("1.png", "2.png");
        board[clusterlist[i][0]][clusterlist[i][1]].src = newSource;

    }
}

// Unhighlight the clusters
function unhighlightCluster(clusterlist) {
    for (let i = 0; i < clusterlist.length; i++) {
        let origSource = board[clusterlist[i][0]][clusterlist[i][1]].src;
        let newSource = origSource.replace("2.png", "1.png");
        board[clusterlist[i][0]][clusterlist[i][1]].src = newSource;

    }
}