import "./main.css";
import { getOverlay, roundData } from "./data";

var dom = {};
document.querySelectorAll("[id]").forEach(el => dom[el.id] = el);

let currentRoundNumber = 0;
let cardActions = new Array(16).fill("none");
let selectCount = Infinity;
let coins = 50;
let minCoins = 0;
let isRoundActive = false;
let constantAdditionalCards = [];
function setCoins (value) {
	if (value < minCoins) {
		endRound("notEnoughCoins");
		value = Math.max(value, 0);
	}
	coins = value;
	dom.coins.textContent = Math.round(value);
}
function setMinCoins (value) {
	minCoins = value;
	dom.minCoins.textContent = value;
}
setCoins(50);
setMinCoins(0);

let highScoreCoins = localStorage.getItem("highScoreCoins");
if (highScoreCoins === null) {
	localStorage.setItem("highScoreCoins", 0);
	highScoreCoins = 0;
}
let highScoreRound = localStorage.getItem("highScoreRound");
if (highScoreRound === null) {
	localStorage.setItem("highScoreRound", 0);
	highScoreRound = 0;
}
highScoreCoins = parseInt(highScoreCoins);
highScoreRound = parseInt(highScoreRound);
function updateHighScores () {
	dom.highScoreCoins.textContent = highScoreCoins + ((highScoreCoins === 1) ? " coin" : " coins");
	dom.highScoreRound.textContent = highScoreRound + ((highScoreRound === 1) ? " round" : " rounds");
}
updateHighScores();

function shuffleArray(array) {
	let shuffled = array.slice();
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
	return shuffled;
}

window.initRound = function initRound (roundNumber) {
	let message = getOverlay("round" + roundNumber);
	if (message === null) {
		message = `<p>Round ${roundNumber}.</p><p>You ready? It's what you signed up for! Good luck.</p><button type="button" onclick="startRound(${roundNumber})">I got this!</button>`;
	}
	dom.overlayMessage.innerHTML = message;
	dom.gameInfo.innerHTML = "";
};

window.startRound = function startRound (roundNumber, effect) {
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
	
	if (typeof effect === "string") {
		let effectParts = effect.split(" ");
		if (effectParts[0] === "add") { // ex. add /2,+1
			constantAdditionalCards.push(...effect.slice(4).split(",")); // ["/2", "+1"]
		} else if (effectParts[0] === "do") { // ex. do /3,-10
			effect.slice(3).split(",").forEach(action => doCardAction(action)); // doCardAction("/3"), doCardAction("-10")
		}
	}
	
	let rdataOptions = data.actions.slice();
	rdataOptions.push(...constantAdditionalCards);
	rdataOptions.push("death");
	rdataOptions = rdataOptions.slice(-16);
	let options = new Array(16).fill().map((_, i) => rdataOptions[i] || getNeutral());
	cardActions = shuffleArray(options);
	
	let labels = shuffleArray(data.labels);
	dom.cards.classList.remove("roundEnded");
	document.querySelectorAll("[data-card-id]").forEach((card, i) => {
		card.querySelector(".cardFront").textContent = labels[i];
		card.title = labels[i];
		card.classList.remove("flipped", "good", "bad", "neutral", "death");
	});
	
	selectCount = data.selectCount;
	dom.gameInfo.innerHTML = `<p>You have ${selectCount} ${(selectCount === 1) ? "card" : "cards"} left to pick.</p>`;
	
	dom.overlayMessage.innerHTML = "";
	
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
		endedMessage += `<button type="button" class="btnDanger" onclick="endGame('none')">End the game here</button><button type="button" class="btnGood" onclick="initRound(${currentRoundNumber + 1})">Proceed to round ${currentRoundNumber + 1}</button>`;
	} else {
		endedMessage += `<button type="button" class="btnGood" onclick="endGame('${reason}')">End the game here</button>`;
	}
	dom.gameInfo.innerHTML = endedMessage;
	selectCount = 0;
}

