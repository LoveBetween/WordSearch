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
    letterRackCanvas : document.getElementById("letterRack"),
    scoreDisplay : document.getElementById("Score"),
    standardColor : ["beige", "lightblue", "#639eff", "pink", "red", "green"],
    standarMultiGrid : [
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
        _ui.canvas.addEventListener('click', function(e) { 
            inputHandler(_ui.canvas, e, that)
        });
        _ui.letterRackCanvas.addEventListener('click', function(e){
           inputHandler(_ui.letterRackCanvas, e, that)
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
    }
    initGrid(width, height){
        return Array(width).fill(null).map(() => Array(height).fill("_"))
    }
    getInput(posX, posY){
        let x = Math.floor(posX/this._ui.cellSize)
        let y = Math.floor(posY/this._ui.cellSize)
        if(x < this._gi.width && y < this._gi.height){
            let cell = [x,y]
            this.highlightCell(x, y)
            this.drawGrid()
        }
    }
    highlightCell(x, y){
        this.highlightedCell = [x,y]
    }
    drawGrid(){
        displayGrid(this._gi.grid, this._ui.standarMultiGrid, this._ui.standardColor, this._ui.canvas, this._ui.cellSize, this.highlightedCell, valeurObj, true)
        drawLetterRack(this._ui.letterRackCanvas, this._ui.cellSize, this.letterRack, valeurObj, true)
    }
    updateScore(player, score){
        player.score += score
        drawScore(this._ui.scoreDisplay, this._gi.p1, this._gi.p2)
    }
    playBotTurn(player, filter){
        console.log(player)
        const allCorrectPlacements = getAllCorrectPlacements(findAllPlacements(this._gi.grid), player.letters)

        if (allCorrectPlacements.length === 0) {
            console.log("No valid words found for current grid and letters.");
            return false;
        }

        const bestPlacement = filterWords(allCorrectPlacements, filter)
        const placement = bestPlacement.placement
        const chosenWord = bestPlacement.word
        const score = calculatePlacementScore(placement, chosenWord, valeurObj, this._ui.standarMultiGrid)
        console.log("Chosen ", placement, chosenWord, score);

        this.placeWord(placement, chosenWord)

        const usedLetters = [...chosenWord].filter((ch, i) => placement.word[i] === "_").join('');
        this.removeLetters(player, usedLetters)
        this.updateScore(player, score)
        updatePlayedWordsDisplay(chosenWord, score)
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
        console.log(player)
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
        drawLetterRack(this._ui.letterRackCanvas, this._ui.cellSize, this.letterRack, valeurObj, true)
    }

    onPointerMove(e){
        
        if (this.letterHeld != null && mouseDown){
            console.log(e.pageX, e.pageY)
            let el = document.getElementById("dragged")
            el.style.position = 'absolute'
            el.style.left = e.pageX+"px"
            el.style.top = e.pageY+"px"
            el.innerText = this.letterHeld
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