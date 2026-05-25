/** Navigation sections and app-wide constants */
export const NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: 'LayoutDashboard' },
  { id: 'tasks', label: 'Tasks', icon: 'CheckSquare' },
  { id: 'pomodoro', label: 'Pomodoro Timer', icon: 'Timer' },
  { id: 'notes', label: 'Notes', icon: 'StickyNote' },
  { id: 'goals', label: 'Goals', icon: 'Target' },
  { id: 'analytics', label: 'Analytics', icon: 'BarChart3' },
  { id: 'settings', label: 'Settings', icon: 'Settings' },
];

export const PRIORITIES = {
  HIGH: 'high',
  MEDIUM: 'medium',
  LOW: 'low',
};

export const PRIORITY_LABELS = {
  high: 'High',
  medium: 'Medium',
  low: 'Low',
};

export const TASK_FILTERS = ['all', 'pending', 'completed', 'overdue'];

export const POMODORO_FOCUS = 25 * 60;
export const POMODORO_BREAK = 5 * 60;

export const STORAGE_KEYS = {
  TASKS: 'sp_tasks',
  NOTES: 'sp_notes',
  GOALS: 'sp_goals',
  STUDY_HOURS: 'sp_study_hours',
  POMODORO_SESSIONS: 'sp_pomodoro_sessions',
  POMODORO_HISTORY: 'sp_pomodoro_history',
  WEEKLY_PRODUCTIVITY: 'sp_weekly_productivity',
  STREAK: 'sp_streak',
  LAST_ACTIVE_DATE: 'sp_last_active_date',
  SETTINGS: 'sp_settings',
  THEME: 'sp_theme',
};

export const DEFAULT_SETTINGS = {
  userName: 'Student',
  notifications: true,
  soundEnabled: true,
  focusDuration: 25,
  breakDuration: 5,
  dailyStudyGoal: 4,
};

/** Fallback quotes when API is unavailable */
export const FALLBACK_QUOTES = [
  { content: 'The secret of getting ahead is getting started.', author: 'Mark Twain' },
  { content: 'Success is the sum of small efforts repeated day in and day out.', author: 'Robert Collier' },
  { content: 'Don\'t watch the clock; do what it does. Keep going.', author: 'Sam Levenson' },
  { content: 'The future depends on what you do today.', author: 'Mahatma Gandhi' },
  { content: 'It always seems impossible until it\'s done.', author: 'Nelson Mandela' },
];
