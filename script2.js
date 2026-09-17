function calculateTotal() {

const five = Number(document.querySelector("#five").value) || 0;
const two = Number(document.querySelector("#two").value) || 0;
const one = Number(document.querySelector("#one").value) || 0;
const fifty = Number(document.querySelector("#fifty").value) || 0;
const twenty = Number(document.querySelector("#twenty").value) || 0;
const ten = Number(document.querySelector("#ten").value) || 0;

const total =
    (500 * five) +
    (200 * two) +
    (100 * one) +
    (50 * fifty) +
    (20 * twenty) +
    (10 * ten);

document.querySelector("#moneyTotal").innerText = "₹" + total;

}

function restart() {

document.querySelector("#moneyTotal").innerText = "₹0";

document.querySelectorAll(".cash input").forEach(function(input) {
    input.value = "";
});

}

document.querySelectorAll(".cash input").forEach(function(input) {

input.addEventListener("input", calculateTotal);

});

document.querySelector("#butt").addEventListener("click", restart);

const unitToMg = {
kg: 1000000,
g: 1000,
mg: 1
};

const calculationTypes =
document.querySelectorAll('input[name="calculation"]');

calculationTypes.forEach(function(radio) {

radio.addEventListener("change", function() {

    const moneyGroup =
        document.querySelector("#moneyInputGroup");

    const quantityGroup =
        document.querySelector("#quantityInputGroup");

    if (this.value === "moneyToQuantity") {

        moneyGroup.classList.remove("hidden");

        quantityGroup.classList.add("hidden");

    } else {

        moneyGroup.classList.add("hidden");

        quantityGroup.classList.remove("hidden");

    }

    clearResult();

});

});

function formatNumber(number) {

if (!Number.isFinite(number)) {
    return "0";
}

return Number(number.toFixed(6)).toString();

}

function getRateDetails() {

const rate =
    Number(document.querySelector("#rate").value);

const rateQuantity =
    Number(document.querySelector("#rateQuantity").value);

const rateUnit =
    document.querySelector("#rateUnit").value;

if (!Number.isFinite(rate) || rate <= 0) {

    showError("Please enter a valid price.");

    return null;
}

if (!Number.isFinite(rateQuantity) || rateQuantity <= 0) {

    showError("Please enter a valid reference quantity.");

    return null;
}

const referenceQuantityMg =
    rateQuantity * unitToMg[rateUnit];

const pricePerMg =
    rate / referenceQuantityMg;

return {
    rate: rate,
    rateQuantity: rateQuantity,
    rateUnit: rateUnit,
    pricePerMg: pricePerMg
};

}

function moneyToQuantity() {

const rateDetails = getRateDetails();

if (!rateDetails) {
    return;
}

const money =
    Number(document.querySelector("#moneyInput").value);

if (!Number.isFinite(money) || money < 0) {

    showError("Please enter a valid money amount.");

    return;
}

const quantityMg =
    money / rateDetails.pricePerMg;

const quantityG =
    quantityMg / 1000;

const quantityKg =
    quantityMg / 1000000;

let mainResult;

if (quantityKg >= 1) {

    mainResult =
        formatNumber(quantityKg) + " KG";

} else if (quantityG >= 1) {

    mainResult =
        formatNumber(quantityG) + " grams";

} else {

    mainResult =
        formatNumber(quantityMg) + " mg";
}

document.querySelector("#result").innerText =
    mainResult;

document.querySelector("#resultDetails").innerText =
    formatNumber(quantityKg) + " KG  |  " +
    formatNumber(quantityG) + " grams  |  " +
    formatNumber(quantityMg) + " mg";

}

function quantityToMoney() {

const rateDetails = getRateDetails();

if (!rateDetails) {
    return;
}

const quantity =
    Number(document.querySelector("#quantityInput").value);

const quantityUnit =
    document.querySelector("#quantityUnit").value;

if (!Number.isFinite(quantity) || quantity < 0) {

    showError("Please enter a valid quantity.");

    return;
}

const quantityMg =
    quantity * unitToMg[quantityUnit];

const money =
    quantityMg * rateDetails.pricePerMg;

document.querySelector("#result").innerText =
    "₹" + formatNumber(money);

document.querySelector("#resultDetails").innerText =
    formatNumber(quantity) +
    " " +
    getUnitName(quantityUnit) +
    " = ₹" +
    formatNumber(money);

}

function getUnitName(unit) {

if (unit === "kg") {
    return "KG";
}

if (unit === "g") {
    return "grams";
}

if (unit === "mg") {
    return "mg";
}

return "";

}

function showError(message) {

document.querySelector("#result").innerText =
    "⚠️ " + message;

document.querySelector("#resultDetails").innerText =
    "";

}

function clearResult() {

document.querySelector("#result").innerText = "—";

document.querySelector("#resultDetails").innerText = "";

}

document.querySelector("#calculateBtn").addEventListener(
"click",
function() {

    const selected =
        document.querySelector(
            'input[name="calculation"]:checked'
        ).value;

    if (selected === "moneyToQuantity") {

        moneyToQuantity();

    } else {

        quantityToMoney();

    }

}

);