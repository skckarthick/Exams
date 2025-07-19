// Assistant Registrar tab functionality
class AssistantRegistrarTab {
  constructor() {
    this.questions = [];
    this.currentQuestionIndex = 0;
    this.studyMode = 'practice'; // practice, reinforcement
    this.showAnswers = false;
    this.userProgress = {
      questionsStudied: 0,
      correctAnswers: 0,
      topicProgress: {}
    };
    
    this.init();
  }

  async init() {
    await this.loadQuestions();
    this.loadUserProgress();
    // Initialize animations for practice mode
    if (window.PracticeAnimations) {
      window.PracticeAnimations.init();
    }
    this.renderInterface();
    this.attachEventListeners();
    this.startStudySession();
  }

  async loadQuestions() {
    try {
      const response = await fetch('/questions/Assistant Registrar.json');
      if (!response.ok) {
        throw new Error('Failed to load questions');
      }
      
      this.questions = await response.json();
      
      // Add metadata if missing
      this.questions = this.questions.map((q, index) => ({
        id: q.id || `ar_${index}`,
        question: q.question,
        options: q.options,
        correctAnswer: q.correctAnswer,
        explanation: q.explanation || 'No explanation available.',
        topic: q.topic || 'General',
        difficulty: q.difficulty || 'medium',
        ...q
      }));
      
    } catch (error) {
      console.error('Error loading questions:', error);
      this.showError('Failed to load questions. Please refresh the page.');
    }
  }

  loadUserProgress() {
    if (window.LocalAccount) {
      const progress = window.LocalAccount.getSubjectProgress('Assistant Registrar');
      if (progress) {
        this.userProgress = { ...this.userProgress, ...progress };
      }
      
      // Load wrong answers for reinforcement
      this.wrongAnswers = window.LocalAccount.getWrongAnswers('Assistant Registrar');
    }
  }

  renderInterface() {
    const container = document.querySelector('.assistant-registrar-container');
    if (!container) return;

    container.innerHTML = `
      <div class="tab-header">
        <h1 class="tab-title">📋 Assistant Registrar</h1>
        <p class="tab-description">
          Master administrative and clerical concepts with comprehensive practice questions 
          and detailed explanations. Build your knowledge systematically.
        </p>
      </div>

      ${this.renderModeSelector()}
      ${this.renderProgressSection()}
      ${this.renderPracticeInterface()}
      ${this.renderTopicPerformance()}
    `;
  }

  renderModeSelector() {
    return `
      <div class="study-mode-selector">
        <h2 class="mode-title">Choose Your Study Mode</h2>
        
        <div class="mode-options">
          <div class="mode-card" data-mode="practice">
            <div class="mode-icon">📚</div>
            <h3 class="mode-name">Practice Mode</h3>
            <p class="mode-description">
              Study questions with instant feedback and detailed explanations. 
              Perfect for learning new concepts.
            </p>
            <button class="btn btn-primary">Start Practice</button>
          </div>
          
          <div class="mode-card" data-mode="reinforcement">
            <div class="mode-icon">🔄</div>
            <h3 class="mode-name">Reinforcement Learning</h3>
            <p class="mode-description">
              Focus on questions you've answered incorrectly before. 
              Strengthen weak areas through repetition.
            </p>
            <button class="btn btn-secondary">Review Mistakes (${this.wrongAnswers?.length || 0})</button>
          </div>
          
          <div class="mode-card" data-mode="topic">
            <div class="mode-icon">🎯</div>
            <h3 class="mode-name">Topic-wise Study</h3>
            <p class="mode-description">
              Study specific topics in detail. Choose from various 
              administrative and clerical subjects.
            </p>
            <button class="btn btn-outline">Select Topics</button>
          </div>
        </div>
      </div>
    `;
  }

  renderProgressSection() {
    const accuracy = this.userProgress.questionsStudied > 0 ? 
      Math.round((this.userProgress.correctAnswers / this.userProgress.questionsStudied) * 100) : 0;

    return `
      <div class="progress-section">
        <div class="progress-header">
          <h3 class="progress-title">Your Progress</h3>
          <span class="progress-percentage">${accuracy}%</span>
        </div>
        <div class="progress-bar-container">
          <div class="progress-bar" style="width: ${accuracy}%"></div>
        </div>
      </div>
    `;
  }

