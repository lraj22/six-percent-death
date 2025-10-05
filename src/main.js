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

function startRound (roundNumber) {
	console.trace(`round ${roundNumber} started!`)
	currentRoundNumber = roundNumber;
	let rdataOptions = roundData[roundNumber].actions.slice();
	rdataOptions.push("death");
	rdataOptions = rdataOptions.slice(-16);
	let options = new Array(16).fill().map((_, i) => rdataOptions[i] || "neutral");
	cardActions = shuffleArray(options);
	let labels = shuffleArray(roundData[roundNumber].labels);
	selectCount = roundData[roundNumber].selectCount;
	document.querySelectorAll("[data-card-id]").forEach((card, i) => {
		card.textContent = labels[i];
		card.classList.remove("flipped");
	});
	overlayMessage.innerHTML = "";
}

function doCardAction (action) {
	console.log(action);
}

document.querySelectorAll("[data-card-id]").forEach((card, index) => {
	index; // 1 - 16, not 0 - 15
	card.addEventListener("click", _ => {
		if (overlayMessage.innerHTML) return; // if overlay open, you can't click cards
		if (card.classList.contains("flipped")) return; // can't flip same card twice
		card.classList.add("flipped");
		doCardAction(cardActions[index]);
	});
});
