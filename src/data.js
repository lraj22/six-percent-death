// overlays.js - includes various overlay messages and actions, so they don't clutter up main.js

const overlays = {
	"round1": `<p>Round 1.</p><p>3 good cards, 3 bad cards, 1 Death. Pick 5 cards.</p><p>By the way, Death will always be one (and only one) of the cards.</p>[Begin|startRound1]`
};

export const roundData = {
	"1": {
		"labels": new Array(16).fill().map((_, i) => (i + 1)),
		"selectCount": 5,
		"actions": ["+10", "+15", "+20", "-5", "-10", "-15"],
	},
};

export function getOverlay (id) {
	if (!(id in overlays)) return null;
	let message = overlays[id];
	message = message.replace(/\[(.+)\|(.+)\]/, `<button type="button" onclick="btnAction('$2')">$1</button>`)
	return message;
}