window.endGame = function endGame (reason) {
	let finalCoins = Math.round(coins);
	let finalRound = currentRoundNumber;
	let message;
	
	document.body.opacity = 1;
	document.body.style.transform = "";
	
	if (reason === "death") {
		message = `<p>Despite reaching round ${finalRound} and getting ${finalCoins} ${(finalCoins === 1) ? "coin": "coins"}, you score 0 coins in 0 rounds due to death. Sorry.</p>`;
	} else if (reason === "notEnoughCoins") {
		message = `<p>You finished Six Percent Death in round ${finalRound} after running out of coins.</p>`;
	} else {
		message = `<p>You finished Six Percent Death with <b>${finalCoins} ${(finalCoins === 1) ? "coin": "coins"}</b> and passed <b>${finalRound} ${(finalRound === 1) ? "round" : "rounds"}.</b></p>`;
	}
	message += `<p>Wanna play again? Possibly do better this time?</p><button type="button" onclick="location.reload()">Absolutely</button>`;
	dom.overlayMessage.innerHTML = message;
	dom.gameInfo.innerHTML = "";
	
	if (reason !== "death") {
		let newHighCoins = Math.max(highScoreCoins, finalCoins)
		let newHighRound = Math.max(highScoreRound, finalRound);
		console.log(highScoreCoins, highScoreRound, newHighCoins, newHighRound);
		if ((highScoreCoins !== newHighCoins) || (highScoreRound !== newHighRound)) {
			highScoreCoins = newHighCoins;
			highScoreRound = newHighRound;
			localStorage.setItem("highScoreCoins", highScoreCoins);
			localStorage.setItem("highScoreRound", highScoreRound);
			updateHighScores();
			dom.newHighScore.style.display = "inline";
		}
	}
};

function getNeutral () {
	let possibilities = ["nothing", "fade", "rotateX", "rotateY", "rotateZ", "skew", "zoomOut", "gradient"];
	return possibilities[Math.floor(Math.random() * possibilities.length)];
}

function getActionDetails (action) {
	let name = "none";
	let classification = "none";
	let neutralActions = {
		"fade": "Fade [rbr:10,20]%",
		"rotateX": "Rotate [rbr:10,25] degrees (X)",
		"rotateY": "Rotate [rbr:5,10] degrees (Y)",
		"rotateZ": "Rotate 100 degrees (Z)",
		"skew": "Skew 10 degrees",
		"zoomOut": "Zoom out [rbr:5,15]%",
		"gradient": "Add random gradient color",
		"nothing": "Literally nothing :P",
	};
	
	if (/^[+-]\d+$/.test(action)) { // +1, +10, -1, -10, etc.
		name = ((action[0] === "+") ? "Gain" : "Lose") + ` ${action.slice(1)} coins`;
		classification = ((action[0] === "+") ? "good" : "bad");
	} else if (/^[x\/]\d+$/.test(action)) { // +1, +10, -1, -10, etc.
		name = ((action[0] === "x") ? "Multiply" : "Divide") + ` coins by ${action.slice(1)}`;
		classification = ((action[0] === "x") ? "good" : "bad");
	} else if (action in neutralActions) {
		name = neutralActions[action].replace(/\[rbr\:(\d+),(\d+)\]/g, (_, min, max) => {
			return roundBasedRange(parseFloat(min), parseFloat(max)).toString();
		});
		classification = "neutral";
	} else if (action === "increaseMinCoins") {
		name = "+10 minimum coin limit";
		classification = "bad";
	} else if (action === "death") {
		name = "Death.";
		classification = "death";
	} else {
		name = "Unknown action";
		classification = "neutral";
	}
	return { action, name, classification };
}

let transforms = {
	"rotateX": 0,
	"rotateY": 0,
	"rotateZ": 0,
	"skew": 0,
};
let gradient = ["#222222", "#222222"]; // default background color

