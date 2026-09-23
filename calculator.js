const display =
    document.getElementById("display");

const modeDisplay =
    document.getElementById("mode");


let current = "0";

let firstNumber = null;

let operator = null;

let waitingForNumber = false;


/*
    NUMBERS AND OPERATORS ARE STORED
    SEPARATELY.

    Example:

    23 + 34 + 15

    numbers:
    [23, 34, 15]

    operators:
    ["+", "+"]
*/

let numbers = [];

let operators = [];

let lastResult = null;


/* MEMORY */

let memory = 0;

let memoryRecallPressed = false;


/* GRAND TOTAL */

let grandTotal = 0;


/* CHECK */

let checkIndex = 0;

let checked = false;


/* =========================================
   DISPLAY
========================================= */

function updateDisplay() {

    const number =
        Number(current);


    if (!Number.isFinite(number)) {

        display.textContent =
            "Error";

        return;
    }


    display.textContent =
        current;
}


/* =========================================
   NUMBER INPUT
========================================= */

function inputNumber(value) {

    if (waitingForNumber) {

        current =
            value === "."
                ? "0."
                : value;

        waitingForNumber =
            false;

        updateDisplay();

        return;
    }


    if (value === ".") {

        if (!current.includes(".")) {

            current += ".";
        }

    } else {

        if (current === "0") {

            current = value;

        } else {

            current += value;
        }
    }


    updateDisplay();
}


/* =========================================
   OPERATOR
========================================= */

function inputOperator(op) {

    /*
        If another operator is already waiting,
        finish the previous operation.
    */

    if (
        operator !== null &&
        !waitingForNumber
    ) {

        calculateCurrent();
    }


    /*
        First number
    */

    if (
        numbers.length === 0
    ) {

        numbers.push(
            Number(current)
        );

    } else if (
        !waitingForNumber
    ) {

        numbers.push(
            Number(current)
        );
    }


    operators.push(op);


    firstNumber =
        Number(current);


    operator = op;


    waitingForNumber =
        true;
}


/* =========================================
   CALCULATE
========================================= */

function calculateCurrent() {

    if (
        firstNumber === null ||
        operator === null
    ) {

        return Number(current);
    }


    const secondNumber =
        Number(current);


    let result = 0;


    switch (operator) {

        case "+":

            result =
                firstNumber +
                secondNumber;

            break;


        case "-":

            result =
                firstNumber -
                secondNumber;

            break;


        case "*":

            result =
                firstNumber *
                secondNumber;

            break;


        case "/":

            if (
                secondNumber === 0
            ) {

                result = 0;

            } else {

                result =
                    firstNumber /
                    secondNumber;
            }

            break;
    }


    current =
        cleanNumber(result);


    firstNumber =
        null;

    operator =
        null;

    waitingForNumber =
        true;


    updateDisplay();


    return Number(current);
}


/* =========================================
   EQUALS
========================================= */

function equals() {

    if (
        operator === null
    ) {

        lastResult =
            Number(current);

        return;
    }


    /*
        Store the final number.
    */

    if (!waitingForNumber) {

        numbers.push(
            Number(current)
        );
    }


    const result =
        calculateCurrent();


    lastResult =
        Number(result);


    grandTotal +=
        lastResult;


    checked =
        false;


    modeDisplay.textContent =
        "PRESS CHECK TO VERIFY";


    updateDisplay();
}


/* =========================================
   CLEAN NUMBER
========================================= */

function cleanNumber(number) {

    if (
        !Number.isFinite(number)
    ) {

        return "0";
    }


    return String(
        Number(
            Number(number).toFixed(10)
        )
    );
}


/* =========================================
   AC
========================================= */

function clearAll() {

    current = "0";

    firstNumber = null;

    operator = null;

    waitingForNumber = false;

    numbers = [];

    operators = [];

    lastResult = null;

    checked = false;

    checkIndex = 0;

    modeDisplay.textContent = "";

    updateDisplay();
}


/* =========================================
   CE
========================================= */

function clearEntry() {

    current = "0";

    waitingForNumber = false;

    updateDisplay();
}


/* =========================================
   MEMORY +
========================================= */

function memoryPlus() {

    memory +=
        Number(current);

    memory =
        Number(
            cleanNumber(memory)
        );

    modeDisplay.textContent =
        "M";
}


