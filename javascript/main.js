//Class
class Character {
	constructor(name, characterSide) {
		//HTML Elements
		this._name = name;
		this._characterSide = characterSide;
		this._box = characterSide.find(".box");
		this._statusIndicator = characterSide.find(".status");
		
		this._healParticle = characterSide.find(".heal-particle");
		this._chanceMark = characterSide.find(".chance-mark");
		
		this._horizontalOrigin = parseFloat(this._box.css("left"));
		this._verticalOrigin = parseFloat(this._box.css("top"));
		
		//Health Bar
		this._healthBar = characterSide.find(".health-bar");
		this._healthNum = characterSide.find(".hp-number")
		this._remainingHealth = this._healthBar.find(".health");
		
		//Stats
		this._health = 100;
		
		this._strength = 8;
		this._minDamage = this._strength - 2;
		this._maxDamage = this._strength + 2;
		
		this._luck = 5;
		
		this._agility = 5;
		
		this._healPower = 6;
		this._minHeal = this._healPower - 2;
		this._maxHeal = this._healPower + 2;
		
		//Status Effects
		this._isPoisoned = false;
		this._poisonRemaining = 0;
		
		
	}
	
	//Getters and Setters (For Stats)
	get directionFactor() {		//Determines whether box goes left or right
		if (this._characterSide === $playerSide) {
			return 1;
		} else {
			return -1;
		}
	}
	
	get health() {
		return `Health: ${this._health}`;
	} 
	
	set health(newHealth) {
		if (newHealth <= 0) {
			this._health = 0;
			
		} else if (newHealth >= 100){
			this._health = 100;
			
		} else {
			this._health = newHealth;
		}
		
		this.updateHealthBar();
	}
	
	get strength() {
		return `Strength: ${this._strength}`;
	}
	
	set strength(newStrength) {
		this._minDamage = newStrength - 2;
		this._maxDamage = newStrength + 2;
		this._strength = newStrength;
	}
	
	get luck() {
		return `Luck: ${this._luck}`;
	}
	
	set luck(newLuck) {
		if (newLuck <= 0) {
			this._luck = 0;
			
		} else if (newLuck >= 10){
			this._luck = 10;
			
		} else {
			this._luck = newLuck;
		}
	}
	
	get agility() {
		return `Agility: ${this._agility}`;
	}
	
	set agility(newAgility) {
		if (newAgility <= 1) {
			this._agility = 1;
			
		} else if (newAgility >= 10){
			this._agility = 10;
			
		} else {
			this._agility = newAgility;
		}
	}
	
	get healPower() {
		return `Heal Power: ${this._healPower}`;
	}
	
	set healPower(newHealPower) {
		this._minHeal = newHealPower - 2;
		this._maxHeal = newHealPower + 2;
		this._healPower = newHealPower;
	}
	
	get stats() {
		return this._name + "'s Stats <br><br>" + this.strength + "<br>" + this.agility + "<br>" +
			this.luck + "<br>" + this.healPower;
	}
	
	get poisonRemaining() {
		return this._poisonRemaining;
	}
	
	set poisonRemaining(num) {
		this._poisonRemaining = num;
	}
	
	//Core Methods
	updateHealthBar() {
		this._remainingHealth.animate({width: this._health + "%"}, 1500); //Animates health bar
		setTimeout(() => this._healthNum.html(this._health), 1500); //Updates number on health bar
	}
	
	removeHealth(damage) {
		this.health = this._health - damage;
	}
	
	restoreHealth(healthRestored) {
		this.health = this._health + healthRestored;
	}
	
	doDamage() {
		let damageDealt = randomBetween(this._minDamage, this._maxDamage); //Gets random damage value
		
		this._opponent.removeHealth(damageDealt);	//Deals damage to opponent
		addToLog(`${this._name} dealt ${damageDealt} damage!`)
	}
	
	//Animations
	attackAnimation() {
		let originalPos = this._horizontalOrigin;
		
		this._box.animate({"left": `${originalPos + this.directionFactor * 640}px`}, 250);
		setTimeout(() => this._box.animate({"left": `${originalPos}px`}, 800), 400);
	}
	
	dodgeAnimation() {
		let orginalPos = this._verticalOrigin;
		
		this._box.animate({"top": `${orginalPos - 100}px`}, 200);
		setTimeout(() => this._box.animate({"top": `${orginalPos}px`}, 200), 500);
	}
	
