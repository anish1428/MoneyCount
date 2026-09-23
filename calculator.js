const display = document.getElementById("display");
const modeDisplay = document.getElementById("mode");

let current = "0";
let firstNumber = null;
let operator = null;
let waitingForNumber = false;

let entries = [];
let lastResult = null;

let memory = 0;
let memoryRecallPressed = false;

let grandTotal = 0;

let checked = false;
let checkIndex = 0;

const operators = {
    "+": (a, b) => a + b,
    "-": (a, b) => a - b,
    "*": (a, b) => a * b,
    "/": (a, b) => b === 0 ? 0 : a / b
};

function updateDisplay() {
    let value = Number(current);

    if (!Number.isFinite(value)) {
        display.textContent = "Error";
        return;
    }

    if (current.length > 15) {
        display.textContent = Number(current).toPrecision(12);
    } else {
        display.textContent = current;
    }
}

function cleanNumber(number) {
    if (!Number.isFinite(number)) return 0;

    return Number(
        Number(number).toFixed(10)
    );
}

function inputNumber(value) {

    if (waitingForNumber) {
        current = value === "." ? "0." : value;
        waitingForNumber = false;
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
        } else if (current === "-0") {
            current = "-" + value;
        } else {
            current += value;
        }
    }

    updateDisplay();
}

function calculate() {

    if (firstNumber === null || operator === null) {
        return Number(current);
    }

    const secondNumber = Number(current);

    const result = operators[operator](
        firstNumber,
        secondNumber
    );

    current = String(cleanNumber(result));

    firstNumber = null;
    operator = null;
    waitingForNumber = true;

    updateDisplay();

    return result;
}

function inputOperator(op) {

    const number = Number(current);

    if (operator !== null && !waitingForNumber) {
        calculate();
    }

    firstNumber = Number(current);
    operator = op;
    waitingForNumber = true;

    entries.push({
        type: "operator",
        value: op
    });
}

function equals() {

    if (operator === null) {
        lastResult = Number(current);
        return;
    }

    const secondNumber = Number(current);

    entries.push({
        type: "number",
        value: secondNumber
    });

    const result = calculate();

    lastResult = result;

    grandTotal += result;

    checked = false;

    modeDisplay.textContent = "Press CHECK to verify";

    updateDisplay();
}

function clearAll() {

    current = "0";
    firstNumber = null;
    operator = null;
    waitingForNumber = false;

    entries = [];
    lastResult = null;

    checked = false;
    checkIndex = 0;

    modeDisplay.textContent = "";

    updateDisplay();
}

function clearEntry() {

    current = "0";
    waitingForNumber = false;

    updateDisplay();
}

function percentage() {

    current = String(
        cleanNumber(Number(current) / 100)
    );

    updateDisplay();
}

function squareRoot() {

    current = String(
        cleanNumber(Math.sqrt(Number(current)))
    );

    waitingForNumber = true;

    updateDisplay();
}

function markup() {

    const percentageValue = Number(current);

    if (firstNumber !== null) {

        const result =
            firstNumber +
            (firstNumber * percentageValue / 100);

        current = String(cleanNumber(result));

        firstNumber = null;
        operator = null;
        waitingForNumber = true;

    } else {

        current = String(
            cleanNumber(
                Number(current) * 1.2
            )
        );

        waitingForNumber = true;
    }

    updateDisplay();
}

function memoryPlus() {

    memory += Number(current);
    memory = cleanNumber(memory);

    modeDisplay.textContent = "M";
}

function memoryMinus() {

    memory -= Number(current);
    memory = cleanNumber(memory);

    modeDisplay.textContent = "M";
}

function memoryRecall() {

    if (!memoryRecallPressed) {

        current = String(memory);
        waitingForNumber = true;
        memoryRecallPressed = true;

        updateDisplay();

    } else {

        memory = 0;
        memoryRecallPressed = false;

        modeDisplay.textContent = "";
    }
}

function grandTotalFunction() {

    current = String(cleanNumber(grandTotal));
    waitingForNumber = true;

    updateDisplay();
}

