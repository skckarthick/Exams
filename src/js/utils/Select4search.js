// Text selection to Google search utility
class Select4Search {
  constructor() {
    this.isEnabled = true;
    this.minSelectionLength = 3;
    this.maxSelectionLength = 100;
    this.searchEngine = 'google'; // google, bing, duckduckgo
    this.contextMenu = null;
    
    this.init();
  }

  init() {
    this.createContextMenu();
    this.attachEventListeners();
    this.loadSettings();
  }

  createContextMenu() {
    this.contextMenu = document.createElement('div');
    this.contextMenu.className = 'select4search-menu';
    this.contextMenu.innerHTML = `
      <div class="search-menu-item" data-engine="google">
        <svg width="16" height="16" viewBox="0 0 24 24">
          <path fill="#4285f4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
          <path fill="#34a853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
          <path fill="#fbbc05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
          <path fill="#ea4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
        </svg>
        Search Google
      </div>
      <div class="search-menu-item" data-engine="bing">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="#0078d4">
          <path d="M5.71 3v11.33l3.29 1.65 6.49-2.47V9.67L10.86 8V5.33L5.71 3z"/>
        </svg>
        Search Bing
      </div>
      <div class="search-menu-item" data-engine="duckduckgo">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="#de5833">
          <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm0 2c5.523 0 10 4.477 10 10s-4.477 10-10 10S2 17.523 2 12 6.477 2 12 2z"/>
        </svg>
        Search DuckDuckGo
      </div>
      <div class="search-menu-divider"></div>
      <div class="search-menu-item" data-action="copy">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
          <path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/>
        </svg>
        Copy Text
      </div>
    `;
    
    document.body.appendChild(this.contextMenu);
    this.addMenuStyles();
  }

  addMenuStyles() {
    if (document.getElementById('select4search-styles')) return;

    const styles = document.createElement('style');
    styles.id = 'select4search-styles';
    styles.textContent = `
      .select4search-menu {
        position: fixed;
        background: white;
        border: 1px solid var(--gray-300);
        border-radius: var(--border-radius-md);
        box-shadow: var(--shadow-lg);
        padding: 0.5rem 0;
        min-width: 180px;
        z-index: 10000;
        display: none;
        font-family: var(--font-primary);
        font-size: 0.875rem;
      }

      .search-menu-item {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        padding: 0.75rem 1rem;
        cursor: pointer;
        transition: background-color var(--transition-fast);
        color: var(--gray-700);
      }

      .search-menu-item:hover {
        background-color: var(--gray-100);
        color: var(--gray-900);
      }

      .search-menu-divider {
        height: 1px;
        background-color: var(--gray-200);
        margin: 0.5rem 0;
      }

      .select4search-highlight {
        background-color: rgba(37, 99, 235, 0.2);
        border-radius: 2px;
        padding: 0 2px;
        animation: highlightFade 2s ease-out;
      }

      @keyframes highlightFade {
        0% { background-color: rgba(37, 99, 235, 0.4); }
        100% { background-color: rgba(37, 99, 235, 0.1); }
      }

      /* Mobile styles */
      @media (max-width: 768px) {
        .select4search-menu {
          min-width: 160px;
          font-size: 0.8rem;
        }
        
        .search-menu-item {
          padding: 0.875rem 1rem;
        }
      }
    `;

    document.head.appendChild(styles);
  }

