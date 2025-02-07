const quotes = [
    { text: "The only limit to our realization of tomorrow is our doubts of today.", category: "Motivation" },
    { text: "In the middle of every difficulty lies opportunity.", category: "Inspiration" },
    { text: "Do what you can, with what you have, where you are.", category: "Action" }
  ];
  
  const quoteDisplay = document.getElementById("quoteDisplay");
  const newQuoteButton = document.getElementById("newQuote");
  
  // Function to show a random quote
  function showRandomQuote() {
    const randomIndex = Math.floor(Math.random() * quotes.length);
    const quote = quotes[randomIndex];
    quoteDisplay.innerHTML = `<p><strong>"${quote.text}"</strong> - <em>${quote.category}</em></p>`;
  }
  
  // Function to create a form for adding new quotes
  function createAddQuoteForm() {
    const form = document.createElement("div");
    form.innerHTML = `
      <input id="newQuoteText" type="text" placeholder="Enter a new quote" />
      <input id="newQuoteCategory" type="text" placeholder="Enter quote category" />
      <button onclick="addQuote()">Add Quote</button>
    `;
    document.body.appendChild(form);
  }
  
  // Function to add a new quote dynamically
  function addQuote() {
    const text = document.getElementById("newQuoteText").value;
    const category = document.getElementById("newQuoteCategory").value;
    if (text && category) {
      quotes.push({ text, category });
      showRandomQuote();
      document.getElementById("newQuoteText").value = "";
      document.getElementById("newQuoteCategory").value = "";
    }
  }
  
  // Initial display of a random quote
  showRandomQuote();
  
  // Event listener for new quote button
  newQuoteButton.addEventListener("click", showRandomQuote);
  
  // Create the add quote form
  createAddQuoteForm();
  