function expressionText() {

    let text = "";

    for (const item of entries) {

        if (item.type === "number") {
            text += item.value;
        }

        if (item.type === "operator") {

            const symbol = {
                "+": "+",
                "-": "−",
                "*": "×",
                "/": "÷"
            }[item.value];

            text += ` ${symbol} `;
        }
    }

    return text;
}

function checkCalculation() {

    if (entries.length === 0) {
        alert("No completed calculation to check.");
        return;
    }

    checked = true;
    checkIndex = 0;

    showCheckPanel();
}

function showCheckPanel() {

    const oldPanel = document.querySelector(".check-panel");

    if (oldPanel) {
        oldPanel.remove();
    }

    const panel = document.createElement("div");

    panel.className = "check-panel";

    const item = entries[checkIndex];

    let value = item.value;

    if (item.type === "operator") {

        value = {
            "+": "+",
            "-": "−",
            "*": "×",
            "/": "÷"
        }[value];
    }

    panel.innerHTML = `
        <div class="check-title">
            <h2>CHECK</h2>
            <button id="closeCheck">×</button>
        </div>

        <div class="check-step">

            <div class="check-number">
                ${escapeHTML(String(value))}
            </div>

            <div class="check-expression">
                Step ${checkIndex + 1} of ${entries.length}
            </div>

            <div class="check-expression">
                ${escapeHTML(expressionUntil(checkIndex))}
            </div>

        </div>

        <div class="check-buttons">

            <button id="previousCheck">
                ◀ PREVIOUS
            </button>

            <button id="nextCheck">
                NEXT ▶
            </button>

            <button id="correctEntry">
                CORRECT
            </button>

            <button id="finishCheck" class="save-button">
                ✓ CORRECT
            </button>

            <button id="saveCalculation" class="save-button">
                SAVE HISTORY
            </button>

        </div>
    `;

    document.querySelector(".calculator-app").appendChild(panel);

    document
        .getElementById("closeCheck")
        .onclick = closeCheck;

    document
        .getElementById("previousCheck")
        .onclick = () => {

            if (checkIndex > 0) {
                checkIndex--;
                showCheckPanel();
            }
        };

    document
        .getElementById("nextCheck")
        .onclick = () => {

            if (checkIndex < entries.length - 1) {
                checkIndex++;
                showCheckPanel();
            }
        };

    document
        .getElementById("correctEntry")
        .onclick = correctCurrentEntry;

    document
        .getElementById("finishCheck")
        .onclick = () => {

            checked = true;
            closeCheck();

            modeDisplay.textContent =
                "✓ CHECKED — SAVE HISTORY";

            updateDisplay();
        };

    document
        .getElementById("saveCalculation")
        .onclick = saveCalculation;
}

function expressionUntil(index) {

    let text = "";

    for (let i = 0; i <= index; i++) {

        const item = entries[i];

        if (item.type === "number") {
            text += item.value;
        } else {

            const symbol = {
                "+": "+",
                "-": "−",
                "*": "×",
                "/": "÷"
            }[item.value];

            text += ` ${symbol} `;
        }
    }

    return text;
}

function correctCurrentEntry() {

    const item = entries[checkIndex];

    if (item.type === "number") {

        const newValue = prompt(
            "Enter corrected number:",
            item.value
        );

        if (newValue === null || newValue.trim() === "") {
            return;
        }

        if (!Number.isFinite(Number(newValue))) {
            alert("Please enter a valid number.");
            return;
        }

        item.value = Number(newValue);

    } else {

        const newOperator = prompt(
            "Enter operator: +  -  *  /",
            item.value
        );

        if (!["+", "-", "*", "/"].includes(newOperator)) {
            alert("Invalid operator.");
            return;
        }

        item.value = newOperator;
    }

    recalculateEntries();

    showCheckPanel();
}

function recalculateEntries() {

    if (entries.length === 0) return;

    let result = null;
    let pendingOperator = null;

    for (const item of entries) {

        if (item.type === "number") {

            if (result === null) {
                result = Number(item.value);
            } else if (pendingOperator) {

                result = operators[pendingOperator](
                    result,
                    Number(item.value)
                );

                pendingOperator = null;
            }

        } else {

            pendingOperator = item.value;
        }
    }

    lastResult = cleanNumber(result);
    current = String(lastResult);

    firstNumber = null;
    operator = null;
    waitingForNumber = true;

    updateDisplay();
}

