// Footer component
class Footer {
  constructor() {
    this.render();
  }

  render() {
    const footerContainer = document.getElementById('footer-container');
    if (!footerContainer) return;

    footerContainer.innerHTML = `
      <footer class="footer">
        <div class="footer-container">
          <div class="footer-content">
            <div class="footer-section">
              <div class="footer-brand">
                <div class="footer-logo">
                  <div class="brand-icon">🎓</div>
                  <span class="brand-text">ExamPrep Portal</span>
                </div>
                <p class="footer-description">
                  Your comprehensive platform for government exam preparation with advanced analytics and personalized learning.
                </p>
              </div>
            </div>

            <div class="footer-section">
              <h3 class="footer-title">Quick Links</h3>
              <ul class="footer-links">
                <li><a href="../../index.html">Home</a></li>
                <li><a href="../Quiz.html">Take Quiz</a></li>
                <li><a href="../dashboard.html">Dashboard</a></li>
                <li><a href="#" onclick="showAbout()">About</a></li>
              </ul>
            </div>

            <div class="footer-section">
              <h3 class="footer-title">Exam Categories</h3>
              <ul class="footer-links">
                <li><a href="./Assistant Registrar.html">Assistant Registrar</a></li>
                <li><a href="./Admin Officer.html">Admin Officer</a></li>
                <li><a href="./General Awareness and Current Affairs.html">General Awareness</a></li>
                <li><a href="./Quantitative Aptitudes and Reasoning.html">Quantitative & Reasoning</a></li>
              </ul>
            </div>

            <div class="footer-section">
              <h3 class="footer-title">Features</h3>
              <ul class="footer-links">
                <li><a href="#" onclick="showFeature('practice')">Practice Mode</a></li>
                <li><a href="#" onclick="showFeature('mock')">Mock Tests</a></li>
                <li><a href="#" onclick="showFeature('analytics')">Performance Analytics</a></li>
                <li><a href="#" onclick="showFeature('progress')">Progress Tracking</a></li>
              </ul>
            </div>
          </div>

          <div class="footer-bottom">
            <div class="footer-bottom-content">
              <p class="copyright">
                &copy; ${new Date().getFullYear()} ExamPrep Portal. All rights reserved. 👨‍💻 Crafted with ❤️ by SKc
              </p>
              <div class="footer-meta">
                <span class="version">v1.0.0</span>
                <span class="separator">•</span>
                <button class="privacy-btn" onclick="showPrivacy()">Privacy Policy</button>
                <span class="separator">•</span>
                <button class="help-btn" onclick="showHelp()">Help</button>
              </div>
            </div>
          </div>
        </div>
      </footer>
    `;

    this.addFooterStyles();
  }