/* =========================================
   MEMORY -
========================================= */

function memoryMinus() {

    memory -=
        Number(current);

    memory =
        Number(
            cleanNumber(memory)
        );

    modeDisplay.textContent =
        "M";
}


/* =========================================
   MRC
========================================= */

function memoryRecall() {

    if (
        !memoryRecallPressed
    ) {

        current =
            cleanNumber(memory);

        waitingForNumber =
            true;

        memoryRecallPressed =
            true;

        updateDisplay();

    } else {

        memory = 0;

        memoryRecallPressed =
            false;

        modeDisplay.textContent =
            "";
    }
}


/* =========================================
   GT
========================================= */

function grandTotalFunction() {

    current =
        cleanNumber(grandTotal);

    waitingForNumber =
        true;

    updateDisplay();
}


/* =========================================
   PERCENT
========================================= */

function percentage() {

    current =
        cleanNumber(
            Number(current) / 100
        );

    waitingForNumber =
        true;

    updateDisplay();
}


/* =========================================
   SQRT
========================================= */

function squareRoot() {

    current =
        cleanNumber(
            Math.sqrt(
                Number(current)
            )
        );

    waitingForNumber =
        true;

    updateDisplay();
}


/* =========================================
   MU
========================================= */

function markup() {

    const value =
        Number(current);


    if (
        firstNumber !== null
    ) {

        current =
            cleanNumber(
                firstNumber +
                (
                    firstNumber *
                    value /
                    100
                )
            );

        firstNumber =
            null;

        operator =
            null;

    } else {

        current =
            cleanNumber(
                value * 1.20
            );
    }


    waitingForNumber =
        true;


    updateDisplay();
}


/* =========================================
   CHECK
========================================= */

function startCheck() {

    if (
        numbers.length === 0
    ) {

        alert(
            "There is no completed calculation to check."
        );

        return;
    }


    checkIndex = 0;

    checked = false;

    showCheck();
}


function showCheck() {

    const overlay =
        document.getElementById(
            "checkOverlay"
        );


    const number =
        document.getElementById(
            "checkNumber"
        );


    const position =
        document.getElementById(
            "checkPosition"
        );


    /*
        ONLY NUMBER IS DISPLAYED.

        Operators are deliberately
        NOT displayed here.
    */

    number.textContent =
        formatNumber(
            numbers[checkIndex]
        );


    position.textContent =
        ` ${checkIndex + 1} / ${numbers.length}`;


    overlay.classList.remove(
        "hidden"
    );


    updateCheckButtons();
}


/* =========================================
   CHECK NAVIGATION
========================================= */

function updateCheckButtons() {

    const previous =
        document.getElementById(
            "previousCheck"
        );


    const next =
        document.getElementById(
            "nextCheck"
        );


    previous.disabled =
        checkIndex === 0;


    next.disabled =
        checkIndex ===
        numbers.length - 1;
}


/* =========================================
   NEXT
========================================= */

document
    .getElementById(
        "nextCheck"
    )
    .addEventListener(
        "click",
        () => {

            if (
                checkIndex <
                numbers.length - 1
            ) {

                checkIndex++;

                showCheck();
            }
        }
    );


/* =========================================
   PREVIOUS
========================================= */

document
    .getElementById(
        "previousCheck"
    )
    .addEventListener(
        "click",
        () => {

            if (
                checkIndex > 0
            ) {

                checkIndex--;

                showCheck();
            }
        }
    );


/* =========================================
   CORRECT NUMBER
========================================= */

function correctCurrentNumber() {

    const oldValue =
        numbers[checkIndex];


    const newValue =
        prompt(
            "Enter corrected number:",
            oldValue
        );


    if (
        newValue === null ||
        newValue.trim() === ""
    ) {

        return;
    }


    const parsed =
        Number(newValue);


    if (
        !Number.isFinite(parsed)
    ) {

        alert(
            "Please enter a valid number."
        );

        return;
    }


    numbers[checkIndex] =
        parsed;


    recalculate();


    showCheck();
}


/* =========================================
   RECALCULATE AFTER CORRECTION
========================================= */

