function checkIsPositiveInteger(value) {
    return typeof value === "number" && (value % 1) === 0 && value > 0;
}

function findIntegerForMachines(valueOfMoney, numberOfMachines) {
    return Math.floor(valueOfMoney / numberOfMachines);
}

function getRandomThreeDigits() {
    return "" + Math.round(Math.random() * 9) + Math.round(Math.random() * 9) + Math.round(Math.random() * 9);
}


function Casino(initialNumberOfSlotMachine, initialMoney) {
    if (!checkIsPositiveInteger(initialNumberOfSlotMachine)) {
        console.log("Number of slot machines must be positive integer value.");
        return this;
    } else if (!checkIsPositiveInteger(initialMoney)) {
        console.log("Initial amount of money must be positive integer value.");
        return this;
    } else if (initialNumberOfSlotMachine > initialMoney) {
        console.log("One machine should have at least 1 $");
        return this;
    }

    this._initialNumberOfSlotMachine = initialNumberOfSlotMachine;
    this._initialMoney = initialMoney;
    this.arrOfMachines = [];
    this.arrOfMachines.push(new SlotMachine(this._initialMoney));
    this.arrOfMachines[0].lucky = "true"; //mark firstmaschine as lucky

    var foundInit = findIntegerForMachines(this._initialMoney, this._initialNumberOfSlotMachine);
    for (var i = 1; i < this._initialNumberOfSlotMachine; i++) {
        this.arrOfMachines.push(new SlotMachine(this.arrOfMachines[0].takeMoney(foundInit)));
    }

    this.getTotalMoney = function() {
        var count = 0;
        for (var i = 0; i < this.arrOfMachines.length; i++) {
            count += this.arrOfMachines[i].money;
        }
        return count;
    };

    this.getNumberOfMachines = function() {
        return this.arrOfMachines.length;
    };

    this.addNewMachine = function() {
        var numOfMachineWhithBiggestMoney = 0;
        for (var i = 0; i < this.arrOfMachines.length; i++) {
            if (this.arrOfMachines[i].money > this.arrOfMachines[numOfMachineWhithBiggestMoney].money) {
                numOfMachineWhithBiggestMoney = i;
            }
        }
        var halfOfMoneyFromBiggest = Math.floor(this.arrOfMachines[numOfMachineWhithBiggestMoney].money / 2); //when we divide integer, it can give number whith point, prevent it.
        this.arrOfMachines[numOfMachineWhithBiggestMoney].takeMoney(halfOfMoneyFromBiggest);
        this.arrOfMachines.push(new SlotMachine(halfOfMoneyFromBiggest));
        return this;
    };

    this.removeMachineByNumber = function(num) {
        if (!(typeof num === "number" && (num % 1) === 0 && (num >= 0 && num < this.getNumberOfMachines()))) {
            console.log(`Please enter integer number between 0 and ${this.getNumberOfMachines() - 1}, both includes.`);
        } else if (this.getNumberOfMachines() === 1) {
            console.log(`Here only 1 machine in yours casino`);
            console.log(`You took ${this.getTotalMoney()}$ from machine and then remove it`);
            this.arrOfMachines[num].takeMoney(this.getTotalMoney());
            this.arrOfMachines.splice(num, 1);
        } else {

            var moneyFromRemoveMachine = this.arrOfMachines[num].money;
            if (this.arrOfMachines[num].lucky === "true") {
                this.arrOfMachines.splice(num, 1);
                this.arrOfMachines[0].lucky = "true";
            } else {
                this.arrOfMachines.splice(num, 1);
            }
            if (moneyFromRemoveMachine === 0) {
                return this;
            }
            this.arrOfMachines[0].money += moneyFromRemoveMachine;
            var foundFromDeleting = findIntegerForMachines(moneyFromRemoveMachine, this.arrOfMachines.length);
            for (var i = 1; i < this.arrOfMachines.length; i++) {
                this.arrOfMachines[i].money += this.arrOfMachines[0].takeMoney(foundFromDeleting);
            }

        }
        return this;
    };

    this.takeMoneyFromCasino = function(value) {
        if (!checkIsPositiveInteger(value) || value > this.getTotalMoney()) {
            console.log(`Amount of money must be positive integer value and not bigger than ${this.getTotalMoney()}`);
        } else {
            this.arrOfMachines.sort((a, b) => b.money - a.money);
            var rest = value;
            while (rest) {
                for (var i = 0; i < this.arrOfMachines.length; i++) {
                    if (this.arrOfMachines[i].money < rest) {
                        rest -= this.arrOfMachines[i].money;
                        this.arrOfMachines[i].takeMoney(this.arrOfMachines[i].money);
                    } else {
                        this.arrOfMachines[i].takeMoney(rest);
                        rest -= rest;
                        break;
                    }
                }
            }
            console.log(`You took ${value}$ from casino`);
        }
        return this;
    };


}

