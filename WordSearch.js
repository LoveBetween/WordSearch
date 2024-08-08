document.getElementById ("inputLetters").addEventListener ("keyup", onInputLetter, false);
var OutputText = document.getElementById ("outputWords")
var textWidthMax = 100

var alphabet = "abcdefghijklmnopqrstuvwxyz";


function onInputLetter(e){
    let letters = e.target.value
    if (/[^a-zA-Z]/.test(letters)){
        OutputText.innerText = "Votre entrée ne doit contenir que des lettres!"
        return
    }

    let array = letters.toUpperCase().split("")
    let words = dawg.findWords(array)
    let sortedWords = [...words].sort((a, b) => b.length - a.length)

    OutputText.innerText = ""


    let wordLength = 100000
    let outputString = sortedWords.length+" mots trouvés!\n"
    for (const word of sortedWords){
        let length = word.length
        if (length < wordLength){
            wordLength = length
            outputString += "\n\nMots de "+wordLength+" lettres\n\n"
        }
        outputString += word+ " \u00a0 "
    }
    OutputText.innerText = outputString
}

var dawg = new Dawg()
dawg.setup(DICTIONNARY)

// let startTime = new Date();
// console.log(dawg.findWords(["A", "B", "A", "C"]))
// let endTime = new Date();
// console.log("Words found in " + (endTime - startTime) / 1000 + "s");