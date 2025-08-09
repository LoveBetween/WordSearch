function findPlacementVerticalPerpendicular(grid, x, y){
    let placement = "_"
    for(let before=1; x-before>=0 && (grid[x-before][y] != "_");before++){
        placement = grid[x-before][y].concat(placement)
    }
    for(let after=1; x+after<15 && (grid[x+after][y] != "_");after++){
        placement = placement.concat(grid[x+after][y])
    }
    return placement
}

//find the placement which connect with info:
//  - an array containing the letters and spaces up to 7 spaces
//  - the created perpendicular words
// format : 
// mainWord = ["0","A","1",...]
// secondaryWords = ["noWord",["_","S",...]
function findPlacementVertical(grid, x, y, dir){
    if(y>0 && grid[x][y-1] != "_"){
        return null
    }
    let correctPlacement = false
    let letterNb = 0
    let spaceNb = 0
    let placement = {}
    placement.x = x
    placement.y = y
    placement.direction = dir
    let mainWord = ""
    let perpendicularWords = []
    

    while(spaceNb<7 && y+spaceNb+letterNb<15){
        if (grid[x][y+spaceNb+letterNb] == "_"){
            mainWord = mainWord.concat("_")
            let perpendicularPlacement = findPlacementVerticalPerpendicular(grid, x, y+spaceNb+letterNb)
            perpendicularWords.push(perpendicularPlacement)
            if (perpendicularPlacement.length > 1){
                correctPlacement = true
            }
            spaceNb++
        }
        else{
            mainWord = mainWord.concat(grid[x][y+spaceNb+letterNb])
            perpendicularWords.push("")
            letterNb++
            correctPlacement = true
        }
    }
    if (!correctPlacement){
        return null
    }
    placement.nextLetter = "_"
    if(y+spaceNb+letterNb+1<15){
        placement.nextLetter = grid[x][y+spaceNb+letterNb+1]
    }
    placement.word = mainWord
    placement.perpendicular = perpendicularWords
    return placement
}

function findAllPlacements(grid){
    let transposedGrid = grid[0].map((_, colIndex) => grid.map(row => row[colIndex]));
    let allPlacements = []
    for(let x=0;x<15;x++){
        for(let y=0;y<15;y++){
            let placement = findPlacementVertical(grid, x, y, "vertical")
            let placement2 = findPlacementVertical(transposedGrid, y, x, "horizontal")
            if(placement != null){
                allPlacements.push(placement)
            }
            if(placement2 != null){
                placement2.x = x // since we've fed y,x instead of x,y
                placement2.y = y
                allPlacements.push(placement2)
            }
        }
    }
    return allPlacements
}

// Adding new function to dawg class
Dawg.prototype.checkValidWord = function(word){
    let node = this.root;
    for(const letter of word) {
        if (!node.edges.has(letter)) {
            return false
        }
        node = node.edges.get(letter)
    }
    if (node.final){
        return true
    }
    return false
}

Dawg.prototype.checkPlacementRec = function(placement, node, letters, newWord, words, isConnected, letterPlaced){
    if( node.final && isConnected && letterPlaced &&
        (placement.word.length<=newWord.length && placement.nextLetter == "_" 
            || placement.word[newWord.length] == "_")){ // the word shouldn't end with a letter right after it
        words.add(newWord)
    }
    if(newWord.length == placement.word.length){
        return
    }
    // Letter already there
    let nextLetter = placement.word[newWord.length]
    if(nextLetter != "_"){
        if(node.edges.has(nextLetter)){
            let child = node.edges.get(nextLetter)
            this.checkPlacementRec(placement, child, letters, newWord.concat(nextLetter), words, true, letterPlaced);
        }
    }
    else{
        // We try placing a letter
        for (let i = 0; i < letters.length; i++){
            if (node.edges.has(letters[i]) || letters[i] == "*"){
                if (placement.perpendicular[newWord.length].length < 2 ||
                this.checkValidWord(placement.perpendicular[newWord.length].replace("_", letters[i]))){
                    if (placement.perpendicular[newWord.length].length > 1){
                        isConnected = true
                    }
                    let newLetters = letters.replace(letters[i],"")
                    let child = node.edges.get(letters[i])
                    this.checkPlacementRec(placement, child, newLetters, newWord.concat(letters[i]), words, isConnected, true);
                }
            }
        }
    }
    return words
}

