function calculateTotal() {

const five =
    Number(document.querySelector("#five").value) || 0;

const two =
    Number(document.querySelector("#two").value) || 0;

const one =
    Number(document.querySelector("#one").value) || 0;

const fifty =
    Number(document.querySelector("#fifty").value) || 0;

const twenty =
    Number(document.querySelector("#twenty").value) || 0;

const ten =
    Number(document.querySelector("#ten").value) || 0;

const total =
    (500 * five) +
    (200 * two) +
    (100 * one) +
    (50 * fifty) +
    (20 * twenty) +
    (10 * ten);

document.querySelector("#moneyTotal").innerText =
    "₹" + total;

}

document
.querySelectorAll(".cash input")
.forEach(function(input) {

    input.addEventListener(
        "input",
        calculateTotal
    );

});

document
.querySelector("#resetBtn")
.addEventListener("click", function() {

    document
        .querySelectorAll(".cash input")
        .forEach(function(input) {

            input.value = "";

        });

    document.querySelector("#moneyTotal").innerText =
        "₹0";

});