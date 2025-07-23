function drawCell(canvas, x, y, cellSize, char){
    let ctx = canvas.getContext("2d")
    ctx.font = Math.floor(cellSize*0.75).toString()+"px Arial";
    ctx.fillStyle = "black"
    ctx.fillText(char,(x+0.25)*cellSize,(y+0.75)*cellSize);
}

function displayGrid(grid, canvas, cellSize){
    let ctx = canvas.getContext("2d")
    //console.log("drawing grid")
    canvas.width = cellSize*grid.length
    canvas.height = cellSize*grid[0].length
    ctx.rect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle="beige";
    ctx.fill();
    ctx.strokeStyle = '#AE81DB'
    ctx.beginPath()
    for (var i=0;i<grid.length;i++) {
        for (var j=0;j<grid[0].length;j++){
            ctx.moveTo(i*cellSize, j*cellSize)
            ctx.lineTo(i*cellSize, (j+1)*cellSize)
            ctx.moveTo(i*cellSize, j*cellSize)
            ctx.lineTo((i+1)*cellSize, j*cellSize)
            drawCell(canvas, i, j, cellSize, grid[i][j])
        }
    }
    ctx.stroke();
}