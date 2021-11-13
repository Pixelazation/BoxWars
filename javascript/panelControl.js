let panelMessages = [];
let logTimer = 8000;

let addToLog = log => panelMessages.push(log);
let clearLog = () => {
	$panelLog.html(" ");
	panelMessages = [];
}

function logPanel() {
	$logPanel.show();
	
	let i = 0;
	for (i = 0; i <= panelMessages.length; i++) {
		setTimeout(() => $panelLog.html(panelMessages.shift()), i * logTimer);
	}
	
	if (checkForGameOver()) {
		setTimeout(() => {
			gameOver();
		}, 3000);
	}
	
	setTimeout(() => {
		if (hidePanel) {$logPanel.hide()}
	}, logTimer / 2);
	
}

function quickLog(message) {
	$logPanel.show();
	$panelLog.html(message);
}
