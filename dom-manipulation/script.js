// Load quotes from local storage or use default quotes
let quotes = JSON.parse(localStorage.getItem("quotes")) || [
  { text: "Success is not final, failure is not fatal.", category: "Motivation" },
  { text: "The only way to do great work is to love what you do.", category: "Work" },
  { text: "Life is what happens when you're busy making other plans.", category: "Life" }
];

// Function to populate categories in the dropdown
function populateCategories() {
  const categoryFilter = document.getElementById("categoryFilter");
  const categories = [...new Set(quotes.map(q => q.category))]; // Get unique categories

  // Clear existing options except "All Categories"
  categoryFilter.innerHTML = `<option value="all">All Categories</option>`;

  // Add categories dynamically
  categories.forEach(category => {
      let option = document.createElement("option");
      option.value = category;
      option.textContent = category;
      categoryFilter.appendChild(option);
  });

  // Restore last selected category from local storage
  const lastSelected = localStorage.getItem("selectedCategory");
  if (lastSelected) {
      categoryFilter.value = lastSelected;
  }
}

// Function to filter quotes based on selected category
function filterQuotes() {
  const selectedCategory = document.getElementById("categoryFilter").value;
  localStorage.setItem("selectedCategory", selectedCategory); // Save selection

  const filteredQuotes = selectedCategory === "all"
      ? quotes
      : quotes.filter(q => q.category === selectedCategory);

  displayQuote(filteredQuotes);
}

// Function to display a random quote from the filtered list
function displayQuote(filteredQuotes = quotes) {
  const quoteDisplay = document.getElementById("quoteDisplay");

  if (filteredQuotes.length === 0) {
      quoteDisplay.innerHTML = "<p>No quotes available for this category.</p>";
      return;
  }

  const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
  quoteDisplay.innerHTML = `<p>${filteredQuotes[randomIndex].text}</p>`;
}

// Function to add a new quote
function addQuote() {
  const newQuoteText = document.getElementById("newQuoteText").value.trim();
  const newQuoteCategory = document.getElementById("newQuoteCategory").value.trim();

  if (!newQuoteText || !newQuoteCategory) {
      alert("Please enter both a quote and a category.");
      return;
  }

  const newQuote = { text: newQuoteText, category: newQuoteCategory };
  quotes.push(newQuote);
  localStorage.setItem("quotes", JSON.stringify(quotes)); // Save to local storage

  populateCategories(); // Update dropdown if a new category is added
  filterQuotes(); // Refresh quote display based on the selected filter

  // Clear input fields
  document.getElementById("newQuoteText").value = "";
  document.getElementById("newQuoteCategory").value = "";

  alert("Quote added successfully!");
}

// Initialize functions on page load
document.addEventListener("DOMContentLoaded", () => {
  populateCategories();
  filterQuotes();
});
