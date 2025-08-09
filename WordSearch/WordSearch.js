// Section DOM
document.getElementById ("inputLetters").addEventListener ("keyup", onInputLetter, false);
var OutputText = document.getElementById ("outputWords")

function dropDownFunction(a) {
    a.parentNode.getElementsByClassName("dropdown-content")[0].classList.toggle("show");
}
function dropDownFunction2() {
    document.getElementById("myDropdown").classList.toggle("show");
}
window.onclick = function(event) {
    if (!event.target.matches('.dropbtn')) {
        var dropdowns = document.getElementsByClassName("dropdown-content");
        var i;
        for (i = 0; i < dropdowns.length; i++) {
            var openDropdown = dropdowns[i];
            if (openDropdown.classList.contains('show')) 
                openDropdown.classList.remove('show');
        }
    }
}

//https://stackoverflow.com/questions/724857/how-to-find-javascript-variable-by-its-name use this or arrays

var frenchDawg = new Dawg()
frenchDawg.setup(FRENCH_DICTIONNARY)
var englishDawg = new Dawg()
var dawg = frenchDawg

function changeLanguage(lang){
    switch(lang){
        case "French":
            if (frenchDawg.nodeCount() == 0){
                frenchDawg.setup(FRENCH_DICTIONNARY)
            }
            dawg = frenchDawg
            break;
        case "English":
            if (englishDawg.nodeCount() == 0){
                englishDawg.setup(ENGLISH_DICTIONNARY)
            }
            dawg = englishDawg
            break;
        default:
            break;
    }
}

var textWidthMax = 100
var alphabet = "abcdefghijklmnopqrstuvwxyz";

function createFrenchSpanLink(word){
    return "<a target=\"_blank\" href=https://www.exionnaire.com/" + word.toLowerCase() + ".html\">" +word+" </a> "
}

function onInputLetter(e){
    let letters = e.target.value
    if (/[^a-zA-Z*]/.test(letters)){
        OutputText.innerHMTL = "Votre entrée ne doit contenir que des lettres ou des *!"
        return
    }
    if ((letters.split("*").length - 1) > 4){
        OutputText.innerHMTL = "Votre entrée ne doit pas contenir plus de 4 *!"
        return
    }
    let array = letters.toUpperCase().split("")
    let words = dawg.findWords(array)
    let sortedWords = [...words].sort((a, b) => b.length - a.length)

    OutputText.innerHTML = "<br>"


    let wordLength = 100000
    let outputString = sortedWords.length+" mots trouvés!\n"
    outputString = ""
    for (const word of sortedWords){
        let length = word.length
        if (length < wordLength){
            wordLength = length
            outputString += "<br><br>&emsp;<span style=\"word-spacing: 0;\"> Mots de "+wordLength+" lettres</span><br><br>";
        }
        outputString += createFrenchSpanLink(word) + " "
    }
    OutputText.innerHTML = outputString
}