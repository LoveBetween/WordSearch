class Game{
    constructor(width, height, cellSize, p1Type, p2Type){
        this.width = 15
        this.height = 15
        this.grid = this.initGrid(15, 15) //15,15 for now
        this.turn = 1
        this.p1 = {type:p1Type, letters:"", score:0}
        this.p2 = {type:p2Type, letters:"", score:0}
        this.cellSize = cellSize
    }
    initGrid(width, height){
        return Array(width).fill(null).map(() => Array(height).fill("_"))
    }
    getInput(posX, posY){
        let x = Math.floor(posX/this.cellSize)
        let y = Math.floor(posY/this.cellSize)
        if(x < this.width && y < this.height){
            let cell = [x,y]
        }
    }
}

function initGrid(width, height){
    return Array(width).fill(null).map(() => Array(height).fill("_"))
}

function init(){
    var grid = initGrid(15, 15)

    console.log(placeWord(grid, { x:4, y:8, direction:"vertical"}, "EH"))
    var dawg = new Dawg()
    dawg.setup(FRENCH_DICTIONNARY)

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

        const longestPlacement = getLongestWordPlacement(allCorrectPlacements)
        const placement = longestPlacement.placement
        const chosenWord = longestPlacement.word
        console.log("Chosen ", placement, chosenWord);

        placeWord(grid, placement, chosenWord)
        var canvas = document.getElementById("viewport");
        var playedWords = document.getElementById("playedWords");
        playedWords.setAttribute('style', 'white-space: pre');
        playedWords.innerHTML = playedWords.innerHTML + chosenWord.length + " - " + createFrenchSpanLink(chosenWord) + "\n"
        displayGrid(grid, standardMultiGrid, standardColor, canvas, 30)
        return true
    }

    var letterBag = sacDeLettres;

    const startTime2 = performance.now()
    
    for(let i=0; i< 30;i++){
        findAllValidWords(grid, letterBag)
    }
    const endTime2 = performance.now()
    console.log(`found all the possible words in ${(endTime2 - startTime2)/1000} milliseconds`) 
}