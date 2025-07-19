// Home page functionality
class HomePage {
  constructor() {
    this.currentTab = 'assistant-registrar';
    this.searchCache = new Map();
    this.init();
  }

  init() {
    this.initializeTabNavigation();
    this.initializeSearch();
    this.setupEventListeners();
    this.loadUserGreeting();
  }

  initializeTabNavigation() {
    const tabContainer = document.getElementById('exam-tabs');
    if (!tabContainer) return;

    // Initialize tab navigation
    if (window.TabNavigation) {
      this.tabNav = new TabNavigation(document.querySelector('.exam-tabs-section'));
      
      // Listen for tab changes
      document.querySelector('.exam-tabs-section').addEventListener('tabChanged', (e) => {
        this.currentTab = e.detail.tab.dataset.tab;
        this.updateTabContent();
      });
    } else {
      // Fallback manual tab handling
      this.setupManualTabNavigation();
    }
  }

  setupManualTabNavigation() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabPanels = document.querySelectorAll('.tab-panel');

    tabButtons.forEach((button, index) => {
      button.addEventListener('click', () => {
        // Remove active class from all tabs and panels
        tabButtons.forEach(btn => btn.classList.remove('active'));
        tabPanels.forEach(panel => panel.classList.remove('active'));

        // Add active class to clicked tab and corresponding panel
        button.classList.add('active');
        if (tabPanels[index]) {
          tabPanels[index].classList.add('active');
        }

        // Update current tab
        this.currentTab = button.dataset.tab;
        this.updateTabContent();
      });
    });
  }

  updateTabContent() {
    // Update content based on current tab
    const tabPanel = document.getElementById(this.currentTab);
    if (!tabPanel) return;

    // Scroll to the tab content section
    const tabContentSection = document.querySelector('.tab-content');
    if (tabContentSection) {
      tabContentSection.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'start' 
      });
    }
  }

  initializeSearch() {
    const searchInput = document.getElementById('search-input');
    const searchBtn = document.getElementById('search-btn');
    const googleSearchBtn = document.getElementById('google-search-btn');

    if (searchInput && searchBtn) {
      // Local search functionality
      searchBtn.addEventListener('click', () => {
        this.performLocalSearch(searchInput.value.trim());
      });

      searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
          this.performLocalSearch(searchInput.value.trim());
        }
      });

      // Live search suggestions
      searchInput.addEventListener('input', this.debounce((e) => {
        this.showSearchSuggestions(e.target.value.trim());
      }, 300));
    }

    if (googleSearchBtn) {
      googleSearchBtn.addEventListener('click', () => {
        this.performGoogleSearch(searchInput.value.trim());
      });
    }
  }

  async performLocalSearch(query) {
    if (!query) return;

    try {
      const results = await this.searchQuestions(query);
      this.displaySearchResults(results, query);
    } catch (error) {
      console.error('Search error:', error);
      this.showSearchError('Search temporarily unavailable');
    }
  }

  async searchQuestions(query) {
    // Check cache first
    const cacheKey = query.toLowerCase();
    if (this.searchCache.has(cacheKey)) {
      return this.searchCache.get(cacheKey);
    }

    const results = [];
    const subjects = [
      'Assistant Registrar',
      'Admin Officer', 
      'General Awareness and Current Affairs',
      'Quantitative Aptitudes and Reasoning'
    ];

    // Search through all question banks
    for (const subject of subjects) {
      try {
        const response = await fetch(`./questions/${subject}.json`);
        if (response.ok) {
          const questions = await response.json();
          const matches = this.findMatchingQuestions(questions, query, subject);
          results.push(...matches);
        }
      } catch (error) {
        console.warn(`Could not search ${subject}:`, error);
      }
    }

    // Cache results for 5 minutes
    this.searchCache.set(cacheKey, results);
    setTimeout(() => this.searchCache.delete(cacheKey), 5 * 60 * 1000);

    return results.slice(0, 20); // Limit to top 20 results
  }

  findMatchingQuestions(questions, query, subject) {
    const queryWords = query.toLowerCase().split(' ').filter(word => word.length > 2);
    const matches = [];

    questions.forEach((question, index) => {
      let score = 0;
      const questionText = question.question.toLowerCase();
      const explanation = (question.explanation || '').toLowerCase();

      // Score based on matches
      queryWords.forEach(word => {
        if (questionText.includes(word)) score += 3;
        if (explanation.includes(word)) score += 1;
        
        // Check options
        question.options?.forEach(option => {
          if (option.toLowerCase().includes(word)) score += 1;
        });
      });

      if (score > 0) {
        matches.push({
          question: question.question,
          subject,
          index,
          score,
          explanation: question.explanation,
          difficulty: question.difficulty || 'medium'
        });
      }
    });

    return matches.sort((a, b) => b.score - a.score);
  }

  displaySearchResults(results, query) {
    // Create or update search results container
    let resultsContainer = document.querySelector('.search-results-overlay');
    
    if (!resultsContainer) {
      resultsContainer = document.createElement('div');
      resultsContainer.className = 'search-results-overlay';
      document.body.appendChild(resultsContainer);
    }

    if (results.length === 0) {
      resultsContainer.innerHTML = `
        <div class="search-results-modal">
          <div class="search-results-header">
            <h3>Search Results for "${query}"</h3>
            <button class="close-search" onclick="this.closest('.search-results-overlay').remove()">×</button>
          </div>
          <div class="search-results-body">
            <div class="no-results">
              <div class="no-results-icon">🔍</div>
              <h4>No questions found</h4>
              <p>Try different keywords or check spelling</p>
            </div>
          </div>
        </div>
      `;
    } else {
      const resultsHTML = results.map(result => `
        <div class="search-result-item" onclick="openQuestionDetail('${result.subject}', ${result.index})">
          <div class="result-header">
            <span class="result-subject">${result.subject}</span>
            <span class="result-difficulty difficulty-${result.difficulty}">${result.difficulty}</span>
          </div>
          <div class="result-question">${this.highlightQuery(result.question, query)}</div>
          ${result.explanation ? `<div class="result-explanation">${this.truncateText(result.explanation, 100)}</div>` : ''}
        </div>
      `).join('');

      resultsContainer.innerHTML = `
        <div class="search-results-modal">
          <div class="search-results-header">
            <h3>Search Results for "${query}" (${results.length} found)</h3>
            <button class="close-search" onclick="this.closest('.search-results-overlay').remove()">×</button>
          </div>
          <div class="search-results-body">
            ${resultsHTML}
          </div>
        </div>
      `;
    }

    resultsContainer.style.display = 'flex';
    this.addSearchResultsStyles();
  }

  highlightQuery(text, query) {
    const words = query.toLowerCase().split(' ').filter(word => word.length > 2);
    let highlighted = text;

    words.forEach(word => {
      const regex = new RegExp(`(${word})`, 'gi');
      highlighted = highlighted.replace(regex, '<mark>$1</mark>');
    });

    return highlighted;
  }

  truncateText(text, maxLength) {
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  }

  performGoogleSearch(query) {
    if (!query) return;

    const searchQuery = encodeURIComponent(`${query} government exam preparation`);
    const googleUrl = `https://www.google.com/search?q=${searchQuery}`;
    window.open(googleUrl, '_blank');
  }

  showSearchSuggestions(query) {
    // Implement live search suggestions if needed
    if (query.length < 3) return;

    // This could show a dropdown with quick suggestions
    console.log('Showing suggestions for:', query);
  }

  showSearchError(message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'search-error alert alert-error';
    errorDiv.textContent = message;
    
    const searchContainer = document.querySelector('.search-container');
    if (searchContainer) {
      searchContainer.appendChild(errorDiv);
      setTimeout(() => errorDiv.remove(), 3000);
    }
  }

  setupEventListeners() {
    // Quick action buttons
    const actionButtons = document.querySelectorAll('.action-btn');
    actionButtons.forEach(button => {
      button.addEventListener('click', (e) => {
        e.preventDefault();
        const href = button.getAttribute('onclick') || button.href;
        
        if (href) {
          // Add loading state
          button.classList.add('loading');
          setTimeout(() => {
            window.location.href = href;
          }, 200);
        }
      });
    });

    // Tab hover effects
    const tabButtons = document.querySelectorAll('.tab-btn');
    tabButtons.forEach(button => {
      button.addEventListener('mouseenter', () => {
        this.preloadTabContent(button.dataset.tab);
      });
    });
  }

  preloadTabContent(tabId) {
    // Preload content for better UX
    const tab = document.getElementById(tabId);
    if (tab && !tab.dataset.preloaded) {
      // Mark as preloaded to avoid duplicate requests
      tab.dataset.preloaded = 'true';
      
      // Any preloading logic here
      console.log(`Preloaded content for ${tabId}`);
    }
  }

  loadUserGreeting() {
    if (window.LocalAccount) {
      const profile = window.LocalAccount.getProfile();
      if (profile) {
        this.showPersonalizedGreeting(profile);
      }
    }
  }

  showPersonalizedGreeting(profile) {
    const heroTitle = document.querySelector('.hero-title');
    if (heroTitle && profile.name !== 'Student') {
      const hour = new Date().getHours();
      let greeting = 'Good morning';
      
      if (hour >= 12 && hour < 17) greeting = 'Good afternoon';
      else if (hour >= 17) greeting = 'Good evening';

      heroTitle.textContent = `${greeting}, ${profile.name}!`;
    }
  }

  addSearchResultsStyles() {
    if (document.getElementById('search-results-styles')) return;

    const styles = document.createElement('style');
    styles.id = 'search-results-styles';
    styles.textContent = `
      .search-results-overlay {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.8);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 2000;
        padding: 2rem;
      }

      .search-results-modal {
        background: white;
        border-radius: var(--border-radius-xl);
        max-width: 800px;
        width: 100%;
        max-height: 80vh;
        display: flex;
        flex-direction: column;
        box-shadow: var(--shadow-xl);
      }

      .search-results-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 1.5rem;
        border-bottom: 2px solid var(--gray-200);
      }

      .search-results-header h3 {
        margin: 0;
        color: var(--gray-900);
      }

      .close-search {
        background: none;
        border: none;
        font-size: 1.5rem;
        cursor: pointer;
        color: var(--gray-500);
        padding: 0.5rem;
        border-radius: var(--border-radius-sm);
      }

      .close-search:hover {
        background: var(--gray-100);
        color: var(--gray-700);
      }

      .search-results-body {
        flex: 1;
        overflow-y: auto;
        padding: 1rem;
      }

      .search-result-item {
        padding: 1rem;
        border: 1px solid var(--gray-200);
        border-radius: var(--border-radius-md);
        margin-bottom: 1rem;
        cursor: pointer;
        transition: all var(--transition-fast);
      }

      .search-result-item:hover {
        border-color: var(--primary-color);
        background: var(--gray-50);
        transform: translateY(-1px);
        box-shadow: var(--shadow-md);
      }

      .result-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 0.5rem;
      }

      .result-subject {
        font-size: 0.875rem;
        font-weight: 600;
        color: var(--primary-color);
      }

      .result-difficulty {
        padding: 0.25rem 0.5rem;
        border-radius: var(--border-radius-sm);
        font-size: 0.75rem;
        font-weight: 600;
        text-transform: uppercase;
      }

      .difficulty-easy { background: var(--success-color); color: white; }
      .difficulty-medium { background: var(--warning-color); color: white; }
      .difficulty-hard { background: var(--error-color); color: white; }

      .result-question {
        font-weight: 500;
        color: var(--gray-900);
        margin-bottom: 0.5rem;
        line-height: 1.5;
      }

      .result-question mark {
        background: var(--warning-color);
        color: white;
        padding: 0.125rem 0.25rem;
        border-radius: 0.125rem;
      }

      .result-explanation {
        font-size: 0.875rem;
        color: var(--gray-600);
        line-height: 1.4;
      }

      .no-results {
        text-align: center;
        padding: 4rem 2rem;
      }

      .no-results-icon {
        font-size: 4rem;
        margin-bottom: 1rem;
        opacity: 0.5;
      }

      .no-results h4 {
        color: var(--gray-700);
        margin-bottom: 0.5rem;
      }

      .no-results p {
        color: var(--gray-500);
      }

      @media (max-width: 768px) {
        .search-results-overlay {
          padding: 1rem;
        }

        .search-results-modal {
          max-height: 90vh;
        }

        .search-results-header {
          padding: 1rem;
        }

        .search-results-header h3 {
          font-size: 1.125rem;
        }
      }
    `;

    document.head.appendChild(styles);
  }

  // Utility function for debouncing
  debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }
}

// Global functions for button interactions
window.openExamTab = function(examType) {
  const examPages = {
    'Assistant Registrar': 'src/pages/tabs/Assistant Registrar.html',
    'Admin Officer': 'src/pages/tabs/Admin Officer.html',
    'General Awareness and Current Affairs': 'src/pages/tabs/General Awareness and Current Affairs.html',
    'Quantitative Aptitudes and Reasoning': 'src/pages/tabs/Quantitative Aptitudes and Reasoning.html'
  };

  const url = examPages[examType];
  if (url) {
    window.location.href = url;
  }
};

window.startQuiz = function(examType) {
  const quizUrl = `src/pages/Quiz.html?subject=${encodeURIComponent(examType)}&mode=test`;
  window.location.href = quizUrl;
};

window.openQuestionDetail = function(subject, questionIndex) {
  const url = `src/pages/tabs/${subject}.html?question=${questionIndex}`;
  window.location.href = url;
};

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new HomePage();
});