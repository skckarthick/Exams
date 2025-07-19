// Animation utilities for practice mode
class PracticeAnimations {
  constructor() {
    this.animationQueue = [];
    this.isAnimating = false;
  }

  // Initialize animations for practice mode
  init() {
    this.addAnimationStyles();
    this.setupAnimationObservers();
  }

  // Add CSS animations dynamically
  addAnimationStyles() {
    if (document.getElementById('practice-animations')) return;

    const styles = document.createElement('style');
    styles.id = 'practice-animations';
    styles.textContent = `
      /* Practice Mode Animations */
      .practice-question-enter {
        animation: questionSlideIn 0.6s cubic-bezier(0.4, 0, 0.2, 1);
      }

      .practice-question-exit {
        animation: questionSlideOut 0.4s cubic-bezier(0.4, 0, 0.2, 1);
      }

      @keyframes questionSlideIn {
        0% {
          opacity: 0;
          transform: translateX(30px) scale(0.95);
        }
        100% {
          opacity: 1;
          transform: translateX(0) scale(1);
        }
      }

      @keyframes questionSlideOut {
        0% {
          opacity: 1;
          transform: translateX(0) scale(1);
        }
        100% {
          opacity: 0;
          transform: translateX(-30px) scale(0.95);
        }
      }

      /* Option Selection Animations */
      .option-select-animation {
        animation: optionSelect 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      }

      @keyframes optionSelect {
        0% {
          transform: scale(1);
          box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.4);
        }
        50% {
          transform: scale(1.02);
          box-shadow: 0 0 0 8px rgba(16, 185, 129, 0.2);
        }
        100% {
          transform: scale(1);
          box-shadow: 0 0 0 0 rgba(16, 185, 129, 0);
        }
      }

      /* Correct Answer Animation */
      .correct-answer-animation {
        animation: correctAnswer 0.8s cubic-bezier(0.4, 0, 0.2, 1);
      }

      @keyframes correctAnswer {
        0% {
          transform: scale(1);
          background-color: var(--surface-primary);
        }
        25% {
          transform: scale(1.03);
          background-color: rgba(16, 185, 129, 0.1);
        }
        50% {
          transform: scale(1.01);
          background-color: rgba(16, 185, 129, 0.15);
        }
        100% {
          transform: scale(1);
          background-color: rgba(16, 185, 129, 0.1);
        }
      }

      /* Incorrect Answer Animation */
      .incorrect-answer-animation {
        animation: incorrectAnswer 0.6s cubic-bezier(0.4, 0, 0.2, 1);
      }

      @keyframes incorrectAnswer {
        0% {
          transform: translateX(0);
          background-color: var(--surface-primary);
        }
        15% {
          transform: translateX(-8px);
          background-color: rgba(239, 68, 68, 0.1);
        }
        30% {
          transform: translateX(8px);
          background-color: rgba(239, 68, 68, 0.15);
        }
        45% {
          transform: translateX(-4px);
        }
        60% {
          transform: translateX(4px);
        }
        75% {
          transform: translateX(-2px);
        }
        100% {
          transform: translateX(0);
          background-color: rgba(239, 68, 68, 0.1);
        }
      }

      /* Checkmark Animation */
      .checkmark-animation {
        animation: checkmarkAppear 0.5s cubic-bezier(0.4, 0, 0.2, 1) 0.2s both;
      }

      @keyframes checkmarkAppear {
        0% {
          opacity: 0;
          transform: scale(0) rotate(-45deg);
        }
        50% {
          opacity: 1;
          transform: scale(1.3) rotate(-45deg);
        }
        100% {
          opacity: 1;
          transform: scale(1) rotate(0deg);
        }
      }

      /* Cross Animation */
      .cross-animation {
        animation: crossAppear 0.5s cubic-bezier(0.4, 0, 0.2, 1) 0.2s both;
      }

      @keyframes crossAppear {
        0% {
          opacity: 0;
          transform: scale(0) rotate(0deg);
        }
        50% {
          opacity: 1;
          transform: scale(1.3) rotate(180deg);
        }
        100% {
          opacity: 1;
          transform: scale(1) rotate(360deg);
        }
      }

      /* Explanation Reveal Animation */
      .explanation-reveal {
        animation: explanationReveal 0.5s cubic-bezier(0.4, 0, 0.2, 1);
      }

      @keyframes explanationReveal {
        0% {
          opacity: 0;
          transform: translateY(-20px);
          max-height: 0;
        }
        100% {
          opacity: 1;
          transform: translateY(0);
          max-height: 500px;
        }
      }

      /* Progress Animation */
      .progress-update {
        animation: progressPulse 0.4s cubic-bezier(0.4, 0, 0.2, 1);
      }

      @keyframes progressPulse {
        0% {
          transform: scale(1);
        }
        50% {
          transform: scale(1.05);
        }
        100% {
          transform: scale(1);
        }
      }

      /* Floating Elements */
      .floating-feedback {
        animation: floatingFeedback 2s cubic-bezier(0.4, 0, 0.2, 1);
      }

      @keyframes floatingFeedback {
        0% {
          opacity: 0;
          transform: translateY(20px) scale(0.8);
        }
        20% {
          opacity: 1;
          transform: translateY(0) scale(1);
        }
        80% {
          opacity: 1;
          transform: translateY(-10px) scale(1);
        }
        100% {
          opacity: 0;
          transform: translateY(-30px) scale(0.9);
        }
      }

      /* Celebration Animation for Correct Streaks */
      .celebration-burst {
        animation: celebrationBurst 1s cubic-bezier(0.4, 0, 0.2, 1);
      }

      @keyframes celebrationBurst {
        0% {
          transform: scale(1);
          filter: brightness(1);
        }
        25% {
          transform: scale(1.05);
          filter: brightness(1.2);
        }
        50% {
          transform: scale(1.02);
          filter: brightness(1.1);
        }
        100% {
          transform: scale(1);
          filter: brightness(1);
        }
      }

      /* Smooth Transitions */
      .practice-transition {
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      }

      /* Hover Enhancements */
      .practice-option:hover {
        transform: translateY(-2px);
        box-shadow: 0 8px 25px rgba(16, 185, 129, 0.15);
      }

      /* Focus Enhancements */
      .practice-option:focus-within {
        outline: 2px solid var(--primary-color);
        outline-offset: 2px;
      }
    `;

    document.head.appendChild(styles);
  }

