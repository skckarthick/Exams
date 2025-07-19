# Exam Preparation Portal

A comprehensive web application for government exam preparation with advanced features including practice modes, mock tests, performance analytics, and personalized learning paths.

## Features

### 🎯 Core Functionality
- **Multiple Exam Categories**: Assistant Registrar, Admin Officer, General Awareness, Quantitative Aptitudes & Reasoning
- **Practice Modes**: Study mode with explanations, timed mock tests, reinforcement learning
- **Smart Question Bank**: Comprehensive questions with detailed explanations
- **Progress Tracking**: Local storage-based progress tracking and analytics
- **Performance Analytics**: Detailed statistics and improvement recommendations

### 🚀 Advanced Features
- **Reinforcement Learning**: Repeat incorrectly answered questions for better retention
- **Keyboard Navigation**: Full keyboard support for accessibility and speed
- **Text Selection Search**: Select any text to search on Google, Bing, or DuckDuckGo
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **PWA Support**: Progressive Web App with offline capabilities
- **Local Account System**: Complete user data management without external dependencies

### 🎨 User Experience
- **Modern UI/Design**: Clean, professional interface with smooth animations
- **Dark/Light Theme**: Automatic theme detection with manual toggle
- **Search Functionality**: Search through questions and topics
- **Tab Navigation**: Easy switching between different exam categories
- **Real-time Feedback**: Instant feedback with detailed explanations
- **Elegant Practice Mode**: Redesigned question display with premium aesthetics
- **Responsive Design**: Optimized for all screen sizes and devices

### 📊 Analytics & Insights
- **Performance Dashboard**: Comprehensive overview of study progress
- **Subject-wise Analysis**: Track performance across different topics
- **Study Recommendations**: AI-powered suggestions for improvement
- **Achievement System**: Badges and milestones to motivate learning
- **Export Data**: Download progress reports and statistics

## Technology Stack

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Styling**: Custom CSS with CSS Variables and Flexbox/Grid
- **Icons**: Lucide React icons and custom SVGs
- **Storage**: Local Storage for user data and progress
- **PWA**: Service Worker for offline functionality
- **Build Tool**: Vite for development and building

## Project Structure

```
Exam Preparation Portal/
├── public/
│   ├── manifest.json          # PWA manifest
│   └── sw.js                  # Service worker
├── images/
│   ├── logo.png              # Application logo
│   ├── background.jpg         # Hero background
│   └── favicon.ico           # Favicon
├── src/
│   ├── css/
│   │   ├── main.css          # Main styles and CSS variables
│   │   ├── home.css          # Home page styles
│   │   ├── Quiz.css          # Quiz interface styles
│   │   ├── dashboard.css     # Dashboard styles
│   │   └── tabs/             # Subject-specific styles
│   ├── js/
│   │   ├── auth/
│   │   │   └── Local Account.js    # Local user management
│   │   ├── components/
│   │   │   ├── header.js           # Navigation header
│   │   │   ├── footer.js           # Footer component
│   │   │   └── tabnav.js          # Tab navigation
│   │   ├── pages/
│   │   │   ├── home.js            # Home page logic
│   │   │   ├── Quiz.js            # Quiz functionality
│   │   │   ├── dashboard.js       # Dashboard analytics
│   │   │   └── tabs/              # Subject-specific logic
│   │   └── utils/
│   │       ├── helpers.js         # Utility functions
│   │       ├── validation.js      # Form validation
│   │       ├── Select4search.js   # Text selection search
│   │       └── Key navigation.js  # Keyboard shortcuts
│   └── pages/
│       ├── Quiz.html             # Quiz interface
│       ├── dashboard.html        # Analytics dashboard
│       └── tabs/                 # Subject-specific pages
├── questions/                    # Question banks (JSON)
│   ├── Assistant Registrar.json
│   ├── Admin Officer.json
│   ├── General Awareness and Current Affairs.json
│   └── Quantitative Aptitudes and Reasoning.json
├── index.html                   # Main entry point
└── README.md
```

## Getting Started

### Prerequisites
- Modern web browser (Chrome, Firefox, Safari, Edge)
- Local web server (for development)

### Installation

1. **Clone or download** the project files
2. **Set up a local server**:
   ```bash
   # Using Python
   python -m http.server 8000
   
   # Using Node.js
   npx serve .
   
   # Using PHP
   php -S localhost:8000
   ```