  attachEventListeners() {
    // Text selection events
    document.addEventListener('mouseup', (e) => this.handleTextSelection(e));
    document.addEventListener('touchend', (e) => this.handleTextSelection(e));
    
    // Context menu clicks
    this.contextMenu.addEventListener('click', (e) => this.handleMenuClick(e));
    
    // Hide menu on outside click
    document.addEventListener('click', (e) => {
      if (!this.contextMenu.contains(e.target)) {
        this.hideMenu();
      }
    });
    
    // Hide menu on scroll
    document.addEventListener('scroll', () => this.hideMenu());
    
    // Hide menu on window resize
    window.addEventListener('resize', () => this.hideMenu());
    
    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => this.handleKeyboard(e));
  }

  handleTextSelection(e) {
    if (!this.isEnabled) return;
    
    // Small delay to ensure selection is complete
    setTimeout(() => {
      const selection = window.getSelection();
      const selectedText = selection.toString().trim();
      
      if (this.isValidSelection(selectedText)) {
        this.showMenu(e, selectedText);
      } else {
        this.hideMenu();
      }
    }, 10);
  }

  isValidSelection(text) {
    if (!text) return false;
    if (text.length < this.minSelectionLength) return false;
    if (text.length > this.maxSelectionLength) return false;
    
    // Don't show menu for selections that are just whitespace or punctuation
    if (!/[a-zA-Z0-9]/.test(text)) return false;
    
    // Don't show menu if selection is inside an input field
    const activeElement = document.activeElement;
    if (activeElement && (
      activeElement.tagName === 'INPUT' || 
      activeElement.tagName === 'TEXTAREA' ||
      activeElement.contentEditable === 'true'
    )) {
      return false;
    }
    
    return true;
  }

  showMenu(e, selectedText) {
    this.selectedText = selectedText;
    this.contextMenu.style.display = 'block';
    
    // Position the menu
    const x = e.clientX || (e.touches && e.touches[0].clientX) || 0;
    const y = e.clientY || (e.touches && e.touches[0].clientY) || 0;
    
    this.positionMenu(x, y);
    
    // Add highlight to selected text
    this.highlightSelection();
  }

  positionMenu(x, y) {
    const menu = this.contextMenu;
    const menuRect = menu.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    
    // Adjust horizontal position
    let left = x + 10;
    if (left + menuRect.width > viewportWidth) {
      left = x - menuRect.width - 10;
    }
    
    // Adjust vertical position
    let top = y + 10;
    if (top + menuRect.height > viewportHeight) {
      top = y - menuRect.height - 10;
    }
    
    // Ensure menu stays within viewport
    left = Math.max(10, Math.min(left, viewportWidth - menuRect.width - 10));
    top = Math.max(10, Math.min(top, viewportHeight - menuRect.height - 10));
    
    menu.style.left = `${left}px`;
    menu.style.top = `${top}px`;
  }

  hideMenu() {
    this.contextMenu.style.display = 'none';
    this.removeHighlight();
  }

  highlightSelection() {
    const selection = window.getSelection();
    if (selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      
      try {
        // Create highlight span
        const highlight = document.createElement('span');
        highlight.className = 'select4search-highlight';
        highlight.appendChild(range.extractContents());
        range.insertNode(highlight);
        
        // Store reference for cleanup
        this.currentHighlight = highlight;
      } catch (error) {
        // Silently handle cases where highlighting fails
        console.debug('Could not highlight selection:', error);
      }
    }
  }

  removeHighlight() {
    if (this.currentHighlight) {
      const parent = this.currentHighlight.parentNode;
      if (parent) {
        // Replace highlight with its contents
        while (this.currentHighlight.firstChild) {
          parent.insertBefore(this.currentHighlight.firstChild, this.currentHighlight);
        }
        parent.removeChild(this.currentHighlight);
        
        // Normalize text nodes
        parent.normalize();
      }
      this.currentHighlight = null;
    }
  }

  handleMenuClick(e) {
    e.preventDefault();
    e.stopPropagation();
    
    const menuItem = e.target.closest('.search-menu-item');
    if (!menuItem) return;
    
    const engine = menuItem.dataset.engine;
    const action = menuItem.dataset.action;
    
    if (engine) {
      this.searchText(this.selectedText, engine);
    } else if (action === 'copy') {
      this.copyText(this.selectedText);
    }
    
    this.hideMenu();
  }

  searchText(text, engine = this.searchEngine) {
    const encodedText = encodeURIComponent(text);
    let searchUrl;
    
    switch (engine) {
      case 'google':
        searchUrl = `https://www.google.com/search?q=${encodedText}`;
        break;
      case 'bing':
        searchUrl = `https://www.bing.com/search?q=${encodedText}`;
        break;
      case 'duckduckgo':
        searchUrl = `https://duckduckgo.com/?q=${encodedText}`;
        break;
      default:
        searchUrl = `https://www.google.com/search?q=${encodedText}`;
    }
    
    // Add context for exam-related searches
    if (this.isExamContext()) {
      searchUrl += ' exam preparation government';
    }
    
    window.open(searchUrl, '_blank', 'noopener,noreferrer');
    
    // Track usage
    this.trackSearch(text, engine);
  }

  copyText(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(() => {
        this.showNotification('Text copied to clipboard');
      }).catch(() => {
        this.fallbackCopy(text);
      });
    } else {
      this.fallbackCopy(text);
    }
  }

  fallbackCopy(text) {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    try {
      document.execCommand('copy');
      this.showNotification('Text copied to clipboard');
    } catch (err) {
      this.showNotification('Could not copy text', 'error');
    }
    
    document.body.removeChild(textArea);
  }

  showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `select4search-notification ${type}`;
    notification.textContent = message;
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: ${type === 'error' ? 'var(--error-color)' : 'var(--success-color)'};
      color: white;
      padding: 0.75rem 1rem;
      border-radius: var(--border-radius-md);
      box-shadow: var(--shadow-lg);
      z-index: 10001;
      font-size: 0.875rem;
      font-weight: 500;
      animation: slideInRight 0.3s ease-out;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
      notification.style.animation = 'slideOutRight 0.3s ease-in';
      setTimeout(() => {
        if (notification.parentNode) {
          notification.parentNode.removeChild(notification);
        }
      }, 300);
    }, 2000);
  }

  handleKeyboard(e) {
    // Ctrl/Cmd + Shift + S to search selected text
    if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'S') {
      e.preventDefault();
      
      const selection = window.getSelection();
      const selectedText = selection.toString().trim();
      
      if (this.isValidSelection(selectedText)) {
        this.searchText(selectedText);
      }
    }
    
    // Escape to hide menu
    if (e.key === 'Escape') {
      this.hideMenu();
    }
  }

  isExamContext() {
    // Check if we're on an exam-related page
    const url = window.location.href.toLowerCase();
    const title = document.title.toLowerCase();
    
    return url.includes('exam') || 
           url.includes('quiz') || 
           url.includes('test') ||
           title.includes('exam') ||
           title.includes('quiz') ||
           title.includes('preparation');
  }

  trackSearch(text, engine) {
    // Track search usage for analytics
    const searchData = {
      text: text.substring(0, 50), // Limit for privacy
      engine: engine,
      timestamp: new Date().toISOString(),
      page: window.location.pathname
    };
    
    // Store in local storage for usage statistics
    const searches = JSON.parse(localStorage.getItem('select4search_history') || '[]');
    searches.unshift(searchData);
    
    // Keep only last 100 searches
    if (searches.length > 100) {
      searches.splice(100);
    }
    
    localStorage.setItem('select4search_history', JSON.stringify(searches));
  }

  loadSettings() {
    const settings = JSON.parse(localStorage.getItem('select4search_settings') || '{}');
    
    this.isEnabled = settings.enabled !== false;
    this.searchEngine = settings.searchEngine || 'google';
    this.minSelectionLength = settings.minSelectionLength || 3;
    this.maxSelectionLength = settings.maxSelectionLength || 100;
  }

  saveSettings() {
    const settings = {
      enabled: this.isEnabled,
      searchEngine: this.searchEngine,
      minSelectionLength: this.minSelectionLength,
      maxSelectionLength: this.maxSelectionLength
    };
    
    localStorage.setItem('select4search_settings', JSON.stringify(settings));
  }

  // Public API methods
  enable() {
    this.isEnabled = true;
    this.saveSettings();
  }

  disable() {
    this.isEnabled = false;
    this.hideMenu();
    this.saveSettings();
  }

  setSearchEngine(engine) {
    if (['google', 'bing', 'duckduckgo'].includes(engine)) {
      this.searchEngine = engine;
      this.saveSettings();
    }
  }

  getSearchHistory() {
    return JSON.parse(localStorage.getItem('select4search_history') || '[]');
  }

  clearSearchHistory() {
    localStorage.removeItem('select4search_history');
  }

  destroy() {
    // Remove event listeners and DOM elements
    document.removeEventListener('mouseup', this.handleTextSelection);
    document.removeEventListener('touchend', this.handleTextSelection);
    document.removeEventListener('keydown', this.handleKeyboard);
    
    if (this.contextMenu && this.contextMenu.parentNode) {
      this.contextMenu.parentNode.removeChild(this.contextMenu);
    }
    
    const styles = document.getElementById('select4search-styles');
    if (styles && styles.parentNode) {
      styles.parentNode.removeChild(styles);
    }
  }
}

// Add CSS animations
const animationStyles = document.createElement('style');
animationStyles.textContent = `
  @keyframes slideInRight {
    from {
      transform: translateX(100%);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }
  
  @keyframes slideOutRight {
    from {
      transform: translateX(0);
      opacity: 1;
    }
    to {
      transform: translateX(100%);
      opacity: 0;
    }
  }
`;
document.head.appendChild(animationStyles);

// Initialize Select4Search when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  window.Select4Search = new Select4Search();
});