  // Setup intersection observers for scroll animations
  setupAnimationObservers() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-in');
        }
      });
    }, { threshold: 0.1 });

    // Observe elements that should animate on scroll
    document.querySelectorAll('.animate-on-scroll').forEach(el => {
      observer.observe(el);
    });
  }

  // Animate option selection
  animateOptionSelection(optionElement) {
    optionElement.classList.add('option-select-animation');
    
    setTimeout(() => {
      optionElement.classList.remove('option-select-animation');
    }, 300);
  }

  // Animate correct answer
  animateCorrectAnswer(optionElement) {
    optionElement.classList.add('correct-answer-animation');
    
    // Add checkmark
    const checkmark = document.createElement('div');
    checkmark.className = 'answer-indicator checkmark-animation';
    checkmark.innerHTML = '✓';
    checkmark.style.cssText = `
      position: absolute;
      right: 1rem;
      top: 50%;
      transform: translateY(-50%);
      color: var(--success-color);
      font-weight: bold;
      font-size: 1.5rem;
      z-index: 10;
    `;
    
    optionElement.style.position = 'relative';
    optionElement.appendChild(checkmark);

    // Show floating feedback
    this.showFloatingFeedback(optionElement, 'Correct! 🎉', 'success');
  }

  // Animate incorrect answer
  animateIncorrectAnswer(optionElement) {
    optionElement.classList.add('incorrect-answer-animation');
    
    // Add cross mark
    const cross = document.createElement('div');
    cross.className = 'answer-indicator cross-animation';
    cross.innerHTML = '✗';
    cross.style.cssText = `
      position: absolute;
      right: 1rem;
      top: 50%;
      transform: translateY(-50%);
      color: var(--error-color);
      font-weight: bold;
      font-size: 1.5rem;
      z-index: 10;
    `;
    
    optionElement.style.position = 'relative';
    optionElement.appendChild(cross);

    // Show floating feedback
    this.showFloatingFeedback(optionElement, 'Try again! 💪', 'error');
  }

  // Show floating feedback
  showFloatingFeedback(element, message, type) {
    const feedback = document.createElement('div');
    feedback.className = `floating-feedback floating-${type}`;
    feedback.textContent = message;
    feedback.style.cssText = `
      position: absolute;
      top: -40px;
      left: 50%;
      transform: translateX(-50%);
      background: ${type === 'success' ? 'var(--success-color)' : 'var(--error-color)'};
      color: white;
      padding: 0.5rem 1rem;
      border-radius: 20px;
      font-size: 0.875rem;
      font-weight: 600;
      z-index: 1000;
      pointer-events: none;
      white-space: nowrap;
    `;

    element.style.position = 'relative';
    element.appendChild(feedback);

    setTimeout(() => {
      if (feedback.parentNode) {
        feedback.parentNode.removeChild(feedback);
      }
    }, 2000);
  }

  // Animate explanation reveal
  animateExplanationReveal(explanationElement) {
    explanationElement.classList.add('explanation-reveal');
  }

  // Animate progress update
  animateProgressUpdate(progressElement) {
    progressElement.classList.add('progress-update');
    
    setTimeout(() => {
      progressElement.classList.remove('progress-update');
    }, 400);
  }

  // Animate question transition
  animateQuestionTransition(currentQuestion, nextQuestion, direction = 'next') {
    return new Promise((resolve) => {
      if (currentQuestion) {
        currentQuestion.classList.add('practice-question-exit');
        
        setTimeout(() => {
          currentQuestion.style.display = 'none';
          currentQuestion.classList.remove('practice-question-exit');
          
          if (nextQuestion) {
            nextQuestion.style.display = 'block';
            nextQuestion.classList.add('practice-question-enter');
            
            setTimeout(() => {
              nextQuestion.classList.remove('practice-question-enter');
              resolve();
            }, 600);
          } else {
            resolve();
          }
        }, 400);
      } else if (nextQuestion) {
        nextQuestion.style.display = 'block';
        nextQuestion.classList.add('practice-question-enter');
        
        setTimeout(() => {
          nextQuestion.classList.remove('practice-question-enter');
          resolve();
        }, 600);
      } else {
        resolve();
      }
    });
  }

  // Celebration animation for streaks
  celebrateStreak(element, streakCount) {
    element.classList.add('celebration-burst');
    
    // Create confetti effect for high streaks
    if (streakCount >= 5) {
      this.createConfettiEffect(element);
    }
    
    setTimeout(() => {
      element.classList.remove('celebration-burst');
    }, 1000);
  }

  // Create confetti effect
  createConfettiEffect(element) {
    const colors = ['#10b981', '#f59e0b', '#8b5cf6', '#ef4444', '#3b82f6'];
    const confettiCount = 20;

    for (let i = 0; i < confettiCount; i++) {
      const confetti = document.createElement('div');
      confetti.style.cssText = `
        position: absolute;
        width: 8px;
        height: 8px;
        background: ${colors[Math.floor(Math.random() * colors.length)]};
        border-radius: 50%;
        pointer-events: none;
        z-index: 1000;
        animation: confettiFall 2s linear forwards;
        left: ${Math.random() * 100}%;
        top: 0;
        animation-delay: ${Math.random() * 0.5}s;
      `;

      element.style.position = 'relative';
      element.appendChild(confetti);

      setTimeout(() => {
        if (confetti.parentNode) {
          confetti.parentNode.removeChild(confetti);
        }
      }, 2500);
    }

    // Add confetti animation if not exists
    if (!document.getElementById('confetti-animation')) {
      const confettiStyle = document.createElement('style');
      confettiStyle.id = 'confetti-animation';
      confettiStyle.textContent = `
        @keyframes confettiFall {
          0% {
            transform: translateY(0) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(200px) rotate(360deg);
            opacity: 0;
          }
        }
      `;
      document.head.appendChild(confettiStyle);
    }
  }

  // Clean up animations
  cleanup() {
    document.querySelectorAll('.answer-indicator').forEach(el => el.remove());
    document.querySelectorAll('.floating-feedback').forEach(el => el.remove());
  }
}

// Create global instance
window.PracticeAnimations = new PracticeAnimations();