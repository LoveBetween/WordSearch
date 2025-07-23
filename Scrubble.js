function initGrid(width, height){
    return Array(width).fill(null).map(() => Array(height).fill("_"))
}

function placeWord(grid, x, y, direction, word){
    let placed = false
    if (direction == "horizontal"){
        if(x+word.length<15){
            for(let i=0; i< word.length; i++){
                grid[x+i][y] = word[i]
            }
            placed = true
        }
    } 
    if (direction == "vertical"){
        if(y+word.length<15){
            for(let i=0; i< word.length; i++){
                grid[x][y+i] = word[i]
            }
            placed = true
        }
    } 
    return placed
}

function init(){
    var grid = initGrid(15, 15)

    console.log(placeWord(grid, 4, 8, "vertical", "EH"))
    var dawg = new Dawg()
    dawg.setup(FRENCH_DICTIONNARY)

    function findAllValidWords(grid, letterBag) {
        const letters = pickLetters(letterBag, 7).letters;
        const allPossiblePlacements = findAllPlacements(grid);
        //console.log("Total placements:", allPossiblePlacements.length);

        const allCorrectPlacements = allPossiblePlacements
            .map(placement => [placement, Array.from(dawg.checkPlacement(placement, letters))])
            .filter(([_, words]) => words.length > 0);

        //console.log("Valid placements with words:", allCorrectPlacements);
        //console.log("Count of valid placements:", allCorrectPlacements.length);

        if (allCorrectPlacements.length === 0) {
            console.log("No valid words found for current grid and letters.");
            return false;
        }

        const [placement, validWords] = allCorrectPlacements[Math.floor(Math.random() * allCorrectPlacements.length)];
        const chosenWord = validWords[Math.floor(Math.random() * validWords.length)];

        console.log("Chosen placement and word:", placement, chosenWord);

        placeWord(grid, placement.x, placement.y, placement.direction, chosenWord)
        var canvas = document.getElementById("viewport");
        displayGrid(grid, canvas, 20)
        return true
    }

    var letterBag = sacDeLettres;

    const startTime2 = performance.now()
    
    for(let i=0; i< 200;i++){
        findAllValidWords(grid, letterBag)
    }
    

    // var testPlacement = {}
    // testPlacement.x = 5
    // testPlacement.y = 3
    // testPlacement.direction = "vertical"
    // testPlacement.word = "_______"
    // testPlacement.perpendicular = ["_", "_", "_", "_", "_", "EUE_", "H_"]
    // console.log(dawg.checkPlacement(testPlacement, "SORTIES"))
    // var canvas = document.getElementById("viewport");
    // displayGrid(grid, canvas, 20)


    const endTime2 = performance.now()
    console.log(`found all the possible words in ${(endTime2 - startTime2)/1000} milliseconds`)

    //display

    
    
}