Dawg.prototype.checkPlacement = function(placement, letters){
    let words = new Set()
    return(this.checkPlacementRec(placement, this.root, letters, "", words, false, false))
}

var alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"//*"
var nbLettres = [9,2,2,3,15,2,2,2,8,1,1,5,3,6,6,2,1,6,6,6,6,2,1,1,1,1]//,2]
var valeurDesLettres = [1,3,3,2,1,4,2,4,1,8,10,1,2,1,1,3,8,1,1,1,1,4,10,10,10,10]//, 0]

let nbObj = {};
let valeurObj = {};

for (let i = 0; i < alphabet.length; i++) {
    let letter = alphabet[i];
    nbObj[letter] = nbLettres[i];
    valeurObj[letter] = valeurDesLettres[i];
}

var sacDeLettres = ""
for (let i=0;i<alphabet.length;i++){
    sacDeLettres+=alphabet[i].repeat(nbLettres[i])
}

function pickLetters(bag, nb){
    let letters = ""
    for(i=0;i<nb && bag.length> 0;i++){
        let rnd = Math.floor(Math.random() * bag.length)
        letters+=bag[rnd]
        bag = bag.replace(bag[rnd], "")
    }
    return {bag, letters}
}

function removeLetters(letters, word){
    for(let letter in word){
        letters = letters.replace(letter, "")
    }
    return letters
}

function placeWord(grid, placement, word){
    let placed = false
    if (placement.direction == "horizontal"){
        if(placement.x+word.length<16){
            for(let i=0; i< word.length; i++){
                grid[placement.x+i][placement.y] = word[i]
            }
            placed = true
        }
    } 
    if (placement.direction == "vertical"){
        if(placement.y+word.length<16){
            for(let i=0; i< word.length; i++){
                grid[placement.x][placement.y+i] = word[i]
            }
            placed = true
        }
    } 
    return placed
}

function calculatePlacementScore(placement, word, letterPoints, multiGrid){
    let x = placement.x
    let y = placement.y

    let multiplier = 1
    let totalScore = 0
    let wordScore = 0
    let cellType = 0

    let lettersUsed = 0
    for(let i = 0; i < word.length; i++){
        // calculating main word points:
        let currentMulti = 1
        let currentLetterPoints = 0
        if(placement.direction == "horizontal"){
            cellType = multiGrid[x+i][y]
        }
        else{
            cellType = multiGrid[x][y+i]
        }
        if(cellType < 3){
            if(placement.word[i] == "_"){
                lettersUsed++
                currentLetterPoints = letterPoints[word[i]]*(cellType+1)
            }
            else{
                currentLetterPoints = letterPoints[word[i]]
            }
        }
        else if (cellType < 5){
            currentLetterPoints = letterPoints[word[i]]
            if(placement.word[i] == "_"){
                currentMulti = cellType - 1
                multiplier = Math.max(multiplier, cellType-1)
            }
        }
        wordScore += currentLetterPoints

        // calculate perpendicular word score, bonuses can only affect placed letter
        let pp = placement.perpendicular[i]
        let ppScore = 0
        if (pp.length > 1){
            let hole = pp.indexOf("_")
            for(let j = 0;j<pp.length; j++){
                if(j == hole){
                    ppScore += currentLetterPoints
                }
                else{
                    ppScore += letterPoints[pp[j]]
                }
            }
            totalScore += ppScore * currentMulti
        }
        
    }
    totalScore = wordScore * multiplier
    totalScore = lettersUsed >= 7 ? totalScore + 50: totalScore;
    return totalScore
}

// filtering
function getAllCorrectPlacements(placements, letters){
    return placements
    .map(
        placement => [placement, Array.from(dawg.checkPlacement(placement, letters))]
    )
    .filter(
        ([_, words]) => words.length > 0
    )
}

const Filters = {
    LONGEST: (a, b) => a.word.length > b.word.length ? a : b,
    MOSTPOINTS : (a,b) => calculatePlacementScore(a.placement, a.word, valeurObj, standardMultiGrid) > 
    calculatePlacementScore(b.placement, b.word, valeurObj, standardMultiGrid) ? a : b,
    SHORTEST: (a,b) => a.word.length < b.word.length ? a : b,

}

function filterWords(placements, filter){
    return placements.flatMap(
        ([placement, words]) => Array.from(words, (word) => ({placement, word}))
    ).reduce(filter)
}