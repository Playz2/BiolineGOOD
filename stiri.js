const API_KEY = '0cec17c681e16213647a31e3efddd8b9'; // Replace with your actual GNews API key
const TRANSLATE_API_KEY = 'YOUR_TRANSLATE_API_KEY'; // Replace with your actual translation API key
let currentPage = 1;
let currentTopic = 'biology';
let currentSearch = '';

// DOM Elements
const newsContainer = document.getElementById('news-container');
const loadingElement = document.getElementById('loading');
const errorElement = document.getElementById('error-message');
const searchInput = document.getElementById('search-input');
const searchButton = document.getElementById('search-button');
const sourceSelect = document.getElementById('source-select');
const prevPageButton = document.getElementById('prev-page');
const nextPageButton = document.getElementById('next-page');

// Topic mapping to search terms
const topicMappings = {
    'biology': 'biology',
    'microbiology': 'microbiology',
    'genetics': 'genetics DNA',
    'ecology': 'ecology environment',
    'biotech': 'biotechnology'
};

// Initialize the news feed
document.addEventListener('DOMContentLoaded', () => {
    fetchNews();
    
    // Event listeners
    searchButton.addEventListener('click', () => {
        currentSearch = searchInput.value;
        currentPage = 1;
        fetchNews();
    });
    
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            currentSearch = searchInput.value;
            currentPage = 1;
            fetchNews();
        }
    });
    
    sourceSelect.addEventListener('change', () => {
        currentTopic = sourceSelect.value;
        currentPage = 1;
        fetchNews();
    });
    
    prevPageButton.addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage--;
            fetchNews();
            newsContainer.scrollIntoView({ behavior: 'smooth' });
        }
    });
    
    nextPageButton.addEventListener('click', () => {
        currentPage++;
        fetchNews();
        newsContainer.scrollIntoView({ behavior: 'smooth' });
    });
});

// Update the fetchNews function with a different pagination approach
async function fetchNews() {
    showLoading(true);
    hideError();
    
    try {
        const searchTerm = currentSearch || topicMappings[currentTopic];
        const articlesPerPage = 6;
        
        // Use page parameter instead of offset
        const url = `https://gnews.io/api/v4/search?q=${encodeURIComponent(searchTerm)}&lang=en&country=us&max=10&page=${currentPage}&apikey=${API_KEY}`;
        
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (data.articles && data.articles.length > 0) {
            // Calculate the slice for current page
            const startIndex = 0;
            const endIndex = articlesPerPage;
            const pageArticles = data.articles.slice(startIndex, endIndex);
            
            // Clear existing content
            newsContainer.innerHTML = '';
            
            // Translate only the articles for current page
            const translatedArticles = await translateArticles(pageArticles);
            displayNews(translatedArticles);
            
            // Update pagination buttons
            prevPageButton.disabled = currentPage <= 1;
            nextPageButton.disabled = data.articles.length <= articlesPerPage;
            
            // Store total articles count
            const totalArticles = data.totalArticles || 0;
            const totalPages = Math.ceil(totalArticles / articlesPerPage);
            
            if (currentPage > totalPages) {
                currentPage = totalPages;
                fetchNews();
                return;
            }
        } else {
            newsContainer.innerHTML = '<p class="loading">Nu au fost găsite știri. Încercați alte cuvinte cheie.</p>';
            prevPageButton.disabled = true;
            nextPageButton.disabled = true;
        }
    } catch (error) {
        console.error('Error fetching news:', error);
        showError('A apărut o eroare la încărcarea știrilor. Vă rugăm să încercați din nou mai târziu.');
    } finally {
        showLoading(false);
    }
}

async function translateArticles(articles) {

    return articles.map(article => {
        return {
            ...article,
            title: mockTranslate(article.title),
            description: mockTranslate(article.description)
        };
    });
}

// Mock translation function (replace with actual API in production)
function mockTranslate(text) {
    // This is a very basic mock translation - in production use a proper translation API
    const translations = {
        'Biology': 'Biologie',
        'Genetics': 'Genetică',
        'DNA': 'ADN',
        'Research': 'Cercetare',
        'Scientists': 'Oamenii de știință',
        'Study': 'Studiu',
        'Cell': 'Celulă',
        'Cells': 'Celule',
        'Discovered': 'Descoperit',
        'New': 'Nou',
        'Species': 'Specie'
        // Add more translations as needed
    };
    
    let translated = text;
    Object.keys(translations).forEach(key => {
        const regex = new RegExp(`\\b${key}\\b`, 'gi');
        translated = translated.replace(regex, translations[key]);
    });
    
    return translated;
}

// Display news in the container
function displayNews(articles) {
    newsContainer.innerHTML = '';
    
    articles.forEach(article => {
        const date = new Date(article.publishedAt).toLocaleDateString('ro-RO');
        
        const card = document.createElement('div');
        card.className = 'news-card';
        
        const imageHtml = article.image ? 
            `<img src="${article.image}" alt="${article.title}" class="news-image">` : 
            `<div class="news-placeholder-image">Imagine indisponibilă</div>`;
        
        card.innerHTML = `
            ${imageHtml}
            <div class="news-content">
                <h3 class="news-title">${article.title}</h3>
                <p class="news-description">${article.description}</p>
                <div class="news-source">
                    <span>${article.source.name}</span>
                    <span class="news-date">${date}</span>
                </div>
                <a href="${article.url}" target="_blank" class="news-link">Citește mai mult</a>
            </div>
        `;
        
        newsContainer.appendChild(card);
    });
}

// Helper functions for UI
function showLoading(isLoading) {
    loadingElement.style.display = isLoading ? 'block' : 'none';
}

function showError(message) {
    errorElement.textContent = message;
    errorElement.style.display = 'block';
}

function hideError() {
    errorElement.style.display = 'none';
}


async function translateText(text, targetLanguage) {
    
    return { translatedText: mockTranslate(text) };
}