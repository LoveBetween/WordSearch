// Original code by Steve Hanov in python
// Link to the article http://stevehanov.ca/blog/index.php?id=115 
class DawgNode {
	NextId = 0;

	constructor() {
		this.id = DawgNode.NextId;
		DawgNode.NextId += 1;
		this.final = false;
		this.edges = new Map();

		this.count = 0;
	}
	numReachable() {
		if (this.count) return this.count;

		let count = 0;
		if (this.final) count += 1;
		for (const [label, node] of this.edges.entries()) {
			count += node.numReachable();
		}
		this.count = count;
		return count;
	}
}

class Dawg {

	constructor() {
		this.previousWord = "";
		this.root = new DawgNode;

		this.uncheckedNodes = [];
		this.minimizedNodes = new Map();
		this.data = [];
	}

	insert(word, data) {
		if (word <= this.previousWord) {
			console.error("Error: Words must be inserted in alphabetical order.");
		}

		let commonPrefix = 0;
		let min = Math.min(word.length, this.previousWord.length);
		for (let i = 0; i < min; i++) {
			if (word[i] != this.previousWord[i]) break;
			commonPrefix += 1;
		}

		this.minimize(commonPrefix);

		this.data.push(data);

		let node = null
		if (this.uncheckedNodes.length == 0) {
			node = this.root;
		}
		else {
			node = this.uncheckedNodes[this.uncheckedNodes.length - 1][2];
		}
		for (const letter of word.slice(commonPrefix)) {
			let nextNode = new DawgNode();

			node.edges.set(letter, nextNode);
			this.uncheckedNodes.push([node, letter, nextNode]);
			node = nextNode;
		}
		node.final = true;
		this.previousWord = word;
	}

	finish() {
		this.minimize(0);
		this.root.numReachable();
	}

	minimize(downTo) {
		for (let i = this.uncheckedNodes.length - 1; i > downTo - 1; i--) {
			let [parent, letter, child] = this.uncheckedNodes[i];
			if (this.minimizedNodes.has(child)) {
				parent.edges.set(letter, this.minimizedNodes.get(child));
			}
			else {
				this.minimizedNodes.set(child, child);
			}
			this.uncheckedNodes.pop();
		}
	}

	nodeCount() {
		return this.minimizedNodes.size;
	}

	edgeCount() {
		let count = 0
		for (const [label, node] of this.minimizedNodes.entries()) {
			count += node.edges.size
		}
		return count
	}

	lookup(word) {
		let node = this.root;
		let skipped = 0;
		for (const letter of word) {
			if (!node.edges.has(letter)) {
				for (const [label, child] of new Map([...node.edges.entries()].sort())) {
					if (label == letter) {
						if (node.final) {
							skipped += 1;
							node = child;
							break;
						}
						skipped += child.count;
					}
				}
			}
		}
		if (node.final) {
			return this.data[skipped]
		}
	}

	findWords(letters) {
		let words = new Set();
		return dawg.findWordsRec(this.root, letters, "", words);
	}

	findWordsRec(node, letters, word, words) {
		if (node.final) {
			words.add(word);
		}
		for (const [label, child] of node.edges.entries()) {
			for (let i = 0; i < letters.length; i++) {
				if (label == letters[i]) {
					let newLetters = letters.slice();
					newLetters.splice(i, 1);
					dawg.findWordsRec(child, newLetters, word.concat(letters[i]), words);
				}
			}
		}
		return words
	}

	setup(words) {
		let startTime = new Date();

		let count = 0;
		for (const word of words) {

			this.insert(word, count);
			count += 1;
		}
		this.finish();

		let endTime = new Date();
		console.log("Dictionary loaded in " + (endTime - startTime) / 1000 + "s");

		console.log("nodecount : " + this.nodeCount());
		console.log("edgecount : " + this.edgeCount());
	}
}


