// overlays.js - includes various overlay messages and actions, so they don't clutter up main.js

const overlays = {
	"round1": `<p>Round 1.</p><p>3 good cards, 3 bad cards, 1 Death. Pick 5 cards.</p><p>By the way, Death will always be one (and only one) of the cards.</p>[Begin|startRound(1)]`,
	"round2": `<p>Round 2.</p><p>Cards will have random text on them, you can choose whichever ones you like... :]</p><p>Introducing more powerful cards, for example double coins and half coins! 3 good, 3 bad. 1 Death as always. Pick 3.</p>[Begin|startRound(2)]`,
	"round3": `<p>Round 3.</p><p>Cards can have special powers. There's a card that will make you lose if you drop below 10 coins. Be careful!</p><p>Pick 3.</p>[Begin|startRound(3)]`,
	"round4": `<p>Round 4.</p><p>You have a choice. You can either divide your coins by 3, or add a card to every future round that halves your coins. Up to you.</p>[Divide by 3|startRound(4, 'do /3')][Add halving card|startRound(4, 'add /2')]`,
};

export const roundData = {
	"1": {
		"labels": new Array(16).fill().map((_, i) => (i + 1)),
		"selectCount": 5,
		"actions": ["+10", "+15", "+20", "-5", "-10", "-15"],
	},
	"2": {
		"labels": ["JavaScript", "HTML/CSS", "SQL", "Python", "Bash/Shell", "TypeScript", "Java", "C#", "C++", "PowerShell", "C", "PHP", "Go", "Rust", "Kotlin", "Lua"],
		"selectCount": 3,
		"actions": ["-10", "-30", "+10", "+30", "/2", "x2"],
	},
	"3": {
		"labels": ["@Olive", "@One For Freedom", "@Lakshya Raj", "@atomtables", "@sebastian", "@Rino", "@Azzy", "@PianoMan0", "@nikoentity", "@Mustafa", "@Anti-Bailey", "@julia do", "@i-am-unknown-81514525", "@Hannah", "@jollyroger182", "@kzlpndx"],
		"selectCount": 3,
		"actions": ["increaseMinCoins", "-10", "-30", "+30", "+50", "x2", "/3"],
	},
};

export function getOverlay (id) {
	if (!(id in overlays)) return null;
	let message = overlays[id];
	message = message.replace(/\[(.+?)\|(.+?)\]/g, `<button type="button" onclick="$2">$1</button>`);
	return message;
}
