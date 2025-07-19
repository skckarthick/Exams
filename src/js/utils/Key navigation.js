// Keyboard navigation utility for enhanced accessibility and user experience
class KeyNavigation {
  constructor() {
    this.shortcuts = new Map();
    this.contexts = new Map();
    this.currentContext = 'global';
    this.isEnabled = true;
    this.preventDefaults = new Set();
    
    this.init();
  }

  init() {
    this.setupGlobalShortcuts();
    this.attachEventListeners();
    this.loadSettings();
  }

  setupGlobalShortcuts() {
    // Global navigation shortcuts
    this.addShortcut('global', 'Escape', () => this.handleEscape());
    this.addShortcut('global', 'F1', () => this.showHelp());
    this.addShortcut('global', 'ctrl+/', () => this.showShortcuts());
    this.addShortcut('global', 'alt+h', () => window.location.href = '/');
    this.addShortcut('global', 'alt+d', () => window.location.href = '/src/pages/dashboard.html');
    this.addShortcut('global', 'alt+q', () => window.location.href = '/src/pages/Quiz.html');
    
    // Search shortcuts
    this.addShortcut('global', 'ctrl+k', () => this.focusSearch());
    this.addShortcut('global', 'ctrl+shift+f', () => this.focusSearch());
    
    // Theme toggle
    this.addShortcut('global', 'ctrl+shift+t', () => this.toggleTheme());
    
    // Quiz/Study specific shortcuts
    this.setupQuizShortcuts();
    this.setupStudyShortcuts();
  }

  setupQuizShortcuts() {
    const quizContext = 'quiz';
    
    // Navigation
    this.addShortcut(quizContext, 'ArrowRight', () => this.quizNext());
    this.addShortcut(quizContext, 'ArrowLeft', () => this.quizPrevious());
    this.addShortcut(quizContext, 'Enter', () => this.quizNext());
    this.addShortcut(quizContext, 'Space', () => this.quizToggleAnswer());
    
    // Option selection
    this.addShortcut(quizContext, '1', () => this.selectOption(0));
    this.addShortcut(quizContext, '2', () => this.selectOption(1));
    this.addShortcut(quizContext, '3', () => this.selectOption(2));
    this.addShortcut(quizContext, '4', () => this.selectOption(3));
    this.addShortcut(quizContext, '5', () => this.selectOption(4));
    
    // Quiz controls
    this.addShortcut(quizContext, 'ctrl+s', () => this.saveProgress());
    this.addShortcut(quizContext, 'ctrl+enter', () => this.submitQuiz());
    this.addShortcut(quizContext, 'm', () => this.markQuestion());
    this.addShortcut(quizContext, 'r', () => this.reviewAnswers());
    
    // Question navigation
    this.addShortcut(quizContext, 'Home', () => this.goToQuestion(0));
    this.addShortcut(quizContext, 'End', () => this.goToLastQuestion());
    this.addShortcut(quizContext, 'PageUp', () => this.jumpQuestions(-5));
    this.addShortcut(quizContext, 'PageDown', () => this.jumpQuestions(5));
    
    // Timer controls
    this.addShortcut(quizContext, 'ctrl+t', () => this.toggleTimer());
    
    // Mark as prevented defaults
    this.preventDefaults.add('ArrowRight');
    this.preventDefaults.add('ArrowLeft');
    this.preventDefaults.add('Space');
    this.preventDefaults.add('Enter');
  }

