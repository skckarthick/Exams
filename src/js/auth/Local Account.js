// Local account management system
class LocalAccount {
  constructor() {
    this.storageKey = 'examPrepUserData';
    this.user = this.loadUser();
    this.init();
  }

  init() {
    // Ensure user data structure exists
    if (!this.user) {
      this.createDefaultUser();
    }
    
    // Show name input dialog if user is still "Student"
    if (this.user.profile.name === 'Student') {
      this.showNameInputDialog();
    }
    
    // Update last login
    this.updateLastLogin();
    
    // Clean up old data periodically
    this.cleanupOldData();
  }

  createDefaultUser() {
    const defaultUser = {
      id: this.generateUserId(),
      profile: {
        name: 'Student',
        email: '',
        avatar: this.generateAvatar(),
        joinDate: new Date().toISOString(),
        lastLogin: new Date().toISOString(),
        preferences: {
          theme: 'light',
          notifications: true,
          soundEffects: true,
          autoSave: true
        }
      },
      statistics: {
        totalQuizzes: 0,
        totalQuestions: 0,
        correctAnswers: 0,
        totalStudyTime: 0,
        streak: 0,
        longestStreak: 0,
        lastActivityDate: new Date().toISOString()
      },
      progress: {
        'Assistant Registrar': {
          questionsAnswered: 0,
          correctAnswers: 0,
          accuracy: 0,
          averageTime: 0,
          topicProgress: {},
          lastStudied: null
        },
        'Admin Officer': {
          questionsAnswered: 0,
          correctAnswers: 0,
          accuracy: 0,
          averageTime: 0,
          topicProgress: {},
          lastStudied: null
        },
        'General Awareness and Current Affairs': {
          questionsAnswered: 0,
          correctAnswers: 0,
          accuracy: 0,
          averageTime: 0,
          topicProgress: {},
          lastStudied: null
        },
        'Quantitative Aptitudes and Reasoning': {
          questionsAnswered: 0,
          correctAnswers: 0,
          accuracy: 0,
          averageTime: 0,
          topicProgress: {},
          lastStudied: null
        }
      },
      quizHistory: [],
      achievements: [],
      wrongAnswers: [], // For reinforcement learning
      bookmarks: [],
      settings: {
        defaultQuizDuration: 60,
        defaultQuestionCount: 50,
        showExplanations: true,
        randomizeQuestions: true,
        randomizeOptions: false
      }
    };

    this.user = defaultUser;
    this.saveUser();
  }

  generateUserId() {
    return 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }

  generateAvatar() {
    const names = ['Student', 'Learner', 'Scholar', 'Aspirant'];
    const name = names[Math.floor(Math.random() * names.length)];
    return name.charAt(0).toUpperCase();
  }

  showNameInputDialog() {
    // Don't show if already shown in this session
    if (sessionStorage.getItem('nameDialogShown')) return;
    
    const modal = document.createElement('div');
    modal.className = 'modal-overlay active';
    modal.style.zIndex = '10000';
    modal.innerHTML = `
      <div class="modal">
        <div class="modal-header">
          <h2 class="modal-title">👋 Welcome to ExamPrep Portal!</h2>
        </div>
        <div class="modal-body">
          <p>Please enter your name to personalize your learning experience:</p>
          <div style="margin: 1.5rem 0;">
            <input type="text" id="user-name-input" placeholder="Enter your name" 
                   style="width: 100%; padding: 1rem; border: 2px solid var(--border-light); border-radius: 8px; font-size: 1rem;"
                   maxlength="50">
          </div>
          <p style="font-size: 0.875rem; color: var(--text-secondary);">
            Your name will be saved locally on this device for a personalized experience.
          </p>
        </div>
        <div class="modal-footer">
          <button class="btn btn-outline" onclick="window.LocalAccount.skipNameInput()">
            Skip for now
          </button>
          <button class="btn btn-primary" onclick="window.LocalAccount.saveUserName()">
            Save Name
          </button>
        </div>
      </div>
    `;
    
    document.body.appendChild(modal);
    
    // Focus on input
    setTimeout(() => {
      const input = document.getElementById('user-name-input');
      if (input) {
        input.focus();
        
        // Handle Enter key
        input.addEventListener('keypress', (e) => {
          if (e.key === 'Enter') {
            this.saveUserName();
          }
        });
      }
    }, 100);
  }

