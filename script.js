let transactions = JSON.parse(localStorage.getItem("transactions")) || [];

function addTransaction() {
    const title = document.getElementById("title").value;
    const amount = Number(document.getElementById("amount").value);
    const type = document.getElementById("type").value;

    if (title === "" || amount === "") {
        alert("Please fill all details!");
        return;
    }

    const transaction = { id: Date.now(), title, amount, type };
    transactions.push(transaction);

    localStorage.setItem("transactions", JSON.stringify(transactions));

    document.getElementById("title").value = "";
    document.getElementById("amount").value = "";

    displayTransactions();
    calculateSummary();
    updateChart();
}

function displayTransactions() {
    const list = document.getElementById("transactionList");
    list.innerHTML = "";

    transactions.forEach(t => {
        const li = document.createElement("li");
        li.innerHTML = `${t.title} - ₹${t.amount} (${t.type})
            <button style="float:right;" onclick="deleteTransaction(${t.id})">X</button>`;
        list.appendChild(li);
    });
}

function deleteTransaction(id) {
    transactions = transactions.filter(t => t.id !== id);
    localStorage.setItem("transactions", JSON.stringify(transactions));
    displayTransactions();
    calculateSummary();
    updateChart();
}

function calculateSummary() {
    let income = transactions
        .filter(t => t.type === "income")
        .reduce((sum, t) => sum + t.amount, 0);

    let expense = transactions
        .filter(t => t.type === "expense")
        .reduce((sum, t) => sum + t.amount, 0);

    document.getElementById("totalIncome").innerText = income;
    document.getElementById("totalExpense").innerText = expense;
    document.getElementById("balance").innerText = income - expense;
}

let chart;

function updateChart() {
    const income = transactions.filter(t => t.type === "income").reduce((a,b)=>a+b.amount,0);
    const expense = transactions.filter(t => t.type === "expense").reduce((a,b)=>a+b.amount,0);

    const ctx = document.getElementById("financeChart").getContext("2d");

    if (chart) chart.destroy();

    chart = new Chart(ctx, {
        type: "pie",
        data: {
            labels: ["Income", "Expenses"],
            datasets: [{
                data: [income, expense],
                backgroundColor: ["green", "red"]
            }]
        }
    });
}

displayTransactions();
calculateSummary();
updateChart();
