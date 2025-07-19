// Header component
class Header {
  constructor() {
    this.render();
    this.attachEventListeners();
  }

  render() {
    const headerContainer = document.getElementById('header-container');
    if (!headerContainer) return;

    headerContainer.innerHTML = `
      <header class="header">
        <nav class="navbar">
          <div class="nav-container">
            <div class="nav-brand">
              <a href="/" class="brand-link">
                <div class="brand-icon">🎓</div>
                <span class="brand-text">ExamPrep Portal</span>
              </a>
            </div>
            
            <div class="nav-menu" id="nav-menu">
              <ul class="nav-list">
                <li class="nav-item">
                  <a href="../../index.html" class="nav-link">Home</a>
                </li>
                <li class="nav-item">
                  <a href="../Quiz.html" class="nav-link">Quiz</a>
                </li>
                <li class="nav-item">
                  <a href="../dashboard.html" class="nav-link">Dashboard</a>
                </li>
                <li class="nav-item dropdown">
                  <a href="#" class="nav-link dropdown-toggle">Subjects</a>
                  <ul class="dropdown-menu">
                    <li><a href="./Assistant Registrar.html" class="dropdown-link">Assistant Registrar</a></li>
                    <li><a href="./Admin Officer.html" class="dropdown-link">Admin Officer</a></li>
                    <li><a href="./General Awareness and Current Affairs.html" class="dropdown-link">General Awareness</a></li>
                    <li><a href="./Quantitative Aptitudes and Reasoning.html" class="dropdown-link">Quantitative & Reasoning</a></li>
                  </ul>
                </li>
              </ul>
            </div>
            
            <div class="nav-actions">
              <button class="theme-toggle" id="theme-toggle" title="Toggle dark mode">
                <span class="theme-icon">🌙</span>
              </button>
              <button class="nav-toggle" id="nav-toggle">
                <span class="hamburger"></span>
                <span class="hamburger"></span>
                <span class="hamburger"></span>
              </button>
            </div>
          </div>
        </nav>
      </header>
    `;

    this.addHeaderStyles();
  }

