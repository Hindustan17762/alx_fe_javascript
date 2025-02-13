// Load quotes from local storage or use default quotes
let quotes = JSON.parse(localStorage.getItem("quotes")) || [
  { text: "Success is not final, failure is not fatal.", category: "Motivation" },
  { text: "The only way to do great work is to love what you do.", category: "Work" },
  { text: "Life is what happens when you're busy making other plans.", category: "Life" }
];

// Mock API URL (replace with a real server if available)
const API_URL = "https://jsonplaceholder.typicode.com/posts"; 

// Function to populate categories dynamically
function populateCategories() {
  const categoryFilter = document.getElementById("categoryFilter");
  const categories = [...new Set(quotes.map(q => q.category))]; // Unique categories

  categoryFilter.innerHTML = `<option value="all">All Categories</option>`; // Reset dropdown

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

// Function to display a random quote
function displayQuote(filteredQuotes = quotes) {
  const quoteDisplay = document.getElementById("quoteDisplay");

  if (filteredQuotes.length === 0) {
      quoteDisplay.innerHTML = "<p>No quotes available for this category.</p>";
      return;
  }

  const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
  quoteDisplay.innerHTML = `<p>${filteredQuotes[randomIndex].text}</p>`;
}

// Function to add a new quote and sync
async function addQuote() {
  const newQuoteText = document.getElementById("newQuoteText").value.trim();
  const newQuoteCategory = document.getElementById("newQuoteCategory").value.trim();

  if (!newQuoteText || !newQuoteCategory) {
      alert("Please enter both a quote and a category.");
      return;
  }

  const newQuote = { text: newQuoteText, category: newQuoteCategory };

  // Save locally first
  quotes.push(newQuote);
  localStorage.setItem("quotes", JSON.stringify(quotes)); // Save to local storage

  populateCategories(); // Update dropdown if a new category is added
  filterQuotes(); // Refresh quote display

  // Sync with the server
  syncQuotes();

  // Clear input fields
  document.getElementById("newQuoteText").value = "";
  document.getElementById("newQuoteCategory").value = "";
}

// Function to fetch quotes from the server
async function fetchQuotesFromServer() {
  try {
      const response = await fetch(API_URL);
      const serverQuotes = await response.json();

      let newQuotes = serverQuotes.map(q => ({
          text: q.title, // Using `title` as mock quote text
          category: "Server" // Assigning "Server" as category
      }));

      // Remove duplicates (if a quote text already exists, don’t add it)
      newQuotes = newQuotes.filter(newQ => !quotes.some(q => q.text === newQ.text));

      if (newQuotes.length > 0) {
          quotes.push(...newQuotes);
          localStorage.setItem("quotes", JSON.stringify(quotes));
          populateCategories();
          filterQuotes();
          showSyncNotification(`Fetched ${newQuotes.length} new quotes from the server.`);
      }

  } catch (error) {
      console.error("Error fetching quotes:", error);
      alert("Failed to fetch quotes from the server.");
  }
}

// Function to sync quotes with the server (fetch + post)
async function syncQuotes() {
  await fetchQuotesFromServer(); // Fetch latest quotes before syncing

  try {
      for (const quote of quotes) {
          await fetch(API_URL, {
              method: "POST",
              headers: {
                  "Content-Type": "application/json"
              },
              body: JSON.stringify(quote)
          });
      }

      showSyncNotification("Quotes synced with server!"); // Required message

  } catch (error) {
      console.error("Sync error:", error);
      alert("Failed to sync with the server. Quotes are saved locally.");
  }
}

// Function to show sync notification
function showSyncNotification(message) {
  const notification = document.createElement("div");
  notification.textContent = message;
  notification.style.position = "fixed";
  notification.style.bottom = "10px";
  notification.style.right = "10px";
  notification.style.padding = "10px";
  notification.style.background = "#28a745";
  notification.style.color = "#fff";
  notification.style.borderRadius = "5px";

  document.body.appendChild(notification);
  setTimeout(() => document.body.removeChild(notification), 3000);
}

// Auto-fetch new quotes every 30 seconds
setInterval(syncQuotes, 30000);

// Initialize functions on page load
document.addEventListener("DOMContentLoaded", () => {
  populateCategories();
  filterQuotes();
  syncQuotes();
});
