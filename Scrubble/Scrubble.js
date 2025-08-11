class Game{
    constructor(width, height, cellSize, p1Type, p2Type, grid, canvas, letterRackCanvas, letterBag){
        let that = this
        document.getElementById("scrabbleBoard").addEventListener('click', function(e) { 
            inputHandler(document.getElementById("scrabbleBoard"), e, that)
        });
        this.width = 15
        this.height = 15
        this.grid = grid
        if (grid == null){
            this.grid = this.initGrid(15, 15) //15,15 for now
        }
        this.turn = 0
        this.p1 = {name:"p1", type:p1Type, letters:"", score:0}
        this.p2 = {name: "p2", type:p2Type, letters:"", score:0}
        this.cellSize = cellSize
        this.highlightedCell = null
        this.canvas = canvas
        this.letterRackCanvas = letterRackCanvas
        this.letterBag = letterBag
    }
    initGrid(width, height){
        return Array(width).fill(null).map(() => Array(height).fill("_"))
    }
    getInput(posX, posY){
        let x = Math.floor(posX/this.cellSize)
        let y = Math.floor(posY/this.cellSize)
        if(x < this.width && y < this.height){
            let cell = [x,y]
            this.highlightCell(x, y)
            this.drawGrid()
        }
    }
    highlightCell(x, y){
        this.highlightedCell = [x,y]
    }
    drawGrid(){
        displayGrid(this.grid, standardMultiGrid, standardColor, this.canvas, this.cellSize, this.highlightedCell, valeurObj, true)
        drawLetterRack(this.letterRackCanvas, 60, ["T","E","S","T","I","N","G"], valeurObj, true)
    }
    updateScore(player, score){
        player.score += score
        // displayScore
    }
    playBotTurn(player, filter){
        console.log(player)
        const allCorrectPlacements = getAllCorrectPlacements(findAllPlacements(this.grid), player.letters)

        if (allCorrectPlacements.length === 0) {
            console.log("No valid words found for current grid and letters.");
            return false;
        }

        const bestPlacement = filterWords(allCorrectPlacements, filter)
        const placement = bestPlacement.placement
        const chosenWord = bestPlacement.word
        const score = calculatePlacementScore(placement, chosenWord, valeurObj, standardMultiGrid)
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
        if (this.letterBag.length == 0){
            return false
        }
        for(let i = player.letters.length; i< 7 && this.letterBag.length > 0; i++){
            let rnd = Math.floor(Math.random() * this.letterBag.length)
            player.letters += this.letterBag[rnd]
            this.letterBag = this.letterBag.slice(0, rnd) + this.letterBag.slice(rnd + 1)
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
        this.turn++
        let player = this.turn%2==1? this.p1 : this.p2;
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
            console.log("Game Ended : player 1 has " + this.p1.score +
                 " points and player 2 has " + this.p2.score + " points.")
        }
    
    }
    
    placeWord(placement, word){
        let placed = false
        if (placement.direction == "horizontal"){
            if(placement.x+word.length<16){
                for(let i=0; i< word.length; i++){
                    this.grid[placement.x+i][placement.y] = word[i]
                }
                placed = true
            }
        } 
        if (placement.direction == "vertical"){
            if(placement.y+word.length<16){
                for(let i=0; i< word.length; i++){
                    this.grid[placement.x][placement.y+i] = word[i]
                }
                placed = true
            }
        } 
        return placed
    }
}

function inputHandler(canvas, e, controller){
    var scale = canvas.getBoundingClientRect().width / canvas.offsetWidth;
    let rect = canvas.getBoundingClientRect();
    let x = e.clientX - rect.left;
    let y = e.clientY - rect.top;
    controller.getInput(x * scale, y * scale);
}

function initGrid(width, height){
    return Array(width).fill(null).map(() => Array(height).fill("_"))
}

function init(){
    var grid = initGrid(15, 15)
    var canvas = document.getElementById("scrabbleBoard");
    var letterRackCanvas = document.getElementById("letterRack");
    var dawg = new Dawg()
    dawg.setup(FRENCH_DICTIONNARY)

    var game = new Game(15, 15, 40, "computer", "computer", grid, canvas, letterRackCanvas, sacDeLettres);
    
    game.placeWord({ x:5, y:5, direction:"vertical"}, "SALUT")
    game.drawLetters(game.p1)
    game.drawLetters(game.p2)
    game.newTurn()
}