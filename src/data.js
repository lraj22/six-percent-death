// overlays.js - includes various overlay messages and actions, so they don't clutter up main.js

const overlays = {
	"round1": `<p>Round 1.</p><p>3 good cards, 3 bad cards, 1 Death. Pick 5 cards.</p><p>By the way, Death will always be one (and only one) of the cards.</p>[Begin|startRound(1)]`,
	"round2": `<p>Round 2.</p><p>Cards will have random text on them, you can choose whichever ones you like... :]</p><p>Introducing more powerful cards, for example double coins and half coins! 3 good, 3 bad. 1 Death as always. Pick 3.</p>[Begin|startRound(2)]`,
};

export const roundData = {
	"1": {
		"labels": new Array(16).fill().map((_, i) => (i + 1)),
		"selectCount": 5,
		"actions": ["+10", "+15", "+20", "-5", "-10", "-15"],
	},
	"2": {
		"labels": ["@Olive", "@One For Freedom", "@Lakshya Raj", "@atomtables", "@sebastian", "@Rino", "@Azzy", "@PianoMan0", "@nikoentity", "@Mustafa", "@Anti-Bailey", "@julia do", "@i-am-unknown-81514525", "@Hannah", "@jollyroger182", "@kzlpndx"],
		"selectCount": 3,
		"actions": ["-10", "-30", "+10", "+30", "/2", "x2"],
	},
};

export function getOverlay (id) {
	if (!(id in overlays)) return null;
	let message = overlays[id];
	message = message.replace(/\[(.+)\|(.+)\]/, `<button type="button" onclick="$2">$1</button>`)
	return message;
}
