function drawCell(ctx, x, y, cellSize, char, lettersValue, drawValue){
    ctx.font = Math.floor(cellSize*0.75).toString()+"px Arial";
    ctx.fillStyle = "black"
    char = char == "_" ? "" : char;
    ctx.fillText(char,(x+0.15)*cellSize,(y+0.70)*cellSize);
    if (drawValue && char.length > 0){
        ctx.font = Math.floor(cellSize*0.30).toString()+"px Arial"
        let points = lettersValue[char]
        ctx.fillText(points, (x+0.70)*cellSize, (y+0.85)*cellSize);
    }
}

function displayGrid(grid, multiGrid, multiColors, canvas, cellSize, highlightedCell, lettersValue, drawValue){
    let ctx = canvas.getContext("2d")
    ctx.lineWidth = 1;
    canvas.width = cellSize*grid.length
    canvas.height = cellSize*grid[0].length
    for (var i=0;i<grid.length;i++) {
        for (var j=0;j<grid[0].length;j++){
            ctx.beginPath()
            ctx.moveTo(i*cellSize, j*cellSize)
            ctx.lineTo(i*cellSize, (j+1)*cellSize)
            ctx.moveTo(i*cellSize, j*cellSize)
            ctx.lineTo((i+1)*cellSize, j*cellSize)
            ctx.stroke();
            ctx.rect(i*cellSize, j*cellSize, cellSize, cellSize)
            ctx.fillStyle = multiColors[multiGrid[i][j]]
            ctx.fill()
            ctx.strokeStyle = '#AE81DB'
            drawCell(ctx, i, j, cellSize, grid[i][j], lettersValue, drawValue)
        }
    }
    if (highlightedCell != null){
        ctx.lineWidth = 3;
        ctx.strokeStyle = "#000000ff"
        ctx.strokeRect(highlightedCell[0]*cellSize, highlightedCell[1]*cellSize, cellSize, cellSize)
    }
    ctx.save()
}

function updatePlayedWordsDisplay(chosenWord, score){
    var playedWords = document.getElementById("playedWords");
    playedWords.setAttribute('style', 'white-space: pre');
    playedWords.innerHTML = playedWords.innerHTML + chosenWord.length + " - " + createFrenchSpanLink(chosenWord) +"  "+ score +" Points \n"
}

function letterDragOverlay(ctx, cellSize, char, posX, posY, lettersValue, drawValue){
    ctx.restore();
    let x = Math.floor(posX/cellSize)
    let y = Math.floor(posY/cellSize)

    ctx.font = Math.floor(cellSize*0.75).toString()+"px Arial";
    ctx.fillStyle = "black"
    char = char == "_" ? "" : char;
    ctx.fillText(char,(x+0.15)*cellSize,(y+0.70)*cellSize);
    if (drawValue && char.length > 0){
        ctx.font = Math.floor(cellSize*0.30).toString()+"px Arial"
        let points = lettersValue[char]
        ctx.fillText(points, (x+0.70)*cellSize, (y+0.85)*cellSize);
    }
}

function drawScore(scoreDisplay, p1, p2){
    scoreDisplay.innerText = `Player 1 : ${p1.score} - Player 2 : ${p2.score}`;
}

function drawLetterRack(canvas, cellSize, letters, lettersValue, drawValue){
    let ctx = canvas.getContext("2d")
    ctx.lineWidth = 1;
    canvas.width = cellSize*7
    canvas.height = cellSize
    ctx.fillStyle = "beige";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = "black"
    letters.forEach((letter, index) => {
        if(letter != null){
            drawCell(ctx, index, 0, cellSize, letter, lettersValue, drawValue)
            ctx.beginPath();
            ctx.moveTo(index*cellSize, 0)
            ctx.lineTo(index*cellSize, cellSize)
            ctx.stroke()
        }
    });
}

function createFrenchSpanLink(word){
    return "<a target=\"_blank\" href=https://www.exionnaire.com/" + word.toLowerCase() + ".html\">" +word+"</a>"
}

const standardMultiGrid = [
    [4,0,0,1,0,0,0,4,0,0,0,1,0,0,4],
    [0,3,0,0,0,2,0,0,0,2,0,0,0,3,0],
    [0,0,3,0,0,0,1,0,1,0,0,0,3,0,0],
    [1,0,0,3,0,0,0,1,0,0,0,3,0,0,1],
    [0,0,0,0,3,0,0,0,0,0,3,0,0,0,0],
    [0,2,0,0,0,2,0,0,0,2,0,0,0,2,0],
    [0,0,1,0,0,0,1,0,1,0,0,0,1,0,0],
    [4,0,0,1,0,0,0,5,0,0,0,1,0,0,4],
    [0,0,1,0,0,0,1,0,1,0,0,0,1,0,0],
    [0,2,0,0,0,2,0,0,0,2,0,0,0,2,0],
    [0,0,0,0,3,0,0,0,0,0,3,0,0,0,0],
    [1,0,0,3,0,0,0,1,0,0,0,3,0,0,1],
    [0,0,3,0,0,0,1,0,1,0,0,0,3,0,0],
    [0,3,0,0,0,2,0,0,0,2,0,0,0,3,0],
    [4,0,0,1,0,0,0,4,0,0,0,1,0,0,4],
]