  renderPracticeInterface() {
    return `
      <div class="practice-interface" id="practice-interface">
        <div class="practice-controls">
          <div class="practice-stats">
            <div class="stat-item">
              <span class="stat-label">Question</span>
              <span class="stat-value" id="current-question-num">1</span>
            </div>
            <div class="stat-item">
              <span class="stat-label">Studied</span>
              <span class="stat-value" id="questions-studied">${this.userProgress.questionsStudied}</span>
            </div>
            <div class="stat-item">
              <span class="stat-label">Accuracy</span>
              <span class="stat-value" id="current-accuracy">${this.userProgress.questionsStudied > 0 ? Math.round((this.userProgress.correctAnswers / this.userProgress.questionsStudied) * 100) : 0}%</span>
            </div>
          </div>
          
          <div class="practice-actions">
            <button class="action-btn shuffle-btn" id="shuffle-btn">🔀 Shuffle</button>
            <button class="action-btn reset-btn" id="reset-btn">🔄 Reset</button>
          </div>
        </div>

        <div class="question-container" id="question-container">
          <!-- Question content will be rendered here -->
        </div>

        <div class="question-navigation">
          <button class="nav-btn prev-btn" id="prev-btn">← Previous</button>
          <button class="nav-btn show-answer-btn" id="show-answer-btn">Show Answer</button>
          <button class="nav-btn next-btn" id="next-btn">Next →</button>
        </div>
      </div>
    `;
  }

