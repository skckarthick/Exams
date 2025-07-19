// Quiz page functionality
class QuizApp {
  constructor() {
    this.questions = [];
    this.currentQuestionIndex = 0;
    this.userAnswers = [];
    this.timeRemaining = 0;
    this.timer = null;
    this.quizSettings = {
      subject: 'General',
      duration: 60,
      questionCount: 50,
      randomize: true
    };
    this.quizState = 'setup'; // setup, active, completed
    this.startTime = null;
    
    this.init();
  }

  init() {
    this.loadURLParameters();
    this.renderQuizSetup();
    this.attachEventListeners();
  }

  loadURLParameters() {
    const urlParams = new URLSearchParams(window.location.search);
    
    if (urlParams.has('subject')) {
      this.quizSettings.subject = urlParams.get('subject');
    }
    if (urlParams.has('duration')) {
      this.quizSettings.duration = parseInt(urlParams.get('duration'));
    }
    if (urlParams.has('questions')) {
      this.quizSettings.questionCount = parseInt(urlParams.get('questions'));
    }
    if (urlParams.has('mode') && urlParams.get('mode') === 'test') {
      // Auto-start quiz if coming from home page
      setTimeout(() => this.startQuiz(), 500);
    }
  }

  renderQuizSetup() {
    const container = document.querySelector('.quiz-container');
    if (!container) return;

    container.innerHTML = `
      <div class="quiz-setup">
        <h1>🎯 Quiz Setup</h1>
        <p>Configure your quiz settings and start your practice session</p>
        
        <form class="setup-form" id="quiz-setup-form">
          <div class="setup-group">
            <label class="setup-label" for="subject-select">Subject</label>
            <select class="setup-select" id="subject-select" required>
              <option value="Assistant Registrar" ${this.quizSettings.subject === 'Assistant Registrar' ? 'selected' : ''}>Assistant Registrar</option>
              <option value="Admin Officer" ${this.quizSettings.subject === 'Admin Officer' ? 'selected' : ''}>Admin Officer</option>
              <option value="General Awareness and Current Affairs" ${this.quizSettings.subject === 'General Awareness and Current Affairs' ? 'selected' : ''}>General Awareness & Current Affairs</option>
              <option value="Quantitative Appritudes and Reasoning" ${this.quizSettings.subject === 'Quantitative Appritudes and Reasoning' ? 'selected' : ''}>Quantitative Aptitudes & Reasoning</option>
            </select>
          </div>
          
          <div class="setup-group">
            <label class="setup-label" for="duration-select">Duration (minutes)</label>
            <select class="setup-select" id="duration-select" required>
              <option value="15" ${this.quizSettings.duration === 15 ? 'selected' : ''}>15 minutes</option>
              <option value="30" ${this.quizSettings.duration === 30 ? 'selected' : ''}>30 minutes</option>
              <option value="45" ${this.quizSettings.duration === 45 ? 'selected' : ''}>45 minutes</option>
              <option value="60" ${this.quizSettings.duration === 60 ? 'selected' : ''}>60 minutes</option>
              <option value="90" ${this.quizSettings.duration === 90 ? 'selected' : ''}>90 minutes</option>
              <option value="120" ${this.quizSettings.duration === 120 ? 'selected' : ''}>120 minutes</option>
            </select>
          </div>
          
          <div class="setup-group">
            <label class="setup-label" for="question-count">Number of Questions</label>
            <input type="number" class="setup-input" id="question-count" 
                   min="10" max="100" step="5" value="${this.quizSettings.questionCount}" required>
          </div>
          
          <div class="setup-group">
            <label class="setup-label">
              <input type="checkbox" id="randomize-questions" ${this.quizSettings.randomize ? 'checked' : ''}> 
              Randomize Question Order
            </label>
          </div>
        </form>
        
        <button type="button" class="start-quiz-btn" id="start-quiz-btn">
          Start Quiz 🚀
        </button>
      </div>

      <div class="quiz-interface" id="quiz-interface">
        <!-- Quiz interface will be rendered here -->
      </div>
    `;
  }