  addHeaderStyles() {
    if (document.getElementById('header-styles')) return;

    const styles = document.createElement('style');
    styles.id = 'header-styles';
    styles.textContent = `
      .header {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        background: rgba(255, 255, 255, 0.95);
        backdrop-filter: blur(10px);
        border-bottom: 1px solid var(--gray-200);
        z-index: 1000;
        transition: all var(--transition-fast);
      }

      .navbar {
        height: 80px;
        display: flex;
        align-items: center;
      }

      .nav-container {
        max-width: 1200px;
        margin: 0 auto;
        padding: 0 1rem;
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: space-between;
      }

      .nav-brand {
        display: flex;
        align-items: center;
      }

      .brand-link {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        text-decoration: none;
        color: var(--gray-900);
        font-weight: 700;
        font-size: 1.25rem;
        transition: color var(--transition-fast);
      }

      .brand-link:hover {
        color: var(--primary-color);
      }

      .brand-icon {
        font-size: 2rem;
        background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
        background-clip: text;
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        display: flex;
        align-items: center;
      }

      .nav-menu {
        display: flex;
        align-items: center;
      }

      .nav-list {
        display: flex;
        align-items: center;
        gap: 2rem;
        list-style: none;
        margin: 0;
        padding: 0;
      }

      .nav-link {
        color: var(--gray-700);
        text-decoration: none;
        font-weight: 500;
        padding: 0.5rem 0;
        position: relative;
        transition: color var(--transition-fast);
        display: flex;
        align-items: center;
        gap: 0.25rem;
      }

      .nav-link:hover {
        color: var(--primary-color);
      }

      .nav-link.active {
        color: var(--primary-color);
      }

      .nav-link.active::after {
        content: '';
        position: absolute;
        bottom: -0.5rem;
        left: 0;
        right: 0;
        height: 2px;
        background: var(--primary-color);
        border-radius: 1px;
      }

      .dropdown {
        position: relative;
      }

      .dropdown-toggle::after {
        content: '▼';
        font-size: 0.75rem;
        margin-left: 0.25rem;
        transition: transform var(--transition-fast);
      }

      .dropdown:hover .dropdown-toggle::after {
        transform: rotate(180deg);
      }

      .dropdown-menu {
        position: absolute;
        top: 100%;
        left: 0;
        background: white;
        border: 1px solid var(--gray-200);
        border-radius: var(--border-radius-md);
        box-shadow: var(--shadow-lg);
        min-width: 220px;
        opacity: 0;
        visibility: hidden;
        transform: translateY(-10px);
        transition: all var(--transition-fast);
        list-style: none;
        margin: 0;
        padding: 0.5rem 0;
        z-index: 1000;
      }

      .dropdown:hover .dropdown-menu {
        opacity: 1;
        visibility: visible;
        transform: translateY(0);
      }

      .dropdown-link {
        display: block;
        padding: 0.75rem 1rem;
        color: var(--gray-700);
        text-decoration: none;
        font-size: 0.875rem;
        transition: all var(--transition-fast);
      }

      .dropdown-link:hover {
        background: var(--gray-50);
        color: var(--primary-color);
      }

      .nav-actions {
        display: flex;
        align-items: center;
        gap: 1rem;
      }

      .theme-toggle {
        background: none;
        border: 2px solid var(--gray-300);
        border-radius: 50%;
        width: 40px;
        height: 40px;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        transition: all var(--transition-fast);
      }

      .theme-toggle:hover {
        border-color: var(--primary-color);
        background: var(--primary-color);
        color: white;
      }

      .theme-icon {
        font-size: 1.25rem;
      }

      .nav-toggle {
        display: none;
        flex-direction: column;
        background: none;
        border: none;
        cursor: pointer;
        padding: 0.5rem;
        gap: 0.25rem;
      }

      .hamburger {
        width: 24px;
        height: 2px;
        background: var(--gray-700);
        transition: all var(--transition-fast);
      }

      .nav-toggle.active .hamburger:nth-child(1) {
        transform: rotate(45deg) translate(6px, 6px);
      }

      .nav-toggle.active .hamburger:nth-child(2) {
        opacity: 0;
      }

      .nav-toggle.active .hamburger:nth-child(3) {
        transform: rotate(-45deg) translate(6px, -6px);
      }

      /* Mobile Styles */
      @media (max-width: 768px) {
        .nav-toggle {
          display: flex;
        }

        .nav-menu {
          position: fixed;
          top: 80px;
          left: 0;
          right: 0;
          background: white;
          border-bottom: 1px solid var(--gray-200);
          max-height: 0;
          overflow: hidden;
          transition: max-height var(--transition-normal);
        }

        .nav-menu.active {
          max-height: 400px;
        }

        .nav-list {
          flex-direction: column;
          padding: 1rem 0;
          gap: 0;
        }

        .nav-item {
          width: 100%;
        }

        .nav-link {
          padding: 1rem;
          border-bottom: 1px solid var(--gray-100);
          width: 100%;
          justify-content: center;
        }

        .dropdown-menu {
          position: static;
          opacity: 1;
          visibility: visible;
          transform: none;
          box-shadow: none;
          border: none;
          background: var(--gray-50);
          border-radius: 0;
        }

        .dropdown:hover .dropdown-menu {
          display: block;
        }
      }

      @media (max-width: 480px) {
        .nav-container {
          padding: 0 0.5rem;
        }

        .brand-text {
          display: none;
        }

        .brand-icon {
          font-size: 2.5rem;
        }
      }
    `;

    document.head.appendChild(styles);
  }

  attachEventListeners() {
    // Mobile menu toggle
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');

    if (navToggle && navMenu) {
      navToggle.addEventListener('click', () => {
        navToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
      });
    }

    // Theme toggle
    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
      themeToggle.addEventListener('click', this.toggleTheme);
    }

    // Set active link
    this.setActiveLink();
    
    // Initialize theme
    this.initializeTheme();
  }

  toggleTheme() {
    const html = document.documentElement;
    const themeIcon = document.querySelector('.theme-icon');
    
    const currentTheme = html.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    html.setAttribute('data-theme', newTheme);
    
    if (newTheme === 'dark') {
      themeIcon.textContent = '☀️';
      localStorage.setItem('theme', 'dark');
    } else {
      themeIcon.textContent = '🌙';
      localStorage.setItem('theme', 'light');
    }
  }
  
  initializeTheme() {
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const theme = savedTheme || (prefersDark ? 'dark' : 'light');
    
    document.documentElement.setAttribute('data-theme', theme);
    
    const themeIcon = document.querySelector('.theme-icon');
    if (themeIcon) {
      themeIcon.textContent = theme === 'dark' ? '☀️' : '🌙';
    }
  }

  setActiveLink() {
    const currentPath = window.location.pathname;
    const navLinks = document.querySelectorAll('.nav-link');

    navLinks.forEach(link => {
      const href = link.getAttribute('href');
      if (href === currentPath || (currentPath === '/' && href === '/')) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
  }
}

// Initialize header when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new Header();
});