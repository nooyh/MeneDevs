var hasDollar = false;



projectBudget.addEventListener('keypress', (e) => {
    if (e.key == "$") {
        if (!hasDollar) {
            hasDollar = true;
        } else {
            e.preventDefault();
        }
    } else if (e.key != ",") {
        if (!(e.keyCode >= 48 && e.keyCode <= 57)) {
            e.preventDefault();
        }
    }
});
projectBudget.oninput = function () {
    console.log("budget changed");
    projectBudget.value = projectBudget.value.replace(/[^0-9 | "$" | "," ]/, "");
    var cost = projectBudget.value;
    if (!hasDollar) {
        cost = "$" + cost;
        projectBudget.value = cost;
        hasDollar = true;
    }
    if (cost.substring(0, 1) != "$") {
        cost = cost.replace("$", "");
        cost = "$" + cost;
        projectBudget.value = cost;
    }
    hasDollar = cost.indexOf("$") != -1;
};

projectBudget.onchange = function () { // formats number with commas
    var costWithoutComma = projectBudget.value; //takes commas out to remake with proper commas
    while (costWithoutComma.indexOf(",") != -1) {
        costWithoutComma = costWithoutComma.replace(",", "");
    }

    if ((costWithoutComma.length - 1) / 3 > 1) {

        let numAfterComma = (costWithoutComma.substring(1).length) % 3;

        let numberOfCommas = (costWithoutComma.substring(1).length - numAfterComma) / 3;
        var afterComma = costWithoutComma.substring(1, numAfterComma + 1);
        var numberBank = costWithoutComma.substring(numAfterComma + 1);

        if (numberBank.length / 6 >= 1 || numberBank.length < 4) {
            numberOfCommas--;
        }

        for (let i = 0; i < numberOfCommas; i++) {
            numberBank = numberBank.slice(0, 3 * (i + 1) + i) + "," + numberBank.slice(3 * (i + 1) + i);

        }
        if (numAfterComma != 0) {
            numberBank = afterComma + "," + numberBank;
        }
        projectBudget.value = "$" + numberBank;
    } else {
        projectBudget.value = costWithoutComma;
    }

}












var hasParentheses = false;
var numberAmt = 0; //amount of numbers after the parentheses
var hasDash = false;
var dashEligible = false;
var spaceEligible = false;
var needStartPare = true;






contact.addEventListener('keypress', (e) => { //doesnt allow spaces or dashes to be typed

    if ((e.key == "-" && dashEligible)) { //allows dash to be typed in spot where needed
        if (!hasDash) {
            hasDash = true;
        } else {
            e.preventDefault();
        }
    } else if ((e.key == " " && spaceEligible)) { //allows space to be typed when needed
        spaceEligible = false;
    } else if ((e.key == ")" && !hasParentheses)) { //allows for the end parentheses to be typed when needed
        hasParentheses = true;
        spaceEligible = true;
    } else if (e.key == "(" && needStartPare) {
        needStartPare = false;
    } else {
        if (!(e.keyCode >= 48 && e.keyCode <= 57)) {
            e.preventDefault();
        }
        // if ((e.key == "-" && !dashEligible)|| e.key == " " || e.key == ")") { //stops the characters other than numbers from being typed
        //     e.preventDefault();
        // }
    }
});

contact.oninput = function () {

    contact.value = contact.value.replace(/[^0-9 | ( | ) | \-\ ]/, ""); //allows only the parantheses, numbers, and dash to be in the contact
    var words = contact.value;

    if (words.indexOf("(") == -1 && needStartPare) { //adds the start of parantheses
        words = '(' + words;
        contact.value = words;
        needStartPare = false;
    }

    if (hasParentheses) { //counts digits after the parentheses
        numberAmt = words.substring(words.indexOf(")")).length - 1;
    }

    if (words.length == 4 && !hasParentheses) { //adds parentheses and space after to area code if none
        words = words + ') ';
        contact.value = words;
        hasParentheses = true;
        spaceEligible = false;
        console.log("added parentheses and space");
    } else if (words.length > 3 && !hasParentheses) { //adds parentheses and moves value if a number is where the end parentheses is supposed to be
        words = words.substring(0, 4) + ')' + words.substring(words.length - 1);
        contact.value = words;
        hasParentheses = true;
    }
    if (spaceEligible && hasParentheses) { //adds a space if there is no space 
        if (words.length > 5) {
            words = words.substring(0, 5) + " " + words.substring(words.length - 1);
            contact.value = words;
        }
    }


    if (numberAmt == 4 && !hasDash) { //adds the dash of phone number if it doesnt have one
        if (dashEligible) {
            words = words + "-";
            contact.value = words;
            console.log("adds dash");
        }

    } else if ((numberAmt > 3 && !hasDash) && dashEligible) { // adds the dash if they deleted the dash and typed another number where the dash was supposed to be 
        words = words.substring(0, words.indexOf(" ") + 4) + "-" + words.substring(words.indexOf(" ") + 4);
        contact.value = words;
    }

    console.log("length of words: " + words.length); //updates the booleans
    hasParentheses = words.indexOf(")") != -1;
    hasDash = words.indexOf("-") != -1;
    dashEligible = words.length > 8;
    spaceEligible = words.indexOf(") ") == -1 && words.substring(words.indexOf("(")).length >= 4;
    needStartPare = words.length == 0;
    console.log("dash eligible: " + dashEligible);
    console.log("space eligible: " + spaceEligible);

};
