class Game{
    constructor(width, height, cellSize, p1Type, p2Type, grid, canvas){
        this.width = 15
        this.height = 15
        this.grid = grid
        if (grid == null){
            this.grid = this.initGrid(15, 15) //15,15 for now
        }
        this.turn = 1
        this.p1 = {type:p1Type, letters:"", score:0}
        this.p2 = {type:p2Type, letters:"", score:0}
        this.cellSize = cellSize
        this.highlightedCell = null
        this.canvas = canvas
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
    }
}

function inputHandler(canvas, e, controller){
    let rect = canvas.getBoundingClientRect();
    let x = e.clientX - rect.left;
    let y = e.clientY - rect.top;
    controller.getInput(x, y);
}

function initGrid(width, height){
    return Array(width).fill(null).map(() => Array(height).fill("_"))
}

function init(){
    var grid = initGrid(15, 15)
    var canvas = document.getElementById("scrabbleBoard");
    console.log(placeWord(grid, { x:4, y:8, direction:"vertical"}, "EH"))
    var dawg = new Dawg()
    dawg.setup(FRENCH_DICTIONNARY)

    var game = new Game(15, 15, 40, "player", "computer", grid, canvas);

    document.getElementById("scrabbleBoard").addEventListener('click', function(e) { 
        inputHandler(document.getElementById("scrabbleBoard"), e, game)});

    function findAllValidWords(grid, letterBag) {
        const letters = pickLetters(letterBag, 7).letters;
        const allPossiblePlacements = findAllPlacements(grid);
        //console.log("Total placements:", allPossiblePlacements.length);

        const allCorrectPlacements = getAllCorrectPlacements(allPossiblePlacements, letters)
        //console.log("Count of valid placements:", allCorrectPlacements.length);

        if (allCorrectPlacements.length === 0) {
            console.log("No valid words found for current grid and letters.");
            return false;
        }

        //const [placement, validWords] = allCorrectPlacements[Math.floor(Math.random() * allCorrectPlacements.length)];
        //const chosenWord = validWords[Math.floor(Math.random() * validWords.length)];

        const longestPlacement = filterWords(allCorrectPlacements, Filters.MOSTPOINTS)
        const placement = longestPlacement.placement
        const chosenWord = longestPlacement.word
        const score = calculatePlacementScore(placement, chosenWord, valeurObj, standardMultiGrid)
        console.log("Chosen ", placement, chosenWord, score);

        placeWord(grid, placement, chosenWord)
        
        
        var playedWords = document.getElementById("playedWords");
        playedWords.setAttribute('style', 'white-space: pre');
        playedWords.innerHTML = playedWords.innerHTML + chosenWord.length + " - " + createFrenchSpanLink(chosenWord) +"  "+ score +" Points \n"
        displayGrid(grid, standardMultiGrid, standardColor, canvas, 40, null, valeurObj, true)
        return true
    }

    var letterBag = sacDeLettres;

    const startTime2 = performance.now()
    
    for(let i=0; i< 30;i++){
        findAllValidWords(grid, letterBag)
    }
    const endTime2 = performance.now()
    console.log(`found all the possible words in ${(endTime2 - startTime2)/1000} seconds`) 
}