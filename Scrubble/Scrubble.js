var mouseDown = 0;
document.body.onmousedown = function() { 
  ++mouseDown;
}
document.body.onmouseup = function() {
  --mouseDown;
}

const UIElements = {
    cellSize : 40,
    canvas : document.getElementById("scrabbleBoard"),
    rackCanvas : document.getElementById("letterRack"),
    scoreText : document.getElementById("Score"),
    playedWords : document.getElementById("playedWords"),
    draggedCanvas : document.getElementById("dragged"),
    gridColors : ["beige", "lightblue", "#639eff", "pink", "red", "green"],
    multiGrid : [
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
    ],
}

var GameInfo = {
    width : 15,
    height : 15,
    grid : initGrid(15, 15),
    p1 : {name:"p1", type:"computer", letters:"", score:0},
    p2 : {name:"p2", type:"computer", letters:"", score:0},
    highlightCell : null,
    letterBag : sacDeLettres,
    turn : 0,

}

class Game{
    constructor(_gi, _ui){
        let that = this
        _ui.canvas.addEventListener('mousedown', function(e) { 
            inputHandler(_ui.canvas, e, that)
        });
        _ui.rackCanvas.addEventListener('mousedown', function(e){
           inputHandler(_ui.rackCanvas, e, that)
        });

        document.getElementById("page1").addEventListener("pointermove", (event) => { 
            this.onPointerMove(event)
         })
        this._ui = _ui
        this._gi = _gi
        this.highlightedCell = null
        this.letterRack = null
        this.letterHeld = null
        this.draggedLetter = null
        this.draggedLetterPlaced = false
        this.wordBeingPlaced = []
    }
    initGrid(width, height){
        return Array(width).fill(null).map(() => Array(height).fill("_"))
    }
    getInput(posX, posY){
        let x = Math.floor(posX/this._ui.cellSize)
        let y = Math.floor(posY/this._ui.cellSize)
        if(x < this._gi.width && y < this._gi.height){
            let cell = [x,y]
            if(this._gi.grid[x][y].length > 1 && this.letterHeld == null){
                this.letterHeld = this._gi.grid[x][y][0]
                this._gi.grid[x][y] = "_"
            }
            this.drawGrid()
        }
    }
    highlightCell(x, y){
        this.highlightedCell = [x,y]
    }
    drawGrid(){
        displayGrid(this._gi.grid, this._ui.multiGrid, this._ui.gridColors, this._ui.canvas, this._ui.cellSize, this.highlightedCell, valeurObj, true)
        drawLetterRack(this._ui.rackCanvas, this._ui.cellSize, this.letterRack, valeurObj, true)
    }
    updateScore(player, score){
        player.score += score
        drawScore(this._ui.scoreText, this._gi.p1, this._gi.p2)
    }
    playBotTurn(player, filter){
        console.log(player)
        const allCorrectPlacements = getAllCorrectPlacements(findAllPlacements(this._gi.grid), player.letters)

        if (allCorrectPlacements.length === 0) {
            console.log("No valid words found for current grid and letters.");
            return false;
        }

        const best = filterWords(allCorrectPlacements, filter)
        const score = calculatePlacementScore(best.placement, best.word, valeurObj, this._ui.multiGrid)
        console.log("Chosen ", best.placement, best.word, score);

        this.placeWord(best.placement, best.word)

        const usedLetters = [...best.word].filter((ch, i) => best.placement.word[i] === "_").join('');
        this.removeLetters(player, usedLetters)
        this.updateScore(player, score)
        updatePlayedWordsDisplay(this._ui.playedWords, best.word, score)
        this.drawGrid()
        return true
    }
    drawLetters(player){
        if (this._gi.letterBag.length == 0){
            return false
        }
        for(let i = player.letters.length; i< 7 && this._gi.letterBag.length > 0; i++){
            let rnd = Math.floor(Math.random() * this._gi.letterBag.length)
            player.letters += this._gi.letterBag[rnd]
            this._gi.letterBag = this._gi.letterBag.slice(0, rnd) + this._gi.letterBag.slice(rnd + 1)
        }
        return true
    }
    removeLetters(player, letters) {
        const current = player.letters;
        player.letters = [...letters].reduce((res, ch) => {
            const i = res.indexOf(ch);
            return i === -1 ? res : res.slice(0, i) + res.slice(i + 1);
        }, current);
    }