  addFooterStyles() {
    if (document.getElementById('footer-styles')) return;

    const styles = document.createElement('style');
    styles.id = 'footer-styles';
    styles.textContent = `
      .footer {
        background: linear-gradient(135deg, var(--gray-900), var(--gray-800));
        color: var(--white);
        margin-top: 4rem;
        position: relative;
        overflow: hidden;
      }

      .footer::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E") repeat;
        pointer-events: none;
      }

      .footer-container {
        max-width: 1200px;
        margin: 0 auto;
        padding: 0 1rem;
        position: relative;
        z-index: 1;
      }

      .footer-content {
        display: grid;
        grid-template-columns: 2fr 1fr 1fr 1fr;
        gap: 3rem;
        padding: 4rem 0 2rem;
      }

      .footer-section {
        display: flex;
        flex-direction: column;
      }

      .footer-brand {
        margin-bottom: 1.5rem;
      }

      .footer-logo {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        margin-bottom: 1rem;
      }

      .footer-logo .brand-icon {
        font-size: 2rem;
        background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
        background-clip: text;
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
      }

      .footer-logo .brand-text {
        font-size: 1.5rem;
        font-weight: 700;
        color: var(--white);
      }

      .footer-description {
        color: var(--gray-300);
        line-height: 1.6;
        font-size: 0.875rem;
        margin: 0;
      }

      .footer-title {
        font-size: 1.125rem;
        font-weight: 600;
        color: var(--white);
        margin-bottom: 1.5rem;
        position: relative;
      }

      .footer-title::after {
        content: '';
        position: absolute;
        bottom: -0.5rem;
        left: 0;
        width: 30px;
        height: 2px;
        background: linear-gradient(90deg, var(--primary-color), var(--secondary-color));
        border-radius: 1px;
      }

      .footer-links {
        list-style: none;
        margin: 0;
        padding: 0;
        display: flex;
        flex-direction: column;
        gap: 0.75rem;
      }

      .footer-links a {
        color: var(--gray-300);
        text-decoration: none;
        font-size: 0.875rem;
        transition: all var(--transition-fast);
        position: relative;
        padding-left: 0;
      }

      .footer-links a:hover {
        color: var(--primary-color);
        padding-left: 0.5rem;
      }

      .footer-links a::before {
        content: '';
        position: absolute;
        left: -0.5rem;
        top: 50%;
        transform: translateY(-50%);
        width: 0;
        height: 1px;
        background: var(--primary-color);
        transition: width var(--transition-fast);
      }

      .footer-links a:hover::before {
        width: 0.25rem;
      }

      .footer-bottom {
        border-top: 1px solid var(--gray-700);
        padding: 2rem 0;
      }

      .footer-bottom-content {
        display: flex;
        justify-content: space-between;
        align-items: center;
        flex-wrap: wrap;
        gap: 1rem;
      }

      .copyright {
        color: var(--gray-400);
        font-size: 0.875rem;
        margin: 0;
      }

      .footer-meta {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        font-size: 0.875rem;
      }

      .version {
        color: var(--gray-500);
        font-family: 'Courier New', monospace;
      }

      .separator {
        color: var(--gray-600);
      }

      .privacy-btn,
      .help-btn {
        background: none;
        border: none;
        color: var(--gray-400);
        cursor: pointer;
        font-size: 0.875rem;
        transition: color var(--transition-fast);
        padding: 0;
      }

      .privacy-btn:hover,
      .help-btn:hover {
        color: var(--primary-color);
      }

      /* Responsive Design */
      @media (max-width: 968px) {
        .footer-content {
          grid-template-columns: 1fr 1fr;
          gap: 2rem;
        }
      }

      @media (max-width: 768px) {
        .footer-content {
          grid-template-columns: 1fr;
          gap: 2rem;
          padding: 3rem 0 2rem;
        }

        .footer-bottom-content {
          flex-direction: column;
          text-align: center;
        }

        .footer-meta {
          justify-content: center;
        }
      }

      @media (max-width: 480px) {
        .footer-container {
          padding: 0 0.5rem;
        }

        .footer-content {
          padding: 2rem 0 1.5rem;
        }

        .footer-logo .brand-text {
          font-size: 1.25rem;
        }
      }
    `;

    document.head.appendChild(styles);
  }
}

// Global functions for footer interactions
window.showAbout = function() {
  const modal = document.createElement('div');
  modal.className = 'modal-overlay active';
  modal.innerHTML = `
    <div class="modal">
      <div class="modal-header">
        <h2 class="modal-title">About ExamPrep Portal</h2>
        <button class="modal-close" onclick="this.closest('.modal-overlay').remove()">×</button>
      </div>
      <div class="modal-body">
        <p>ExamPrep Portal is a comprehensive platform designed to help students prepare for government exams with confidence and efficiency.</p>
        <h4>Key Features:</h4>
        <ul>
          <li>Comprehensive question banks for multiple exam categories</li>
          <li>Adaptive learning with reinforcement for incorrect answers</li>
          <li>Detailed performance analytics and progress tracking</li>
          <li>Timed mock tests simulating real exam conditions</li>
          <li>Personalized study recommendations</li>
        </ul>
        <p>Built with modern web technologies for optimal performance across all devices.</p>
      </div>
    </div>
  `;
  document.body.appendChild(modal);
};

