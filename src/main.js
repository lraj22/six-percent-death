import "./main.css";
import { getOverlay, roundData } from "./data";

var dom = {};
document.querySelectorAll("[id]").forEach(el => dom[el.id] = el);

let currentRoundNumber = 0;
let cardActions = new Array(16).fill("none");
let selectCount = Infinity;
let coins = 50;
function setCoins (value) {
	coins = value;
	dom.coins.textContent = value;
}
setCoins(50);

const actions = {
	"closeOverlay": function () {
		overlayMessage.innerHTML = "";
	},
	"startRound1": function () {
		startRound(1);
	},
};

function shuffleArray(array) {
	let shuffled = array.slice();
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
	return shuffled;
}

window.btnAction = function btnAction (actionId) {
	if (actionId in actions) {
		actions[actionId]();
	}
	let possibleOverlay = getOverlay(actionId);
	if (possibleOverlay !== null) overlayMessage.innerHTML = possibleOverlay;
};

function getNeutral () {
	let possibilities = ["nothing"];
	return possibilities[Math.floor(Math.random() * possibilities.length)];
}

function startRound (roundNumber) {
	console.trace(`round ${roundNumber} started!`)
	currentRoundNumber = roundNumber;
	let rdataOptions = roundData[roundNumber].actions.slice();
	rdataOptions.push("death");
	rdataOptions = rdataOptions.slice(-16);
	let options = new Array(16).fill().map((_, i) => rdataOptions[i] || getNeutral());
	cardActions = shuffleArray(options);
	console.log(cardActions);
	let labels = shuffleArray(roundData[roundNumber].labels);
	selectCount = roundData[roundNumber].selectCount;
	document.querySelectorAll("[data-card-id]").forEach((card, i) => {
		card.textContent = labels[i];
		card.title = labels[i];
		card.classList.remove("flipped");
	});
	overlayMessage.innerHTML = "";
}

function endRound () {
	dom.cards.classList.add("roundEnded");
	dom.roundEnded.textContent = "Ended. You may not select any more cards.";
	// here, give user options to either "exit the game" and keep their earnings, or "continue to the next round"
	// maybe later, implement the ability to pick from two continue options
}

function getActionDetails (action) {
	let name = "none";
	let classification = "none";
	
	if (/^[+-]\d+$/.test(action)) { // +1, +10, -1, -10, etc.
		name = ((action[0] === "+") ? "Gain" : "Lose") + ` ${action.slice(1)} points`;
		classification = ((action[0] === "+") ? "good" : "bad");
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
		if (currentSelectedCount >= selectCount) endRound(); // we now reached maximum selectable, end the round
	});
});
