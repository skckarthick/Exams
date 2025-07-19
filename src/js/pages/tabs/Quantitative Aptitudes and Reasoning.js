// Quantitative Aptitudes and Reasoning tab functionality
class QuantitativeReasoningTab {
  constructor() {
    this.questions = [];
    this.currentQuestionIndex = 0;
    this.studyMode = 'practice';
    this.showAnswers = false;
    this.showStepByStep = false;
    this.userProgress = {
      questionsStudied: 0,
      correctAnswers: 0,
      topicProgress: {}
    };
    this.mathTools = {
      calculator: false,
      formulas: false,
      stepByStep: true
    };
    
    this.init();
  }

  async init() {
    await this.loadQuestions();
    this.loadUserProgress();
    this.renderInterface();
    this.attachEventListeners();
    this.startStudySession();
  }

  async loadQuestions() {
    try {
      const response = await fetch('/questions/Quantitative Aptitudes and Reasoning.json');
      if (!response.ok) {
        throw new Error('Failed to load questions');
      }
      
      this.questions = await response.json();
      
      this.questions = this.questions.map((q, index) => ({
        id: q.id || `qr_${index}`,
        question: q.question,
        options: q.options,
        correctAnswer: q.correctAnswer,
        explanation: q.explanation || 'No explanation available.',
        topic: q.topic || 'Mathematics',
        difficulty: q.difficulty || 'medium',
        type: q.type || 'multiple-choice', // multiple-choice, numerical, reasoning
        formula: q.formula || null,
        steps: q.steps || [],
        timeLimit: q.timeLimit || 120, // seconds per question
        ...q
      }));
      
    } catch (error) {
      console.error('Error loading questions:', error);
      this.showError('Failed to load questions. Please refresh the page.');
    }
  }

  loadUserProgress() {
    if (window.LocalAccount) {
      const progress = window.LocalAccount.getSubjectProgress('Quantitative Aptitudes and Reasoning');
      if (progress) {
        this.userProgress = { ...this.userProgress, ...progress };
      }
      
      this.wrongAnswers = window.LocalAccount.getWrongAnswers('Quantitative Aptitudes and Reasoning');
    }
  }

  renderInterface() {
    const container = document.querySelector('.quantitative-reasoning-container');
    if (!container) return;

    container.innerHTML = `
      <div class="tab-header">
        <h1 class="tab-title">🔢 Quantitative Aptitudes & Reasoning</h1>
        <p class="tab-description">
          Master mathematical concepts and logical reasoning with step-by-step solutions, 
          formula references, and comprehensive practice questions.
        </p>
      </div>

      ${this.renderMathTools()}
      ${this.renderSubjectCategories()}
      ${this.renderFormulaPanel()}
      ${this.renderModeSelector()}
      ${this.renderProgressSection()}
      ${this.renderMathPracticeInterface()}
      ${this.renderTopicPerformance()}
    `;
  }

