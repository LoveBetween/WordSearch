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