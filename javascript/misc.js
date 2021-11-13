//HTML Elements (jQuery Selectors)
	//Play Area
	const $playArea = $("#play-area");

	//Player Sides
	const $playerSide = $("#player-side");
	const $compSide = $("#comp-side");

	//Player Controls
	const $playerControls = $("#player-controls");
	const $logPanel = $("#log-panel");
	const $panelLog = $("#log-panel p");
	const $turnDisplay = $("#turn-display");
	
	const controlButtons = $("td");

	const $attackButton = controlButtons[0];
	const $healButton = controlButtons[1];
	const $chanceButton = controlButtons[2];
	const $trainButton = controlButtons[3];

	//Stat Display
	const $statDisplay = $("#stat-display");

//Misc Game Variables
const computerTurnLength = 7000;
const panelHideTimer = 3000;

let hidePanel = false;

//Misc Functions
function randomBetween(min, max) {	//Gets random number between min and max inclusive
	return Math.floor(Math.random() * (max - min + 1)) + min; 
}

function resetPlayers() {
	Player.resetAll();
	Computer.resetAll();
	console.log("Players reset!");
}

function gameReset() {
	resetPlayers();
	$logPanel.hide();
	$turnDisplay.html(`${Player._name}'s turn`);
	console.log("Game reset!");
}