window.showFeature = function(feature) {
  const features = {
    practice: {
      title: 'Practice Mode',
      content: 'Study at your own pace with instant feedback and detailed explanations for each question.'
    },
    mock: {
      title: 'Mock Tests',
      content: 'Experience real exam conditions with timed tests and comprehensive result analysis.'
    },
    analytics: {
      title: 'Performance Analytics',
      content: 'Track your progress with detailed statistics and identify areas for improvement.'
    },
    progress: {
      title: 'Progress Tracking',
      content: 'Monitor your learning journey with visual progress indicators and achievement badges.'
    }
  };

  const featureInfo = features[feature];
  if (!featureInfo) return;

  const modal = document.createElement('div');
  modal.className = 'modal-overlay active';
  modal.innerHTML = `
    <div class="modal">
      <div class="modal-header">
        <h2 class="modal-title">${featureInfo.title}</h2>
        <button class="modal-close" onclick="this.closest('.modal-overlay').remove()">×</button>
      </div>
      <div class="modal-body">
        <p>${featureInfo.content}</p>
      </div>
    </div>
  `;
  document.body.appendChild(modal);
};

window.showPrivacy = function() {
  const modal = document.createElement('div');
  modal.className = 'modal-overlay active';
  modal.innerHTML = `
    <div class="modal">
      <div class="modal-header">
        <h2 class="modal-title">Privacy Policy</h2>
        <button class="modal-close" onclick="this.closest('.modal-overlay').remove()">×</button>
      </div>
      <div class="modal-body">
        <h4>Data Collection</h4>
        <p>We only store your quiz results and progress locally on your device. No personal data is transmitted to external servers.</p>
        
        <h4>Local Storage</h4>
        <p>Your progress, scores, and preferences are saved in your browser's local storage for a personalized experience.</p>
        
        <h4>Third-Party Services</h4>
        <p>When using the Google Search feature, you will be redirected to Google's search service, which is subject to Google's privacy policy.</p>
        
        <h4>Updates</h4>
        <p>This privacy policy may be updated periodically. Any changes will be reflected on this page.</p>
      </div>
    </div>
  `;
  document.body.appendChild(modal);
};

window.showHelp = function() {
  const modal = document.createElement('div');
  modal.className = 'modal-overlay active';
  modal.innerHTML = `
    <div class="modal">
      <div class="modal-header">
        <h2 class="modal-title">Help & Support</h2>
        <button class="modal-close" onclick="this.closest('.modal-overlay').remove()">×</button>
      </div>
      <div class="modal-body">
        <h4>Getting Started</h4>
        <p>1. Choose your exam category from the home page</p>
        <p>2. Select between Practice Mode or Mock Test</p>
        <p>3. Answer questions and review your performance</p>
        
        <h4>Keyboard Shortcuts</h4>
        <p>• Enter or Right Arrow: Next question</p>
        <p>• Left Arrow: Previous question</p>
        <p>• Space: Select option</p>
        <p>• Ctrl+S: Save progress</p>
        
        <h4>Features</h4>
        <p>• <strong>Practice Mode:</strong> Study with instant feedback</p>
        <p>• <strong>Mock Tests:</strong> Timed exam simulation</p>
        <p>• <strong>Dashboard:</strong> Track your progress</p>
        <p>• <strong>Search:</strong> Find specific topics or questions</p>
        
        <h4>Tips</h4>
        <p>• Review wrong answers for better understanding</p>
        <p>• Take regular mock tests to improve time management</p>
        <p>• Use the dashboard to identify weak areas</p>
      </div>
    </div>
  `;
  document.body.appendChild(modal);
};

// Initialize footer when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new Footer();
});