// Dashboard page functionality
class Dashboard {
  constructor() {
    this.userData = null;
    this.charts = {};
    this.filters = {
      subject: 'all',
      timeRange: '30days',
      sortBy: 'date'
    };
    
    this.init();
  }

  init() {
    this.loadUserData();
    this.renderDashboard();
    this.attachEventListeners();
    this.loadCharts();
  }

  loadUserData() {
    if (window.LocalAccount) {
      this.userData = {
        profile: window.LocalAccount.getProfile(),
        statistics: window.LocalAccount.getStatistics(),
        quizHistory: window.LocalAccount.getQuizHistory(),
        subjectProgress: window.LocalAccount.getSubjectProgress(),
        achievements: window.LocalAccount.getAchievements(),
        wrongAnswers: window.LocalAccount.getWrongAnswers()
      };
    } else {
      this.userData = this.getDefaultUserData();
    }
  }

  getDefaultUserData() {
    return {
      profile: { name: 'Student', joinDate: new Date().toISOString() },
      statistics: { totalQuizzes: 0, totalQuestions: 0, correctAnswers: 0, totalStudyTime: 0, streak: 0 },
      quizHistory: [],
      subjectProgress: {},
      achievements: [],
      wrongAnswers: []
    };
  }

  renderDashboard() {
    const container = document.querySelector('.dashboard-container');
    if (!container) return;

    container.innerHTML = `
      <div class="dashboard-header">
        <h1 class="dashboard-title">📊 Your Learning Dashboard</h1>
        <p class="dashboard-subtitle">Track your progress and achieve your goals</p>
      </div>

      ${this.renderWelcomeMessage()}
      ${this.renderProfileSection()}
      ${this.renderAnalyticsSection()}
      ${this.renderQuizHistory()}
      ${this.renderRecommendations()}
      ${this.renderAchievements()}
      ${this.renderQuickActions()}
    `;
  }

  renderWelcomeMessage() {
    const lastLogin = this.userData.profile.lastLogin ? 
      new Date(this.userData.profile.lastLogin).toLocaleDateString() : 'today';

    return `
      <div class="welcome-message">
        <h2 class="welcome-title">Welcome back, ${this.userData.profile.name}! 👋</h2>
        <p class="welcome-text">
          Last activity: ${lastLogin}. You're on a ${this.userData.statistics.streak}-day study streak! 
          Keep up the excellent work and continue building your knowledge.
        </p>
      </div>
    `;
  }

  renderProfileSection() {
    const stats = this.userData.statistics;
    const accuracy = stats.totalQuestions > 0 ? 
      Math.round((stats.correctAnswers / stats.totalQuestions) * 100) : 0;

    return `
      <div class="profile-section">
        <div class="profile-header">
          <div class="profile-avatar">${this.userData.profile.name.charAt(0).toUpperCase()}</div>
          <div class="profile-info">
            <h3>${this.userData.profile.name}</h3>
            <p>Member since ${new Date(this.userData.profile.joinDate).getFullYear()}</p>
          </div>
        </div>
        
        <div class="profile-stats">
          <div class="stat-card">
            <span class="stat-icon">🎯</span>
            <div class="stat-number">${stats.totalQuizzes}</div>
            <div class="stat-label">Quizzes Taken</div>
          </div>
          
          <div class="stat-card">
            <span class="stat-icon">❓</span>
            <div class="stat-number">${stats.totalQuestions}</div>
            <div class="stat-label">Questions Answered</div>
          </div>
          
          <div class="stat-card">
            <span class="stat-icon">✅</span>
            <div class="stat-number">${accuracy}%</div>
            <div class="stat-label">Overall Accuracy</div>
          </div>
          
          <div class="stat-card">
            <span class="stat-icon">⏱️</span>
            <div class="stat-number">${this.formatStudyTime(stats.totalStudyTime)}</div>
            <div class="stat-label">Study Time</div>
          </div>
          
          <div class="stat-card">
            <span class="stat-icon">🔥</span>
            <div class="stat-number">${stats.streak}</div>
            <div class="stat-label">Current Streak</div>
          </div>
        </div>
      </div>
    `;
  }