	healAnimation() {
		for (let i = 0; i < 6; i++) {
			this._healParticle.fadeToggle(800);
		}
	}

	trainAnimation() {
		let originalPosX = this._horizontalOrigin;
		let originalPosY = this._verticalOrigin;
		
		for (let i = 0; i < 2; i++) {
			this._box.animate({"left": `${originalPosX + this.directionFactor * 100}px`}, 800);
			this._box.animate({"left": `${originalPosX + this.directionFactor * -100}px`}, 800);
		}
		
		this._box.animate({"left": `${originalPosX}px`}, 1000);
	}
	
	chanceAnimation() {
		for (let i = 0; i < 4; i++) {
			this._chanceMark.fadeToggle(800);
		}
	}
	
	//Chance Sub-Functions/Methods
	selectTarget() {
		let index = randomBetween(0, this._luck); // 8/11 to choose self with max luck
		
		if (index > 2) {
			return this;
		} else {
			return this._opponent;
		}
	}
	
	doPoisonDamage() {
		if (this._poisonRemaining <= 0) {
			this.removePoison();
			
		} else {
			let damage = randomBetween(4, 6);
			this.health = this._health - damage;
			this._poisonRemaining--;
		
			addToLog(`${this._name} took ${damage} damage due to poison!`);
			
		}
	}
	
	removePoison() {
		this._isPoisoned = false;
		this.poisonRemaining = 0;
		this._statusIndicator.hide();
		addToLog(`${this._name}'s poison wore off!`)
	}
	
	//Move Sets
	attack() {
		quickLog(`${this._name} attacked!`);
		
		if (randomBetween(1, 15) < this._opponent._agility) {
			this.attackAnimation();
			this._opponent.dodgeAnimation();
			addToLog(`${this._opponent._name} dodged!`);
			
		} else {
			this.attackAnimation();
			setTimeout(() => this.doDamage(), 200);
		}
		this.endTurn();
	}
	
	heal() {
		quickLog(`${this._name} healed!`);
		this.healAnimation();
		
		let healthHealed = randomBetween(this._minHeal, this._maxHeal);	//Gets random heal value
		this.restoreHealth(healthHealed);
		
		if (this._health === 100) {
			addToLog(`${this._name} is at full health!`);
		} else {
			addToLog(`${this._name} restored ${healthHealed}hp!`);
		}
		this.endTurn();
	}
	
	chance() {
		let targetIfGood = this.selectTarget();
		let targetIfBad = targetIfGood._opponent;
		
		let index = randomBetween(1, 9);
		
		quickLog(`${this._name} is taking a chance!`);
		this.chanceAnimation();
		
		switch (index) {
			case 1: //Poison Target
				targetIfBad._isPoisoned = true;
				targetIfBad.poisonRemaining = 3;
				targetIfBad._statusIndicator.show();
				addToLog(`${targetIfBad._name} got poisoned!`);
				break;
				
			case 2: //Cut off target health
				let damage = Math.ceil(targetIfBad._health / 2);
				targetIfBad.removeHealth(damage);
				addToLog(`${targetIfBad._name}'s health got sliced in half!`);
				break;
				
			case 3: //Reset Stats
				targetIfBad.resetStats();
				addToLog(`${targetIfBad._name}'s stats got reset!`)
				break;
				
			case 4: //Heal for half current health
				targetIfGood.health = Math.floor(targetIfGood._health + targetIfGood._health / 2);
				addToLog(`${targetIfGood._name}'s health increased by 50%!`);
				break;
				
			case 5: //Incerase all stats by 1
				targetIfGood.strength += 1;
				targetIfGood.luck += 1;
				targetIfGood.agility += 1;
				targetIfGood.healPower += 1;
				addToLog(`${targetIfGood._name}'s stats increased by 1!`);
				break;
				
			case 6: //Lower Stats by 1
				targetIfBad.strength -= 1;
				targetIfBad.luck -= 1;
				targetIfBad.agility -= 1;
				targetIfBad.healPower -= 1;
				addToLog(`${targetIfBad._name}'s stats decreased by 1!`);
				break;
				
			case 7: //Swap health
				let thisCurrentHealth = this._health;
				this.health = this._opponent._health;
				this._opponent.health = thisCurrentHealth;
				addToLog(`Both players' health got swapped!`);
				break;
			
			default:
				addToLog("Nothing happened!");
				break;
		}
		this.endTurn();
		//Found Bottle: Getting poisoned, cut off health, skip turn, double health
		//Magic Dust: 50% increase stats, full restore, swap stats, normify
	}
	