function recalculate() {

    if (
        numbers.length === 0
    ) {

        return;
    }


    let result =
        Number(numbers[0]);


    for (
        let i = 0;

        i < operators.length &&
        i + 1 < numbers.length;

        i++
    ) {

        const next =
            Number(
                numbers[i + 1]
            );


        switch (
            operators[i]
        ) {

            case "+":

                result += next;

                break;


            case "-":

                result -= next;

                break;


            case "*":

                result *= next;

                break;


            case "/":

                if (
                    next !== 0
                ) {

                    result /= next;

                } else {

                    result = 0;
                }

                break;
        }
    }


    result =
        Number(
            Number(result)
                .toFixed(10)
        );


    current =
        String(result);


    lastResult =
        result;


    waitingForNumber =
        true;


    updateDisplay();
}


/* =========================================
   FINISH CHECK
========================================= */

document
    .getElementById(
        "finishCheck"
    )
    .addEventListener(
        "click",
        () => {

            checked = true;


            document
                .getElementById(
                    "checkOverlay"
                )
                .classList.add(
                    "hidden"
                );


            modeDisplay.textContent =
                "✓ CHECKED — SAVE HISTORY";


            updateDisplay();
        }
    );


/* =========================================
   CLOSE CHECK
========================================= */

document
    .getElementById(
        "closeCheck"
    )
    .addEventListener(
        "click",
        () => {

            document
                .getElementById(
                    "checkOverlay"
                )
                .classList.add(
                    "hidden"
                );
        }
    );


/* =========================================
   CORRECT BUTTON
========================================= */

document
    .getElementById(
        "correctNumber"
    )
    .addEventListener(
        "click",
        correctCurrentNumber
    );


/* =========================================
   HISTORY
========================================= */

function getHistory() {

    try {

        return JSON.parse(
            localStorage.getItem(
                "moneyCalculatorHistory"
            )
        ) || [];

    } catch {

        return [];
    }
}


function createExpression() {

    let expression = "";


    for (
        let i = 0;

        i < numbers.length;

        i++
    ) {

        expression +=
            formatNumber(
                numbers[i]
            );


        if (
            i < operators.length
        ) {

            const symbol = {

                "+": "+",

                "-": "−",

                "*": "×",

                "/": "÷"

            }[
                operators[i]
            ];


            expression +=
                ` ${symbol} `;
        }
    }


    return expression;
}


/* =========================================
   SAVE HISTORY
========================================= */

function saveCalculation() {

    if (!checked) {

        alert(
            "Please finish CHECK first."
        );

        return;
    }


    if (
        lastResult === null
    ) {

        return;
    }


    const history =
        getHistory();


    history.unshift({

        expression:
            createExpression(),

        result:
            lastResult,

        time:
            new Date()
                .toLocaleString()
    });


    localStorage.setItem(
        "moneyCalculatorHistory",
        JSON.stringify(history)
    );


    document
        .getElementById(
            "checkOverlay"
        )
        .classList.add(
            "hidden"
        );


    modeDisplay.textContent =
        "✓ SAVED TO HISTORY";


    openHistory();
}


/* =========================================
   OPEN HISTORY
========================================= */

function openHistory() {

    const overlay =
        document.getElementById(
            "historyOverlay"
        );


    const list =
        document.getElementById(
            "historyList"
        );


    const history =
        getHistory();


    list.innerHTML = "";


    if (
        history.length === 0
    ) {

        list.innerHTML = `

            <p style="
                text-align:center;
                color:#777;
                padding:30px;
            ">
                No saved calculations.
            </p>

        `;

    } else {

        history.forEach(
            (item, index) => {

                const div =
                    document.createElement(
                        "div"
                    );


                div.className =
                    "history-item";


                div.innerHTML = `

                    <div class="history-time">

                        ${escapeHTML(
                            item.time
                        )}

                    </div>


                    <div class="history-expression">

                        ${escapeHTML(
                            item.expression
                        )}

                    </div>


                    <div class="history-result">

                        = ${escapeHTML(
                            String(item.result)
                        )}

                    </div>


                    <button
                        class="delete-history"
                        data-index="${index}"
                    >
                        DELETE
                    </button>

                `;


                list.appendChild(div);
            }
        );


        document
            .querySelectorAll(
                ".delete-history"
            )
            .forEach(
                button => {

                    button.addEventListener(
                        "click",
                        () => {

                            const index =
                                Number(
                                    button.dataset
                                        .index
                                );


                            const history =
                                getHistory();


                            history.splice(
                                index,
                                1
                            );


                            localStorage.setItem(
                                "moneyCalculatorHistory",
                                JSON.stringify(
                                    history
                                )
                            );


                            openHistory();
                        }
                    );
                }
            );
    }


    overlay.classList.remove(
        "hidden"
    );
}