  attachEventListeners() {
    document.addEventListener('click', (e) => {
      if (e.target.id === 'start-quiz-btn') {
        this.handleQuizStart();
      }
      
      if (e.target.classList.contains('option')) {
        this.selectOption(e.target);
      }
      
      if (e.target.classList.contains('question-number')) {
        const questionIndex = parseInt(e.target.dataset.index);
        this.goToQuestion(questionIndex);
      }
      
      if (e.target.id === 'prev-btn') {
        this.previousQuestion();
      }
      
      if (e.target.id === 'next-btn') {
        this.nextQuestion();
      }
      
      if (e.target.id === 'submit-btn') {
        this.showSubmitConfirmation();
      }
      
      if (e.target.id === 'mark-btn') {
        this.toggleQuestionMark();
      }
    });

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
      if (this.quizState === 'active') {
        this.handleKeyboardNavigation(e);
      }
    });

    // Prevent page refresh during quiz
    window.addEventListener('beforeunload', (e) => {
      if (this.quizState === 'active') {
        e.preventDefault();
        e.returnValue = 'Quiz in progress. Are you sure you want to leave?';
      }
    });
  }

  async handleQuizStart() {
    const form = document.getElementById('quiz-setup-form');
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    // Update settings from form
    this.quizSettings.subject = document.getElementById('subject-select').value;
    this.quizSettings.duration = parseInt(document.getElementById('duration-select').value);
    this.quizSettings.questionCount = parseInt(document.getElementById('question-count').value);
    this.quizSettings.randomize = document.getElementById('randomize-questions').checked;

    // Show loading state
    const startBtn = document.getElementById('start-quiz-btn');
    startBtn.innerHTML = 'Loading Questions... <div class="spinner"></div>';
    startBtn.disabled = true;

    try {
      await this.loadQuestions();
      this.startQuiz();
    } catch (error) {
      console.error('Error starting quiz:', error);
      this.showError('Failed to load questions. Please try again.');
      startBtn.innerHTML = 'Start Quiz 🚀';
      startBtn.disabled = false;
    }
  }

  async loadQuestions() {
    const response = await fetch(`./questions/${this.quizSettings.subject}.json`);
    if (!response.ok) {
      throw new Error(`Failed to load questions for ${this.quizSettings.subject}`);
    }

    const allQuestions = await response.json();
    
    // Randomize and select questions
    let selectedQuestions = [...allQuestions];
    
    if (this.quizSettings.randomize) {
      selectedQuestions = this.shuffleArray(selectedQuestions);
    }
    
    // Limit to requested count
    this.questions = selectedQuestions.slice(0, this.quizSettings.questionCount);
    
    // Initialize user answers
    this.userAnswers = new Array(this.questions.length).fill(null);
  }

  startQuiz() {
    this.quizState = 'active';
    this.startTime = Date.now();
    this.timeRemaining = this.quizSettings.duration * 60; // Convert to seconds
    
    this.renderQuizInterface();
    this.startTimer();
    this.renderCurrentQuestion();
  }

  renderQuizInterface() {
    const setupDiv = document.querySelector('.quiz-setup');
    const interfaceDiv = document.getElementById('quiz-interface');
    
    setupDiv.style.display = 'none';
    interfaceDiv.classList.add('active');
    
    interfaceDiv.innerHTML = `
      <div class="quiz-header">
        <h2 class="quiz-title">${this.quizSettings.subject}</h2>
        <div class="quiz-stats">
          <div class="stat-item">
            <span class="stat-label">Question</span>
            <span class="stat-value" id="current-question">1</span>
          </div>
          <div class="stat-item">
            <span class="stat-label">Total</span>
            <span class="stat-value">${this.questions.length}</span>
          </div>
          <div class="stat-item">
            <span class="stat-label">Answered</span>
            <span class="stat-value" id="answered-count">0</span>
          </div>
        </div>
        <div class="timer" id="timer">${this.formatTime(this.timeRemaining)}</div>
      </div>

      <div class="question-nav">
        <h3 class="nav-title">Question Navigation</h3>
        <div class="question-grid" id="question-grid">
          ${this.renderQuestionNavigation()}
        </div>
      </div>

      <div class="question-panel" id="question-panel">
        <!-- Current question will be rendered here -->
      </div>

      <div class="quiz-navigation">
        <button class="nav-btn prev-btn" id="prev-btn" disabled>
          ← Previous
        </button>
        
        <div class="nav-actions">
          <button class="mark-btn" id="mark-btn">Mark for Review</button>
          <button class="submit-btn" id="submit-btn">Submit Quiz</button>
        </div>
        
        <button class="nav-btn next-btn" id="next-btn">
          Next →
        </button>
      </div>
    `;
  }

  renderQuestionNavigation() {
    return this.questions.map((_, index) => {
      const status = this.getQuestionStatus(index);
      return `
        <button class="question-number ${status}" data-index="${index}">
          ${index + 1}
        </button>
      `;
    }).join('');
  }

  getQuestionStatus(index) {
    const classes = [];
    
    if (index === this.currentQuestionIndex) {
      classes.push('current');
    }
    
    if (this.userAnswers[index] !== null) {
      classes.push('answered');
    }
    
    if (this.questions[index].marked) {
      classes.push('marked');
    }
    
    return classes.join(' ');
  }

  renderCurrentQuestion() {
    const question = this.questions[this.currentQuestionIndex];
    const questionPanel = document.getElementById('question-panel');
    
    if (!question || !questionPanel) return;

    questionPanel.innerHTML = `
      <div class="question-header">
        <span class="question-info">Question ${this.currentQuestionIndex + 1} of ${this.questions.length}</span>
        <div class="question-actions">
          <button class="mark-btn ${question.marked ? 'marked' : ''}" id="mark-btn">
            ${question.marked ? 'Unmark' : 'Mark for Review'}
          </button>
        </div>
      </div>

      <div class="question-text">
        ${question.question}
      </div>

      <div class="options-container">
        ${question.options.map((option, index) => `
          <div class="option ${this.userAnswers[this.currentQuestionIndex] === index ? 'selected' : ''}" 
               data-index="${index}">
            <div class="option-radio"></div>
            <div class="option-text">${option}</div>
          </div>
        `).join('')}
      </div>
    `;

    this.updateNavigationButtons();
    this.updateQuestionNavigation();
    this.updateStats();
  }

  selectOption(optionElement) {
    // Remove selection from all options
    const options = document.querySelectorAll('.option');
    options.forEach(opt => opt.classList.remove('selected'));
    
    // Add selection to clicked option
    optionElement.classList.add('selected');
    
    // Store answer
    const optionIndex = parseInt(optionElement.dataset.index);
    this.userAnswers[this.currentQuestionIndex] = optionIndex;
    
    this.updateStats();
    this.updateQuestionNavigation();
  }

  previousQuestion() {
    if (this.currentQuestionIndex > 0) {
      this.currentQuestionIndex--;
      this.renderCurrentQuestion();
    }
  }

  nextQuestion() {
    if (this.currentQuestionIndex < this.questions.length - 1) {
      this.currentQuestionIndex++;
      this.renderCurrentQuestion();
    }
  }

  goToQuestion(index) {
    if (index >= 0 && index < this.questions.length) {
      this.currentQuestionIndex = index;
      this.renderCurrentQuestion();
    }
  }

  toggleQuestionMark() {
    this.questions[this.currentQuestionIndex].marked = !this.questions[this.currentQuestionIndex].marked;
    
    const markBtn = document.getElementById('mark-btn');
    if (this.questions[this.currentQuestionIndex].marked) {
      markBtn.textContent = 'Unmark';
      markBtn.classList.add('marked');
    } else {
      markBtn.textContent = 'Mark for Review';
      markBtn.classList.remove('marked');
    }
    
    this.updateQuestionNavigation();
  }

  updateNavigationButtons() {
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    
    if (prevBtn) {
      prevBtn.disabled = this.currentQuestionIndex === 0;
    }
    
    if (nextBtn) {
      if (this.currentQuestionIndex === this.questions.length - 1) {
        nextBtn.textContent = 'Review Answers';
      } else {
        nextBtn.textContent = 'Next →';
      }
    }
  }

  updateQuestionNavigation() {
    const questionGrid = document.getElementById('question-grid');
    if (!questionGrid) return;

    questionGrid.innerHTML = this.renderQuestionNavigation();
  }

  updateStats() {
    const currentQuestionEl = document.getElementById('current-question');
    const answeredCountEl = document.getElementById('answered-count');
    
    if (currentQuestionEl) {
      currentQuestionEl.textContent = this.currentQuestionIndex + 1;
    }
    
    if (answeredCountEl) {
      const answeredCount = this.userAnswers.filter(answer => answer !== null).length;
      answeredCountEl.textContent = answeredCount;
    }
  }

  startTimer() {
    this.timer = setInterval(() => {
      this.timeRemaining--;
      
      const timerEl = document.getElementById('timer');
      if (timerEl) {
        timerEl.textContent = this.formatTime(this.timeRemaining);
        
        // Warning states
        if (this.timeRemaining <= 300) { // 5 minutes
          timerEl.classList.add('warning');
        }
        if (this.timeRemaining <= 60) { // 1 minute
          timerEl.classList.add('danger');
        }
      }
      
      if (this.timeRemaining <= 0) {
        this.timeUp();
      }
    }, 1000);
  }

  timeUp() {
    clearInterval(this.timer);
    this.showTimeUpModal();
  }

  showTimeUpModal() {
    const modal = document.createElement('div');
    modal.className = 'modal-overlay active';
    modal.innerHTML = `
      <div class="modal">
        <div class="modal-header">
          <h2 class="modal-title">⏰ Time's Up!</h2>
        </div>
        <div class="modal-body">
          <p>Your quiz time has expired. Your answers have been automatically submitted.</p>
        </div>
        <div class="modal-footer">
          <button class="btn btn-primary" onclick="this.closest('.modal-overlay').remove(); window.quizApp.finishQuiz()">
            View Results
          </button>
        </div>
      </div>
    `;
    
    document.body.appendChild(modal);
  }

  showSubmitConfirmation() {
    const unanswered = this.userAnswers.filter(answer => answer === null).length;
    const message = unanswered > 0 
      ? `You have ${unanswered} unanswered questions. Are you sure you want to submit?`
      : 'Are you sure you want to submit your quiz?';

    const modal = document.createElement('div');
    modal.className = 'modal-overlay active';
    modal.innerHTML = `
      <div class="modal">
        <div class="modal-header">
          <h2 class="modal-title">Submit Quiz</h2>
        </div>
        <div class="modal-body">
          <p>${message}</p>
        </div>
        <div class="modal-footer">
          <button class="btn btn-ghost" onclick="this.closest('.modal-overlay').remove()">
            Continue Quiz
          </button>
          <button class="btn btn-primary" onclick="this.closest('.modal-overlay').remove(); window.quizApp.finishQuiz()">
            Submit Quiz
          </button>
        </div>
      </div>
    `;
    
    document.body.appendChild(modal);
  }

  finishQuiz() {
    clearInterval(this.timer);
    this.quizState = 'completed';
    
    const results = this.calculateResults();
    this.saveQuizResults(results);
    this.showResults(results);
  }

  calculateResults() {
    const endTime = Date.now();
    const timeTaken = Math.round((endTime - this.startTime) / 1000); // in seconds
    
    let correct = 0;
    let incorrect = 0;
    let unanswered = 0;
    const wrongAnswers = [];
    
    this.questions.forEach((question, index) => {
      const userAnswer = this.userAnswers[index];
      
      if (userAnswer === null) {
        unanswered++;
      } else if (userAnswer === question.correctAnswer) {
        correct++;
      } else {
        incorrect++;
        wrongAnswers.push({
          questionId: `${this.quizSettings.subject}_${index}`,
          question: question.question,
          correctAnswer: question.options[question.correctAnswer],
          userAnswer: question.options[userAnswer],
          explanation: question.explanation,
          subject: this.quizSettings.subject,
          topic: question.topic || 'General'
        });
      }
    });
    
    const percentage = Math.round((correct / this.questions.length) * 100);
    
    return {
      subject: this.quizSettings.subject,
      totalQuestions: this.questions.length,
      correctAnswers: correct,
      incorrectAnswers: incorrect,
      unanswered: unanswered,
      percentage: percentage,
      timeTaken: timeTaken,
      questions: this.questions.map((q, index) => ({
        question: q.question,
        options: q.options,
        correctAnswer: q.correctAnswer,
        userAnswer: this.userAnswers[index],
        explanation: q.explanation,
        isCorrect: this.userAnswers[index] === q.correctAnswer
      })),
      wrongAnswers: wrongAnswers
    };
  }

  saveQuizResults(results) {
    if (window.LocalAccount) {
      window.LocalAccount.addQuizResult(results);
      
      // Check for new achievements
      const newAchievements = window.LocalAccount.checkAndAwardAchievements();
      if (newAchievements.length > 0) {
        this.showAchievements(newAchievements);
      }
    }
  }

  showResults(results) {
    const modal = document.createElement('div');
    modal.className = 'modal-overlay active results-modal';
    
    const performanceLevel = this.getPerformanceLevel(results.percentage);
    const improvementAreas = this.getImprovementAreas(results.wrongAnswers);
    
    modal.innerHTML = `
      <div class="modal">
        <div class="modal-header">
          <h2 class="modal-title">Quiz Results</h2>
          <button class="modal-close" onclick="this.closest('.modal-overlay').remove()">×</button>
        </div>
        
        <div class="modal-body">
          <div class="results-header">
            <h3 class="results-title">Your Performance</h3>
            <div class="results-score">${results.percentage}%</div>
            <div class="results-percentage">${performanceLevel}</div>
          </div>

          <div class="results-stats">
            <div class="result-stat">
              <div class="result-stat-value correct">${results.correctAnswers}</div>
              <div class="result-stat-label">Correct</div>
            </div>
            <div class="result-stat">
              <div class="result-stat-value incorrect">${results.incorrectAnswers}</div>
              <div class="result-stat-label">Incorrect</div>
            </div>
            <div class="result-stat">
              <div class="result-stat-value unanswered">${results.unanswered}</div>
              <div class="result-stat-label">Unanswered</div>
            </div>
            <div class="result-stat">
              <div class="result-stat-value">${this.formatTime(results.timeTaken)}</div>
              <div class="result-stat-label">Time Taken</div>
            </div>
          </div>

          ${improvementAreas.length > 0 ? `
            <div class="performance-analysis">
              <h4 class="analysis-title">Areas for Improvement</h4>
              <div class="improvement-areas">
                ${improvementAreas.map(area => `<span class="improvement-tag">${area}</span>`).join('')}
              </div>
            </div>
          ` : ''}

          <div class="question-review">
            <h4>Question Review</h4>
            <div class="review-container">
              ${results.questions.map((q, index) => this.renderQuestionReview(q, index)).join('')}
            </div>
          </div>
        </div>

        <div class="modal-footer results-actions">
          <button class="btn btn-outline" onclick="window.location.href='/src/pages/dashboard.html'">
            View Dashboard
          </button>
          <button class="btn btn-secondary" onclick="window.location.reload()">
            Retake Quiz
          </button>
          <button class="btn btn-primary" onclick="window.location.href='/'">
            Back to Home
          </button>
        </div>
      </div>
    `;
    
    document.body.appendChild(modal);
  }

  renderQuestionReview(question, index) {
    const statusClass = question.isCorrect ? 'correct' : 
                       question.userAnswer !== null ? 'incorrect' : 'unanswered';
    const statusText = question.isCorrect ? 'Correct' : 
                      question.userAnswer !== null ? 'Incorrect' : 'Unanswered';
    
    return `
      <div class="review-question">
        <div class="review-header">
          <span class="review-question-number">Question ${index + 1}</span>
          <span class="review-status ${statusClass}">${statusText}</span>
        </div>
        
        <div class="review-question-text">${question.question}</div>
        
        ${question.userAnswer !== null ? `
          <div class="review-answer">
            <strong>Your Answer:</strong> ${question.options[question.userAnswer]}
          </div>
        ` : ''}
        
        <div class="review-answer">
          <strong>Correct Answer:</strong> ${question.options[question.correctAnswer]}
        </div>
        
        ${question.explanation ? `
          <div class="review-explanation">
            <strong>Explanation:</strong> ${question.explanation}
          </div>
        ` : ''}
      </div>
    `;
  }

  getPerformanceLevel(percentage) {
    if (percentage >= 90) return 'Excellent! 🌟';
    if (percentage >= 80) return 'Very Good! 👍';
    if (percentage >= 70) return 'Good! 👌';
    if (percentage >= 60) return 'Fair 📚';
    return 'Needs Improvement 💪';
  }

  getImprovementAreas(wrongAnswers) {
    const topics = {};
    
    wrongAnswers.forEach(answer => {
      const topic = answer.topic || 'General';
      topics[topic] = (topics[topic] || 0) + 1;
    });
    
    return Object.entries(topics)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([topic]) => topic);
  }

  showAchievements(achievements) {
    setTimeout(() => {
      const modal = document.createElement('div');
      modal.className = 'modal-overlay active';
      modal.innerHTML = `
        <div class="modal">
          <div class="modal-header">
            <h2 class="modal-title">🏆 New Achievements!</h2>
            <button class="modal-close" onclick="this.closest('.modal-overlay').remove()">×</button>
          </div>
          <div class="modal-body">
            ${achievements.map(achievement => `
              <div class="achievement-item">
                <div class="achievement-icon">${achievement.icon}</div>
                <div class="achievement-info">
                  <h4>${achievement.name}</h4>
                  <p>${achievement.description}</p>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      `;
      document.body.appendChild(modal);
    }, 2000);
  }

  handleKeyboardNavigation(e) {
    switch (e.key) {
      case 'ArrowLeft':
        e.preventDefault();
        this.previousQuestion();
        break;
      case 'ArrowRight':
      case 'Enter':
        e.preventDefault();
        this.nextQuestion();
        break;
      case ' ':
        e.preventDefault();
        // Select first unselected option or toggle current selection
        const options = document.querySelectorAll('.option');
        const selectedOption = document.querySelector('.option.selected');
        if (!selectedOption && options.length > 0) {
          this.selectOption(options[0]);
        }
        break;
      case '1':
      case '2':
      case '3':
      case '4':
        e.preventDefault();
        const optionIndex = parseInt(e.key) - 1;
        const option = document.querySelector(`.option[data-index="${optionIndex}"]`);
        if (option) {
          this.selectOption(option);
        }
        break;
    }
  }

  formatTime(seconds) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  }

  shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }

  showError(message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'alert alert-error';
    errorDiv.textContent = message;
    
    const container = document.querySelector('.quiz-container');
    if (container) {
      container.insertBefore(errorDiv, container.firstChild);
      setTimeout(() => errorDiv.remove(), 5000);
    }
  }
}

// Initialize quiz app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  window.quizApp = new QuizApp();
});