function drawCell(canvas, x, y, cellSize, char){
    let ctx = canvas.getContext("2d")
    ctx.font = Math.floor(cellSize*0.75).toString()+"px Arial";
    ctx.fillStyle = "black"
    char = char == "_" ? "" : char;
    ctx.fillText(char,(x+0.25)*cellSize,(y+0.75)*cellSize);
}

function displayGrid(grid, multiGrid, multiColors, canvas, cellSize){
    let ctx = canvas.getContext("2d")
    //console.log("drawing grid")
    canvas.width = cellSize*grid.length
    canvas.height = cellSize*grid[0].length
    ctx.rect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle="beige";
    ctx.fill();
    for (var i=0;i<grid.length;i++) {
        for (var j=0;j<grid[0].length;j++){
            //if (multiGrid[i][j] > 0){
                ctx.rect(i*cellSize, j*cellSize, cellSize, cellSize)
                ctx.fillStyle = multiColors[multiGrid[i][j]]
                ctx.fill()
            //}
            ctx.strokeStyle = '#AE81DB'
            ctx.beginPath()
            ctx.moveTo(i*cellSize, j*cellSize)
            ctx.lineTo(i*cellSize, (j+1)*cellSize)
            ctx.moveTo(i*cellSize, j*cellSize)
            ctx.lineTo((i+1)*cellSize, j*cellSize)
            ctx.stroke();
            drawCell(canvas, i, j, cellSize, grid[i][j])
        }
    }
    
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

const standardColor = ["beige", "lightblue", "#639eff", "pink", "red", "green"]