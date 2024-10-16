

function restart() {
    document.querySelector(".total").innerText = "₹0";
    Array.from(document.getElementsByTagName("input")).forEach(e => {
        e.value = "";
    });
}

function calculateTotal() {
    let a = 500 * (document.querySelector("#five").value || 0);
    let b = 200 * (document.querySelector("#two").value || 0);
    let c = 100 * (document.querySelector("#one").value || 0);
    let d = 50 * (document.querySelector("#fifty").value || 0);
    let e = 20 * (document.querySelector("#twenty").value || 0);
    let f = 10 * (document.querySelector("#ten").value || 0);
    let total = a + b + c + d + e + f;
    document.querySelector(".total").innerText = "₹" + total;
}



document.querySelector("#butt").addEventListener("click", () => {
    restart();
});

Array.from(document.getElementsByTagName("input")).forEach(input => {
    input.addEventListener("input", calculateTotal);
});





