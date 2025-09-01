# School Planner - Refactored Structure

This project has been refactored to improve code organization, maintainability, and reusability.

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── SortableItem.tsx    # Draggable lesson plan item
│   ├── DayColumn.tsx       # Day column with drop zone
│   ├── LessonPlanModal.tsx # Modal for creating/editing lessons
│   ├── DayView.tsx         # Full-screen day view
│   ├── WeeklyGridView.tsx  # Weekly grid layout
│   └── index.ts           # Component exports
├── hooks/              # Custom React hooks
│   ├── useAmplifyClient.ts    # Amplify client and data management
│   ├── useLessonPlanModal.ts  # Modal state management
│   ├── useDragAndDrop.ts      # Drag and drop functionality
│   └── index.ts               # Hook exports
├── types/              # TypeScript type definitions
│   └── index.ts           # All type definitions
├── utils/              # Utility functions
│   ├── dateUtils.ts       # Date manipulation utilities
│   └── index.ts           # Utility exports
├── data/               # Data and constants
│   └── demoData.ts        # Demo lesson plans
└── App.tsx             # Main application component
```

## Key Refactoring Benefits

### 1. **Separation of Concerns**

- **Components**: Each UI component is in its own file with a single responsibility
- **Hooks**: Business logic is extracted into custom hooks
- **Utils**: Pure functions for common operations
- **Types**: Centralized type definitions

### 2. **Reusability**

- Components can be easily reused across different parts of the app
- Custom hooks can be shared between components
- Utility functions are pure and testable

### 3. **Maintainability**

- Smaller, focused files are easier to understand and modify
- Clear separation makes debugging easier
- Type safety with centralized type definitions

### 4. **Testability**

- Individual components and hooks can be unit tested in isolation
- Pure utility functions are easy to test
- Mock dependencies are simpler with the modular structure

## Component Overview

### Core Components

- **`SortableItem`**: Individual draggable lesson plan cards
- **`DayColumn`**: Droppable container for each day of the week
- **`WeeklyGridView`**: Main grid layout showing all days
- **`DayView`**: Detailed full-screen view for a single day
- **`LessonPlanModal`**: Form modal for creating and editing lesson plans

### Custom Hooks

- **`useAmplifyClient`**: Manages Amplify connection and lesson plan data
- **`useLessonPlanModal`**: Handles modal state and form data management
- **`useDragAndDrop`**: Manages drag and drop functionality and state

### Utilities

- **`dateUtils`**: Functions for date manipulation and formatting
- **`demoData`**: Demo lesson plans for development and testing

## Usage Examples

### Importing Components

```typescript
import { SortableItem, DayColumn } from './components';
```

### Using Custom Hooks

```typescript
import { useAmplifyClient, useDragAndDrop } from './hooks';

function MyComponent() {
  const { lessonPlans, deleteLessonPlan } = useAmplifyClient();
  // ... component logic
}
```

### Using Utilities

```typescript
import { getCurrentDate, daysOfWeek } from './utils';

const today = getCurrentDate('Monday');
```

## Future Improvements

1. **Testing**: Add unit tests for components, hooks, and utilities
2. **Storybook**: Create component documentation and visual testing
3. **Performance**: Implement React.memo and useMemo where appropriate
4. **Accessibility**: Add ARIA labels and keyboard navigation
5. **Internationalization**: Add i18n support for multiple languages

## Development

To run the development server:

```bash
npm run dev
```

The refactored code maintains all original functionality while providing a much cleaner and more maintainable codebase.
