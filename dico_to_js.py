
dico = open("words_alpha.txt", "r")
words = dico.readlines()


js_dico = open("englishDictionary.js", "a")
js_dico.write("let DICTIONNARY = [")

for word in words:
    js_dico.write("\"" + word.replace('\n', '').upper() + "\""+ ",")


js_dico.write("]")