  saveUserName() {
    const input = document.getElementById('user-name-input');
    const name = input ? input.value.trim() : '';
    
    if (name && name.length >= 2) {
      this.updateProfile({ 
        name: name,
        avatar: name.charAt(0).toUpperCase()
      });
      
      // Mark dialog as shown
      sessionStorage.setItem('nameDialogShown', 'true');
      
      // Close modal
      const modal = document.querySelector('.modal-overlay');
      if (modal) {
        modal.remove();
      }
      
      // Show success message
      this.showWelcomeMessage(name);
    } else {
      alert('Please enter a valid name (at least 2 characters)');
    }
  }

  skipNameInput() {
    // Mark dialog as shown
    sessionStorage.setItem('nameDialogShown', 'true');
    
    // Close modal
    const modal = document.querySelector('.modal-overlay');
    if (modal) {
      modal.remove();
    }
  }

  showWelcomeMessage(name) {
    const notification = document.createElement('div');
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: var(--success-color);
      color: white;
      padding: 1rem 1.5rem;
      border-radius: 8px;
      box-shadow: var(--shadow-lg);
      z-index: 10001;
      font-weight: 600;
      animation: slideInRight 0.3s ease-out;
    `;
    notification.textContent = `Welcome, ${name}! Your profile has been saved.`;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
      if (notification.parentNode) {
        notification.style.animation = 'slideOutRight 0.3s ease-in';
        setTimeout(() => {
          if (notification.parentNode) {
            notification.parentNode.removeChild(notification);
          }
        }, 300);
      }
    }, 3000);
  }
  loadUser() {
    try {
      const userData = localStorage.getItem(this.storageKey);
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      console.error('Error loading user data:', error);
      return null;
    }
  }

  saveUser() {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(this.user));
      return true;
    } catch (error) {
      console.error('Error saving user data:', error);
      return false;
    }
  }

  updateLastLogin() {
    if (this.user) {
      this.user.profile.lastLogin = new Date().toISOString();
      this.saveUser();
    }
  }

  // Profile management
  updateProfile(updates) {
    if (!this.user) return false;

    this.user.profile = { ...this.user.profile, ...updates };
    return this.saveUser();
  }

  getProfile() {
    return this.user ? this.user.profile : null;
  }

  // Quiz history management
  addQuizResult(quizData) {
    if (!this.user) return false;

    const quizResult = {
      id: this.generateQuizId(),
      subject: quizData.subject,
      score: quizData.score,
      totalQuestions: quizData.totalQuestions,
      correctAnswers: quizData.correctAnswers,
      incorrectAnswers: quizData.incorrectAnswers,
      unanswered: quizData.unanswered,
      timeTaken: quizData.timeTaken,
      accuracy: Math.round((quizData.correctAnswers / quizData.totalQuestions) * 100),
      date: new Date().toISOString(),
      questions: quizData.questions || []
    };

    this.user.quizHistory.unshift(quizResult);
    
    // Keep only last 100 quiz results
    if (this.user.quizHistory.length > 100) {
      this.user.quizHistory = this.user.quizHistory.slice(0, 100);
    }

    // Update statistics
    this.updateStatistics(quizResult);
    
    // Update subject progress
    this.updateSubjectProgress(quizData.subject, quizResult);

    // Add wrong answers for reinforcement
    this.addWrongAnswers(quizData.wrongAnswers || []);

    return this.saveUser();
  }

  generateQuizId() {
    return 'quiz_' + Date.now() + '_' + Math.random().toString(36).substr(2, 6);
  }

  updateStatistics(quizResult) {
    if (!this.user.statistics) {
      this.user.statistics = {
        totalQuizzes: 0,
        totalQuestions: 0,
        correctAnswers: 0,
        totalStudyTime: 0,
        streak: 0,
        longestStreak: 0,
        lastActivityDate: new Date().toISOString()
      };
    }

    const stats = this.user.statistics;
    
    stats.totalQuizzes++;
    stats.totalQuestions += quizResult.totalQuestions;
    stats.correctAnswers += quizResult.correctAnswers;
    stats.totalStudyTime += quizResult.timeTaken;
    stats.lastActivityDate = new Date().toISOString();

    // Update streak
    if (quizResult.accuracy >= 60) { // 60% threshold for maintaining streak
      stats.streak++;
      stats.longestStreak = Math.max(stats.longestStreak, stats.streak);
    } else {
      stats.streak = 0;
    }
  }

  updateSubjectProgress(subject, quizResult) {
    if (!this.user.progress[subject]) {
      this.user.progress[subject] = {
        questionsAnswered: 0,
        correctAnswers: 0,
        accuracy: 0,
        averageTime: 0,
        topicProgress: {},
        lastStudied: null
      };
    }

    const progress = this.user.progress[subject];
    
    progress.questionsAnswered += quizResult.totalQuestions;
    progress.correctAnswers += quizResult.correctAnswers;
    progress.accuracy = Math.round((progress.correctAnswers / progress.questionsAnswered) * 100);
    progress.lastStudied = new Date().toISOString();

    // Update average time
    const totalTime = (progress.averageTime * (progress.questionsAnswered - quizResult.totalQuestions)) + 
                     (quizResult.timeTaken);
    progress.averageTime = Math.round(totalTime / progress.questionsAnswered);
  }

  // Wrong answers for reinforcement learning
  addWrongAnswers(wrongAnswers) {
    if (!Array.isArray(wrongAnswers)) return;

    wrongAnswers.forEach(answer => {
      const existingIndex = this.user.wrongAnswers.findIndex(
        wa => wa.questionId === answer.questionId
      );

      if (existingIndex !== -1) {
        // Increment mistake count
        this.user.wrongAnswers[existingIndex].mistakeCount++;
        this.user.wrongAnswers[existingIndex].lastMistake = new Date().toISOString();
      } else {
        // Add new wrong answer
        this.user.wrongAnswers.push({
          questionId: answer.questionId,
          question: answer.question,
          correctAnswer: answer.correctAnswer,
          userAnswer: answer.userAnswer,
          subject: answer.subject,
          topic: answer.topic,
          mistakeCount: 1,
          firstMistake: new Date().toISOString(),
          lastMistake: new Date().toISOString(),
          reviewed: false
        });
      }
    });

    // Keep only recent wrong answers (last 500)
    if (this.user.wrongAnswers.length > 500) {
      this.user.wrongAnswers.sort((a, b) => new Date(b.lastMistake) - new Date(a.lastMistake));
      this.user.wrongAnswers = this.user.wrongAnswers.slice(0, 500);
    }
  }

  getWrongAnswers(subject = null, limit = null) {
    let wrongAnswers = this.user.wrongAnswers || [];

    if (subject) {
      wrongAnswers = wrongAnswers.filter(wa => wa.subject === subject);
    }

    // Sort by mistake count (descending) and last mistake (recent first)
    wrongAnswers.sort((a, b) => {
      if (a.mistakeCount !== b.mistakeCount) {
        return b.mistakeCount - a.mistakeCount;
      }
      return new Date(b.lastMistake) - new Date(a.lastMistake);
    });

    return limit ? wrongAnswers.slice(0, limit) : wrongAnswers;
  }

  markWrongAnswerReviewed(questionId) {
    const wrongAnswer = this.user.wrongAnswers.find(wa => wa.questionId === questionId);
    if (wrongAnswer) {
      wrongAnswer.reviewed = true;
      this.saveUser();
    }
  }

  // Achievements system
  checkAndAwardAchievements() {
    const achievements = [
      {
        id: 'first_quiz',
        name: 'Getting Started',
        description: 'Complete your first quiz',
        condition: () => this.user.statistics.totalQuizzes >= 1,
        icon: '🎯'
      },
      {
        id: 'quiz_master',
        name: 'Quiz Master',
        description: 'Complete 50 quizzes',
        condition: () => this.user.statistics.totalQuizzes >= 50,
        icon: '👑'
      },
      {
        id: 'accuracy_expert',
        name: 'Accuracy Expert',
        description: 'Achieve 90%+ accuracy in a quiz',
        condition: () => this.user.quizHistory.some(quiz => quiz.accuracy >= 90),
        icon: '🎯'
      },
      {
        id: 'speed_demon',
        name: 'Speed Demon',
        description: 'Complete a 50-question quiz in under 30 minutes',
        condition: () => this.user.quizHistory.some(quiz => 
          quiz.totalQuestions >= 50 && quiz.timeTaken <= 1800
        ),
        icon: '⚡'
      },
      {
        id: 'streak_warrior',
        name: 'Streak Warrior',
        description: 'Maintain a 10-day study streak',
        condition: () => this.user.statistics.longestStreak >= 10,
        icon: '🔥'
      }
    ];

    const newAchievements = [];
    const currentAchievementIds = this.user.achievements.map(a => a.id);

    achievements.forEach(achievement => {
      if (!currentAchievementIds.includes(achievement.id) && achievement.condition()) {
        const newAchievement = {
          ...achievement,
          dateEarned: new Date().toISOString()
        };
        this.user.achievements.push(newAchievement);
        newAchievements.push(newAchievement);
      }
    });

    if (newAchievements.length > 0) {
      this.saveUser();
      return newAchievements;
    }

    return [];
  }

  // Data management
  exportData() {
    return {
      version: '1.0',
      exportDate: new Date().toISOString(),
      userData: this.user
    };
  }

  importData(data) {
    try {
      if (data.version && data.userData) {
        this.user = data.userData;
        return this.saveUser();
      }
      return false;
    } catch (error) {
      console.error('Error importing data:', error);
      return false;
    }
  }

  clearAllData() {
    localStorage.removeItem(this.storageKey);
    this.user = null;
    this.createDefaultUser();
    return true;
  }

  cleanupOldData() {
    if (!this.user) return;

    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

    // Remove quiz history older than 1 year
    this.user.quizHistory = this.user.quizHistory.filter(
      quiz => new Date(quiz.date) > oneYearAgo
    );

    // Remove old wrong answers that have been reviewed
    this.user.wrongAnswers = this.user.wrongAnswers.filter(
      wa => !wa.reviewed || new Date(wa.lastMistake) > oneYearAgo
    );

    this.saveUser();
  }

  // Getters for dashboard
  getStatistics() {
    return this.user ? this.user.statistics : null;
  }

  getQuizHistory(limit = null) {
    if (!this.user) return [];
    return limit ? this.user.quizHistory.slice(0, limit) : this.user.quizHistory;
  }

  getSubjectProgress(subject = null) {
    if (!this.user) return null;
    return subject ? this.user.progress[subject] : this.user.progress;
  }

  getAchievements() {
    return this.user ? this.user.achievements : [];
  }

  getSettings() {
    return this.user ? this.user.settings : null;
  }

  updateSettings(newSettings) {
    if (!this.user) return false;
    this.user.settings = { ...this.user.settings, ...newSettings };
    return this.saveUser();
  }
}

// Create global instance
window.LocalAccount = new LocalAccount();