  setupStudyShortcuts() {
    const studyContext = 'study';
    
    // Study navigation
    this.addShortcut(studyContext, 'ArrowRight', () => this.studyNext());
    this.addShortcut(studyContext, 'ArrowLeft', () => this.studyPrevious());
    this.addShortcut(studyContext, 'Space', () => this.toggleExplanation());
    this.addShortcut(studyContext, 'Enter', () => this.studyNext());
    
    // Study modes
    this.addShortcut(studyContext, 'p', () => this.switchMode('practice'));
    this.addShortcut(studyContext, 'r', () => this.switchMode('reinforcement'));
    this.addShortcut(studyContext, 't', () => this.switchMode('topic'));
    
    // Study controls
    this.addShortcut(studyContext, 's', () => this.shuffleQuestions());
    this.addShortcut(studyContext, 'h', () => this.showHint());
    this.addShortcut(studyContext, 'e', () => this.showExplanation());
    
    // Option selection (same as quiz)
    this.addShortcut(studyContext, '1', () => this.selectOption(0));
    this.addShortcut(studyContext, '2', () => this.selectOption(1));
    this.addShortcut(studyContext, '3', () => this.selectOption(2));
    this.addShortcut(studyContext, '4', () => this.selectOption(3));
    this.addShortcut(studyContext, '5', () => this.selectOption(4));
  }

  attachEventListeners() {
    document.addEventListener('keydown', (e) => this.handleKeyDown(e));
    document.addEventListener('keyup', (e) => this.handleKeyUp(e));
    
    // Context detection
    document.addEventListener('DOMContentLoaded', () => this.detectContext());
    window.addEventListener('popstate', () => this.detectContext());
    
    // Focus management
    document.addEventListener('focusin', (e) => this.handleFocusIn(e));
    document.addEventListener('focusout', (e) => this.handleFocusOut(e));
  }

  handleKeyDown(e) {
    if (!this.isEnabled) return;
    
    // Don't handle shortcuts when typing in inputs
    if (this.isTypingContext(e.target)) return;
    
    const shortcutKey = this.getShortcutKey(e);
    const contextShortcuts = this.shortcuts.get(this.currentContext);
    const globalShortcuts = this.shortcuts.get('global');
    
    // Check context-specific shortcuts first
    if (contextShortcuts && contextShortcuts.has(shortcutKey)) {
      if (this.preventDefaults.has(e.key) || e.ctrlKey || e.altKey || e.metaKey) {
        e.preventDefault();
      }
      
      const handler = contextShortcuts.get(shortcutKey);
      handler(e);
      return;
    }
    
    // Check global shortcuts
    if (globalShortcuts && globalShortcuts.has(shortcutKey)) {
      if (this.preventDefaults.has(e.key) || e.ctrlKey || e.altKey || e.metaKey) {
        e.preventDefault();
      }
      
      const handler = globalShortcuts.get(shortcutKey);
      handler(e);
      return;
    }
    
    // Handle special navigation keys
    this.handleSpecialKeys(e);
  }

  handleKeyUp(e) {
    // Handle any key up events if needed
  }

