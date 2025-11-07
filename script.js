// DOM Elements
const searchInput = document.getElementById('searchInput');
const searchButton = document.getElementById('searchButton');
const resultsDiv = document.getElementById('results');

// Event Listeners
searchButton.addEventListener('click', performSearch);
searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        performSearch();
    }
});

async function performSearch() {
    const searchTerm = searchInput.value.trim();
    
    if (!searchTerm) {
        showMessage('Please enter a search term');
        return;
    }

    try {
        showMessage('Searching...');
        const response = await fetch(`https://openlibrary.org/search.json?q=${encodeURIComponent(searchTerm)}`);
        
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await response.json();
        displayResults(data);

    } catch (error) {
        showMessage('An error occurred while searching. Please try again later.');
        console.error('Search error:', error);
    }
}

function displayResults(data) {
    if (!data.docs || data.docs.length === 0) {
        showMessage('No books found. Try different keywords.');
        return;
    }

    resultsDiv.innerHTML = `
        <h2>Found ${data.numFound} results</h2>
        <div class="books-grid">
            ${data.docs.slice(0, 10).map(book => createBookCard(book)).join('')}
        </div>
    `;
}

function createBookCard(book) {
    const coverImage = book.cover_i 
        ? `https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg`
        : 'https://via.placeholder.com/150x200?text=No+Cover';

    return `
        <div class="book-card">
            <img src="${coverImage}" alt="${book.title}" class="book-cover">
            <div class="book-info">
                <h3 class="book-title">${escapeHtml(book.title)}</h3>
                <p class="book-author">${escapeHtml(book.author_name?.[0] || 'Unknown Author')}</p>
                <p class="book-year">${book.first_publish_year || 'Year unknown'}</p>
                ${book.key ? `<a href="https://openlibrary.org${book.key}" target="_blank" class="book-link">View Details</a>` : ''}
            </div>
        </div>
    `;
}

function showMessage(message) {
    resultsDiv.innerHTML = `<div class="message">${message}</div>`;
}

function escapeHtml(unsafe) {
    if (!unsafe) return '';
    return unsafe
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}