  renderAnalyticsSection() {
    return `
      <div class="analytics-section">
        <h2 class="section-title">Performance Analytics</h2>
        
        <div class="analytics-grid">
          <div class="analytics-card">
            <div class="analytics-header">
              <h3 class="analytics-title">Overall Progress</h3>
              <span class="analytics-icon">📈</span>
            </div>
            <div class="progress-circle" data-percentage="75">
              <div class="progress-text">75%</div>
            </div>
            <div class="analytics-details">
              <div class="detail-item">
                <span class="detail-label">This Month</span>
                <span class="detail-value">+12%</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">Best Subject</span>
                <span class="detail-value">${this.getBestSubject()}</span>
              </div>
            </div>
          </div>

          <div class="analytics-card">
            <div class="analytics-header">
              <h3 class="analytics-title">Weekly Activity</h3>
              <span class="analytics-icon">📅</span>
            </div>
            <div id="weekly-chart" class="chart-container"></div>
          </div>

          <div class="analytics-card">
            <div class="analytics-header">
              <h3 class="analytics-title">Subject Performance</h3>
              <span class="analytics-icon">📚</span>
            </div>
            <div id="subject-chart" class="chart-container"></div>
          </div>
        </div>
      </div>
    `;
  }

  renderQuizHistory() {
    const recentQuizzes = this.userData.quizHistory.slice(0, 10);

    return `
      <div class="history-section">
        <h2 class="section-title">Quiz History</h2>
        
        <div class="history-filters">
          <div class="filter-group">
            <label class="filter-label">Subject</label>
            <select class="filter-select" id="subject-filter">
              <option value="all">All Subjects</option>
              <option value="Assistant Registrar">Assistant Registrar</option>
              <option value="Admin Officer">Admin Officer</option>
              <option value="General Awareness and Current Affairs">General Awareness</option>
              <option value="Quantitative Aptitudes and Reasoning">Quantitative & Reasoning</option>
            </select>
          </div>
          
          <div class="filter-group">
            <label class="filter-label">Time Range</label>
            <select class="filter-select" id="time-filter">
              <option value="7days">Last 7 days</option>
              <option value="30days" selected>Last 30 days</option>
              <option value="90days">Last 3 months</option>
              <option value="all">All time</option>
            </select>
          </div>
          
          <div class="filter-group">
            <label class="filter-label">Sort By</label>
            <select class="filter-select" id="sort-filter">
              <option value="date">Date</option>
              <option value="score">Score</option>
              <option value="subject">Subject</option>
            </select>
          </div>
        </div>

        <div class="history-table">
          ${recentQuizzes.length > 0 ? `
            <div class="table-responsive">
              <table class="table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Subject</th>
                    <th>Score</th>
                    <th>Questions</th>
                    <th>Duration</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  ${recentQuizzes.map(quiz => this.renderQuizRow(quiz)).join('')}
                </tbody>
              </table>
            </div>
          ` : `
            <div class="empty-state">
              <div class="empty-state-icon">📝</div>
              <h3 class="empty-state-title">No Quiz History</h3>
              <p class="empty-state-description">Start taking quizzes to see your progress here!</p>
              <a href="./Quiz.html" class="btn btn-primary">Take Your First Quiz</a>
            </div>
          `}
        </div>
      </div>
    `;
  }

  renderQuizRow(quiz) {
    const date = new Date(quiz.date).toLocaleDateString();
    const scoreClass = this.getScoreClass(quiz.percentage);
    const duration = this.formatTime(quiz.timeTaken);

    return `
      <tr>
        <td class="quiz-date">${date}</td>
        <td class="quiz-subject">${quiz.subject}</td>
        <td class="quiz-score ${scoreClass}">${quiz.percentage}%</td>
        <td>${quiz.correctAnswers}/${quiz.totalQuestions}</td>
        <td class="quiz-duration">${duration}</td>
        <td>
          <button class="action-btn-small" onclick="dashboard.viewQuizDetails('${quiz.id}')">
            View Details
          </button>
        </td>
      </tr>
    `;
  }