function closeCheck() {

    const panel = document.querySelector(".check-panel");

    if (panel) {
        panel.remove();
    }
}

function saveCalculation() {

    if (!checked) {
        alert("Please complete CHECK first.");
        return;
    }

    if (lastResult === null) {
        return;
    }

    const history = getHistory();

    history.unshift({
        expression: expressionText(),
        result: lastResult,
        time: new Date().toLocaleString()
    });

    localStorage.setItem(
        "moneyCalculatorHistory",
        JSON.stringify(history)
    );

    closeCheck();

    modeDisplay.textContent = "✓ SAVED TO HISTORY";

    openHistory();
}

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

function openHistory() {

    const panel =
        document.getElementById("historyPanel");

    const list =
        document.getElementById("historyList");

    const history = getHistory();

    list.innerHTML = "";

    if (history.length === 0) {

        list.innerHTML = `
            <p style="text-align:center;color:#777">
                No saved calculations.
            </p>
        `;

    } else {

        history.forEach((item, index) => {

            const div = document.createElement("div");

            div.className = "history-item";

            div.innerHTML = `
                <div class="history-time">
                    ${escapeHTML(item.time)}
                </div>

                <div class="history-expression">
                    ${escapeHTML(item.expression)}
                </div>

                <div class="history-result">
                    = ${escapeHTML(String(item.result))}
                </div>

                <button
                    data-history-index="${index}"
                    style="
                        margin-top:10px;
                        padding:8px 12px;
                        border-radius:8px;
                        background:#222;
                        color:white;
                    "
                >
                    DELETE
                </button>
            `;

            list.appendChild(div);
        });

        list
            .querySelectorAll("[data-history-index]")
            .forEach(button => {

                button.onclick = () => {

                    const index =
                        Number(
                            button.dataset.historyIndex
                        );

                    history.splice(index, 1);

                    localStorage.setItem(
                        "moneyCalculatorHistory",
                        JSON.stringify(history)
                    );

                    openHistory();
                };
            });
    }

    panel.classList.remove("hidden");
}

function closeHistory() {

    document
        .getElementById("historyPanel")
        .classList.add("hidden");
}

function escapeHTML(value) {

    return value
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}

document
    .querySelectorAll("[data-value]")
    .forEach(button => {

        button.addEventListener("click", () => {

            const value =
                button.dataset.value;

            if (
                ["+", "-", "*", "/"]
                .includes(value)
            ) {

                entries.push({
                    type: "number",
                    value: Number(current)
                });

                inputOperator(value);

            } else {

                inputNumber(value);
            }
        });
    });

document
    .querySelectorAll("[data-action]")
    .forEach(button => {

        button.addEventListener("click", () => {

            const action =
                button.dataset.action;

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

                case "percent":
                    percentage();
                    break;

                case "sqrt":
                    squareRoot();
                    break;

                case "mu":
                    markup();
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

                case "check":
                    checkCalculation();
                    break;

                case "correct":
                    if (entries.length) {
                        checkCalculation();
                    }
                    break;

                case "history":
                    openHistory();
                    break;
            }
        });
    });

document
    .getElementById("closeHistory")
    .onclick = closeHistory;

document
    .getElementById("clearHistory")
    .onclick = () => {

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
    };

document.addEventListener("keydown", event => {

    if (
        event.target.tagName === "INPUT" ||
        event.target.tagName === "TEXTAREA"
    ) {
        return;
    }

    const key = event.key;

    if (/^[0-9.]$/.test(key)) {
        inputNumber(key);
        return;
    }

    if (
        ["+", "-", "*", "/"]
        .includes(key)
    ) {

        entries.push({
            type: "number",
            value: Number(current)
        });

        inputOperator(key);

        return;
    }

    if (key === "Enter" || key === "=") {
        equals();
        return;
    }

    if (key === "Escape") {
        clearAll();
        return;
    }

    if (key === "Backspace") {
        clearEntry();
    }
});

updateDisplay();