	train() {
		quickLog(`${this._name} is training`);
		this.trainAnimation();
		
		let increase;
		switch (randomBetween(0, 5)) {
			case 0:	//Increase Strength
				increase = randomBetween(1, 3);
				this.strength = this._strength + increase;
				
				addToLog(`${this._name}'s Strength increased by ${increase}`);
				break;
			case 1:	//Increase Heal Power
				increase = randomBetween(1, 3);
				this.healPower = this._healPower + increase;
				
				addToLog(`${this._name}'s Heal Power increased by ${increase}`);
				break;
			case 2:	//Increase Luck
				increase = increase = randomBetween(1, 2);
				this.luck = this._luck + increase;
				
				addToLog(`${this._name}'s Luck increased by ${increase}`);
				break;
			case 3:	//Increase Agility
				increase = increase = randomBetween(1, 2);
				this.agility = this._agility + increase;
				
				addToLog(`${this._name}'s Agility increased by ${increase}`);
				break;
			default:	//No stat increase
				addToLog(`${this._name} needs more training!`);
				break;
		}
		this.endTurn();
	}
	
	showStats() {
		$statDisplay.show();
		$statDisplay.html(this.stats);
	}
	
	endTurn() {
		let player = this;
		$logPanel.show();
		setTimeout(function() {
			
			if (player._isPoisoned) {
				player.doPoisonDamage();
			}
		
			logPanel();
			
			setTimeout(() => {
				$turnDisplay.html(`${player._opponent._name}'s Turn`);
				clearLog();
				
				if (!checkForGameOver()) {
					if (player === Computer) {
						hidePanel = true;
						
					} else {
						hidePanel = false;
					}
					
				} else {
						hidePanel = false;
					
				}
				
			}, 2000)
			
		}, 1500)
	}
	
	resetStats() {						//Resets all stats
		this.strength = 8;
		this.luck = 5;
		this.agility = 5;
		this.healPower = 6;
	} 
	
	resetAll() {				
		this.resetStats();
		this.restoreHealth(100);
		this._isPoisoned = false;
		this.poisonRemaining = 0;
		this._statusIndicator.hide();
	}
}

//Player and Computer Objects
let Player = new Character('Player', $playerSide);

let Computer = new Character('Computer', $compSide);

Player._opponent = Computer;
Computer._opponent = Player;

//Player Control Functions
function playerAttack() {
	Player.attack();
	setTimeout(startComputerTurn, computerTurnLength);
}

function playerHeal() {
	Player.heal();
	setTimeout(startComputerTurn, computerTurnLength);
}

function playerChance() {
	Player.chance();
	setTimeout(startComputerTurn, computerTurnLength);
}

function playerTrain() {
	Player.train();
	setTimeout(startComputerTurn, computerTurnLength);
}


//Computer Functions
function startComputerTurn() {
	computerTurn();
//	if (checkForGameOver()) {
//		gameOver();
//		console.log("Game Over!");
//		
//	} else {
//		computerTurn();
//		console.log("Game continues");
//	}
}

function computerTurn() {
	
	if (!checkForGameOver()) {
	
		let index = randomBetween(1, 6);
		switch (index) {
			case 1:
			case 2:
			case 3:
				if (Player._health < 25) {
					Computer.attack();
				} else if (Computer._health < 30) {
					Computer.heal();
				} else {
					Computer.attack();
				}
				break;
			case 4:
				if (Computer._health > 90) {
					Computer.attack();
				} else {
					Computer.heal();
				}
				break;
			case 5:
				Computer.chance();
				break;
			case 6:
				Computer.train();
				break;
		}
	}
}

//Player Control Event Listeners
$attackButton.addEventListener('click', playerAttack);
$healButton.addEventListener('click', playerHeal);
$chanceButton.addEventListener('click', playerChance);
$trainButton.addEventListener('click', playerTrain);

Player._box.hover(function() {
	Player.showStats();
}, function() {$statDisplay.hide()});

Computer._box.hover(function() {
	Computer.showStats();
}, function() {$statDisplay.hide()});