  renderRecommendations() {
    const recommendations = this.generateRecommendations();

    return `
      <div class="recommendations-section">
        <h2 class="recommendations-title">📋 Study Recommendations</h2>
        
        <div class="recommendations-grid">
          ${recommendations.map(rec => `
            <div class="recommendation-card" onclick="dashboard.followRecommendation('${rec.action}')">
              <span class="recommendation-icon">${rec.icon}</span>
              <h3 class="recommendation-title">${rec.title}</h3>
              <p class="recommendation-description">${rec.description}</p>
              <span class="recommendation-priority priority-${rec.priority}">${rec.priority} priority</span>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  renderAchievements() {
    const allAchievements = [
      { id: 'first_quiz', name: 'Getting Started', icon: '🎯', description: 'Complete first quiz' },
      { id: 'quiz_master', name: 'Quiz Master', icon: '👑', description: 'Complete 50 quizzes' },
      { id: 'accuracy_expert', name: 'Accuracy Expert', icon: '🎯', description: '90%+ accuracy' },
      { id: 'speed_demon', name: 'Speed Demon', icon: '⚡', description: 'Fast completion' },
      { id: 'streak_warrior', name: 'Streak Warrior', icon: '🔥', description: '10-day streak' },
      { id: 'subject_master', name: 'Subject Master', icon: '📚', description: 'Master a subject' }
    ];

    const earnedIds = this.userData.achievements.map(a => a.id);

    return `
      <div class="achievements-section">
        <h2 class="achievements-title">🏆 Achievements</h2>
        
        <div class="achievements-grid">
          ${allAchievements.map(achievement => `
            <div class="achievement-badge ${earnedIds.includes(achievement.id) ? 'earned' : ''}">
              <span class="achievement-icon">${achievement.icon}</span>
              <div class="achievement-name">${achievement.name}</div>
              <div class="achievement-description">${achievement.description}</div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  renderQuickActions() {
    return `
      <div class="quick-actions-section">
        <a href="./Quiz.html" class="quick-action-card">
          <span class="quick-action-icon">🎯</span>
          <h3 class="quick-action-title">Take Quiz</h3>
          <p class="quick-action-description">Start a new practice session</p>
        </a>
        
        <a href="./tabs/Assistant Registrar.html" class="quick-action-card">
          <span class="quick-action-icon">📚</span>
          <h3 class="quick-action-title">Study Mode</h3>
          <p class="quick-action-description">Practice with explanations</p>
        </a>
        
        <div class="quick-action-card" onclick="dashboard.reviewWrongAnswers()">
          <span class="quick-action-icon">🔄</span>
          <h3 class="quick-action-title">Review Mistakes</h3>
          <p class="quick-action-description">Learn from wrong answers</p>
        </div>
        
        <div class="quick-action-card" onclick="dashboard.exportProgress()">
          <span class="quick-action-icon">📊</span>
          <h3 class="quick-action-title">Export Data</h3>
          <p class="quick-action-description">Download your progress</p>
        </div>
      </div>
    `;
  }

  attachEventListeners() {
    // Filter change handlers
    document.addEventListener('change', (e) => {
      if (e.target.classList.contains('filter-select')) {
        this.handleFilterChange(e.target);
      }
    });

    // Progress circle animations
    this.animateProgressCircles();
  }

  handleFilterChange(selectElement) {
    const filterId = selectElement.id;
    const value = selectElement.value;

    switch (filterId) {
      case 'subject-filter':
        this.filters.subject = value;
        break;
      case 'time-filter':
        this.filters.timeRange = value;
        break;
      case 'sort-filter':
        this.filters.sortBy = value;
        break;
    }

    this.updateQuizHistory();
  }

  updateQuizHistory() {
    let filteredQuizzes = [...this.userData.quizHistory];

    // Apply subject filter
    if (this.filters.subject !== 'all') {
      filteredQuizzes = filteredQuizzes.filter(quiz => quiz.subject === this.filters.subject);
    }

    // Apply time range filter
    const now = new Date();
    const timeRanges = {
      '7days': 7 * 24 * 60 * 60 * 1000,
      '30days': 30 * 24 * 60 * 60 * 1000,
      '90days': 90 * 24 * 60 * 60 * 1000,
      'all': Infinity
    };

    const timeLimit = now.getTime() - timeRanges[this.filters.timeRange];
    filteredQuizzes = filteredQuizzes.filter(quiz => 
      new Date(quiz.date).getTime() > timeLimit
    );

    // Apply sorting
    filteredQuizzes.sort((a, b) => {
      switch (this.filters.sortBy) {
        case 'date':
          return new Date(b.date) - new Date(a.date);
        case 'score':
          return b.percentage - a.percentage;
        case 'subject':
          return a.subject.localeCompare(b.subject);
        default:
          return 0;
      }
    });

    // Update table
    this.updateHistoryTable(filteredQuizzes.slice(0, 20));
  }

  updateHistoryTable(quizzes) {
    const tableContainer = document.querySelector('.history-table .table-responsive');
    if (!tableContainer) return;

    if (quizzes.length === 0) {
      tableContainer.innerHTML = `
        <div class="empty-state">
          <div class="empty-state-icon">🔍</div>
          <h3 class="empty-state-title">No Results Found</h3>
          <p class="empty-state-description">Try adjusting your filters</p>
        </div>
      `;
      return;
    }

    tableContainer.innerHTML = `
      <table class="table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Subject</th>
            <th>Score</th>
            <th>Questions</th>
            <th>Duration</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          ${quizzes.map(quiz => this.renderQuizRow(quiz)).join('')}
        </tbody>
      </table>
    `;
  }

  loadCharts() {
    this.loadWeeklyActivityChart();
    this.loadSubjectPerformanceChart();
  }

  loadWeeklyActivityChart() {
    const container = document.getElementById('weekly-chart');
    if (!container) return;

    // Simple text-based chart for now
    const weeklyData = this.getWeeklyActivity();
    container.innerHTML = `
      <div class="simple-chart">
        ${weeklyData.map((day, index) => `
          <div class="chart-bar">
            <div class="bar" style="height: ${(day.quizzes / Math.max(...weeklyData.map(d => d.quizzes)) * 100) || 0}%"></div>
            <div class="bar-label">${day.day}</div>
          </div>
        `).join('')}
      </div>
    `;

    this.addChartStyles();
  }

  loadSubjectPerformanceChart() {
    const container = document.getElementById('subject-chart');
    if (!container) return;

    const subjectData = this.getSubjectPerformance();
    container.innerHTML = `
      <div class="subject-performance">
        ${Object.entries(subjectData).map(([subject, data]) => `
          <div class="subject-item">
            <div class="subject-name">${subject.split(' ')[0]}</div>
            <div class="subject-bar">
              <div class="subject-progress" style="width: ${data.accuracy}%"></div>
            </div>
            <div class="subject-score">${data.accuracy}%</div>
          </div>
        `).join('')}
      </div>
    `;
  }

  animateProgressCircles() {
    const circles = document.querySelectorAll('.progress-circle');
    circles.forEach(circle => {
      const percentage = parseInt(circle.dataset.percentage);
      const degrees = (percentage / 100) * 360;
      
      setTimeout(() => {
        circle.style.background = `conic-gradient(var(--primary-color) ${degrees}deg, var(--gray-200) ${degrees}deg)`;
      }, 500);
    });
  }

  // Helper methods
  getBestSubject() {
    const subjects = this.userData.subjectProgress;
    let bestSubject = 'None';
    let bestAccuracy = 0;

    Object.entries(subjects).forEach(([subject, data]) => {
      if (data.accuracy > bestAccuracy) {
        bestAccuracy = data.accuracy;
        bestSubject = subject.split(' ')[0]; // Shortened name
      }
    });

    return bestSubject;
  }

  getWeeklyActivity() {
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const weeklyData = days.map(day => ({ day, quizzes: 0 }));

    // Calculate activity for last 7 days
    const now = new Date();
    this.userData.quizHistory.forEach(quiz => {
      const quizDate = new Date(quiz.date);
      const daysDiff = Math.floor((now - quizDate) / (1000 * 60 * 60 * 24));
      
      if (daysDiff < 7) {
        const dayIndex = (7 - daysDiff - 1) % 7;
        weeklyData[dayIndex].quizzes++;
      }
    });

    return weeklyData;
  }

  getSubjectPerformance() {
    const subjects = this.userData.subjectProgress;
    const performance = {};

    Object.entries(subjects).forEach(([subject, data]) => {
      performance[subject] = {
        accuracy: data.accuracy || 0,
        questionsAnswered: data.questionsAnswered || 0
      };
    });

    return performance;
  }

  generateRecommendations() {
    const recommendations = [];
    const stats = this.userData.statistics;
    const wrongAnswers = this.userData.wrongAnswers;

    // Based on accuracy
    if (stats.totalQuestions > 0) {
      const accuracy = (stats.correctAnswers / stats.totalQuestions) * 100;
      
      if (accuracy < 60) {
        recommendations.push({
          title: 'Focus on Fundamentals',
          description: 'Your accuracy is below 60%. Review basic concepts.',
          icon: '📚',
          priority: 'high',
          action: 'study_basics'
        });
      }
    }

    // Based on wrong answers
    if (wrongAnswers.length > 10) {
      recommendations.push({
        title: 'Review Mistakes',
        description: `You have ${wrongAnswers.length} questions to review.`,
        icon: '🔄',
        priority: 'high',
        action: 'review_mistakes'
      });
    }

    // Based on streak
    if (stats.streak === 0) {
      recommendations.push({
        title: 'Start Daily Practice',
        description: 'Build a study streak for consistent progress.',
        icon: '🔥',
        priority: 'medium',
        action: 'daily_practice'
      });
    }

    // Default recommendations
    if (recommendations.length === 0) {
      recommendations.push(
        {
          title: 'Take a Mock Test',
          description: 'Test your knowledge with a timed quiz.',
          icon: '⏱️',
          priority: 'medium',
          action: 'mock_test'
        },
        {
          title: 'Explore New Topics',
          description: 'Expand your knowledge in different subjects.',
          icon: '🌟',
          priority: 'low',
          action: 'explore_topics'
        }
      );
    }

    return recommendations.slice(0, 4);
  }

  getScoreClass(percentage) {
    if (percentage >= 90) return 'score-excellent';
    if (percentage >= 75) return 'score-good';
    if (percentage >= 60) return 'score-average';
    return 'score-poor';
  }

  formatTime(seconds) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  }

  formatStudyTime(totalSeconds) {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  }

  addChartStyles() {
    if (document.getElementById('chart-styles')) return;

    const styles = document.createElement('style');
    styles.id = 'chart-styles';
    styles.textContent = `
      .simple-chart {
        display: flex;
        align-items: end;
        justify-content: space-between;
        height: 100px;
        padding: 1rem 0;
      }

      .chart-bar {
        display: flex;
        flex-direction: column;
        align-items: center;
        flex: 1;
      }

      .bar {
        width: 20px;
        background: linear-gradient(to top, var(--primary-color), var(--secondary-color));
        border-radius: 2px 2px 0 0;
        min-height: 5px;
        transition: height 0.5s ease;
      }

      .bar-label {
        font-size: 0.75rem;
        color: var(--gray-600);
        margin-top: 0.5rem;
      }

      .subject-performance {
        display: flex;
        flex-direction: column;
        gap: 1rem;
        padding: 1rem 0;
      }

      .subject-item {
        display: flex;
        align-items: center;
        gap: 1rem;
      }

      .subject-name {
        font-size: 0.875rem;
        font-weight: 600;
        color: var(--gray-700);
        min-width: 80px;
      }

      .subject-bar {
        flex: 1;
        height: 8px;
        background: var(--gray-200);
        border-radius: 4px;
        overflow: hidden;
      }

      .subject-progress {
        height: 100%;
        background: linear-gradient(90deg, var(--primary-color), var(--secondary-color));
        border-radius: 4px;
        transition: width 0.5s ease;
      }

      .subject-score {
        font-size: 0.875rem;
        font-weight: 600;
        color: var(--primary-color);
        min-width: 40px;
        text-align: right;
      }
    `;

    document.head.appendChild(styles);
  }

  // Public methods for interactions
  viewQuizDetails(quizId) {
    const quiz = this.userData.quizHistory.find(q => q.id === quizId);
    if (!quiz) return;

    const modal = document.createElement('div');
    modal.className = 'modal-overlay active';
    modal.innerHTML = `
      <div class="modal">
        <div class="modal-header">
          <h2 class="modal-title">Quiz Details</h2>
          <button class="modal-close" onclick="this.closest('.modal-overlay').remove()">×</button>
        </div>
        <div class="modal-body">
          <div class="quiz-detail-header">
            <h3>${quiz.subject}</h3>
            <p>Taken on ${new Date(quiz.date).toLocaleDateString()}</p>
          </div>
          
          <div class="quiz-detail-stats">
            <div class="detail-stat">
              <span class="stat-label">Score</span>
              <span class="stat-value">${quiz.percentage}%</span>
            </div>
            <div class="detail-stat">
              <span class="stat-label">Correct</span>
              <span class="stat-value">${quiz.correctAnswers}</span>
            </div>
            <div class="detail-stat">
              <span class="stat-label">Incorrect</span>
              <span class="stat-value">${quiz.incorrectAnswers}</span>
            </div>
            <div class="detail-stat">
              <span class="stat-label">Time</span>
              <span class="stat-value">${this.formatTime(quiz.timeTaken)}</span>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-primary" onclick="this.closest('.modal-overlay').remove()">Close</button>
        </div>
      </div>
    `;
    
    document.body.appendChild(modal);
  }

  followRecommendation(action) {
    const actions = {
      study_basics: () => window.location.href = './tabs/Assistant Registrar.html',
      review_mistakes: () => this.reviewWrongAnswers(),
      daily_practice: () => window.location.href = './Quiz.html',
      mock_test: () => window.location.href = './Quiz.html?duration=60&questions=50',
      explore_topics: () => window.location.href = '../../index.html'
    };

    if (actions[action]) {
      actions[action]();
    }
  }

  reviewWrongAnswers() {
    const wrongAnswers = this.userData.wrongAnswers.slice(0, 20);
    
    if (wrongAnswers.length === 0) {
      alert('No wrong answers to review. Great job!');
      return;
    }

    const modal = document.createElement('div');
    modal.className = 'modal-overlay active';
    modal.innerHTML = `
      <div class="modal">
        <div class="modal-header">
          <h2 class="modal-title">Review Wrong Answers</h2>
          <button class="modal-close" onclick="this.closest('.modal-overlay').remove()">×</button>
        </div>
        <div class="modal-body">
          <div class="wrong-answers-list">
            ${wrongAnswers.map((answer, index) => `
              <div class="wrong-answer-item">
                <div class="answer-header">
                  <span class="answer-subject">${answer.subject}</span>
                  <span class="mistake-count">${answer.mistakeCount} mistake${answer.mistakeCount > 1 ? 's' : ''}</span>
                </div>
                <div class="answer-question">${answer.question}</div>
                <div class="answer-details">
                  <div class="user-answer">Your answer: ${answer.userAnswer}</div>
                  <div class="correct-answer">Correct answer: ${answer.correctAnswer}</div>
                </div>
                <button class="btn btn-sm btn-primary" onclick="dashboard.markReviewed('${answer.questionId}', ${index})">
                  Mark as Reviewed
                </button>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    `;
    
    document.body.appendChild(modal);
  }

  markReviewed(questionId, index) {
    if (window.LocalAccount) {
      window.LocalAccount.markWrongAnswerReviewed(questionId);
    }
    
    // Remove from display
    const item = document.querySelectorAll('.wrong-answer-item')[index];
    if (item) {
      item.style.opacity = '0.5';
      item.querySelector('button').textContent = 'Reviewed ✓';
      item.querySelector('button').disabled = true;
    }
  }

  exportProgress() {
    if (!window.LocalAccount) {
      alert('Export feature requires local account data');
      return;
    }

    const data = window.LocalAccount.exportData();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `exam-prep-progress-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }
}

// Initialize dashboard when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  window.dashboard = new Dashboard();
});