  renderMathTools() {
    const tools = [
      { name: 'Calculator', icon: '🧮', description: 'Basic calculator' },
      { name: 'Formula Sheet', icon: '📐', description: 'Mathematical formulas' },
      { name: 'Step Solver', icon: '📝', description: 'Step-by-step solutions' },
      { name: 'Graph Plotter', icon: '📊', description: 'Plot graphs and charts' },
      { name: 'Unit Converter', icon: '⚖️', description: 'Convert units' },
      { name: 'Statistics', icon: '📈', description: 'Statistical calculations and analysis' },
      { name: 'Percentage Calculator', icon: '📊', description: 'Calculate percentages and ratios' },
      { name: 'Equation Solver', icon: '🔧', description: 'Solve linear and quadratic equations' }
    ];

    return `
      <div class="math-tools-section">
        <h2 class="tools-title">🛠️ Mathematical Tools</h2>
        
        <div class="tools-grid">
          ${tools.map(tool => `
            <div class="tool-btn" onclick="quantitativeReasoningTab.openTool('${tool.name}')">
              <div class="tool-icon">${tool.icon}</div>
              <div class="tool-name">${tool.name}</div>
              <div class="tool-description">${tool.description}</div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  renderSubjectCategories() {
    const subjects = [
      {
        name: 'Arithmetic',
        icon: '➕',
        description: 'Basic mathematical operations and calculations',
        topics: ['Percentages', 'Profit & Loss', 'Simple & Compound Interest', 'Ratio & Proportion']
      },
      {
        name: 'Algebra',
        icon: '📐',
        description: 'Equations, inequalities, and algebraic expressions',
        topics: ['Linear Equations', 'Quadratic Equations', 'Polynomials', 'Functions']
      },
      {
        name: 'Geometry',
        icon: '📏',
        description: 'Shapes, areas, volumes, and spatial reasoning',
        topics: ['Triangles', 'Circles', 'Polygons', 'Coordinate Geometry']
      },
      {
        name: 'Statistics',
        icon: '📊',
        description: 'Data analysis, probability, and statistical measures',
        topics: ['Mean, Median, Mode', 'Probability', 'Data Interpretation', 'Graphs & Charts']
      },
      {
        name: 'Logical Reasoning',
        icon: '🧠',
        description: 'Pattern recognition and logical problem solving',
        topics: ['Series', 'Analogies', 'Classifications', 'Coding-Decoding']
      },
      {
        name: 'Data Interpretation',
        icon: '📈',
        description: 'Analysis of charts, graphs, and tabular data',
        topics: ['Bar Charts', 'Line Graphs', 'Pie Charts', 'Tables']
      }
    ];

    return `
      <div class="subject-categories">
        <h2 class="categories-title">📚 Mathematical Subjects</h2>
        
        <div class="subjects-grid">
          ${subjects.map(subject => `
            <div class="subject-card" onclick="quantitativeReasoningTab.filterBySubject('${subject.name}')">
              <div class="subject-icon">${subject.icon}</div>
              <h3 class="subject-name">${subject.name}</h3>
              <p class="subject-description">${subject.description}</p>
              <div class="subject-stats">
                <span>${this.questions.filter(q => q.topic === subject.name).length} questions</span>
                <span>Multiple levels</span>
              </div>
              <div class="difficulty-levels">
                ${[1,2,3,4,5].map(level => `
                  <div class="difficulty-dot ${level <= 3 ? 'filled' : ''}"></div>
                `).join('')}
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  renderFormulaPanel() {
    const formulas = [
      { name: 'Simple Interest', expression: 'SI = (P × R × T) / 100' },
      { name: 'Compound Interest', expression: 'CI = P(1 + R/100)^T - P' },
      { name: 'Profit Percentage', expression: 'Profit% = (Profit/CP) × 100' },
      { name: 'Speed Formula', expression: 'Speed = Distance / Time' },
      { name: 'Distance Formula', expression: 'Distance = Speed × Time' },
      { name: 'Time Formula', expression: 'Time = Distance / Speed' },
      { name: 'Average Speed', expression: 'Avg Speed = Total Distance / Total Time' },
      { name: 'Area of Circle', expression: 'A = πr²' },
      { name: 'Circumference of Circle', expression: 'C = 2πr' },
      { name: 'Area of Rectangle', expression: 'A = length × width' },
      { name: 'Area of Triangle', expression: 'A = (1/2) × base × height' },
      { name: 'Perimeter of Rectangle', expression: 'P = 2(l + w)' },
      { name: 'Perimeter of Square', expression: 'P = 4 × side' },
      { name: 'Volume of Cube', expression: 'V = side³' },
      { name: 'Volume of Cylinder', expression: 'V = πr²h' },
      { name: 'Pythagorean Theorem', expression: 'c² = a² + b²' },
      { name: 'Quadratic Formula', expression: 'x = (-b ± √(b²-4ac)) / 2a' },
      { name: 'Probability', expression: 'P(E) = Favorable outcomes / Total outcomes' },
      { name: 'Average', expression: 'Average = Sum of values / Number of values' },
      { name: 'Percentage', expression: 'Percentage = (Part/Whole) × 100' },
      { name: 'Discount', expression: 'Discount = Marked Price - Selling Price' },
      { name: 'Loss Percentage', expression: 'Loss% = (Loss/CP) × 100' },
      { name: 'Work Rate', expression: 'Work = Rate × Time' },
      { name: 'Ratio', expression: 'a:b = a/b' },
      { name: 'Proportion', expression: 'a:b = c:d ⟹ ad = bc' },
      { name: 'Arithmetic Mean', expression: 'AM = (a₁ + a₂ + ... + aₙ) / n' },
      { name: 'Geometric Mean', expression: 'GM = ⁿ√(a₁ × a₂ × ... × aₙ)' },
      { name: 'Harmonic Mean', expression: 'HM = n / (1/a₁ + 1/a₂ + ... + 1/aₙ)' },
      { name: 'Standard Deviation', expression: 'σ = √(Σ(x-μ)²/n)' },
      { name: 'Variance', expression: 'σ² = Σ(x-μ)²/n' }
    ];

    return `
      <div class="formula-panel">
        <div class="formula-header">
          <h2 class="formula-title">📐 Formula Reference</h2>
          <button class="toggle-formulas" id="toggle-formulas">Show Formulas</button>
        </div>
        
        <div class="formulas-grid" id="formulas-grid">
          ${formulas.map(formula => `
            <div class="formula-card">
              <div class="formula-name">${formula.name}</div>
              <div class="formula-expression">${formula.expression}</div>
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
            <h3 class="mode-name">Mathematical Practice</h3>
            <p class="mode-description">
              Systematic practice with step-by-step solutions and 
              formula references for comprehensive understanding.
            </p>
            <button class="btn btn-primary">Start Practice</button>
          </div>
          
          <div class="mode-card" data-mode="timed">
            <div class="mode-icon">⏱️</div>
            <h3 class="mode-name">Timed Problem Solving</h3>
            <p class="mode-description">
              Practice with time constraints to improve speed and 
              accuracy for competitive exam conditions.
            </p>
            <button class="btn btn-secondary">Start Timed Practice</button>
          </div>
          
          <div class="mode-card" data-mode="reasoning">
            <div class="mode-icon">🧠</div>
            <h3 class="mode-name">Logical Reasoning</h3>
            <p class="mode-description">
              Focus on pattern recognition, logical sequences, 
              and analytical reasoning problems.
            </p>
            <button class="btn btn-outline">Start Reasoning</button>
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
          <h3 class="progress-title">Mathematical Progress</h3>
          <span class="progress-percentage">${accuracy}%</span>
        </div>
        <div class="progress-bar-container">
          <div class="progress-bar" style="width: ${accuracy}%"></div>
        </div>
      </div>
    `;
  }

  renderMathPracticeInterface() {
    return `
      <div class="math-practice-interface" id="math-practice-interface">
        <div class="math-controls">
          <div class="practice-stats">
            <div class="stat-item">
              <span class="stat-label">Question</span>
              <span class="stat-value" id="current-question-num">1</span>
            </div>
            <div class="stat-item">
              <span class="stat-label">Solved</span>
              <span class="stat-value" id="questions-studied">${this.userProgress.questionsStudied}</span>
            </div>
            <div class="stat-item">
              <span class="stat-label">Math Score</span>
              <span class="stat-value" id="current-accuracy">${this.userProgress.questionsStudied > 0 ? Math.round((this.userProgress.correctAnswers / this.userProgress.questionsStudied) * 100) : 0}%</span>
            </div>
          </div>
          
          <div class="problem-timer">
            <div class="timer-display" id="timer-display">2:00</div>
            <button class="step-by-step-toggle" id="step-toggle">Show Steps</button>
          </div>
        </div>

        <div class="math-problem-container" id="math-problem-container">
          <!-- Math problem content will be rendered here -->
        </div>

        <div class="question-navigation">
          <button class="nav-btn prev-btn" id="prev-btn">← Previous</button>
          <button class="nav-btn show-answer-btn" id="show-answer-btn">Show Solution</button>
          <button class="nav-btn next-btn" id="next-btn">Next →</button>
        </div>
      </div>
    `;
  }

  renderTopicPerformance() {
    const topics = this.getTopicStats();
    
    return `
      <div class="topic-performance">
        <h2 class="performance-title">📊 Mathematical Skills Assessment</h2>
        
        <div class="topic-grid">
          ${Object.entries(topics).map(([topic, stats]) => `
            <div class="topic-card" onclick="quantitativeReasoningTab.filterByTopic('${topic}')">
              <h3 class="topic-name">${topic}</h3>
              <div class="topic-score ${this.getScoreClass(stats.accuracy)}">${stats.accuracy}%</div>
              <div class="topic-questions">${stats.answered}/${stats.total} problems</div>
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
      
      if (e.target.id === 'toggle-formulas') {
        this.toggleFormulas();
      }
      
      if (e.target.id === 'step-toggle') {
        this.toggleStepByStep();
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
      
      if (e.target.id === 'check-answer-btn') {
        this.checkMathAnswer();
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
    
    const practiceInterface = document.getElementById('math-practice-interface');
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
        
      case 'timed':
        this.activeQuestions = [...this.questions];
        this.shuffleArray(this.activeQuestions);
        // Enable timer for each question
        this.timedMode = true;
        break;
        
      case 'reasoning':
        this.activeQuestions = this.questions.filter(q => 
          q.type === 'reasoning' || 
          q.topic.toLowerCase().includes('reasoning') ||
          q.topic.toLowerCase().includes('logical')
        );
        if (this.activeQuestions.length === 0) {
          this.activeQuestions = this.questions.filter(q => q.difficulty === 'hard');
        }
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
    const container = document.getElementById('math-problem-container');
    
    if (!container || !question) return;

    const isMathProblem = question.type === 'numerical' || question.formula;

    container.innerHTML = `
      <div class="problem-header">
        <span class="problem-type">${question.type || 'Multiple Choice'}</span>
        <div class="problem-difficulty">
          <span>Difficulty: </span>
          ${[1,2,3,4,5].map(level => `
            <span class="difficulty-dot ${level <= this.getDifficultyLevel(question.difficulty) ? 'filled' : ''}"></span>
          `).join('')}
        </div>
      </div>

      <div class="math-expression">${question.question}</div>

      ${question.type === 'numerical' ? this.renderNumericalInput() : this.renderMultipleChoice(question)}

      <div class="step-by-step-solution" id="step-solution">
        <h4 class="solution-title">Step-by-Step Solution</h4>
        ${question.steps && question.steps.length > 0 ? 
          question.steps.map((step, index) => `
            <div class="solution-step">
              <span class="step-number">${index + 1}</span>
              <div class="step-explanation">${step}</div>
            </div>
          `).join('') : 
          `<div class="solution-step">
            <span class="step-number">1</span>
            <div class="step-explanation">${question.explanation}</div>
          </div>`
        }
      </div>

      <div class="answer-feedback" id="answer-feedback">
        <div class="feedback-header">
          <div class="feedback-icon">✓</div>
          <h4 class="feedback-title">Mathematical Solution</h4>
        </div>
        <div class="feedback-explanation">${question.explanation}</div>
        ${question.formula ? `<div class="feedback-formula">Formula used: ${question.formula}</div>` : ''}
        <div class="feedback-topic">${question.topic}</div>
      </div>
    `;

    this.updateNavigationButtons();
    this.updateStats();
    this.showAnswers = false;
    this.showStepByStep = false;

    // Start timer if in timed mode
    if (this.timedMode) {
      this.startQuestionTimer(question.timeLimit || 120);
    }
  }

  renderMultipleChoice(question) {
    return `
      <div class="options-list">
        ${question.options.map((option, index) => `
          <div class="option-item" data-index="${index}">
            <div class="option-letter">${String.fromCharCode(65 + index)}</div>
            <div class="option-text">${option}</div>
          </div>
        `).join('')}
      </div>
    `;
  }

  renderNumericalInput() {
    return `
      <div class="math-answer-section">
        <div class="answer-input-group">
          <label class="answer-label">Your Answer:</label>
          <input type="number" class="math-answer-input" id="math-answer" placeholder="Enter your answer" step="any">
          <button class="check-answer-btn" id="check-answer-btn">Check Answer</button>
        </div>
      </div>
    `;
  }

  toggleFormulas() {
    const formulasGrid = document.getElementById('formulas-grid');
    const toggleBtn = document.getElementById('toggle-formulas');
    
    if (formulasGrid.classList.contains('expanded')) {
      formulasGrid.classList.remove('expanded');
      toggleBtn.textContent = 'Show Formulas';
    } else {
      formulasGrid.classList.add('expanded');
      toggleBtn.textContent = 'Hide Formulas';
    }
  }

  toggleStepByStep() {
    const stepSolution = document.getElementById('step-solution');
    const toggleBtn = document.getElementById('step-toggle');
    
    if (this.showStepByStep) {
      stepSolution.classList.remove('show');
      toggleBtn.textContent = 'Show Steps';
      this.showStepByStep = false;
    } else {
      stepSolution.classList.add('show');
      toggleBtn.textContent = 'Hide Steps';
      this.showStepByStep = true;
    }
  }

  startQuestionTimer(seconds) {
    let timeRemaining = seconds;
    const timerDisplay = document.getElementById('timer-display');
    
    const timer = setInterval(() => {
      timeRemaining--;
      timerDisplay.textContent = this.formatTime(timeRemaining);
      
      if (timeRemaining <= 30) {
        timerDisplay.classList.add('warning');
      }
      
      if (timeRemaining <= 10) {
        timerDisplay.classList.add('danger');
      }
      
      if (timeRemaining <= 0) {
        clearInterval(timer);
        this.handleTimeUp();
      }
    }, 1000);
    
    // Store timer reference to clear it when moving to next question
    this.currentTimer = timer;
  }

  handleTimeUp() {
    // Auto-move to next question or show time up message
    this.showTimeUpForQuestion();
  }

  showTimeUpForQuestion() {
    const modal = document.createElement('div');
    modal.className = 'modal-overlay active';
    modal.innerHTML = `
      <div class="modal">
        <div class="modal-header">
          <h2 class="modal-title">⏰ Time's Up!</h2>
        </div>
        <div class="modal-body">
          <p>Time limit reached for this question. The correct solution is shown below.</p>
        </div>
        <div class="modal-footer">
          <button class="btn btn-primary" onclick="this.closest('.modal-overlay').remove(); quantitativeReasoningTab.showAnswer(); quantitativeReasoningTab.toggleStepByStep()">
            View Solution
          </button>
        </div>
      </div>
    `;
    
    document.body.appendChild(modal);
  }

  checkMathAnswer() {
    const answerInput = document.getElementById('math-answer');
    const userAnswer = parseFloat(answerInput.value);
    const question = this.activeQuestions[this.currentQuestionIndex];
    
    if (isNaN(userAnswer)) {
      alert('Please enter a valid number');
      return;
    }
    
    // For numerical questions, the correct answer should be stored as a number
    const correctAnswer = parseFloat(question.correctAnswer);
    const tolerance = 0.01; // Allow small floating point differences
    
    const isCorrect = Math.abs(userAnswer - correctAnswer) <= tolerance;
    
    this.userProgress.questionsStudied++;
    if (isCorrect) {
      this.userProgress.correctAnswers++;
      answerInput.style.borderColor = 'var(--success-color)';
      answerInput.style.backgroundColor = 'rgba(16, 185, 129, 0.1)';
    } else {
      answerInput.style.borderColor = 'var(--error-color)';
      answerInput.style.backgroundColor = 'rgba(239, 68, 68, 0.1)';
      this.addWrongAnswer(question, userAnswer.toString());
    }
    
    this.showAnswer();
    this.updateTopicProgress(question.topic, isCorrect);
    this.saveProgress();
  }

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

  showAnswer() {
    const feedback = document.getElementById('answer-feedback');
    if (feedback) {
      feedback.classList.add('show');
      this.showAnswers = true;
      
      const showAnswerBtn = document.getElementById('show-answer-btn');
      if (showAnswerBtn) {
        showAnswerBtn.textContent = 'Hide Solution';
      }
    }
  }

  toggleAnswer() {
    const feedback = document.getElementById('answer-feedback');
    const showAnswerBtn = document.getElementById('show-answer-btn');
    
    if (!feedback || !showAnswerBtn) return;

    if (this.showAnswers) {
      feedback.classList.remove('show');
      showAnswerBtn.textContent = 'Show Solution';
      this.showAnswers = false;
    } else {
      const question = this.activeQuestions[this.currentQuestionIndex];
      
      if (question.type !== 'numerical') {
        const correctOption = document.querySelector(`[data-index="${question.correctAnswer}"]`);
        if (correctOption) {
          correctOption.classList.add('correct');
        }
      }
      
      feedback.classList.add('show');
      showAnswerBtn.textContent = 'Hide Solution';
      this.showAnswers = true;
    }
  }

  previousQuestion() {
    if (this.currentTimer) {
      clearInterval(this.currentTimer);
    }
    
    if (this.currentQuestionIndex > 0) {
      this.currentQuestionIndex--;
      this.renderCurrentQuestion();
    }
  }

  nextQuestion() {
    if (this.currentTimer) {
      clearInterval(this.currentTimer);
    }
    
    if (this.currentQuestionIndex < this.activeQuestions.length - 1) {
      this.currentQuestionIndex++;
      this.renderCurrentQuestion();
    } else {
      this.showCompletionMessage();
    }
  }

  openTool(toolName) {
    // Simple tool implementations
    switch (toolName) {
      case 'Calculator':
        this.openCalculator();
        break;
      case 'Formula Sheet':
        this.toggleFormulas();
        break;
      case 'Step Solver':
        this.toggleStepByStep();
        break;
      case 'Graph Plotter':
        this.openGraphPlotter();
        break;
      case 'Unit Converter':
        this.openUnitConverter();
        break;
      case 'Statistics':
        this.openStatisticsCalculator();
        break;
      case 'Percentage Calculator':
        this.openPercentageCalculator();
        break;
      case 'Equation Solver':
        this.openEquationSolver();
        break;
      default:
        alert(`${toolName} tool is now available!`);
    }
  }

  // Equation Solver
  openEquationSolver() {
    const modal = document.createElement('div');
    modal.className = 'modal-overlay active';
    modal.innerHTML = `
      <div class="modal">
        <div class="modal-header">
          <h2 class="modal-title">🔧 Equation Solver</h2>
          <button class="modal-close" onclick="this.closest('.modal-overlay').remove()">×</button>
        </div>
        <div class="modal-body">
          <div class="equation-solver">
            <div class="solver-section">
              <h4>Linear Equation (ax + b = 0)</h4>
              <div style="display: flex; gap: 0.5rem; align-items: center; margin: 1rem 0;">
                <input type="number" id="linear-a" placeholder="a" style="width: 80px; padding: 0.5rem;">
                <span>x +</span>
                <input type="number" id="linear-b" placeholder="b" style="width: 80px; padding: 0.5rem;">
                <span>= 0</span>
              </div>
              <div>Solution: x = <span id="linear-result" style="font-weight: bold; color: var(--primary-color);">-</span></div>
            </div>
            
            <div class="solver-section" style="margin-top: 2rem;">
              <h4>Quadratic Equation (ax² + bx + c = 0)</h4>
              <div style="display: flex; gap: 0.5rem; align-items: center; margin: 1rem 0;">
                <input type="number" id="quad-a" placeholder="a" style="width: 80px; padding: 0.5rem;">
                <span>x² +</span>
                <input type="number" id="quad-b" placeholder="b" style="width: 80px; padding: 0.5rem;">
                <span>x +</span>
                <input type="number" id="quad-c" placeholder="c" style="width: 80px; padding: 0.5rem;">
                <span>= 0</span>
              </div>
              <div>Solutions: <span id="quad-result" style="font-weight: bold; color: var(--primary-color);">-</span></div>
              <div>Discriminant: <span id="discriminant" style="font-weight: bold;">-</span></div>
            </div>
            
            <div class="solver-section" style="margin-top: 2rem;">
              <h4>System of Linear Equations</h4>
              <div style="margin: 1rem 0;">
                <div style="display: flex; gap: 0.5rem; align-items: center; margin-bottom: 0.5rem;">
                  <input type="number" id="sys-a1" placeholder="a₁" style="width: 60px; padding: 0.5rem;">
                  <span>x +</span>
                  <input type="number" id="sys-b1" placeholder="b₁" style="width: 60px; padding: 0.5rem;">
                  <span>y =</span>
                  <input type="number" id="sys-c1" placeholder="c₁" style="width: 60px; padding: 0.5rem;">
                </div>
                <div style="display: flex; gap: 0.5rem; align-items: center;">
                  <input type="number" id="sys-a2" placeholder="a₂" style="width: 60px; padding: 0.5rem;">
                  <span>x +</span>
                  <input type="number" id="sys-b2" placeholder="b₂" style="width: 60px; padding: 0.5rem;">
                  <span>y =</span>
                  <input type="number" id="sys-c2" placeholder="c₂" style="width: 60px; padding: 0.5rem;">
                </div>
              </div>
              <div>Solution: <span id="system-result" style="font-weight: bold; color: var(--primary-color);">-</span></div>
            </div>
          </div>
        </div>
      </div>
    `;
    
    document.body.appendChild(modal);
    
    // Add event listeners for real-time solving
    ['linear-a', 'linear-b', 'quad-a', 'quad-b', 'quad-c', 'sys-a1', 'sys-b1', 'sys-c1', 'sys-a2', 'sys-b2', 'sys-c2'].forEach(id => {
      document.getElementById(id).addEventListener('input', () => this.solveEquations());
    });
  }

  solveEquations() {
    // Linear equation
    const a = parseFloat(document.getElementById('linear-a').value) || 0;
    const b = parseFloat(document.getElementById('linear-b').value) || 0;
    
    if (a !== 0) {
      const x = -b / a;
      document.getElementById('linear-result').textContent = x.toFixed(4);
    } else {
      document.getElementById('linear-result').textContent = a === 0 && b === 0 ? 'Infinite solutions' : 'No solution';
    }
    
    // Quadratic equation
    const qa = parseFloat(document.getElementById('quad-a').value) || 0;
    const qb = parseFloat(document.getElementById('quad-b').value) || 0;
    const qc = parseFloat(document.getElementById('quad-c').value) || 0;
    
    if (qa !== 0) {
      const discriminant = qb * qb - 4 * qa * qc;
      document.getElementById('discriminant').textContent = discriminant.toFixed(2);
      
      if (discriminant > 0) {
        const x1 = (-qb + Math.sqrt(discriminant)) / (2 * qa);
        const x2 = (-qb - Math.sqrt(discriminant)) / (2 * qa);
        document.getElementById('quad-result').textContent = `x₁ = ${x1.toFixed(4)}, x₂ = ${x2.toFixed(4)}`;
      } else if (discriminant === 0) {
        const x = -qb / (2 * qa);
        document.getElementById('quad-result').textContent = `x = ${x.toFixed(4)} (repeated root)`;
      } else {
        const real = -qb / (2 * qa);
        const imaginary = Math.sqrt(-discriminant) / (2 * qa);
        document.getElementById('quad-result').textContent = `x = ${real.toFixed(4)} ± ${imaginary.toFixed(4)}i`;
      }
    } else {
      document.getElementById('quad-result').textContent = 'Not a quadratic equation';
      document.getElementById('discriminant').textContent = '-';
    }
    
    // System of equations
    const a1 = parseFloat(document.getElementById('sys-a1').value) || 0;
    const b1 = parseFloat(document.getElementById('sys-b1').value) || 0;
    const c1 = parseFloat(document.getElementById('sys-c1').value) || 0;
    const a2 = parseFloat(document.getElementById('sys-a2').value) || 0;
    const b2 = parseFloat(document.getElementById('sys-b2').value) || 0;
    const c2 = parseFloat(document.getElementById('sys-c2').value) || 0;
    
    const determinant = a1 * b2 - a2 * b1;
    
    if (determinant !== 0) {
      const x = (c1 * b2 - c2 * b1) / determinant;
      const y = (a1 * c2 - a2 * c1) / determinant;
      document.getElementById('system-result').textContent = `x = ${x.toFixed(4)}, y = ${y.toFixed(4)}`;
    } else {
      document.getElementById('system-result').textContent = 'No unique solution';
    }
  }

  openCalculator() {
    const modal = document.createElement('div');
    modal.className = 'modal-overlay active';
    modal.innerHTML = `
      <div class="modal">
        <div class="modal-header">
          <h2 class="modal-title">🧮 Calculator</h2>
          <button class="modal-close" onclick="this.closest('.modal-overlay').remove()">×</button>
        </div>
        <div class="modal-body">
          <div class="calculator">
            <input type="text" class="calc-display" id="calc-display" readonly>
            <div class="calc-buttons">
              <button onclick="quantitativeReasoningTab.calcInput('C')" class="calc-btn clear">C</button>
              <button onclick="quantitativeReasoningTab.calcInput('CE')" class="calc-btn clear">CE</button>
              <button onclick="quantitativeReasoningTab.calcInput('/')" class="calc-btn operator">÷</button>
              <button onclick="quantitativeReasoningTab.calcInput('back')" class="calc-btn">⌫</button>
              
              <button onclick="quantitativeReasoningTab.calcInput('7')" class="calc-btn">7</button>
              <button onclick="quantitativeReasoningTab.calcInput('8')" class="calc-btn">8</button>
              <button onclick="quantitativeReasoningTab.calcInput('9')" class="calc-btn">9</button>
              <button onclick="quantitativeReasoningTab.calcInput('*')" class="calc-btn operator">×</button>
              
              <button onclick="quantitativeReasoningTab.calcInput('4')" class="calc-btn">4</button>
              <button onclick="quantitativeReasoningTab.calcInput('5')" class="calc-btn">5</button>
              <button onclick="quantitativeReasoningTab.calcInput('6')" class="calc-btn">6</button>
              <button onclick="quantitativeReasoningTab.calcInput('-')" class="calc-btn operator">-</button>
              
              <button onclick="quantitativeReasoningTab.calcInput('1')" class="calc-btn">1</button>
              <button onclick="quantitativeReasoningTab.calcInput('2')" class="calc-btn">2</button>
              <button onclick="quantitativeReasoningTab.calcInput('3')" class="calc-btn">3</button>
              <button onclick="quantitativeReasoningTab.calcInput('+')" class="calc-btn operator">+</button>
              
              <button onclick="quantitativeReasoningTab.calcInput('0')" class="calc-btn zero">0</button>
              <button onclick="quantitativeReasoningTab.calcInput('.')" class="calc-btn">.</button>
              <button onclick="quantitativeReasoningTab.calcInput('sqrt')" class="calc-btn operator">√</button>
              <button onclick="quantitativeReasoningTab.calcInput('=')" class="calc-btn equals">=</button>
              
              <button onclick="quantitativeReasoningTab.calcInput('(')" class="calc-btn operator">(</button>
              <button onclick="quantitativeReasoningTab.calcInput(')')" class="calc-btn operator">)</button>
              <button onclick="quantitativeReasoningTab.calcInput('^')" class="calc-btn operator">x²</button>
              <button onclick="quantitativeReasoningTab.calcInput('%')" class="calc-btn operator">%</button>
            </div>
          </div>
        </div>
      </div>
    `;
    
    document.body.appendChild(modal);
    this.calcExpression = '';
    this.calcHistory = [];
  }

  openGraphPlotter() {
    const modal = document.createElement('div');
    modal.className = 'modal-overlay active';
    modal.innerHTML = `
      <div class="modal">
        <div class="modal-header">
          <h2 class="modal-title">📊 Graph Plotter</h2>
          <button class="modal-close" onclick="this.closest('.modal-overlay').remove()">×</button>
        </div>
        <div class="modal-body">
          <div class="graph-plotter">
            <div class="function-input-section">
              <label for="function-input">Enter function (e.g., x^2, 2*x+1, sin(x)):</label>
              <input type="text" id="function-input" placeholder="x^2" style="width: 100%; padding: 0.75rem; margin: 0.5rem 0; border: 2px solid var(--border-light); border-radius: 8px;">
              <div class="graph-controls">
                <label>X Range: </label>
                <input type="number" id="x-min" value="-10" style="width: 80px; padding: 0.5rem; margin: 0 0.25rem;">
                <span>to</span>
                <input type="number" id="x-max" value="10" style="width: 80px; padding: 0.5rem; margin: 0 0.25rem;">
                <button onclick="quantitativeReasoningTab.plotGraph()" class="btn btn-primary" style="margin-left: 1rem;">Plot Graph</button>
              </div>
            </div>
            <canvas id="graph-canvas" width="500" height="400" style="border: 1px solid var(--border-light); margin-top: 1rem; background: white;"></canvas>
            <div class="graph-examples" style="margin-top: 1rem;">
              <h4>Example Functions:</h4>
              <div class="example-buttons" style="display: flex; gap: 0.5rem; flex-wrap: wrap; margin-top: 0.5rem;">
                <button onclick="document.getElementById('function-input').value='x^2'; quantitativeReasoningTab.plotGraph()" class="btn btn-sm btn-outline">x²</button>
                <button onclick="document.getElementById('function-input').value='2*x+1'; quantitativeReasoningTab.plotGraph()" class="btn btn-sm btn-outline">2x+1</button>
                <button onclick="document.getElementById('function-input').value='sin(x)'; quantitativeReasoningTab.plotGraph()" class="btn btn-sm btn-outline">sin(x)</button>
                <button onclick="document.getElementById('function-input').value='cos(x)'; quantitativeReasoningTab.plotGraph()" class="btn btn-sm btn-outline">cos(x)</button>
                <button onclick="document.getElementById('function-input').value='x^3'; quantitativeReasoningTab.plotGraph()" class="btn btn-sm btn-outline">x³</button>
                <button onclick="document.getElementById('function-input').value='1/x'; quantitativeReasoningTab.plotGraph()" class="btn btn-sm btn-outline">1/x</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
    document.body.appendChild(modal);
    
    // Plot default function
    setTimeout(() => {
      this.plotGraph();
    }, 100);
  }

  openUnitConverter() {
    const modal = document.createElement('div');
    modal.className = 'modal-overlay active';
    modal.innerHTML = `
      <div class="modal">
        <div class="modal-header">
          <h2 class="modal-title">⚖️ Unit Converter</h2>
          <button class="modal-close" onclick="this.closest('.modal-overlay').remove()">×</button>
        </div>
        <div class="modal-body">
          <div class="unit-converter">
            <div class="converter-type-selector" style="margin-bottom: 1.5rem;">
              <label>Conversion Type:</label>
              <select id="conversion-type" onchange="quantitativeReasoningTab.updateUnitOptions()" style="width: 100%; padding: 0.5rem; margin-top: 0.5rem;">
                <option value="length">Length</option>
                <option value="weight">Weight</option>
                <option value="temperature">Temperature</option>
                <option value="area">Area</option>
                <option value="volume">Volume</option>
                <option value="time">Time</option>
              </select>
            </div>
            <div style="display: grid; gap: 1rem;">
            <div>
              <label>From:</label>
              <select id="from-unit" style="width: 100%; padding: 0.5rem;"></select>
            </div>
            <div>
              <label>To:</label>
              <select id="to-unit" style="width: 100%; padding: 0.5rem;"></select>
            </div>
            <div>
              <label>Value:</label>
              <input type="number" id="convert-value" placeholder="Enter value" oninput="quantitativeReasoningTab.convertUnits()" style="width: 100%; padding: 0.5rem;">
            </div>
            <div id="conversion-result" style="padding: 1rem; background: var(--surface-secondary); border-radius: 8px; font-weight: bold; font-size: 1.1rem;">
              Enter a value to see conversion
            </div>
            </div>
          </div>
        </div>
      </div>
    `;
    document.body.appendChild(modal);
    
    // Initialize with length units
    this.updateUnitOptions();
  }

  openStatisticsCalculator() {
    const modal = document.createElement('div');
    modal.className = 'modal-overlay active';
    modal.innerHTML = `
      <div class="modal">
        <div class="modal-header">
          <h2 class="modal-title">📈 Statistics Calculator</h2>
          <button class="modal-close" onclick="this.closest('.modal-overlay').remove()">×</button>
        </div>
        <div class="modal-body">
          <div class="statistics-calculator">
            <div>
              <label>Enter numbers (comma separated):</label>
              <textarea id="stats-data" placeholder="1, 2, 3, 4, 5, 6, 7, 8, 9, 10" oninput="quantitativeReasoningTab.calculateStatistics()" style="width: 100%; padding: 0.75rem; height: 100px; border: 2px solid var(--border-light); border-radius: 8px;"></textarea>
            </div>
            <div class="stats-results" style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 1rem; margin-top: 1rem;">
              <div style="padding: 1rem; background: var(--surface-secondary); border-radius: 8px; text-align: center;">
                <div style="font-weight: bold;">Mean</div>
                <div id="mean-result">-</div>
              </div>
              <div style="padding: 1rem; background: var(--surface-secondary); border-radius: 8px; text-align: center;">
                <div style="font-weight: bold;">Median</div>
                <div id="median-result">-</div>
              </div>
              <div style="padding: 1rem; background: var(--surface-secondary); border-radius: 8px; text-align: center;">
                <div style="font-weight: bold;">Mode</div>
                <div id="mode-result">-</div>
              </div>
              <div style="padding: 1rem; background: var(--surface-secondary); border-radius: 8px; text-align: center;">
                <div style="font-weight: bold;">Range</div>
                <div id="range-result">-</div>
              </div>
              <div style="padding: 1rem; background: var(--surface-secondary); border-radius: 8px; text-align: center;">
                <div style="font-weight: bold;">Std Dev</div>
                <div id="stddev-result">-</div>
              </div>
              <div style="padding: 1rem; background: var(--surface-secondary); border-radius: 8px; text-align: center;">
                <div style="font-weight: bold;">Variance</div>
                <div id="variance-result">-</div>
              </div>
            </div>
            <div class="additional-stats" style="margin-top: 1rem; padding: 1rem; background: var(--surface-secondary); border-radius: 8px;">
              <h4>Additional Information:</h4>
              <div id="additional-info">Enter data to see detailed statistics</div>
            </div>
          </div>
        </div>
      </div>
    `;
    document.body.appendChild(modal);
    
    // Calculate with default data
    this.calculateStatistics();
  }

  // Enhanced Calculator Functions
  calcInput(value) {
    const display = document.getElementById('calc-display');
    
    switch (value) {
      case 'C':
        this.calcExpression = '';
        display.value = '';
        break;
      case 'CE':
        // Clear entry - remove last number/operator
        this.calcExpression = this.calcExpression.replace(/[\d.]+$/, '');
        display.value = this.calcExpression;
        break;
      case 'back':
        this.calcExpression = this.calcExpression.slice(0, -1);
        display.value = this.calcExpression;
        break;
      case 'sqrt':
        if (this.calcExpression) {
          try {
            const result = Math.sqrt(eval(this.calcExpression.replace('×', '*').replace('÷', '/')));
            display.value = result;
            this.calcExpression = result.toString();
          } catch (error) {
            display.value = 'Error';
            this.calcExpression = '';
          }
        }
        break;
      case '^':
        this.calcExpression += '**';
        display.value = this.calcExpression;
        break;
      case '%':
        if (this.calcExpression) {
          try {
            const result = eval(this.calcExpression.replace('×', '*').replace('÷', '/')) / 100;
            display.value = result;
            this.calcExpression = result.toString();
          } catch (error) {
            display.value = 'Error';
            this.calcExpression = '';
          }
        }
        break;
      case '=':
        try {
          let expression = this.calcExpression
            .replace(/×/g, '*')
            .replace(/÷/g, '/')
            .replace(/\^/g, '**');
          const result = eval(expression);
          display.value = result;
          this.calcExpression = result.toString();
          this.calcHistory.push(`${this.calcExpression} = ${result}`);
        } catch (error) {
          display.value = 'Error';
          this.calcExpression = '';
        }
        break;
      default:
        this.calcExpression += value;
        display.value = this.calcExpression;
    }
  }

  // Graph Plotting Function
  plotGraph() {
    const canvas = document.getElementById('graph-canvas');
    const ctx = canvas.getContext('2d');
    const functionInput = document.getElementById('function-input').value || 'x^2';
    const xMin = parseFloat(document.getElementById('x-min').value) || -10;
    const xMax = parseFloat(document.getElementById('x-max').value) || 10;
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Set up coordinate system
    const width = canvas.width;
    const height = canvas.height;
    const centerX = width / 2;
    const centerY = height / 2;
    const scaleX = width / (xMax - xMin);
    const scaleY = height / 20; // Adjust based on typical y range
    
    // Draw axes
    ctx.strokeStyle = '#666';
    ctx.lineWidth = 1;
    
    // X-axis
    ctx.beginPath();
    ctx.moveTo(0, centerY);
    ctx.lineTo(width, centerY);
    ctx.stroke();
    
    // Y-axis
    ctx.beginPath();
    ctx.moveTo(centerX, 0);
    ctx.lineTo(centerX, height);
    ctx.stroke();
    
    // Draw grid
    ctx.strokeStyle = '#ddd';
    ctx.lineWidth = 0.5;
    
    for (let i = 0; i <= 10; i++) {
      const x = (i / 10) * width;
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
      
      const y = (i / 10) * height;
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }
    
    // Plot function
    ctx.strokeStyle = '#3b82f6';
    ctx.lineWidth = 2;
    ctx.beginPath();
    
    let firstPoint = true;
    for (let px = 0; px < width; px++) {
      const x = xMin + (px / width) * (xMax - xMin);
      
      try {
        // Replace common math functions
        let expression = functionInput
          .replace(/\^/g, '**')
          .replace(/sin/g, 'Math.sin')
          .replace(/cos/g, 'Math.cos')
          .replace(/tan/g, 'Math.tan')
          .replace(/log/g, 'Math.log')
          .replace(/sqrt/g, 'Math.sqrt')
          .replace(/abs/g, 'Math.abs')
          .replace(/x/g, `(${x})`);
        
        const y = eval(expression);
        
        if (isFinite(y)) {
          const py = centerY - y * scaleY;
          
          if (py >= 0 && py <= height) {
            if (firstPoint) {
              ctx.moveTo(px, py);
              firstPoint = false;
            } else {
              ctx.lineTo(px, py);
            }
          }
        }
      } catch (error) {
        // Skip invalid points
      }
    }
    
    ctx.stroke();
    
    // Add labels
    ctx.fillStyle = '#333';
    ctx.font = '12px Arial';
    ctx.fillText('0', centerX + 5, centerY - 5);
    ctx.fillText(`${xMin}`, 5, centerY - 5);
    ctx.fillText(`${xMax}`, width - 30, centerY - 5);
  }

  // Unit Conversion Functions
  updateUnitOptions() {
    const conversionType = document.getElementById('conversion-type').value;
    const fromUnit = document.getElementById('from-unit');
    const toUnit = document.getElementById('to-unit');
    
    const unitOptions = {
      length: [
        { value: 'mm', text: 'Millimeters' },
        { value: 'cm', text: 'Centimeters' },
        { value: 'm', text: 'Meters' },
        { value: 'km', text: 'Kilometers' },
        { value: 'in', text: 'Inches' },
        { value: 'ft', text: 'Feet' },
        { value: 'yd', text: 'Yards' },
        { value: 'mi', text: 'Miles' }
      ],
      weight: [
        { value: 'mg', text: 'Milligrams' },
        { value: 'g', text: 'Grams' },
        { value: 'kg', text: 'Kilograms' },
        { value: 'oz', text: 'Ounces' },
        { value: 'lb', text: 'Pounds' },
        { value: 't', text: 'Tons' }
      ],
      temperature: [
        { value: 'c', text: 'Celsius' },
        { value: 'f', text: 'Fahrenheit' },
        { value: 'k', text: 'Kelvin' }
      ],
      area: [
        { value: 'mm2', text: 'Square Millimeters' },
        { value: 'cm2', text: 'Square Centimeters' },
        { value: 'm2', text: 'Square Meters' },
        { value: 'km2', text: 'Square Kilometers' },
        { value: 'in2', text: 'Square Inches' },
        { value: 'ft2', text: 'Square Feet' }
      ],
      volume: [
        { value: 'ml', text: 'Milliliters' },
        { value: 'l', text: 'Liters' },
        { value: 'gal', text: 'Gallons' },
        { value: 'qt', text: 'Quarts' },
        { value: 'pt', text: 'Pints' },
        { value: 'cup', text: 'Cups' }
      ],
      time: [
        { value: 'ms', text: 'Milliseconds' },
        { value: 's', text: 'Seconds' },
        { value: 'min', text: 'Minutes' },
        { value: 'hr', text: 'Hours' },
        { value: 'day', text: 'Days' },
        { value: 'week', text: 'Weeks' },
        { value: 'month', text: 'Months' },
        { value: 'year', text: 'Years' }
      ]
    };
    
    const options = unitOptions[conversionType];
    
    fromUnit.innerHTML = '';
    toUnit.innerHTML = '';
    
    options.forEach(option => {
      fromUnit.innerHTML += `<option value="${option.value}">${option.text}</option>`;
      toUnit.innerHTML += `<option value="${option.value}">${option.text}</option>`;
    });
    
    // Set different default selections
    if (options.length > 1) {
      toUnit.selectedIndex = 1;
    }
    
    this.convertUnits();
  }

  convertUnits() {
    const conversionType = document.getElementById('conversion-type').value;
    const fromUnit = document.getElementById('from-unit').value;
    const toUnit = document.getElementById('to-unit').value;
    const value = parseFloat(document.getElementById('convert-value').value);
    const resultDiv = document.getElementById('conversion-result');
    
    if (isNaN(value)) {
      resultDiv.textContent = 'Enter a valid number';
      return;
    }
    
    const conversions = {
      length: {
        mm: 0.001, cm: 0.01, m: 1, km: 1000,
        in: 0.0254, ft: 0.3048, yd: 0.9144, mi: 1609.34
      },
      weight: {
        mg: 0.000001, g: 0.001, kg: 1,
        oz: 0.0283495, lb: 0.453592, t: 1000
      },
      area: {
        mm2: 0.000001, cm2: 0.0001, m2: 1, km2: 1000000,
        in2: 0.00064516, ft2: 0.092903
      },
      volume: {
        ml: 0.001, l: 1, gal: 3.78541, qt: 0.946353,
        pt: 0.473176, cup: 0.236588
      },
      time: {
        ms: 0.001, s: 1, min: 60, hr: 3600,
        day: 86400, week: 604800, month: 2629746, year: 31556952
      }
    };
    
    if (conversionType === 'temperature') {
      let result;
      if (fromUnit === 'c' && toUnit === 'f') {
        result = (value * 9/5) + 32;
      } else if (fromUnit === 'f' && toUnit === 'c') {
        result = (value - 32) * 5/9;
      } else if (fromUnit === 'c' && toUnit === 'k') {
        result = value + 273.15;
      } else if (fromUnit === 'k' && toUnit === 'c') {
        result = value - 273.15;
      } else if (fromUnit === 'f' && toUnit === 'k') {
        result = (value - 32) * 5/9 + 273.15;
      } else if (fromUnit === 'k' && toUnit === 'f') {
        result = (value - 273.15) * 9/5 + 32;
      } else {
        result = value;
      }
      resultDiv.textContent = `${result.toFixed(2)} ${toUnit.toUpperCase()}`;
    } else {
      const conversionTable = conversions[conversionType];
      if (conversionTable) {
        const baseValue = value * conversionTable[fromUnit];
        const result = baseValue / conversionTable[toUnit];
        resultDiv.textContent = `${result.toFixed(6)} ${toUnit}`;
      }
    }
  }

  // Statistics Calculator Functions
  calculateStatistics() {
    const input = document.getElementById('stats-data').value;
    const numbers = input.split(',').map(n => parseFloat(n.trim())).filter(n => !isNaN(n));
    
    if (numbers.length === 0) {
      this.clearStatistics();
      return;
    }
    
    // Sort numbers for median calculation
    const sorted = [...numbers].sort((a, b) => a - b);
    
    // Mean
    const mean = numbers.reduce((sum, n) => sum + n, 0) / numbers.length;
    document.getElementById('mean-result').textContent = mean.toFixed(2);
    
    // Median
    let median;
    if (sorted.length % 2 === 0) {
      median = (sorted[sorted.length / 2 - 1] + sorted[sorted.length / 2]) / 2;
    } else {
      median = sorted[Math.floor(sorted.length / 2)];
    }
    document.getElementById('median-result').textContent = median.toFixed(2);
    
    // Mode
    const frequency = {};
    numbers.forEach(n => frequency[n] = (frequency[n] || 0) + 1);
    const maxFreq = Math.max(...Object.values(frequency));
    const modes = Object.keys(frequency).filter(n => frequency[n] === maxFreq);
    document.getElementById('mode-result').textContent = modes.length === numbers.length ? 'No mode' : modes.join(', ');
    
    // Range
    const range = Math.max(...numbers) - Math.min(...numbers);
    document.getElementById('range-result').textContent = range.toFixed(2);
    
    // Standard Deviation
    const variance = numbers.reduce((sum, n) => sum + Math.pow(n - mean, 2), 0) / numbers.length;
    const stdDev = Math.sqrt(variance);
    document.getElementById('stddev-result').textContent = stdDev.toFixed(2);
    document.getElementById('variance-result').textContent = variance.toFixed(2);
    
    // Additional info
    const additionalInfo = `
      Count: ${numbers.length} | 
      Sum: ${numbers.reduce((sum, n) => sum + n, 0).toFixed(2)} | 
      Min: ${Math.min(...numbers)} | 
      Max: ${Math.max(...numbers)} |
      Q1: ${this.calculateQuartile(sorted, 0.25).toFixed(2)} |
      Q3: ${this.calculateQuartile(sorted, 0.75).toFixed(2)}
    `;
    document.getElementById('additional-info').textContent = additionalInfo;
  }

  calculateQuartile(sortedArray, quartile) {
    const index = quartile * (sortedArray.length - 1);
    if (Number.isInteger(index)) {
      return sortedArray[index];
    } else {
      const lower = Math.floor(index);
      const upper = Math.ceil(index);
      const weight = index - lower;
      return sortedArray[lower] * (1 - weight) + sortedArray[upper] * weight;
    }
  }

  clearStatistics() {
    ['mean-result', 'median-result', 'mode-result', 'range-result', 'stddev-result', 'variance-result'].forEach(id => {
      document.getElementById(id).textContent = '-';
    });
    document.getElementById('additional-info').textContent = 'Enter data to see detailed statistics';
  }

  // Add Percentage Calculator
  openPercentageCalculator() {
    const modal = document.createElement('div');
    modal.className = 'modal-overlay active';
    modal.innerHTML = `
      <div class="modal">
        <div class="modal-header">
          <h2 class="modal-title">📊 Percentage Calculator</h2>
          <button class="modal-close" onclick="this.closest('.modal-overlay').remove()">×</button>
        </div>
        <div class="modal-body">
          <div class="percentage-calculator">
            <div class="calc-section">
              <h4>What is X% of Y?</h4>
              <div style="display: flex; gap: 0.5rem; align-items: center; margin: 1rem 0;">
                <input type="number" id="percent1" placeholder="%" style="width: 80px; padding: 0.5rem;">
                <span>% of</span>
                <input type="number" id="value1" placeholder="Value" style="width: 100px; padding: 0.5rem;">
                <span>=</span>
                <span id="result1" style="font-weight: bold; color: var(--primary-color);">0</span>
              </div>
            </div>
            
            <div class="calc-section">
              <h4>X is what % of Y?</h4>
              <div style="display: flex; gap: 0.5rem; align-items: center; margin: 1rem 0;">
                <input type="number" id="value2" placeholder="Value" style="width: 100px; padding: 0.5rem;">
                <span>is</span>
                <span id="result2" style="font-weight: bold; color: var(--primary-color);">0</span>
                <span>% of</span>
                <input type="number" id="total2" placeholder="Total" style="width: 100px; padding: 0.5rem;">
              </div>
            </div>
            
            <div class="calc-section">
              <h4>Percentage Change</h4>
              <div style="display: flex; gap: 0.5rem; align-items: center; margin: 1rem 0;">
                <span>From</span>
                <input type="number" id="old-value" placeholder="Old" style="width: 100px; padding: 0.5rem;">
                <span>to</span>
                <input type="number" id="new-value" placeholder="New" style="width: 100px; padding: 0.5rem;">
                <span>=</span>
                <span id="change-result" style="font-weight: bold; color: var(--primary-color);">0%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
    
    document.body.appendChild(modal);
    
    // Add event listeners for real-time calculation
    ['percent1', 'value1', 'value2', 'total2', 'old-value', 'new-value'].forEach(id => {
      document.getElementById(id).addEventListener('input', () => this.calculatePercentages());
    });
  }

  calculatePercentages() {
    // What is X% of Y?
    const percent1 = parseFloat(document.getElementById('percent1').value) || 0;
    const value1 = parseFloat(document.getElementById('value1').value) || 0;
    document.getElementById('result1').textContent = (percent1 * value1 / 100).toFixed(2);
    
    // X is what % of Y?
    const value2 = parseFloat(document.getElementById('value2').value) || 0;
    const total2 = parseFloat(document.getElementById('total2').value) || 1;
    document.getElementById('result2').textContent = ((value2 / total2) * 100).toFixed(2);
    
    // Percentage Change
    const oldValue = parseFloat(document.getElementById('old-value').value) || 0;
    const newValue = parseFloat(document.getElementById('new-value').value) || 0;
    const change = oldValue !== 0 ? ((newValue - oldValue) / oldValue * 100) : 0;
    document.getElementById('change-result').textContent = `${change.toFixed(2)}%`;
  }

  filterBySubject(subject) {
    this.activeQuestions = this.questions.filter(q => 
      q.topic === subject || q.category === subject.toLowerCase()
    );
    this.currentQuestionIndex = 0;
    this.studyMode = 'subject';
    
    const practiceInterface = document.getElementById('math-practice-interface');
    practiceInterface.classList.add('active');
    
    // Scroll to practice interface
    practiceInterface.scrollIntoView({ 
      behavior: 'smooth', 
      block: 'start' 
    });
    
    this.renderCurrentQuestion();
  }

  getDifficultyLevel(difficulty) {
    const levels = { easy: 2, medium: 3, hard: 5 };
    return levels[difficulty] || 3;
  }

  formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  }

  // Include other standard methods similar to other tabs
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
        correctAnswer: question.type === 'numerical' ? 
          question.correctAnswer.toString() : 
          question.options[question.correctAnswer],
        userAnswer: question.type === 'numerical' ? 
          userAnswer : 
          question.options[userAnswer],
        subject: 'Quantitative Aptitudes and Reasoning',
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
      const topic = q.topic || 'Mathematics';
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
    
    const practiceInterface = document.getElementById('math-practice-interface');
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
          <h2 class="modal-title">🎉 Mathematical Session Complete!</h2>
        </div>
        <div class="modal-body">
          <div class="completion-stats">
            <div class="completion-stat">
              <div class="stat-number">${this.userProgress.questionsStudied}</div>
              <div class="stat-label">Problems Solved</div>
            </div>
            <div class="completion-stat">
              <div class="stat-number">${accuracy}%</div>
              <div class="stat-label">Math Score</div>
            </div>
            <div class="completion-stat">
              <div class="stat-number">${this.userProgress.correctAnswers}</div>
              <div class="stat-label">Correct Solutions</div>
            </div>
          </div>
          
          <p>Outstanding work on developing your quantitative and reasoning skills!</p>
        </div>
        <div class="modal-footer">
          <button class="btn btn-outline" onclick="this.closest('.modal-overlay').remove(); quantitativeReasoningTab.resetSession()">
            Solve More Problems
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
    if (!document.getElementById('math-practice-interface').classList.contains('active')) {
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
    
    const container = document.querySelector('.quantitative-reasoning-container');
    if (container) {
      container.insertBefore(errorDiv, container.firstChild);
      setTimeout(() => errorDiv.remove(), 5000);
    }
  }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  window.quantitativeReasoningTab = new QuantitativeReasoningTab();
});