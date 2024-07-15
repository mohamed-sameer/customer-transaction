document.addEventListener("DOMContentLoaded", function () {
  const customers = [
    { id: 1, name: "Ahmed Ali" },
    { id: 2, name: "Aya Elsayed" },
    { id: 3, name: "Mina Adel" },
    { id: 4, name: "Sarah Reda" },
    { id: 5, name: "Mohamed Sayed" },
  ];

  const transactions = [
    { id: 1, customer_id: 1, date: "2022-01-01", amount: 1000 },
    { id: 2, customer_id: 1, date: "2022-01-02", amount: 2000 },
    { id: 3, customer_id: 2, date: "2022-01-01", amount: 550 },
    { id: 4, customer_id: 3, date: "2022-01-01", amount: 500 },
    { id: 5, customer_id: 2, date: "2022-01-02", amount: 1300 },
    { id: 6, customer_id: 4, date: "2022-01-01", amount: 750 },
    { id: 7, customer_id: 3, date: "2022-01-02", amount: 1250 },
    { id: 8, customer_id: 5, date: "2022-01-01", amount: 2500 },
    { id: 9, customer_id: 5, date: "2022-01-02", amount: 875 },
  ];

  const customerTableBody = document.querySelector("#customerTable tbody");
  const filterNameInput = document.getElementById("filterName");
  const filterAmountInput = document.getElementById("filterAmount");
  const filterButton = document.getElementById("filterButton");
  const transactionChart = document
    .getElementById("transactionChart")
    .getContext("2d");

  let chart = null;

  function displayCustomerTransactions() {
    customerTableBody.innerHTML = "";
    const filterName = filterNameInput.value.toLowerCase();
    const filterAmount = parseFloat(filterAmountInput.value);

    transactions.forEach((transaction) => {
      const customer = customers.find((c) => c.id === transaction.customer_id);
      if (!customer) return;

      const customerName = customer.name.toLowerCase();
      const transactionAmount = transaction.amount;

      if (
        (filterName && !customerName.includes(filterName)) ||
        (!isNaN(filterAmount) && transactionAmount < filterAmount)
      ) {
        return;
      }

      const row = document.createElement("tr");
      row.innerHTML = `
              <td>${customer.name}</td>
              <td>${transaction.date}</td>
              <td>${transaction.amount}</td>
          `;
      row.addEventListener("click", () => {
        displayTransactionChart(customer.id);
      });
      customerTableBody.appendChild(row);
    });
  }

  function displayTransactionChart(customerId) {
    const customerTransactions = transactions.filter(
      (t) => t.customer_id === customerId
    );
    const transactionData = customerTransactions.reduce((acc, transaction) => {
      const date = transaction.date;
      acc[date] = (acc[date] || 0) + transaction.amount;
      return acc;
    }, {});

    const labels = Object.keys(transactionData);
    const data = Object.values(transactionData);

    if (chart) chart.destroy();
    chart = new Chart(transactionChart, {
      type: "bar",
      data: {
        labels,
        datasets: [
          {
            label: "Transaction Amount",
            data,
            backgroundColor: "rgba(75, 192, 192, 0.2)",
            borderColor: "rgba(75, 192, 192, 1)",
            borderWidth: 1,
          },
        ],
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      },
    });
  }

  filterButton.addEventListener("click", displayCustomerTransactions);

  displayCustomerTransactions();
});