function transformsToString () {
	return Object.keys(transforms).map(transform => (`${transform}(${transforms[transform]}deg)`)).join(" ");
}
document.body.style.transform = transformsToString();
document.body.style.scale = 1;

function roundBasedRange (min, max) {
	return Math.round(min + ((max - min) * Math.min(currentRoundNumber / 3, 1)));
}

function doCardAction (action) {
	console.log(action);
	if (/^[+-]\d+$/.test(action)) { // +1, +10, -1, -10, etc.
		setCoins(coins + (parseInt(action.slice(1)) * ((action[0] === "+") ? 1 : -1))); // add/remove coins
	} else if (/^[x\/]\d+$/.test(action)) { // +1, +10, -1, -10, etc.
		setCoins(coins * (parseInt(action.slice(1)) ** ((action[0] === "x") ? 1 : -1))); // multiply/divide coins
	} else if (action === "fade") {
		document.body.style.opacity = parseFloat(getComputedStyle(document.body).opacity) * (1 - roundBasedRange(0.05, 0.15));
	} else if (action === "zoomOut") {
		document.body.style.scale = parseFloat(getComputedStyle(document.body).scale) * 0.9;
	} else if (action === "rotateX") {
		transforms.rotateX += roundBasedRange(10, 25);
		if (Math.floor((transforms.rotateX % 360) / 60) % 3 === 1) transforms.rotateX += 60;
		document.body.style.transform = transformsToString();
	} else if (action === "rotateY") {
		transforms.rotateY += roundBasedRange(5, 10);
		if (Math.floor((transforms.rotateY % 360) / 60) % 3 === 1) transforms.rotateY += 60;
		document.body.style.transform = transformsToString();
	} else if (action === "rotateZ") {
		transforms.rotateZ += 100;
		if (Math.floor((transforms.rotateZ % 360) / 60) % 3 === 1) transforms.rotateZ += 60;
		document.body.style.transform = transformsToString();
	} else if (action === "skew") {
		transforms.skew += 5;
		if (Math.floor((transforms.skew % 360) / 60) % 3 === 1) transforms.skew += 60;
		document.body.style.transform = transformsToString();
	} else if (action === "gradient") {
		gradient.splice(-1, 0, "#" + Math.floor(Math.random() * 16777216).toString(16)); // add random color
		document.body.style.background = `linear-gradient(${transforms.rotateZ + 90}deg, ${gradient.join(", ")})`;
	} else if (action === "increaseMinCoins") {
		setMinCoins(minCoins + 10);
	} else if (action === "nothing") {
		// do nothing, lol
	} else if (action === "death") {
		endRound("death");
		selectCount = 0;
	} else {
		console.warn(`Could not complete unidentified action: ${action}`);
	}
	setCoins(coins);
}

document.querySelectorAll("[data-card-id]").forEach((card, index) => {
	card.innerHTML = `<div class="cardInner"><div class="cardFront"></div><div class="cardBack"></div></div>`;
	card.addEventListener("click", _ => {
		if (dom.overlayMessage.innerHTML) return; // if overlay open, you can't click cards
		if (card.classList.contains("flipped")) return; // can't flip same card twice
		let currentSelectedCount = document.querySelectorAll("[data-card-id].flipped").length;
		if (currentSelectedCount >= selectCount) return; // can't select more than allowable
		
		let { action, name, classification } = getActionDetails(cardActions[index]);
		card.classList.add(classification);
		card.querySelector(".cardBack").textContent = name;
		card.classList.add("flipped");
		doCardAction(action);
		currentSelectedCount++;
		let cardsLeft = selectCount - currentSelectedCount;
		if (currentSelectedCount >= selectCount) endRound(); // we now reached maximum selectable, end the round
		else dom.gameInfo.innerHTML = `<p>You have ${cardsLeft} ${(cardsLeft === 1) ? "card" : "cards"} left to pick.</p>`;
	});
});