3. **Open your browser** and navigate to `http://localhost:8000`

### Development Setup

For development with Vite:

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## Usage Guide

### 🏠 Home Page
- Browse different exam categories
- Use the search bar to find specific topics
- Quick access to dashboard and quiz modes

### 📝 Taking Quizzes
1. Select exam category and configure settings
2. Choose duration and number of questions
3. Navigate using keyboard shortcuts or mouse
4. Review answers and explanations
5. View detailed results and recommendations

### 📊 Dashboard
- Track overall progress and statistics
- View subject-wise performance
- Access quiz history and analytics
- Get personalized study recommendations

### 📚 Study Modes
- **Practice Mode**: Study with instant feedback
- **Mock Test Mode**: Timed exam simulation
- **Reinforcement Mode**: Focus on weak areas
- **Topic-wise Study**: Concentrate on specific subjects

## Keyboard Shortcuts

### Global Navigation
- `Alt + H`: Home page
- `Alt + D`: Dashboard
- `Alt + Q`: Quiz page
- `Ctrl + K`: Focus search
- `Ctrl + Shift + T`: Toggle theme
- `F1`: Show help

### Quiz Navigation
- `→` or `Enter`: Next question
- `←`: Previous question
- `Space`: Show/hide answer
- `1-4`: Select options A-D
- `M`: Mark for review
- `Ctrl + S`: Save progress
- `Ctrl + Enter`: Submit quiz

### Study Mode
- `→`: Next question
- `←`: Previous question
- `Space`: Toggle explanation
- `S`: Shuffle questions
- `H`: Show hint

## Features in Detail

### 🎨 Design & User Experience
- **Elegant Color Scheme**: Light green primary theme with sophisticated gradients
- **Advanced Animations**: Smooth transitions and feedback animations in practice mode
- **Modern Question Display**: Redesigned question interface with elegant typography
- **Visual Feedback**: Real-time animations for correct/incorrect answers
- **Responsive Design**: Optimized for all screen sizes

### 🔍 Smart Search
- Search through all question banks
- Highlight matching terms
- Filter by subject and difficulty
- Google search integration for selected text

### 📱 Progressive Web App
- Install on mobile devices
- Offline functionality
- Fast loading with caching
- Native app-like experience

### 🎯 Adaptive Learning
- Track wrong answers for reinforcement
- Personalized question recommendations
- Difficulty adjustment based on performance
- Spaced repetition for better retention

### 📈 Analytics
- Detailed performance metrics
- Subject-wise progress tracking
- Time-based analysis
- Improvement recommendations
- Achievement system

## Customization

### Adding Questions
1. Edit JSON files in the `questions/` directory
2. Follow the existing question format:
```json
{
  "id": "unique_id",
  "question": "Question text",
  "options": ["Option A", "Option B", "Option C", "Option D"],
  "correctAnswer": 0,
  "explanation": "Detailed explanation",
  "topic": "Topic name",
  "difficulty": "easy|medium|hard"
}
```

Example Structure: NEW
{
  "id": "ga_001",
  "question": "...",
  "topic": "Indian Politics",
  "category": "polity",
  "difficulty": "easy"
}

### Styling
- Modify CSS variables in `src/css/main.css`
- Customize colors, fonts, and spacing
- Add new themes by extending the CSS

### Adding Features
- Create new JavaScript modules in appropriate directories
- Follow the existing code structure and patterns
- Update navigation and routing as needed

## Browser Support

- Chrome 80+
- Firefox 75+
- Safari 13+
- Edge 80+

## Performance

- Optimized for fast loading
- Efficient local storage usage
- Minimal external dependencies
- Progressive enhancement

## Security

- No external data transmission
- Local storage encryption for sensitive data
- XSS protection through proper sanitization
- HTTPS recommended for production

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support and questions:
- Check the built-in help system (F1)
- Review the keyboard shortcuts (Ctrl + /)
- Refer to this documentation

## Roadmap

### Upcoming Features
- Advanced analytics with charts
- Export functionality for progress reports
- More question types (fill-in-the-blank, drag-drop)
- Social features (study groups, leaderboards)
- Advanced search with filters
- Voice-based navigation
- AI-powered study recommendations

### Performance Improvements
- Lazy loading for better performance
- Advanced caching strategies
- Database optimization
- Mobile app development

---

**Happy Learning! 🎓**

Built with ❤️ for exam preparation success.