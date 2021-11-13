const $startMenu = $("#start");
const $startButton = $("#start button");
const $nameInput = $("#start input");
const $playerName = $playerSide.find(".player-name");

function startGame() {
	changePlayerName();
	gameReset();
	$startMenu.fadeOut(1000);
}

function gameOver() {
	let winner = checkWinner();
	
	quickLog(`Game Over! ${winner._name} won!`);
	setTimeout(() => $startMenu.fadeIn(1000), 3000);
}

function checkForGameOver() {
	if (Player._health === 0 || Computer._health === 0) {
		return true;
	} else {
		return false;
	}
}

function checkWinner() {
	if (Player._health === 0) {
		return Computer;
		
	} else if (Computer._health === 0) {
		return Player;
	}
}

function changePlayerName() {
	let input = $nameInput.val();
	
	if (input.trim === "" || input === "Enter Name") {
		input = "Player";
	}
	
	if (input.length > 12) {
		input = input.slice(0, 12);
	}
	
	$playerName.html(input);
	Player._name = input;
	$turnDisplay.html(`${input}'s turn`);
	
	console.log(`Name changed to ${input}`);
}

$startButton.click(startGame);
$nameInput.blur(changePlayerName);