/* =========================================
   CLOSE HISTORY
========================================= */

document
    .getElementById(
        "closeHistory"
    )
    .addEventListener(
        "click",
        () => {

            document
                .getElementById(
                    "historyOverlay"
                )
                .classList.add(
                    "hidden"
                );
        }
    );


/* =========================================
   CLEAR HISTORY
========================================= */

document
    .getElementById(
        "clearHistory"
    )
    .addEventListener(
        "click",
        () => {

            if (
                confirm(
                    "Delete all calculation history?"
                )
            ) {

                localStorage.removeItem(
                    "moneyCalculatorHistory"
                );


                openHistory();
            }
        }
    );


/* =========================================
   SAVE BUTTON
========================================= */

document
    .getElementById(
        "saveCalculation"
    )
    .addEventListener(
        "click",
        saveCalculation
    );


/* =========================================
   BUTTON EVENTS
========================================= */

document
    .querySelectorAll(
        "[data-value]"
    )
    .forEach(
        button => {

            button.addEventListener(
                "click",
                () => {

                    const value =
                        button.dataset
                            .value;


                    if (
                        [
                            "+",
                            "-",
                            "*",
                            "/"
                        ].includes(value)
                    ) {

                        inputOperator(value);

                    } else {

                        inputNumber(value);
                    }
                }
            );
        }
    );


document
    .querySelectorAll(
        "[data-action]"
    )
    .forEach(
        button => {

            button.addEventListener(
                "click",
                () => {

                    const action =
                        button.dataset
                            .action;


                    switch (action) {

                        case "equals":

                            equals();

                            break;


                        case "ac":

                            clearAll();

                            break;


                        case "ce":

                            clearEntry();

                            break;


                        case "check":

                            startCheck();

                            break;


                        case "correct":

                            if (
                                numbers.length > 0
                            ) {

                                startCheck();
                            }

                            break;


                        case "memory-plus":

                            memoryPlus();

                            break;


                        case "memory-minus":

                            memoryMinus();

                            break;


                        case "memory-recall":

                            memoryRecall();

                            break;


                        case "gt":

                            grandTotalFunction();

                            break;


                        case "percent":

                            percentage();

                            break;


                        case "mu":

                            markup();

                            break;


                        case "sqrt":

                            squareRoot();

                            break;


                        case "auto-replay":

                            if (
                                numbers.length > 0
                            ) {

                                startCheck();
                            }

                            break;
                    }
                }
            );
        }
    );


/* =========================================
   HISTORY BUTTON
========================================= */

document
    .querySelector(
        '[data-action="history"]'
    )
    ?.addEventListener(
        "click",
        openHistory
    );


/* =========================================
   KEYBOARD
========================================= */

document.addEventListener(
    "keydown",
    event => {

        const key =
            event.key;


        if (
            /^[0-9.]$/.test(key)
        ) {

            inputNumber(key);

            return;
        }


        if (
            [
                "+",
                "-",
                "*",
                "/"
            ].includes(key)
        ) {

            inputOperator(key);

            return;
        }


        if (
            key === "Enter" ||
            key === "="
        ) {

            equals();

            return;
        }


        if (
            key === "Escape"
        ) {

            clearAll();

            return;
        }


        if (
            key === "Backspace"
        ) {

            clearEntry();
        }
    }
);


/* =========================================
   FORMAT NUMBER
========================================= */

function formatNumber(number) {

    return Number(number)
        .toLocaleString(
            "en-IN",
            {
                maximumFractionDigits: 10
            }
        );
}


/* =========================================
   ESCAPE HTML
========================================= */

function escapeHTML(value) {

    return String(value)

        .replaceAll(
            "&",
            "&amp;"
        )

        .replaceAll(
            "<",
            "&lt;"
        )

        .replaceAll(
            ">",
            "&gt;"
        )

        .replaceAll(
            '"',
            "&quot;"
        )

        .replaceAll(
            "'",
            "&#039;"
        );
}


/* =========================================
   INITIALIZE
========================================= */

updateDisplay();