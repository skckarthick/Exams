// Tab navigation component
class TabNavigation {
  constructor(container, options = {}) {
    this.container = container;
    this.options = {
      activeClass: 'active',
      fadeIn: true,
      keyboard: true,
      ...options
    };
    
    this.tabs = [];
    this.panels = [];
    this.currentIndex = 0;
    
    this.init();
  }

  init() {
    this.findTabsAndPanels();
    this.attachEventListeners();
    this.setInitialState();
  }

  findTabsAndPanels() {
    const tabsContainer = this.container.querySelector('.exam-tabs');
    const contentContainer = this.container.querySelector('.tab-content');

    if (tabsContainer && contentContainer) {
      this.tabs = Array.from(tabsContainer.querySelectorAll('.tab-btn'));
      this.panels = Array.from(contentContainer.querySelectorAll('.tab-panel'));
    }
  }

  attachEventListeners() {
    // Tab click events
    this.tabs.forEach((tab, index) => {
      tab.addEventListener('click', () => {
        this.switchTab(index);
      });
    });

    // Keyboard navigation
    if (this.options.keyboard) {
      this.container.addEventListener('keydown', (e) => {
        this.handleKeyboard(e);
      });
    }

    // Touch gestures for mobile
    this.attachTouchEvents();
  }

  attachTouchEvents() {
    let startX = 0;
    let startY = 0;
    const threshold = 50;

    this.container.addEventListener('touchstart', (e) => {
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
    });

    this.container.addEventListener('touchend', (e) => {
      if (!startX || !startY) return;

      const endX = e.changedTouches[0].clientX;
      const endY = e.changedTouches[0].clientY;

      const diffX = startX - endX;
      const diffY = startY - endY;

      // Only trigger if horizontal swipe is dominant
      if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > threshold) {
        if (diffX > 0) {
          // Swipe left - next tab
          this.nextTab();
        } else {
          // Swipe right - previous tab
          this.prevTab();
        }
      }

      startX = 0;
      startY = 0;
    });
  }

  handleKeyboard(e) {
    switch (e.key) {
      case 'ArrowLeft':
        e.preventDefault();
        this.prevTab();
        break;
      case 'ArrowRight':
        e.preventDefault();
        this.nextTab();
        break;
      case 'Home':
        e.preventDefault();
        this.switchTab(0);
        break;
      case 'End':
        e.preventDefault();
        this.switchTab(this.tabs.length - 1);
        break;
    }
  }

  switchTab(index) {
    if (index < 0 || index >= this.tabs.length || index === this.currentIndex) {
      return;
    }

    // Remove active states
    this.tabs[this.currentIndex].classList.remove(this.options.activeClass);
    this.panels[this.currentIndex].classList.remove(this.options.activeClass);

    // Update current index
    this.currentIndex = index;

    // Add active states
    this.tabs[this.currentIndex].classList.add(this.options.activeClass);
    
    // Handle panel transition
    if (this.options.fadeIn) {
      this.animatePanel();
    } else {
      this.panels[this.currentIndex].classList.add(this.options.activeClass);
    }

    // Update URL if data-tab attribute exists
    const tabData = this.tabs[this.currentIndex].getAttribute('data-tab');
    if (tabData) {
      this.updateURL(tabData);
    }

    // Trigger custom event
    this.container.dispatchEvent(new CustomEvent('tabChanged', {
      detail: {
        index: this.currentIndex,
        tab: this.tabs[this.currentIndex],
        panel: this.panels[this.currentIndex]
      }
    }));

    // Update tab focus
    this.tabs[this.currentIndex].focus();
  }

  animatePanel() {
    const panel = this.panels[this.currentIndex];
    
    // Start with fade out effect for current panel
    panel.style.opacity = '0';
    panel.style.transform = 'translateY(10px)';
    panel.classList.add(this.options.activeClass);

    // Animate in after a brief delay
    requestAnimationFrame(() => {
      panel.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
      panel.style.opacity = '1';
      panel.style.transform = 'translateY(0)';
    });
  }

  nextTab() {
    const nextIndex = (this.currentIndex + 1) % this.tabs.length;
    this.switchTab(nextIndex);
  }

  prevTab() {
    const prevIndex = this.currentIndex === 0 ? this.tabs.length - 1 : this.currentIndex - 1;
    this.switchTab(prevIndex);
  }

  setInitialState() {
    // Check URL for initial tab
    const urlParams = new URLSearchParams(window.location.search);
    const tabParam = urlParams.get('tab');
    
    if (tabParam) {
      const tabIndex = this.tabs.findIndex(tab => 
        tab.getAttribute('data-tab') === tabParam
      );
      if (tabIndex !== -1) {
        this.currentIndex = tabIndex;
      }
    }

    // Set initial active states
    this.tabs[this.currentIndex].classList.add(this.options.activeClass);
    this.panels[this.currentIndex].classList.add(this.options.activeClass);
  }

  updateURL(tabData) {
    const url = new URL(window.location);
    url.searchParams.set('tab', tabData);
    window.history.replaceState({}, '', url);
  }

  // Public API methods
  getCurrentTab() {
    return {
      index: this.currentIndex,
      tab: this.tabs[this.currentIndex],
      panel: this.panels[this.currentIndex]
    };
  }

  goToTab(identifier) {
    let index;
    
    if (typeof identifier === 'number') {
      index = identifier;
    } else if (typeof identifier === 'string') {
      index = this.tabs.findIndex(tab => 
        tab.getAttribute('data-tab') === identifier
      );
    }

    if (index !== -1) {
      this.switchTab(index);
    }
  }

  addTab(tabElement, panelElement) {
    this.tabs.push(tabElement);
    this.panels.push(panelElement);
    
    // Attach click event to new tab
    tabElement.addEventListener('click', () => {
      this.switchTab(this.tabs.length - 1);
    });
  }

  removeTab(index) {
    if (index < 0 || index >= this.tabs.length) return;

    // Remove elements
    this.tabs[index].remove();
    this.panels[index].remove();

    // Update arrays
    this.tabs.splice(index, 1);
    this.panels.splice(index, 1);

    // Adjust current index if necessary
    if (this.currentIndex >= index) {
      this.currentIndex = Math.max(0, this.currentIndex - 1);
    }

    // Update active states
    if (this.tabs.length > 0) {
      this.switchTab(this.currentIndex);
    }
  }

  destroy() {
    // Remove event listeners
    this.tabs.forEach(tab => {
      tab.replaceWith(tab.cloneNode(true));
    });

    // Clear references
    this.tabs = [];
    this.panels = [];
    this.container = null;
  }
}

// Export for use in other modules
window.TabNavigation = TabNavigation;