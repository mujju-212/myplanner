# MyPlanner 

A comprehensive, privacy-first personal productivity mobile application built with React Native and Expo. Your data never leaves your device unless you choose to export it.

##  Features

### Core Functionality
- ** Todo Management** - Create, organize, and track tasks with priorities, tags, and due dates
- ** Calendar & Events** - Schedule and manage events with an intuitive calendar interface
- ** Personal Logs** - Daily journaling with mood tracking and productivity ratings
- ** Goals & Projects** - Set and track long-term goals and projects
- ** Habit Tracking** - Build and maintain positive habits
- ** Gamification** - Earn XP, level up, and maintain streaks to stay motivated
- ** AI Assistant** - AI-powered planning and productivity suggestions
- ** Analytics** - Visualize your productivity patterns and progress
- ** Achievements** - Unlock rewards and milestones
- ** Smart Search** - Find anything across todos, events, logs, and more

### Technical Highlights
- ** 100% Offline-First** - All data stored locally using SQLite
- ** Dark Mode Support** - Beautiful themes for day and night
- ** Fast & Responsive** - Optimized performance with smooth animations
- ** Privacy-Focused** - No accounts, no cloud sync, your data stays on your device
- ** Import/Export** - Backup and restore your data anytime

##  Tech Stack

- **Framework**: React Native 0.81.5 with Expo SDK 54
- **Language**: TypeScript
- **Database**: SQLite (expo-sqlite)
- **State Management**: Zustand
- **Navigation**: Expo Router (file-based routing)
- **UI Components**: React Native Paper with custom components
- **Animations**: React Native Reanimated
- **Date Utilities**: date-fns
- **Testing**: Jest + React Native Testing Library + Detox

##  Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Expo CLI (`npm install -g expo-cli`)
- For iOS: macOS with Xcode
- For Android: Android Studio with Android SDK

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/mujju-212/myplanner.git
   cd myplanner
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npx expo start
   ```

4. **Run on your device**
   - Scan the QR code with Expo Go app (Android) or Camera app (iOS)
   - Or press `a` for Android emulator
   - Or press `i` for iOS simulator

##  Available Scripts

```bash
npm start          # Start Expo development server
npm run android    # Run on Android emulator
npm run ios        # Run on iOS simulator
npm run web        # Run in web browser
npm run lint       # Run ESLint
npm test           # Run tests
```

##  Project Structure

```
myplanner/
 app/                      # Expo Router pages
    (tabs)/              # Tab navigation screens
       index.tsx        # Home/Dashboard
       todos.tsx        # Todo list
       calendar.tsx     # Calendar view
       logs.tsx         # Personal logs
       more.tsx         # Settings & more
    (stacks)/            # Modal & stack screens
        todo/            # Todo CRUD screens
        event/           # Event management
        log/             # Log entries
        goal/            # Goal tracking
        habit/           # Habit tracking
 src/
    components/          # Reusable UI components
    database/            # SQLite schema & repositories
    hooks/               # Custom React hooks
    services/            # Business logic services
    stores/              # Zustand state stores
    theme/               # Theme configuration
    types/               # TypeScript definitions
    utils/               # Utility functions
 __tests__/               # Test suites
```

##  Database Schema

The app uses SQLite with the following main tables:

- `todo_lists` - Task list categories
- `todos` - Individual tasks with metadata
- `daily_logs` - Personal journal entries
- `events` - Calendar events
- `goals` - Long-term goals
- `habits` - Habit tracking data
- `projects` - Project management
- `user_stats` - Gamification data (XP, levels, streaks)

##  Roadmap

- [ ] Cloud backup option (optional)
- [ ] Widget support for iOS/Android
- [ ] Voice input for quick task creation
- [ ] Advanced analytics dashboard
- [ ] Export to PDF reports
- [ ] Integration with calendars (Google, Outlook)
- [ ] Collaborative features (optional)

##  Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

##  License

This project is licensed under the MIT License - see the LICENSE file for details.

##  Author

**Mujutaba M N**
- GitHub: [@mujju-212](https://github.com/mujju-212)
- Email: mujju786492@gmail.com

##  Acknowledgments

- Built with [Expo](https://expo.dev)
- Icons by [@expo/vector-icons](https://icons.expo.fyi/)
- Inspired by modern productivity apps

---

**Note**: This is a privacy-first application. All data is stored locally on your device. Make sure to export backups regularly to prevent data loss.
