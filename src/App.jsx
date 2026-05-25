import { useState, useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import { ThemeProvider } from './context/ThemeContext';
import { AppDataProvider } from './context/AppDataContext';
import Layout from './components/layout/Layout';
import DashboardHome from './components/dashboard/DashboardHome';
import TaskManager from './components/tasks/TaskManager';
import PomodoroTimer from './components/pomodoro/PomodoroTimer';
import NotesSection from './components/notes/NotesSection';
import GoalsTracker from './components/goals/GoalsTracker';
import AnalyticsDashboard from './components/analytics/AnalyticsDashboard';
import SettingsPanel from './components/settings/SettingsPanel';
import LoadingSpinner from './components/ui/LoadingSpinner';

const SECTIONS = {
  dashboard: DashboardHome,
  tasks: TaskManager,
  pomodoro: PomodoroTimer,
  notes: NotesSection,
  goals: GoalsTracker,
  analytics: AnalyticsDashboard,
  settings: SettingsPanel,
};

function AppContent() {
  const [activeSection, setActiveSection] = useState('dashboard');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 300);
    return () => clearTimeout(timer);
  }, []);

  const ActiveComponent = SECTIONS[activeSection] || DashboardHome;

  if (loading) {
    return (
      <div className="page-bg flex min-h-screen items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <Layout activeSection={activeSection} onNavigate={setActiveSection}>
      <ActiveComponent />
    </Layout>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AppDataProvider>
        <AppContent />
        <Toaster position="bottom-right" />
      </AppDataProvider>
    </ThemeProvider>
  );
}