function SlotMachine(startingMoney) {
    if (checkIsPositiveInteger(startingMoney)) {
        this.money = startingMoney;
    } else {
        console.log("Initial amount of money must be positive integer value.");
    }

    this.getAllMoney = function() {
        return this.money;
    };

    this.takeMoney = function(value) {
        if (!checkIsPositiveInteger(value)) {
            console.log("You can take from machine only an integer positive value of money");
        } else if (value > this.money) {
            console.log(`Machine have only ${this.money} amount of money`);
        } else {
            this.money = this.money - value;
            return value;
        }

    };

    this.putMoney = function(value) {
        if (checkIsPositiveInteger(value)) {
            this.money = this.money + value;
            return value;
        } else {
            console.log("You can put in machine only an integer positive value of money");
        }

    };

    this.play = function(value) {
        if (!checkIsPositiveInteger(value)) {
            console.log("U can put in machine only an integer positive value of money");
        } else if (this.money === 0) {
            console.log(`You can not play in this machine, sorry. Choose another one`);
        } else if (value * 5 > this.money) {
            console.log(`Max bet in this machine equals ${Math.floor(this.money / 5)}$`);
        } else {

            this.putMoney(value);
            var rand = getRandomThreeDigits();
            while (this.lucky === "true" && rand === "777") {
                rand = getRandomThreeDigits();
            }

            if (rand === "777") {
                console.log(`You rolled ${rand}. Jackpot! You won ${this.money}$`);
                return this.takeMoney(this.money);
            } else if (rand[0] === rand[1] && rand[1] === rand[2]) {
                console.log(`You rolled ${rand}. Gratz. You won ${value * 5}$`);
                return this.takeMoney(value * 5);
            } else if ((rand[0] === rand[1]) || (rand[0] === rand[2]) || (rand[1] === rand[2])) {
                console.log(`You rolled ${rand}. Gratz. You won ${value * 2}$`);
                return this.takeMoney(value * 2);
            } else {
                console.log(`You rolled ${rand}. Sorry. You loss ${value}$`);
                return 0;
            }
        }
    };

    return this;
}

function demonstration() {
    //create casino, machine whith number "0" is lucky
    var myCasino = new Casino(7, 25000);
    console.log(myCasino);

    //show total money in casino
    console.log(myCasino.getTotalMoney());

    //show number of machines there
    console.log(myCasino.getNumberOfMachines());

    //add a pair of new machines
    myCasino.addNewMachine();
    myCasino.addNewMachine();
    console.log(myCasino);
    console.log(myCasino.getNumberOfMachines());

    //remove machine for id, if you don't know last, it will be a hint:)
    myCasino.removeMachineByNumber(10); //wrong id
    myCasino.removeMachineByNumber(5); //now it's fine
    myCasino.removeMachineByNumber(0); //if you delete "lucky", new "lucky" will be created
    console.log(myCasino);
    console.log(myCasino.getNumberOfMachines());
    console.log(myCasino.getTotalMoney());

    //if you want take money from casino (there are some hint's if you want take to much or something like that)
    myCasino.takeMoneyFromCasino(100000);
    myCasino.takeMoneyFromCasino(20000);
    console.log(myCasino.getTotalMoney());

    //create a new machine
    var myMachine = new SlotMachine(1000);
    console.log(myMachine);

    //grab some money from it
    console.log(myMachine.takeMoney(250));

    //put some to it
    console.log(myMachine.putMoney(700));

    //now try to play in Casino :))
    myCasino.arrOfMachines[5].play(5);
    myCasino.arrOfMachines[5].play(5);
    myCasino.arrOfMachines[5].play(5);
    myCasino.arrOfMachines[5].play(5);
    myCasino.arrOfMachines[5].play(5);
    myCasino.arrOfMachines[5].play(5);

    //p.s. in this demonstration all of data changes dynamically:( I think in debugger all changes will be better shown
}
demonstration();

module.exports = {
    checkIsPositiveInteger: checkIsPositiveInteger,
    findIntegerForMachines: findIntegerForMachines,
    getRandomThreeDigits: getRandomThreeDigits,
    Casino: Casino,
    SlotMachine: SlotMachine,
    demonstration: demonstration
}
