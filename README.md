# React Progress Web App

A comprehensive React application featuring a progress tracker and practice components to learn React concepts.

## Features

### Progress Tracker
- **Interactive Progress Bars**: Visual representation of goal completion
- **Task Management**: Add, complete, and track daily/weekly tasks
- **Statistics Dashboard**: Overall progress metrics and stats
- **Responsive Design**: Works on desktop and mobile devices

### Practice Components
- **Counter Component**: Demonstrates custom hooks and state management
- **Form Practice**: Form handling, validation, and error states
- **Todo Application**: List management with local storage persistence
- **Data Fetching**: API calls, loading states, and error handling

## Technology Stack

- **React 18+**: Latest React with hooks
- **Vite**: Fast development and build tool
- **JavaScript (JSX)**: Modern JavaScript with JSX syntax
- **CSS3**: Custom styling with gradients and animations
- **Local Storage**: Client-side data persistence

## Project Structure

```
src/
├── components/           # Reusable UI components
│   ├── ProgressBar.jsx   # Progress visualization
│   ├── TaskList.jsx      # Task management
│   └── StatsCard.jsx     # Statistics display
├── hooks/                # Custom React hooks
│   ├── useCounter.js     # Counter functionality
│   └── useLocalStorage.js # Local storage management
├── practice/             # Practice components for learning
│   ├── Counter.jsx       # State management practice
│   ├── FormPractice.jsx  # Form handling practice
│   ├── TodoPractice.jsx  # List manipulation practice
│   ├── DataFetching.jsx  # API call practice
│   └── PracticePage.jsx  # Main practice container
├── utils/                # Utility functions
│   ├── formatters.js     # Data formatting helpers
│   └── validation.js     # Form validation helpers
├── App.jsx               # Main application component
├── main.jsx              # Application entry point
└── index.css             # Global styles
```

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn package manager

### Installation

1. Clone or download the project
2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to `http://localhost:5173`

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint for code quality

## Learning Objectives

This project covers essential React concepts:

### React Hooks
- **useState**: Managing component state
- **useEffect**: Handling side effects and lifecycle
- **useCallback**: Optimizing function references
- **Custom Hooks**: Creating reusable stateful logic

### State Management
- Local component state
- State lifting and sharing
- Form state handling
- List state manipulation

### Side Effects
- API data fetching
- Local storage integration
- Error handling patterns
- Loading state management

### Best Practices
- Component composition
- Code organization and structure
- Utility function separation
- Props and data flow
- Event handling

## Component Examples

### Using Custom Hooks
```jsx
import { useCounter } from './hooks/useCounter';

const MyComponent = () => {
  const { count, increment, decrement, reset } = useCounter(0);
  
  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={increment}>+</button>
      <button onClick={decrement}>-</button>
      <button onClick={reset}>Reset</button>
    </div>
  );
};
```

### Form Handling with Validation
```jsx
import { useState } from 'react';
import { isValidEmail } from './utils/validation';

const ContactForm = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isValidEmail(email)) {
      setError('Please enter a valid email');
      return;
    }
    // Process form
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <input 
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      {error && <span>{error}</span>}
      <button type="submit">Submit</button>
    </form>
  );
};
```

## Customization

### Adding New Practice Components
1. Create a new component in `src/practice/`
2. Import and add it to `PracticePage.jsx`
3. Update navigation if needed

### Styling
- Modify `src/index.css` for global styles
- Use inline styles for component-specific styling
- CSS variables are available for consistent theming

### Utility Functions
- Add new utilities to `src/utils/`
- Export functions for reuse across components
- Follow existing patterns for consistency

## Contributing

Feel free to:
- Add new practice components
- Improve existing functionality
- Enhance styling and animations
- Add more utility functions
- Improve documentation

## License

This project is open source and available under the [MIT License](LICENSE).