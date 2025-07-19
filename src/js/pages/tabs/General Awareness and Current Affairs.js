// General Awareness and Current Affairs tab functionality
class GeneralAwarenessTab {
  constructor() {
    this.questions = [];
    this.currentQuestionIndex = 0;
    this.studyMode = 'practice';
    this.showAnswers = false;
    this.userProgress = {
      questionsStudied: 0,
      correctAnswers: 0,
      topicProgress: {}
    };
    this.currentAffairs = [];
    
    this.init();
  }

  async init() {
    await this.loadQuestions();
    this.loadUserProgress();
    this.loadCurrentAffairs();
    this.renderInterface();
    this.attachEventListeners();
    this.startStudySession();
  }

  async loadQuestions() {
    try {
      const response = await fetch('../../../questions/General Awareness and Current Affairs.json');
      if (!response.ok) {
        throw new Error('Failed to load questions');
      }
      
      this.questions = await response.json();
      
      this.questions = this.questions.map((q, index) => ({
        id: q.id || `ga_${index}`,
        question: q.question,
        options: q.options,
        correctAnswer: q.correctAnswer,
        explanation: q.explanation || 'No explanation available.',
        topic: q.topic || 'General Knowledge',
        difficulty: q.difficulty || 'medium',
        category: q.category || 'general',
        isCurrentAffair: q.isCurrentAffair || false,
        date: q.date || null,
        ...q
      }));
      
    } catch (error) {
      console.error('Error loading questions:', error);
      this.showError('Failed to load questions. Please refresh the page.');
    }
  }

  loadUserProgress() {
    if (window.LocalAccount) {
      const progress = window.LocalAccount.getSubjectProgress('General Awareness and Current Affairs');
      if (progress) {
        this.userProgress = { ...this.userProgress, ...progress };
      }
      
      this.wrongAnswers = window.LocalAccount.getWrongAnswers('General Awareness and Current Affairs');
    }
  }

  loadCurrentAffairs() {
    // Simulate current affairs data - in real app, this would come from an API
    this.currentAffairs = [
      {
        date: '2024-01-15',
        title: 'New Government Policy on Digital India',
        summary: 'Government announces new initiatives for digital transformation...',
        tags: ['Policy', 'Technology', 'Government']
      },
      {
        date: '2024-01-14',
        title: 'Economic Survey 2024 Highlights',
        summary: 'Key findings from the latest economic survey...',
        tags: ['Economy', 'Finance', 'Survey']
      },
      {
        date: '2024-01-13',
        title: 'International Relations Update',
        summary: 'Recent developments in foreign policy...',
        tags: ['International', 'Diplomacy', 'Foreign Policy']
      }
    ];
  }

  renderInterface() {
    const container = document.querySelector('.general-awareness-container');
    if (!container) return;

    container.innerHTML = `
      <div class="tab-header">
        <h1 class="tab-title">🌐 General Awareness & Current Affairs</h1>
        <p class="tab-description">
          Stay updated with current events and strengthen your general knowledge 
          with comprehensive coverage of national and international affairs.
        </p>
      </div>

      ${this.renderCurrentAffairsTicker()}
      ${this.renderAwarenessCategories()}
      ${this.renderTimeBasedPractice()}
      ${this.renderCurrentAffairsIntegration()}
      ${this.renderModeSelector()}
      ${this.renderProgressSection()}
      ${this.renderPracticeInterface()}
      ${this.renderTopicPerformance()}
    `;
  }

  renderCurrentAffairsTicker() {
    const latestAffair = this.currentAffairs[0];
    
    return `
      <div class="current-affairs-ticker">
        <div class="ticker-header">
          <span class="ticker-icon">📰</span>
          <span class="ticker-title">Latest Current Affairs</span>
        </div>
        <div class="ticker-content">
          <div class="ticker-text">
            ${latestAffair ? `${latestAffair.title} - ${latestAffair.summary}` : 'Stay updated with the latest current affairs...'}
          </div>
        </div>
      </div>
    `;
  }

