import { createContext, useContext, useCallback } from 'react';
import toast from 'react-hot-toast';
import { useLocalStorage } from '../hooks/useLocalStorage';
import {
  STORAGE_KEYS,
  DEFAULT_SETTINGS,
  PRIORITIES,
} from '../utils/constants';
import {
  generateId,
  getTodayKey,
  getWeeklyProductivity,
  getStudyHoursHistory,
} from '../utils/storage';
import { downloadDataExport, importDataFromJson, readJsonFile } from '../utils/exportData';

const AppDataContext = createContext(null);

export function AppDataProvider({ children }) {
  const [tasks, setTasks] = useLocalStorage(STORAGE_KEYS.TASKS, []);
  const [notes, setNotes] = useLocalStorage(STORAGE_KEYS.NOTES, []);
  const [goals, setGoals] = useLocalStorage(STORAGE_KEYS.GOALS, []);
  const [studyHours, setStudyHours] = useLocalStorage(STORAGE_KEYS.STUDY_HOURS, {});
  const [pomodoroSessions, setPomodoroSessions] = useLocalStorage(
    STORAGE_KEYS.POMODORO_SESSIONS,
    0
  );
  const [pomodoroHistory, setPomodoroHistory] = useLocalStorage(
    STORAGE_KEYS.POMODORO_HISTORY,
    []
  );
  const [weeklyProductivity, setWeeklyProductivity] = useLocalStorage(
    STORAGE_KEYS.WEEKLY_PRODUCTIVITY,
    null
  );
  const [streak, setStreak] = useLocalStorage(STORAGE_KEYS.STREAK, 0);
  const [lastActiveDate, setLastActiveDate] = useLocalStorage(
    STORAGE_KEYS.LAST_ACTIVE_DATE,
    null
  );
  const [settings, setSettings] = useLocalStorage(
    STORAGE_KEYS.SETTINGS,
    DEFAULT_SETTINGS
  );

  const mergedSettings = { ...DEFAULT_SETTINGS, ...settings };
  const weekly = getWeeklyProductivity(weeklyProductivity);
  const studyHistory = getStudyHoursHistory(studyHours);
  const dailyStudyGoal = mergedSettings.dailyStudyGoal || 4;
  const focusMinutes = mergedSettings.focusDuration || 25;

  const updateStreak = useCallback(() => {
    const today = getTodayKey();
    if (lastActiveDate === today) return;

    if (lastActiveDate) {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayKey = yesterday.toISOString().split('T')[0];
      if (lastActiveDate === yesterdayKey) {
        setStreak((s) => s + 1);
      } else {
        setStreak(1);
      }
    } else {
      setStreak(1);
    }
    setLastActiveDate(today);
  }, [lastActiveDate, setLastActiveDate, setStreak]);

  const addTask = (title, priority = PRIORITIES.MEDIUM, dueDate = null) => {
    const task = {
      id: generateId(),
      title: title.trim(),
      priority,
      dueDate: dueDate || null,
      completed: false,
      createdAt: new Date().toISOString(),
    };
    setTasks((prev) => [task, ...prev]);
    updateStreak();
    toast.success('Task added');
    return task;
  };

  const updateTask = (id, updates, silent = false) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, ...updates } : t))
    );
    if (!silent) toast.success('Task updated');
  };

  const deleteTask = (id) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
    toast.success('Task deleted');
  };

  const toggleTask = (id) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id !== id) return t;
        const completed = !t.completed;
        if (completed) updateWeeklyOnComplete();
        return {
          ...t,
          completed,
          completedAt: completed ? new Date().toISOString() : null,
        };
      })
    );
    updateStreak();
  };

  const updateWeeklyOnComplete = () => {
    const dayIndex = new Date().getDay();
    const idx = dayIndex === 0 ? 6 : dayIndex - 1;
    setWeeklyProductivity((prev) => {
      const data = getWeeklyProductivity(prev);
      return data.map((d, i) =>
        i === idx ? { ...d, tasks: d.tasks + 1 } : d
      );
    });
  };

  const addStudyMinutes = (minutes) => {
    const today = getTodayKey();
    const hours = minutes / 60;
    setStudyHours((prev) => {
      const history = { ...(prev || {}) };
      history[today] = +((history[today] || 0) + hours).toFixed(1);
      return history;
    });
    const dayIndex = new Date().getDay();
    const idx = dayIndex === 0 ? 6 : dayIndex - 1;
    setWeeklyProductivity((prev) => {
      const data = getWeeklyProductivity(prev);
      return data.map((d, i) =>
        i === idx ? { ...d, hours: +(d.hours + hours).toFixed(1) } : d
      );
    });
  };

  const logStudyMinutes = (minutes) => {
    addStudyMinutes(minutes);
    toast.success(`Logged ${minutes} min of study`);
  };

  const addNote = (title, content) => {
    const note = {
      id: generateId(),
      title: title.trim() || 'Untitled',
      content,
      updatedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    };
    setNotes((prev) => [note, ...prev]);
    toast.success('Note created');
    return note;
  };

  const updateNote = (id, updates) => {
    setNotes((prev) =>
      prev.map((n) =>
        n.id === id
          ? { ...n, ...updates, updatedAt: new Date().toISOString() }
          : n
      )
    );
  };

  const deleteNote = (id) => {
    setNotes((prev) => prev.filter((n) => n.id !== id));
    toast.success('Note deleted');
  };

  const addGoal = (title) => {
    const goal = {
      id: generateId(),
      title: title.trim(),
      completed: false,
      createdAt: new Date().toISOString(),
    };
    setGoals((prev) => [...prev, goal]);
    updateStreak();
    toast.success('Goal added');
    return goal;
  };

  const toggleGoal = (id) => {
    setGoals((prev) =>
      prev.map((g) => (g.id === id ? { ...g, completed: !g.completed } : g))
    );
    updateStreak();
  };

  const deleteGoal = (id) => {
    setGoals((prev) => prev.filter((g) => g.id !== id));
    toast.success('Goal removed');
  };

  const incrementPomodoro = () => {
    const entry = {
      id: generateId(),
      completedAt: new Date().toISOString(),
      durationMinutes: focusMinutes,
      type: 'focus',
    };
    setPomodoroHistory((prev) => [entry, ...prev].slice(0, 100));
    setPomodoroSessions((s) => s + 1);
    addStudyMinutes(focusMinutes);
    updateStreak();
  };

  const clearPomodoroHistory = () => {
    setPomodoroHistory([]);
    toast.success('Pomodoro history cleared');
  };

  const updateSettings = (updates) => {
    setSettings((prev) => ({ ...prev, ...updates }));
    toast.success('Settings saved');
  };

  const exportData = () => {
    downloadDataExport();
    toast.success('Backup downloaded');
  };

  const importData = async (file) => {
    try {
      const parsed = await readJsonFile(file);
      const error = importDataFromJson(parsed);
      if (error) {
        toast.error(error);
        return;
      }
      toast.success('Data imported. Reloading...');
      setTimeout(() => window.location.reload(), 800);
    } catch (err) {
      toast.error(err.message || 'Import failed');
    }
  };

  const completedTasks = tasks.filter((t) => t.completed).length;
  const pendingTasks = tasks.filter((t) => !t.completed).length;
  const overdueTasks = tasks.filter(
    (t) => t.dueDate && !t.completed && t.dueDate < getTodayKey()
  ).length;
  const todayStudyHours = studyHistory[getTodayKey()] || 0;
  const studyGoalProgress = dailyStudyGoal
    ? Math.min(100, Math.round((todayStudyHours / dailyStudyGoal) * 100))
    : 0;
  const completedGoals = goals.filter((g) => g.completed).length;
  const goalProgress = goals.length
    ? Math.round((completedGoals / goals.length) * 100)
    : 0;

  const value = {
    tasks,
    notes,
    goals,
    settings: mergedSettings,
    studyHistory,
    weekly,
    streak,
    pomodoroSessions,
    pomodoroHistory,
    completedTasks,
    pendingTasks,
    overdueTasks,
    todayStudyHours,
    dailyStudyGoal,
    studyGoalProgress,
    completedGoals,
    goalProgress,
    addTask,
    updateTask,
    deleteTask,
    toggleTask,
    addNote,
    updateNote,
    deleteNote,
    addGoal,
    toggleGoal,
    deleteGoal,
    incrementPomodoro,
    clearPomodoroHistory,
    updateSettings,
    logStudyMinutes,
    exportData,
    importData,
    setSettings,
  };

  return (
    <AppDataContext.Provider value={value}>{children}</AppDataContext.Provider>
  );
}

export function useAppData() {
  const ctx = useContext(AppDataContext);
  if (!ctx) throw new Error('useAppData must be used within AppDataProvider');
  return ctx;
}