  handleSpecialKeys(e) {
    // Tab navigation enhancement
    if (e.key === 'Tab') {
      this.enhanceTabNavigation(e);
    }
    
    // Arrow key navigation for custom elements
    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
      this.handleArrowNavigation(e);
    }
  }

  enhanceTabNavigation(e) {
    // Find all focusable elements
    const focusableElements = this.getFocusableElements();
    const currentIndex = focusableElements.indexOf(document.activeElement);
    
    if (currentIndex === -1) return;
    
    let nextIndex;
    if (e.shiftKey) {
      nextIndex = currentIndex - 1;
      if (nextIndex < 0) nextIndex = focusableElements.length - 1;
    } else {
      nextIndex = currentIndex + 1;
      if (nextIndex >= focusableElements.length) nextIndex = 0;
    }
    
    const nextElement = focusableElements[nextIndex];
    if (nextElement) {
      e.preventDefault();
      nextElement.focus();
      this.highlightFocusedElement(nextElement);
    }
  }

  handleArrowNavigation(e) {
    const activeElement = document.activeElement;
    
    // Handle custom navigation for specific elements
    if (activeElement.classList.contains('tab-btn')) {
      this.navigateTabs(e);
    } else if (activeElement.classList.contains('option-item')) {
      this.navigateOptions(e);
    } else if (activeElement.classList.contains('question-number')) {
      this.navigateQuestionNumbers(e);
    }
  }

  navigateTabs(e) {
    const tabs = Array.from(document.querySelectorAll('.tab-btn'));
    const currentIndex = tabs.indexOf(document.activeElement);
    
    if (currentIndex === -1) return;
    
    let nextIndex;
    if (e.key === 'ArrowLeft') {
      nextIndex = currentIndex - 1;
      if (nextIndex < 0) nextIndex = tabs.length - 1;
    } else if (e.key === 'ArrowRight') {
      nextIndex = currentIndex + 1;
      if (nextIndex >= tabs.length) nextIndex = 0;
    } else {
      return;
    }
    
    e.preventDefault();
    tabs[nextIndex].focus();
    tabs[nextIndex].click();
  }

  navigateOptions(e) {
    const options = Array.from(document.querySelectorAll('.option-item'));
    const currentIndex = options.indexOf(document.activeElement);
    
    if (currentIndex === -1) return;
    
    let nextIndex;
    if (e.key === 'ArrowUp') {
      nextIndex = currentIndex - 1;
      if (nextIndex < 0) nextIndex = options.length - 1;
    } else if (e.key === 'ArrowDown') {
      nextIndex = currentIndex + 1;
      if (nextIndex >= options.length) nextIndex = 0;
    } else {
      return;
    }
    
    e.preventDefault();
    options[nextIndex].focus();
  }

  navigateQuestionNumbers(e) {
    const questions = Array.from(document.querySelectorAll('.question-number'));
    const currentIndex = questions.indexOf(document.activeElement);
    
    if (currentIndex === -1) return;
    
    let nextIndex;
    const questionsPerRow = Math.floor(questions.length / Math.ceil(questions.length / 10));
    
    switch (e.key) {
      case 'ArrowLeft':
        nextIndex = currentIndex - 1;
        if (nextIndex < 0) nextIndex = questions.length - 1;
        break;
      case 'ArrowRight':
        nextIndex = currentIndex + 1;
        if (nextIndex >= questions.length) nextIndex = 0;
        break;
      case 'ArrowUp':
        nextIndex = currentIndex - questionsPerRow;
        if (nextIndex < 0) nextIndex = currentIndex;
        break;
      case 'ArrowDown':
        nextIndex = currentIndex + questionsPerRow;
        if (nextIndex >= questions.length) nextIndex = currentIndex;
        break;
      default:
        return;
    }
    
    e.preventDefault();
    questions[nextIndex].focus();
  }

  getShortcutKey(e) {
    const parts = [];
    
    if (e.ctrlKey) parts.push('ctrl');
    if (e.altKey) parts.push('alt');
    if (e.shiftKey) parts.push('shift');
    if (e.metaKey) parts.push('meta');
    
    parts.push(e.key.toLowerCase());
    
    return parts.join('+');
  }

  addShortcut(context, key, handler) {
    if (!this.shortcuts.has(context)) {
      this.shortcuts.set(context, new Map());
    }
    
    this.shortcuts.get(context).set(key.toLowerCase(), handler);
  }

  removeShortcut(context, key) {
    const contextShortcuts = this.shortcuts.get(context);
    if (contextShortcuts) {
      contextShortcuts.delete(key.toLowerCase());
    }
  }

  setContext(context) {
    this.currentContext = context;
    this.updateContextIndicator();
  }

  detectContext() {
    const path = window.location.pathname;
    
    if (path.includes('Quiz.html')) {
      this.setContext('quiz');
    } else if (path.includes('tabs/')) {
      this.setContext('study');
    } else if (path.includes('dashboard.html')) {
      this.setContext('dashboard');
    } else {
      this.setContext('global');
    }
  }

  updateContextIndicator() {
    // Visual indicator of current context (optional)
    const indicator = document.getElementById('keyboard-context-indicator');
    if (indicator) {
      indicator.textContent = this.currentContext;
    }
  }

  isTypingContext(element) {
    if (!element) return false;
    
    const tagName = element.tagName.toLowerCase();
    const inputTypes = ['input', 'textarea', 'select'];
    
    return inputTypes.includes(tagName) || 
           element.contentEditable === 'true' ||
           element.classList.contains('search-input');
  }

  getFocusableElements() {
    const selector = [
      'a[href]',
      'button:not([disabled])',
      'input:not([disabled])',
      'select:not([disabled])',
      'textarea:not([disabled])',
      '[tabindex]:not([tabindex="-1"])',
      '[contenteditable="true"]'
    ].join(', ');
    
    return Array.from(document.querySelectorAll(selector))
      .filter(el => this.isVisible(el));
  }

  isVisible(element) {
    const style = window.getComputedStyle(element);
    return style.display !== 'none' && 
           style.visibility !== 'hidden' && 
           style.opacity !== '0';
  }

  highlightFocusedElement(element) {
    // Add temporary highlight to focused element
    element.classList.add('keyboard-focused');
    setTimeout(() => {
      element.classList.remove('keyboard-focused');
    }, 1000);
  }

  handleFocusIn(e) {
    // Add focus ring for keyboard navigation
    if (this.wasKeyboardNavigation) {
      e.target.classList.add('keyboard-focus');
    }
  }

  handleFocusOut(e) {
    e.target.classList.remove('keyboard-focus');
  }

  // Quiz-specific handlers
  quizNext() {
    const nextBtn = document.getElementById('next-btn');
    if (nextBtn && !nextBtn.disabled) {
      nextBtn.click();
    }
  }

  quizPrevious() {
    const prevBtn = document.getElementById('prev-btn');
    if (prevBtn && !prevBtn.disabled) {
      prevBtn.click();
    }
  }

  quizToggleAnswer() {
    const showAnswerBtn = document.getElementById('show-answer-btn');
    if (showAnswerBtn) {
      showAnswerBtn.click();
    }
  }

  selectOption(index) {
    const options = document.querySelectorAll('.option-item');
    if (options[index]) {
      options[index].click();
      options[index].focus();
    }
  }

  markQuestion() {
    const markBtn = document.getElementById('mark-btn');
    if (markBtn) {
      markBtn.click();
    }
  }

  submitQuiz() {
    const submitBtn = document.getElementById('submit-btn');
    if (submitBtn) {
      submitBtn.click();
    }
  }

  saveProgress() {
    // Trigger save progress if available
    if (window.quizApp && window.quizApp.saveProgress) {
      window.quizApp.saveProgress();
      this.showNotification('Progress saved');
    }
  }

  goToQuestion(index) {
    const questionNumbers = document.querySelectorAll('.question-number');
    if (questionNumbers[index]) {
      questionNumbers[index].click();
    }
  }

  goToLastQuestion() {
    const questionNumbers = document.querySelectorAll('.question-number');
    if (questionNumbers.length > 0) {
      questionNumbers[questionNumbers.length - 1].click();
    }
  }

  jumpQuestions(offset) {
    const currentQuestion = document.querySelector('.question-number.current');
    if (currentQuestion) {
      const questionNumbers = Array.from(document.querySelectorAll('.question-number'));
      const currentIndex = questionNumbers.indexOf(currentQuestion);
      const newIndex = Math.max(0, Math.min(questionNumbers.length - 1, currentIndex + offset));
      
      if (questionNumbers[newIndex]) {
        questionNumbers[newIndex].click();
      }
    }
  }

  toggleTimer() {
    // Toggle timer visibility if available
    const timer = document.getElementById('timer');
    if (timer) {
      timer.style.display = timer.style.display === 'none' ? 'block' : 'none';
    }
  }

  reviewAnswers() {
    // Open review modal if available
    const reviewBtn = document.querySelector('[data-action="review"]');
    if (reviewBtn) {
      reviewBtn.click();
    }
  }

  // Study-specific handlers
  studyNext() {
    const nextBtn = document.getElementById('next-btn');
    if (nextBtn && !nextBtn.disabled) {
      nextBtn.click();
    }
  }

  studyPrevious() {
    const prevBtn = document.getElementById('prev-btn');
    if (prevBtn && !prevBtn.disabled) {
      prevBtn.click();
    }
  }

  toggleExplanation() {
    const showAnswerBtn = document.getElementById('show-answer-btn');
    if (showAnswerBtn) {
      showAnswerBtn.click();
    }
  }

  switchMode(mode) {
    const modeBtn = document.querySelector(`[data-mode="${mode}"]`);
    if (modeBtn) {
      modeBtn.click();
    }
  }

  shuffleQuestions() {
    const shuffleBtn = document.getElementById('shuffle-btn');
    if (shuffleBtn) {
      shuffleBtn.click();
    }
  }

  showHint() {
    const hintBtn = document.getElementById('hint-btn');
    if (hintBtn) {
      hintBtn.click();
    }
  }

  showExplanation() {
    const explanationBtn = document.getElementById('explanation-btn');
    if (explanationBtn) {
      explanationBtn.click();
    }
  }

  // Global handlers
  handleEscape() {
    // Close modals, menus, etc.
    const modal = document.querySelector('.modal-overlay.active');
    if (modal) {
      const closeBtn = modal.querySelector('.modal-close');
      if (closeBtn) {
        closeBtn.click();
      } else {
        modal.remove();
      }
      return;
    }
    
    // Close dropdowns
    const dropdown = document.querySelector('.dropdown-menu.active');
    if (dropdown) {
      dropdown.classList.remove('active');
      return;
    }
    
    // Clear search
    const searchInput = document.querySelector('.search-input');
    if (searchInput && searchInput === document.activeElement) {
      searchInput.value = '';
      searchInput.blur();
    }
  }

  focusSearch() {
    const searchInput = document.querySelector('#search-input, .search-input, [type="search"]');
    if (searchInput) {
      searchInput.focus();
      searchInput.select();
    }
  }

  toggleTheme() {
    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
      themeToggle.click();
    }
  }

  showHelp() {
    if (window.showHelp) {
      window.showHelp();
    }
  }

  showShortcuts() {
    this.displayShortcutsModal();
  }

  displayShortcutsModal() {
    const shortcuts = this.getShortcutsForContext();
    
    const modal = document.createElement('div');
    modal.className = 'modal-overlay active';
    modal.innerHTML = `
      <div class="modal">
        <div class="modal-header">
          <h2 class="modal-title">⌨️ Keyboard Shortcuts</h2>
          <button class="modal-close" onclick="this.closest('.modal-overlay').remove()">×</button>
        </div>
        <div class="modal-body">
          <div class="shortcuts-context">
            <h3>Current Context: ${this.currentContext}</h3>
          </div>
          <div class="shortcuts-list">
            ${shortcuts.map(shortcut => `
              <div class="shortcut-item">
                <div class="shortcut-keys">
                  ${this.formatShortcutKey(shortcut.key)}
                </div>
                <div class="shortcut-description">${shortcut.description}</div>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    `;
    
    document.body.appendChild(modal);
    this.addShortcutsStyles();
  }

  getShortcutsForContext() {
    const shortcuts = [];
    const contextShortcuts = this.shortcuts.get(this.currentContext);
    const globalShortcuts = this.shortcuts.get('global');
    
    // Add context shortcuts
    if (contextShortcuts) {
      contextShortcuts.forEach((handler, key) => {
        shortcuts.push({
          key,
          description: this.getShortcutDescription(key, this.currentContext)
        });
      });
    }
    
    // Add global shortcuts
    if (globalShortcuts) {
      globalShortcuts.forEach((handler, key) => {
        shortcuts.push({
          key,
          description: this.getShortcutDescription(key, 'global')
        });
      });
    }
    
    return shortcuts;
  }

  getShortcutDescription(key, context) {
    const descriptions = {
      // Global
      'escape': 'Close modal/menu or clear search',
      'f1': 'Show help',
      'ctrl+/': 'Show keyboard shortcuts',
      'alt+h': 'Go to home page',
      'alt+d': 'Go to dashboard',
      'alt+q': 'Go to quiz page',
      'ctrl+k': 'Focus search',
      'ctrl+shift+f': 'Focus search',
      'ctrl+shift+t': 'Toggle theme',
      
      // Quiz
      'arrowright': 'Next question',
      'arrowleft': 'Previous question',
      'enter': 'Next question',
      'space': 'Show/hide answer',
      '1': 'Select option A',
      '2': 'Select option B',
      '3': 'Select option C',
      '4': 'Select option D',
      '5': 'Select option E',
      'ctrl+s': 'Save progress',
      'ctrl+enter': 'Submit quiz',
      'm': 'Mark question for review',
      'r': 'Review answers',
      'home': 'Go to first question',
      'end': 'Go to last question',
      'pageup': 'Jump back 5 questions',
      'pagedown': 'Jump forward 5 questions',
      'ctrl+t': 'Toggle timer',
      
      // Study
      'p': 'Switch to practice mode',
      't': 'Switch to topic mode',
      's': 'Shuffle questions',
      'h': 'Show hint',
      'e': 'Show explanation'
    };
    
    return descriptions[key] || 'Custom shortcut';
  }

  formatShortcutKey(key) {
    return key
      .split('+')
      .map(part => {
        const keyMap = {
          'ctrl': 'Ctrl',
          'alt': 'Alt',
          'shift': 'Shift',
          'meta': 'Cmd',
          'arrowup': '↑',
          'arrowdown': '↓',
          'arrowleft': '←',
          'arrowright': '→',
          'enter': 'Enter',
          'space': 'Space',
          'escape': 'Esc',
          'home': 'Home',
          'end': 'End',
          'pageup': 'PgUp',
          'pagedown': 'PgDn'
        };
        
        return keyMap[part] || part.toUpperCase();
      })
      .join(' + ');
  }

  addShortcutsStyles() {
    if (document.getElementById('shortcuts-styles')) return;

    const styles = document.createElement('style');
    styles.id = 'shortcuts-styles';
    styles.textContent = `
      .shortcuts-context {
        text-align: center;
        margin-bottom: 2rem;
        padding: 1rem;
        background: var(--gray-100);
        border-radius: var(--border-radius-md);
      }
      
      .shortcuts-context h3 {
        margin: 0;
        color: var(--primary-color);
        text-transform: capitalize;
      }
      
      .shortcuts-list {
        display: grid;
        gap: 0.75rem;
        max-height: 400px;
        overflow-y: auto;
      }
      
      .shortcut-item {
        display: flex;
        align-items: center;
        gap: 1rem;
        padding: 0.75rem;
        background: var(--gray-50);
        border-radius: var(--border-radius-md);
      }
      
      .shortcut-keys {
        font-family: 'Courier New', monospace;
        background: var(--gray-800);
        color: var(--white);
        padding: 0.25rem 0.5rem;
        border-radius: var(--border-radius-sm);
        font-size: 0.875rem;
        font-weight: 600;
        min-width: 120px;
        text-align: center;
      }
      
      .shortcut-description {
        flex: 1;
        color: var(--gray-700);
        font-size: 0.875rem;
      }
      
      .keyboard-focused {
        outline: 2px solid var(--primary-color);
        outline-offset: 2px;
      }
      
      .keyboard-focus {
        box-shadow: 0 0 0 2px var(--primary-color);
      }
    `;

    document.head.appendChild(styles);
  }

  showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `keyboard-notification ${type}`;
    notification.textContent = message;
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: var(--primary-color);
      color: white;
      padding: 0.75rem 1rem;
      border-radius: var(--border-radius-md);
      box-shadow: var(--shadow-lg);
      z-index: 10001;
      font-size: 0.875rem;
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

  loadSettings() {
    const settings = JSON.parse(localStorage.getItem('keyboard_navigation_settings') || '{}');
    this.isEnabled = settings.enabled !== false;
  }

  saveSettings() {
    const settings = {
      enabled: this.isEnabled
    };
    localStorage.setItem('keyboard_navigation_settings', JSON.stringify(settings));
  }

  enable() {
    this.isEnabled = true;
    this.saveSettings();
  }

  disable() {
    this.isEnabled = false;
    this.saveSettings();
  }

  destroy() {
    document.removeEventListener('keydown', this.handleKeyDown);
    document.removeEventListener('keyup', this.handleKeyUp);
    document.removeEventListener('focusin', this.handleFocusIn);
    document.removeEventListener('focusout', this.handleFocusOut);
  }
}

// Initialize KeyNavigation when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  window.KeyNavigation = new KeyNavigation();
});