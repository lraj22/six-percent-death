import "./main.css";
import { getOverlay, roundData } from "./data";

var dom = {};
document.querySelectorAll("[id]").forEach(el => dom[el.id] = el);

let currentRoundNumber = 0;
let cardActions = new Array(16).fill("none");
let selectCount = Infinity;
let coins = 50;
let isRoundActive = false;
function setCoins (value) {
	if (value < 0) {
		endRound("notEnoughCoins");
		value = 0;
	}
	coins = value;
	dom.coins.textContent = Math.round(value);
}
setCoins(50);

function shuffleArray(array) {
	let shuffled = array.slice();
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
	return shuffled;
}

function getNeutral () {
	// TODO: add more neutral stuff (font size change, zoom out, visual tilt, unnecessary gradients, literally anything)
	let possibilities = ["nothing"];
	return possibilities[Math.floor(Math.random() * possibilities.length)];
}

window.initRound = function initRound (roundNumber) {
	let message = getOverlay("round" + roundNumber);
	if (message === null) {
		message = `<p>Round ${roundNumber}.</p><p>You ready? It's what you signed up for! Good luck.</p><button type="button" onclick="startRound(${roundNumber})">I got this!</button>`;
	}
	overlayMessage.innerHTML = message;
	dom.gameInfo.innerHTML = "";
};

window.startRound = function startRound (roundNumber) {
	let data = {};
	if (roundNumber in roundData) {
		data = roundData[roundNumber];
	} else {
		data = {
			"labels": ["people", "history", "way", "art", "world", "information", "map", "two", "family", "government", "health", "system", "computer", "meat", "year", "thanks", "music", "person", "reading", "method", "data", "food", "understanding", "theory", "law", "bird", "literature", "problem", "software", "control", "knowledge", "power", "ability", "economics", "love", "internet", "television", "science", "library", "nature", "fact", "product", "idea", "temperature", "investment", "area", "society", "time", "work", "film", "water", "money", "example", "while", "business", "study", "game", "life", "form", "air", "day", "place", "number", "part", "field", "fish", "back", "process", "heat", "hand", "experience", "job", "book", "end", "point", "type", "home", "economy", "value", "body", "market", "guide", "interest", "state", "radio", "course", "company", "price", "size", "card", "list", "mind", "trade", "line", "care", "group", "risk", "word", "fat", "force", "key", "light", "training", "name", "school", "top", "amount", "level", "order", "practice", "research", "sense", "service", "piece"], // supposedly some of the most common nouns in English, 16 will be picked at random
			"selectCount": Math.floor(Math.random() * 3) + 3,
			"actions": ["-10", "-30", "-50", "+10", "+30", "+50", "/2", "x2", "/4", "x4"],
		};
	}
	
	console.trace(`round ${roundNumber} started!`);
	currentRoundNumber = roundNumber;
	
	let rdataOptions = data.actions.slice();
	rdataOptions.push("death");
	rdataOptions = rdataOptions.slice(-16);
	let options = new Array(16).fill().map((_, i) => rdataOptions[i] || getNeutral());
	cardActions = shuffleArray(options);
	
	let labels = shuffleArray(data.labels);
	dom.cards.classList.remove("roundEnded");
	document.querySelectorAll("[data-card-id]").forEach((card, i) => {
		card.textContent = labels[i];
		card.title = labels[i];
		card.classList.remove("flipped", "good", "bad", "neutral", "death");
	});
	
	selectCount = data.selectCount;
	dom.gameInfo.innerHTML = `<p>You have ${selectCount} ${(selectCount === 1) ? "card" : "cards"} left to pick.</p>`;
	
	overlayMessage.innerHTML = "";
	
	isRoundActive = true;
}

function endRound (reason) {
	if (!reason) reason = "none";
	if (!isRoundActive) return;
	isRoundActive = false;
	dom.cards.classList.add("roundEnded");
	const reasons = {
		"none": "",
		"death": "<b>You died. </b>",
		"notEnoughCoins": "<b>You ran out of coins. </b>",
	}
	let endedMessage = `<p>${reasons[reason]}Round over. You may not select any more cards.</p>`;
	
	if (reason === "none") {
		endedMessage += `<button type="button" class="btnDanger" onclick="endGame()">End the game here</button><button type="button" class="btnGood" onclick="initRound(${currentRoundNumber + 1})">Proceed to round ${currentRoundNumber + 1}</button>`;
	} else {
		endedMessage += `<button type="button" class="btnGood" onclick="endGame()">End the game here</button>`;
	}
	dom.gameInfo.innerHTML = endedMessage;
	selectCount = 0;
	// TODO: implement the ability to pick from two continue options
}

window.endGame = function endGame () {
	// TODO: add game end
	// TODO: high score?
	alert("Not implemented yet!");
};

function getActionDetails (action) {
	let name = "none";
	let classification = "none";
	
	if (/^[+-]\d+$/.test(action)) { // +1, +10, -1, -10, etc.
		name = ((action[0] === "+") ? "Gain" : "Lose") + ` ${action.slice(1)} coins`;
		classification = ((action[0] === "+") ? "good" : "bad");
	} else if (/^[x\/]\d+$/.test(action)) { // +1, +10, -1, -10, etc.
		name = ((action[0] === "x") ? "Multiply" : "Divide") + ` coins by ${action.slice(1)}`;
		classification = ((action[0] === "x") ? "good" : "bad");
	} else if (action === "nothing") {
		name = "Literally nothing :P";
		classification = "neutral";
	} else if (action === "death") {
		name = "Death.";
		classification = "death";
	} else {
		name = "Unknown action";
		classification = "neutral";
	}
	return { action, name, classification };
}

function doCardAction (action) {
	console.log(action);
	// TODO: add more actions!!
	if (/^[+-]\d+$/.test(action)) { // +1, +10, -1, -10, etc.
		setCoins(coins + (parseInt(action.slice(1)) * ((action[0] === "+") ? 1 : -1))); // add/remove coins based on
	} else if (/^[x\/]\d+$/.test(action)) { // +1, +10, -1, -10, etc.
		setCoins(coins * (parseInt(action.slice(1)) ** ((action[0] === "x") ? 1 : -1))); // add/remove coins based on
	} else if (action === "nothing") {
		// do nothing, lol
	} else if (action === "death") {
		endRound("death");
		selectCount = 0;
	} else {
		console.warn(`Could not complete unidentified action: ${action}`);
	}
}

document.querySelectorAll("[data-card-id]").forEach((card, index) => {
	card.addEventListener("click", _ => {
		if (overlayMessage.innerHTML) return; // if overlay open, you can't click cards
		if (card.classList.contains("flipped")) return; // can't flip same card twice
		let currentSelectedCount = document.querySelectorAll("[data-card-id].flipped").length;
		if (currentSelectedCount >= selectCount) return; // can't select more than allowable
		
		let { action, name, classification } = getActionDetails(cardActions[index]);
		card.classList.add("flipped");
		card.classList.add(classification);
		card.textContent = name;
		doCardAction(action);
		currentSelectedCount++;
		let cardsLeft = selectCount - currentSelectedCount;
		if (currentSelectedCount >= selectCount) endRound(); // we now reached maximum selectable, end the round
		else dom.gameInfo.innerHTML = `<p>You have ${cardsLeft} ${(cardsLeft === 1) ? "card" : "cards"} left to pick.</p>`;
	});
});