  renderAwarenessCategories() {
    const categories = [
      {
        name: 'Indian History',
        icon: '🏛️',
        description: 'Ancient, medieval, and modern Indian history',
        questions: this.questions.filter(q => q.category === 'history').length
      },
      {
        name: 'Geography',
        icon: '🌍',
        description: 'Physical and political geography of India and world',
        questions: this.questions.filter(q => q.category === 'geography').length
      },
      {
        name: 'Indian Polity',
        icon: '🏛️',
        description: 'Constitution, governance, and political system',
        questions: this.questions.filter(q => q.category === 'polity').length
      },
      {
        name: 'Economics',
        icon: '💰',
        description: 'Indian economy, budget, and economic policies',
        questions: this.questions.filter(q => q.category === 'economics').length
      },
      {
        name: 'Science & Technology',
        icon: '🔬',
        description: 'Scientific developments and technological advances',
        questions: this.questions.filter(q => q.category === 'science').length
      },
      {
        name: 'Current Affairs',
        icon: '📰',
        description: 'Recent events and contemporary issues',
        questions: this.questions.filter(q => q.isCurrentAffair).length
      }
    ];

    return `
      <div class="awareness-categories">
        <h2 class="categories-title">📚 Knowledge Categories</h2>
        
        <div class="categories-grid">
          ${categories.map(category => `
            <div class="category-card" onclick="generalAwarenessTab.filterByCategory('${category.name}')">
              <div class="category-icon">${category.icon}</div>
              <h3 class="category-name">${category.name}</h3>
              <p class="category-description">${category.description}</p>
              <div class="category-stats">
                <span>${category.questions} questions</span>
                <span>Updated daily</span>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  renderTimeBasedPractice() {
    const timeModes = [
      {
        name: 'Daily Current Affairs',
        icon: '📅',
        duration: '15 min',
        description: 'Quick daily update with recent events'
      },
      {
        name: 'Weekly Review',
        icon: '📊',
        duration: '30 min',
        description: 'Comprehensive weekly current affairs'
      },
      {
        name: 'Monthly Assessment',
        icon: '📈',
        duration: '60 min',
        description: 'Complete monthly knowledge test'
      },
      {
        name: 'Rapid Fire Round',
        icon: '⚡',
        duration: '10 min',
        description: 'Quick-fire general knowledge questions'
      }
    ];

    return `
      <div class="time-based-practice">
        <h2 class="practice-modes-title">⏰ Time-Based Practice</h2>
        
        <div class="time-modes-grid">
          ${timeModes.map(mode => `
            <div class="time-mode-card" onclick="generalAwarenessTab.startTimeMode('${mode.name}')">
              <div class="time-mode-icon">${mode.icon}</div>
              <h3 class="time-mode-name">${mode.name}</h3>
              <div class="time-mode-duration">${mode.duration}</div>
              <p class="time-mode-description">${mode.description}</p>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  renderCurrentAffairsIntegration() {
    return `
      <div class="current-affairs-integration">
        <div class="integration-header">
          <h2 class="integration-title">📰 Current Affairs Hub</h2>
          <span class="last-updated">Last updated: ${new Date().toLocaleDateString()}</span>
        </div>
        
        <div class="affairs-grid">
          ${this.currentAffairs.map(affair => `
            <div class="affair-card">
              <div class="affair-date">${new Date(affair.date).toLocaleDateString()}</div>
              <h3 class="affair-title">${affair.title}</h3>
              <p class="affair-summary">${affair.summary}</p>
              <div class="affair-tags">
                ${affair.tags.map(tag => `<span class="affair-tag">${tag}</span>`).join('')}
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  renderModeSelector() {
    return `
      <div class="study-mode-selector">
        <h2 class="mode-title">Choose Your Study Mode</h2>
        
        <div class="mode-options">
          <div class="mode-card" data-mode="practice">
            <div class="mode-icon">📚</div>
            <h3 class="mode-name">Knowledge Building</h3>
            <p class="mode-description">
              Systematic study of general awareness topics with 
              detailed explanations and current affairs integration.
            </p>
            <button class="btn btn-primary">Start Learning</button>
          </div>
          
          <div class="mode-card" data-mode="current-affairs">
            <div class="mode-icon">📰</div>
            <h3 class="mode-name">Current Affairs Focus</h3>
            <p class="mode-description">
              Concentrate on recent events and contemporary issues 
              with regular updates and analysis.
            </p>
            <button class="btn btn-secondary">Study Current Affairs</button>
          </div>
          
          <div class="mode-card" data-mode="mixed">
            <div class="mode-icon">🎯</div>
            <h3 class="mode-name">Mixed Practice</h3>
            <p class="mode-description">
              Balanced combination of general knowledge and 
              current affairs for comprehensive preparation.
            </p>
            <button class="btn btn-outline">Start Mixed Mode</button>
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
          <h3 class="progress-title">Knowledge Progress</h3>
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
              <span class="stat-label">Knowledge Score</span>
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
        <h2 class="performance-title">📊 Knowledge Areas Assessment</h2>
        
        <div class="topic-grid">
          ${Object.entries(topics).map(([topic, stats]) => `
            <div class="topic-card" onclick="generalAwarenessTab.filterByTopic('${topic}')">
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
      if (e.target.closest('.mode-card')) {
        const modeCard = e.target.closest('.mode-card');
        const mode = modeCard.dataset.mode;
        this.selectStudyMode(mode);
      }
      
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
      
      if (e.target.closest('.option-item')) {
        this.selectOption(e.target.closest('.option-item'));
      }
    });

    document.addEventListener('keydown', (e) => {
      this.handleKeyboardNavigation(e);
    });
  }

  selectStudyMode(mode) {
    this.studyMode = mode;
    
    document.querySelectorAll('.mode-card').forEach(card => {
      card.classList.remove('active');
    });
    
    document.querySelector(`[data-mode="${mode}"]`).classList.add('active');
    
    const practiceInterface = document.getElementById('practice-interface');
    practiceInterface.classList.add('active');
    
    // Scroll to practice interface
    practiceInterface.scrollIntoView({ 
      behavior: 'smooth', 
      block: 'start' 
    });
    
    this.prepareQuestions();
    this.renderCurrentQuestion();
  }

  prepareQuestions() {
    switch (this.studyMode) {
      case 'practice':
        this.activeQuestions = [...this.questions];
        this.shuffleArray(this.activeQuestions);
        break;
        
      case 'current-affairs':
        this.activeQuestions = this.questions.filter(q => q.isCurrentAffair);
        if (this.activeQuestions.length === 0) {
          this.activeQuestions = this.questions.filter(q => 
            q.category === 'current-affairs' || 
            q.topic.toLowerCase().includes('current')
          );
        }
        break;
        
      case 'mixed':
        // 60% general knowledge, 40% current affairs
        const generalQuestions = this.questions.filter(q => !q.isCurrentAffair);
        const currentQuestions = this.questions.filter(q => q.isCurrentAffair);
        
        this.activeQuestions = [
          ...this.shuffleArray([...generalQuestions]).slice(0, 30),
          ...this.shuffleArray([...currentQuestions]).slice(0, 20)
        ];
        this.shuffleArray(this.activeQuestions);
        break;
        
      default:
        this.activeQuestions = [...this.questions];
    }
    
    this.currentQuestionIndex = 0;
  }

  startStudySession() {
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

    const isCurrentAffair = question.isCurrentAffair;

    container.innerHTML = `
      ${isCurrentAffair ? `
        <div class="reinforcement-indicator show">
          📰 Current Affairs: This question is based on recent events
        </div>
      ` : ''}
      
      <div class="question-header">
        <span class="question-number">Question ${this.currentQuestionIndex + 1} of ${this.activeQuestions.length}</span>
        <div class="question-meta">
          <span class="difficulty-badge difficulty-${question.difficulty}">${question.difficulty}</span>
          ${isCurrentAffair ? '<span class="current-affair-badge">Current Affairs</span>' : ''}
        </div>
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
          <h4 class="feedback-title">${isCurrentAffair ? 'Current Affairs Insight' : 'Knowledge Explanation'}</h4>
        </div>
        <div class="feedback-explanation">${question.explanation}</div>
        <div class="feedback-topic">${question.topic}</div>
        ${question.date ? `<div class="feedback-date">Related to events from: ${new Date(question.date).toLocaleDateString()}</div>` : ''}
      </div>
    `;

    this.updateNavigationButtons();
    this.updateStats();
    this.showAnswers = false;
  }

  // Include similar methods as other tabs with current affairs specific adaptations
  selectOption(optionElement) {
    document.querySelectorAll('.option-item').forEach(opt => {
      opt.classList.remove('selected', 'correct', 'incorrect');
    });

    optionElement.classList.add('selected');
    
    const selectedIndex = parseInt(optionElement.dataset.index);
    const question = this.activeQuestions[this.currentQuestionIndex];
    const isCorrect = selectedIndex === question.correctAnswer;

    this.userProgress.questionsStudied++;
    if (isCorrect) {
      this.userProgress.correctAnswers++;
      optionElement.classList.add('correct');
    } else {
      optionElement.classList.add('incorrect');
      
      const correctOption = document.querySelector(`[data-index="${question.correctAnswer}"]`);
      if (correctOption) {
        correctOption.classList.add('correct');
      }
      
      this.addWrongAnswer(question, selectedIndex);
    }

    this.showAnswer();
    this.updateTopicProgress(question.topic, isCorrect);
    this.saveProgress();
  }

  filterByCategory(category) {
    const categoryMap = {
      'Indian History': 'history',
      'Geography': 'geography',
      'Indian Polity': 'polity',
      'Economics': 'economics',
      'Science & Technology': 'science',
      'Current Affairs': 'current-affairs'
    };

    const categoryKey = categoryMap[category];
    if (categoryKey) {
      if (categoryKey === 'current-affairs') {
        this.activeQuestions = this.questions.filter(q => q.isCurrentAffair);
      } else {
        this.activeQuestions = this.questions.filter(q => q.category === categoryKey);
      }
    } else {
      this.activeQuestions = [...this.questions];
    }

    this.currentQuestionIndex = 0;
    this.studyMode = 'category';
    
    const practiceInterface = document.getElementById('practice-interface');
    practiceInterface.classList.add('active');
    
    // Scroll to practice interface
    practiceInterface.scrollIntoView({ 
      behavior: 'smooth', 
      block: 'start' 
    });
    
    this.renderCurrentQuestion();
  }

  startTimeMode(mode) {
    const timeModes = {
      'Daily Current Affairs': { duration: 15, filter: q => q.isCurrentAffair },
      'Weekly Review': { duration: 30, filter: q => q.isCurrentAffair || q.category === 'current-affairs' },
      'Monthly Assessment': { duration: 60, filter: q => true },
      'Rapid Fire Round': { duration: 10, filter: q => q.difficulty === 'easy' }
    };

    const modeConfig = timeModes[mode];
    if (modeConfig) {
      this.activeQuestions = this.questions.filter(modeConfig.filter);
      this.shuffleArray(this.activeQuestions);
      
      // Limit questions based on time
      const questionLimit = Math.min(this.activeQuestions.length, modeConfig.duration * 2);
      this.activeQuestions = this.activeQuestions.slice(0, questionLimit);
      
      this.currentQuestionIndex = 0;
      this.studyMode = 'timed';
      
      const practiceInterface = document.getElementById('practice-interface');
      practiceInterface.classList.add('active');
      
      // Scroll to practice interface
      practiceInterface.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'start' 
      });
      
      this.renderCurrentQuestion();
      
      // Start timer
      this.startTimer(modeConfig.duration * 60); // Convert to seconds
    }
  }

  startTimer(seconds) {
    let timeRemaining = seconds;
    
    const timerDisplay = document.createElement('div');
    timerDisplay.className = 'timer-display';
    timerDisplay.textContent = this.formatTime(timeRemaining);
    
    const controls = document.querySelector('.practice-controls');
    if (controls) {
      controls.appendChild(timerDisplay);
    }
    
    const timer = setInterval(() => {
      timeRemaining--;
      timerDisplay.textContent = this.formatTime(timeRemaining);
      
      if (timeRemaining <= 60) {
        timerDisplay.classList.add('warning');
      }
      
      if (timeRemaining <= 0) {
        clearInterval(timer);
        this.showTimeUpMessage();
      }
    }, 1000);
  }

  formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  }

  showTimeUpMessage() {
    const modal = document.createElement('div');
    modal.className = 'modal-overlay active';
    modal.innerHTML = `
      <div class="modal">
        <div class="modal-header">
          <h2 class="modal-title">⏰ Time's Up!</h2>
        </div>
        <div class="modal-body">
          <p>Your timed practice session has ended. Great job on your current affairs knowledge!</p>
          <div class="time-up-stats">
            <div class="stat">Questions Attempted: ${this.userProgress.questionsStudied}</div>
            <div class="stat">Accuracy: ${this.userProgress.questionsStudied > 0 ? Math.round((this.userProgress.correctAnswers / this.userProgress.questionsStudied) * 100) : 0}%</div>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-primary" onclick="this.closest('.modal-overlay').remove(); generalAwarenessTab.resetSession()">
            Continue Learning
          </button>
        </div>
      </div>
    `;
    
    document.body.appendChild(modal);
  }

  practiceCurrentAffair(title) {
    // Filter questions related to the current affair topic
    this.activeQuestions = this.questions.filter(q => 
      q.isCurrentAffair || 
      q.question.toLowerCase().includes(title.toLowerCase().split(' ')[0]) ||
      q.topic.toLowerCase().includes('current')
    );
    
    if (this.activeQuestions.length === 0) {
      this.activeQuestions = this.questions.filter(q => q.isCurrentAffair);
    }
    
    this.currentQuestionIndex = 0;
    this.studyMode = 'current-affair';
    
    const practiceInterface = document.getElementById('practice-interface');
    practiceInterface.classList.add('active');
    
    // Scroll to practice interface
    practiceInterface.scrollIntoView({ 
      behavior: 'smooth', 
      block: 'start' 
    });
    
    this.renderCurrentQuestion();
  }

  // Include other standard methods similar to other tabs
  showAnswer() {
    const feedback = document.getElementById('answer-feedback');
    if (feedback) {
      feedback.classList.add('show');
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
      this.showCompletionMessage();
    }
  }

  shuffleQuestions() {
    this.shuffleArray(this.activeQuestions);
    this.currentQuestionIndex = 0;
    this.renderCurrentQuestion();
  }

  resetProgress() {
    if (confirm('Are you sure you want to reset your knowledge progress?')) {
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
        subject: 'General Awareness and Current Affairs',
        topic: question.topic,
        explanation: question.explanation
      };
      
      window.LocalAccount.addWrongAnswers([wrongAnswer]);
    }
  }

  saveProgress() {
    if (window.LocalAccount) {
      const progressData = {
        questionsAnswered: this.userProgress.questionsStudied,
        correctAnswers: this.userProgress.correctAnswers,
        accuracy: this.userProgress.questionsStudied > 0 ? 
          Math.round((this.userProgress.correctAnswers / this.userProgress.questionsStudied) * 100) : 0,
        topicProgress: this.userProgress.topicProgress,
        lastStudied: new Date().toISOString()
      };
    }
  }

  getTopicStats() {
    const topics = {};
    
    this.questions.forEach(q => {
      const topic = q.topic || 'General Knowledge';
      if (!topics[topic]) {
        topics[topic] = { total: 0, answered: 0, correct: 0, accuracy: 0 };
      }
      topics[topic].total++;
    });
    
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
          <h2 class="modal-title">🎉 Knowledge Session Complete!</h2>
        </div>
        <div class="modal-body">
          <div class="completion-stats">
            <div class="completion-stat">
              <div class="stat-number">${this.userProgress.questionsStudied}</div>
              <div class="stat-label">Questions Studied</div>
            </div>
            <div class="completion-stat">
              <div class="stat-number">${accuracy}%</div>
              <div class="stat-label">Knowledge Score</div>
            </div>
            <div class="completion-stat">
              <div class="stat-number">${this.userProgress.correctAnswers}</div>
              <div class="stat-label">Correct Answers</div>
            </div>
          </div>
          
          <p>Excellent work on expanding your general awareness and current affairs knowledge!</p>
        </div>
        <div class="modal-footer">
          <button class="btn btn-outline" onclick="this.closest('.modal-overlay').remove(); generalAwarenessTab.resetSession()">
            Continue Learning
          </button>
          <button class="btn btn-primary" onclick="window.location.href='../dashboard.html'">
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
    
    const container = document.querySelector('.general-awareness-container');
    if (container) {
      container.insertBefore(errorDiv, container.firstChild);
      setTimeout(() => errorDiv.remove(), 5000);
    }
  }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  window.generalAwarenessTab = new GeneralAwarenessTab();
});