    newTurn(){
        this._gi.turn++
        let player = this._gi.turn%2==1? this._gi.p1 : this._gi.p2;
        let isStuck = false
        if (player.type == "computer"){
            if(!this.playBotTurn(player, Filters.MOSTPOINTS)){
                isStuck = true
            }
        }
        else{
            //player turn
        }
        if ((this.drawLetters(player) || player.letters.length > 0) && !isStuck){
            this.newTurn()
        }
        else{
            console.log("Game Ended : player 1 has " + this._gi.p1.score +
                 " points and player 2 has " + this._gi.p2.score + " points.")
        }
    
    }
    
    placeWord(placement, word){
        let placed = false
        if (placement.direction == "horizontal"){
            if(placement.x+word.length<16){
                for(let i=0; i< word.length; i++){
                    this._gi.grid[placement.x+i][placement.y] = word[i]
                }
                placed = true
            }
        } 
        if (placement.direction == "vertical"){
            if(placement.y+word.length<16){
                for(let i=0; i< word.length; i++){
                    this._gi.grid[placement.x][placement.y+i] = word[i]
                }
                placed = true
            }
        } 
        return placed
    }
    clickLetterRack(posX){
        let x = Math.floor(posX/40)
        this.letterHeld = this.letterRack[x]
        this.letterRack[x] = null
        drawLetterRack(this._ui.rackCanvas, this._ui.cellSize, this.letterRack, valeurObj, true)
    }

    calculateDragOnEmptyBoardSpace(e){
        let canvas = this._ui.canvas
        let rect = canvas.getBoundingClientRect();
        var scale = canvas.getBoundingClientRect().width / canvas.offsetWidth;
        let x = (e.clientX - rect.left)*scale;
        let y = (e.clientY - rect.top)*scale;
        let posX = Math.floor(x/this._ui.cellSize)
        let posY = Math.floor(y/this._ui.cellSize)
        if(posX > -1 && posX < this._gi.width &&
        posY > -1 && posY < this._gi.height &&
        this._gi.grid[posX][posY] == "_"){
            return [true, posX, posY]
        }
        return [false]
    }

    onPointerMove(e){
        if (this.letterHeld != null && mouseDown){
            drawLetterRack(this._ui.draggedCanvas, this._ui.cellSize, [this.letterHeld],valeurObj, true)
            this._ui.draggedCanvas.style.position = 'absolute'
            this._ui.draggedCanvas.style.display = "block"
            
            let boardPos = this.calculateDragOnEmptyBoardSpace(e)
            if(boardPos[0])
            {
                let rect = this._ui.canvas.getBoundingClientRect();
                this._ui.draggedCanvas.style.left = rect.left+boardPos[1]*this._ui.cellSize+"px"
                this._ui.draggedCanvas.style.top = rect.top+boardPos[2]*this._ui.cellSize+"px"
            }
            else{
                this._ui.draggedCanvas.style.left = Math.floor(e.pageX-this._ui.cellSize/2)+"px"
                this._ui.draggedCanvas.style.top = Math.floor(e.pageY-this._ui.cellSize/2)+"px"
            }
        }
        else if(this.letterHeld !=null){ // on releasing the letter
            let boardPos = this.calculateDragOnEmptyBoardSpace(e)
            if(boardPos[0]){ // get on board
                this._gi.grid[boardPos[1]][boardPos[2]] = this.letterHeld + "°"
                this.drawGrid()
            }
            else{ // get on rack
                this.letterRack[this.letterRack.findIndex(e => e==null)] = this.letterHeld
                this.drawGrid()
            }
            
            this.letterHeld = null
            this._ui.draggedCanvas.style.display = "none"
        }
    }
}

function inputHandler(canvas, e, controller){
    var scale = canvas.getBoundingClientRect().width / canvas.offsetWidth;
    let rect = canvas.getBoundingClientRect();
    let x = e.clientX - rect.left;
    let y = e.clientY - rect.top;
    if(canvas.id == "scrabbleBoard"){
        controller.getInput(x * scale, y * scale);
    }
    if(canvas.id == "letterRack"){
        controller.clickLetterRack(x)
    }
}

function initGrid(width, height){
    return Array(width).fill(null).map(() => Array(height).fill("_"))
}

function init(){
    var grid = initGrid(15, 15)
    var dawg = new Dawg()
    dawg.setup(FRENCH_DICTIONNARY)

    var game = new Game(GameInfo, UIElements);
    game.letterRack = ["T","E","S","T","I","N","G"]

    game.placeWord({ x:5, y:5, direction:"vertical"}, "SALUT")
    game.drawLetters(game._gi.p1)
    game.drawLetters(game._gi.p2)
    game.newTurn()
}