  renderTopicPerformance() {
    const topics = this.getTopicStats();
    
    return `
      <div class="topic-performance">
        <h2 class="performance-title">📊 Topic Performance</h2>
        
        <div class="topic-grid">
          ${Object.entries(topics).map(([topic, stats]) => `
            <div class="topic-card" onclick="assistantRegistrarTab.filterByTopic('${topic}')">
              <h3 class="topic-name">${topic}</h3>
              <div class="topic-score ${this.getScoreClass(stats.accuracy)}">${stats.accuracy}%</div>
              <div class="topic-questions">${stats.answered}/${stats.total} questions</div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  attachEventListeners() {
    document.addEventListener('click', (e) => {
      // Mode selection
      if (e.target.closest('.mode-card')) {
        const modeCard = e.target.closest('.mode-card');
        const mode = modeCard.dataset.mode;
        this.selectStudyMode(mode);
      }
      
      // Navigation buttons
      if (e.target.id === 'prev-btn') {
        this.previousQuestion();
      }
      
      if (e.target.id === 'next-btn') {
        this.nextQuestion();
      }
      
      if (e.target.id === 'show-answer-btn') {
        this.toggleAnswer();
      }
      
      if (e.target.id === 'shuffle-btn') {
        this.shuffleQuestions();
      }
      
      if (e.target.id === 'reset-btn') {
        this.resetProgress();
      }
      
      // Option selection
      if (e.target.closest('.option-item')) {
        this.selectOption(e.target.closest('.option-item'));
      }
    });

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
      this.handleKeyboardNavigation(e);
    });
  }

  selectStudyMode(mode) {
    this.studyMode = mode;
    
    // Update UI
    document.querySelectorAll('.mode-card').forEach(card => {
      card.classList.remove('active');
    });
    
    document.querySelector(`[data-mode="${mode}"]`).classList.add('active');
    
    // Show practice interface
    const practiceInterface = document.getElementById('practice-interface');
    practiceInterface.classList.add('active');
    
    // Scroll to practice interface
    practiceInterface.scrollIntoView({ 
      behavior: 'smooth', 
      block: 'start' 
    });
    
    // Prepare questions based on mode
    this.prepareQuestions();
    this.renderCurrentQuestion();
  }

  prepareQuestions() {
    switch (this.studyMode) {
      case 'practice':
        // Use all questions, shuffled
        this.activeQuestions = [...this.questions];
        this.shuffleArray(this.activeQuestions);
        break;
        
      case 'reinforcement':
        // Use only wrong answers
        if (this.wrongAnswers && this.wrongAnswers.length > 0) {
          this.activeQuestions = this.questions.filter(q => 
            this.wrongAnswers.some(wa => wa.questionId === q.id)
          );
        } else {
          this.activeQuestions = [...this.questions].slice(0, 20);
        }
        break;
        
      case 'topic':
        // Will be filtered by topic selection
        this.activeQuestions = [...this.questions];
        break;
        
      default:
        this.activeQuestions = [...this.questions];
    }
    
    this.currentQuestionIndex = 0;
  }

  startStudySession() {
    // Auto-start practice mode
    this.selectStudyMode('practice');
  }

  renderCurrentQuestion() {
    if (!this.activeQuestions || this.activeQuestions.length === 0) {
      this.showError('No questions available for this mode.');
      return;
    }

    const question = this.activeQuestions[this.currentQuestionIndex];
    const container = document.getElementById('question-container');
    
    if (!container || !question) return;

    // Show reinforcement indicator if applicable
    const isReinforcement = this.studyMode === 'reinforcement' || 
      (this.wrongAnswers && this.wrongAnswers.some(wa => wa.questionId === question.id));

    container.innerHTML = `
      ${isReinforcement ? `
        <div class="reinforcement-indicator show">
          🔄 Reinforcement Learning: You've answered this question incorrectly before
        </div>
      ` : ''}
      
      <div class="question-header">
        <span class="question-number">Question ${this.currentQuestionIndex + 1} of ${this.activeQuestions.length}</span>
        <span class="difficulty-badge difficulty-${question.difficulty}">${question.difficulty}</span>
      </div>

      <div class="question-text">${question.question}</div>

      <div class="options-list">
        ${question.options.map((option, index) => `
          <div class="option-item" data-index="${index}">
            <div class="option-letter">${String.fromCharCode(65 + index)}</div>
            <div class="option-text">${option}</div>
          </div>
        `).join('')}
      </div>

      <div class="answer-feedback" id="answer-feedback">
        <div class="feedback-header">
          <div class="feedback-icon">✓</div>
          <h4 class="feedback-title">Explanation</h4>
        </div>
        <div class="feedback-explanation">${question.explanation}</div>
        <div class="feedback-topic">${question.topic}</div>
      </div>
    `;

    this.updateNavigationButtons();
    this.updateStats();
    this.showAnswers = false;
  }

  selectOption(optionElement) {
    // Clean up previous animations
    if (window.PracticeAnimations) {
      window.PracticeAnimations.cleanup();
    }
    
    // Animate option selection
    if (window.PracticeAnimations) {
      window.PracticeAnimations.animateOptionSelection(optionElement);
    }
    
    // Remove previous selections
    document.querySelectorAll('.option-item').forEach(opt => {
      opt.classList.remove('selected', 'correct', 'incorrect');
    });

    // Mark selected option
    optionElement.classList.add('selected');
    
    const selectedIndex = parseInt(optionElement.dataset.index);
    const question = this.activeQuestions[this.currentQuestionIndex];
    const isCorrect = selectedIndex === question.correctAnswer;

    // Update progress
    this.userProgress.questionsStudied++;
    if (isCorrect) {
      this.userProgress.correctAnswers++;
      optionElement.classList.add('correct');
      
      // Animate correct answer
      if (window.PracticeAnimations) {
        window.PracticeAnimations.animateCorrectAnswer(optionElement);
      }
    } else {
      optionElement.classList.add('incorrect');
      
      // Animate incorrect answer
      if (window.PracticeAnimations) {
        window.PracticeAnimations.animateIncorrectAnswer(optionElement);
      }
      
      // Show correct answer
      const correctOption = document.querySelector(`[data-index="${question.correctAnswer}"]`);
      if (correctOption) {
        correctOption.classList.add('correct');
        
        // Animate correct answer reveal
        if (window.PracticeAnimations) {
          setTimeout(() => {
            window.PracticeAnimations.animateCorrectAnswer(correctOption);
          }, 300);
        }
      }
      
      // Add to wrong answers for reinforcement
      this.addWrongAnswer(question, selectedIndex);
    }

    // Show explanation
    this.showAnswer();
    
    // Update topic progress
    this.updateTopicProgress(question.topic, isCorrect);
    
    // Save progress
    this.saveProgress();
  }

  showAnswer() {
    const feedback = document.getElementById('answer-feedback');
    if (feedback) {
      feedback.classList.add('show');
      
      // Animate explanation reveal
      if (window.PracticeAnimations) {
        window.PracticeAnimations.animateExplanationReveal(feedback);
      }
      
      this.showAnswers = true;
      
      const showAnswerBtn = document.getElementById('show-answer-btn');
      if (showAnswerBtn) {
        showAnswerBtn.textContent = 'Hide Answer';
      }
    }
  }

  toggleAnswer() {
    const feedback = document.getElementById('answer-feedback');
    const showAnswerBtn = document.getElementById('show-answer-btn');
    
    if (!feedback || !showAnswerBtn) return;

    if (this.showAnswers) {
      feedback.classList.remove('show');
      showAnswerBtn.textContent = 'Show Answer';
      this.showAnswers = false;
    } else {
      // Show correct answer without user selection
      const question = this.activeQuestions[this.currentQuestionIndex];
      const correctOption = document.querySelector(`[data-index="${question.correctAnswer}"]`);
      if (correctOption) {
        correctOption.classList.add('correct');
      }
      
      feedback.classList.add('show');
      showAnswerBtn.textContent = 'Hide Answer';
      this.showAnswers = true;
    }
  }

  previousQuestion() {
    if (this.currentQuestionIndex > 0) {
      this.currentQuestionIndex--;
      this.renderCurrentQuestion();
    }
  }

  nextQuestion() {
    if (this.currentQuestionIndex < this.activeQuestions.length - 1) {
      this.currentQuestionIndex++;
      this.renderCurrentQuestion();
    } else {
      // End of questions - show completion
      this.showCompletionMessage();
    }
  }

  shuffleQuestions() {
    this.shuffleArray(this.activeQuestions);
    this.currentQuestionIndex = 0;
    this.renderCurrentQuestion();
  }

  resetProgress() {
    if (confirm('Are you sure you want to reset your progress? This cannot be undone.')) {
      this.userProgress = {
        questionsStudied: 0,
        correctAnswers: 0,
        topicProgress: {}
      };
      
      this.saveProgress();
      this.currentQuestionIndex = 0;
      this.renderCurrentQuestion();
      this.updateStats();
    }
  }

  updateNavigationButtons() {
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    
    if (prevBtn) {
      prevBtn.disabled = this.currentQuestionIndex === 0;
    }
    
    if (nextBtn) {
      if (this.currentQuestionIndex === this.activeQuestions.length - 1) {
        nextBtn.textContent = 'Complete Study';
      } else {
        nextBtn.textContent = 'Next →';
      }
    }
  }

  updateStats() {
    const currentQuestionEl = document.getElementById('current-question-num');
    const questionsStudiedEl = document.getElementById('questions-studied');
    const accuracyEl = document.getElementById('current-accuracy');
    
    if (currentQuestionEl) {
      currentQuestionEl.textContent = this.currentQuestionIndex + 1;
    }
    
    if (questionsStudiedEl) {
      questionsStudiedEl.textContent = this.userProgress.questionsStudied;
    }
    
    if (accuracyEl) {
      const accuracy = this.userProgress.questionsStudied > 0 ? 
        Math.round((this.userProgress.correctAnswers / this.userProgress.questionsStudied) * 100) : 0;
      accuracyEl.textContent = `${accuracy}%`;
    }
  }

  updateTopicProgress(topic, isCorrect) {
    if (!this.userProgress.topicProgress[topic]) {
      this.userProgress.topicProgress[topic] = {
        total: 0,
        correct: 0
      };
    }
    
    this.userProgress.topicProgress[topic].total++;
    if (isCorrect) {
      this.userProgress.topicProgress[topic].correct++;
    }
  }

  addWrongAnswer(question, userAnswer) {
    if (window.LocalAccount) {
      const wrongAnswer = {
        questionId: question.id,
        question: question.question,
        correctAnswer: question.options[question.correctAnswer],
        userAnswer: question.options[userAnswer],
        subject: 'Assistant Registrar',
        topic: question.topic,
        explanation: question.explanation
      };
      
      window.LocalAccount.addWrongAnswers([wrongAnswer]);
    }
  }

  saveProgress() {
    if (window.LocalAccount) {
      // Update subject progress
      const progressData = {
        questionsAnswered: this.userProgress.questionsStudied,
        correctAnswers: this.userProgress.correctAnswers,
        accuracy: this.userProgress.questionsStudied > 0 ? 
          Math.round((this.userProgress.correctAnswers / this.userProgress.questionsStudied) * 100) : 0,
        topicProgress: this.userProgress.topicProgress,
        lastStudied: new Date().toISOString()
      };
      
      // This would need to be implemented in LocalAccount
      // window.LocalAccount.updateSubjectProgress('Assistant Registrar', progressData);
    }
  }

  getTopicStats() {
    const topics = {};
    
    // Initialize topics from questions
    this.questions.forEach(q => {
      const topic = q.topic || 'General';
      if (!topics[topic]) {
        topics[topic] = { total: 0, answered: 0, correct: 0, accuracy: 0 };
      }
      topics[topic].total++;
    });
    
    // Update with user progress
    Object.entries(this.userProgress.topicProgress || {}).forEach(([topic, progress]) => {
      if (topics[topic]) {
        topics[topic].answered = progress.total;
        topics[topic].correct = progress.correct;
        topics[topic].accuracy = progress.total > 0 ? 
          Math.round((progress.correct / progress.total) * 100) : 0;
      }
    });
    
    return topics;
  }

  getScoreClass(accuracy) {
    if (accuracy >= 90) return 'score-excellent';
    if (accuracy >= 75) return 'score-good';
    if (accuracy >= 60) return 'score-needs-work';
    return 'score-poor';
  }

  filterByTopic(topic) {
    this.activeQuestions = this.questions.filter(q => q.topic === topic);
    this.currentQuestionIndex = 0;
    this.studyMode = 'topic';
    
    // Show practice interface
    const practiceInterface = document.getElementById('practice-interface');
    practiceInterface.classList.add('active');
    
    // Scroll to practice interface
    practiceInterface.scrollIntoView({ 
      behavior: 'smooth', 
      block: 'start' 
    });
    
    this.renderCurrentQuestion();
  }

  showCompletionMessage() {
    const accuracy = this.userProgress.questionsStudied > 0 ? 
      Math.round((this.userProgress.correctAnswers / this.userProgress.questionsStudied) * 100) : 0;

    const modal = document.createElement('div');
    modal.className = 'modal-overlay active';
    modal.innerHTML = `
      <div class="modal">
        <div class="modal-header">
          <h2 class="modal-title">🎉 Study Session Complete!</h2>
        </div>
        <div class="modal-body">
          <div class="completion-stats">
            <div class="completion-stat">
              <div class="stat-number">${this.userProgress.questionsStudied}</div>
              <div class="stat-label">Questions Studied</div>
            </div>
            <div class="completion-stat">
              <div class="stat-number">${accuracy}%</div>
              <div class="stat-label">Accuracy</div>
            </div>
            <div class="completion-stat">
              <div class="stat-number">${this.userProgress.correctAnswers}</div>
              <div class="stat-label">Correct Answers</div>
            </div>
          </div>
          
          <p>Great job! You've completed this study session. Your progress has been saved.</p>
        </div>
        <div class="modal-footer">
          <button class="btn btn-outline" onclick="this.closest('.modal-overlay').remove(); assistantRegistrarTab.resetSession()">
            Study More
          </button>
          <button class="btn btn-primary" onclick="window.location.href='/src/pages/dashboard.html'">
            View Dashboard
          </button>
        </div>
      </div>
    `;
    
    document.body.appendChild(modal);
  }

  resetSession() {
    this.currentQuestionIndex = 0;
    this.prepareQuestions();
    this.renderCurrentQuestion();
  }

  handleKeyboardNavigation(e) {
    if (!document.getElementById('practice-interface').classList.contains('active')) {
      return;
    }

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
        this.toggleAnswer();
        break;
      case '1':
      case '2':
      case '3':
      case '4':
        e.preventDefault();
        const optionIndex = parseInt(e.key) - 1;
        const option = document.querySelector(`[data-index="${optionIndex}"]`);
        if (option) {
          this.selectOption(option);
        }
        break;
    }
  }

  shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  showError(message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'alert alert-error';
    errorDiv.textContent = message;
    
    const container = document.querySelector('.assistant-registrar-container');
    if (container) {
      container.insertBefore(errorDiv, container.firstChild);
      setTimeout(() => errorDiv.remove(), 5000);
    }
  }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  window.assistantRegistrarTab = new AssistantRegistrarTab();
});