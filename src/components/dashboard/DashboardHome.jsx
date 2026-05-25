import {
  CheckCircle2,
  Clock,
  ListTodo,
  Plus,
  RefreshCw,
  TrendingUp,
} from 'lucide-react';
import { useAppData } from '../../context/AppDataContext';
import { useQuote } from '../../hooks/useQuote';
import GlassCard from '../ui/GlassCard';
import StatCard from '../ui/StatCard';
import ProgressBar from '../ui/ProgressBar';
import LoadingSpinner from '../ui/LoadingSpinner';
import Button from '../ui/Button';

export default function DashboardHome() {
  const {
    settings,
    completedTasks,
    pendingTasks,
    todayStudyHours,
    dailyStudyGoal,
    studyGoalProgress,
    streak,
    goalProgress,
    tasks,
    pomodoroSessions,
    logStudyMinutes,
  } = useAppData();
  const { quote, loading, refreshQuote } = useQuote();

  const totalTasks = tasks.length;
  const completionRate = totalTasks
    ? Math.round((completedTasks / totalTasks) * 100)
    : 0;

  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
          {greeting}, {settings.userName}
        </h2>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
          {completedTasks} tasks done · {pendingTasks} pending · {streak} day streak
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          icon={CheckCircle2}
          label="Completed"
          value={completedTasks}
          subtext={`${completionRate}% of total`}
        />
        <StatCard icon={ListTodo} label="Pending" value={pendingTasks} />
        <StatCard
          icon={Clock}
          label="Study today"
          value={`${todayStudyHours}h`}
          subtext={`Goal: ${dailyStudyGoal}h`}
        />
        <StatCard icon={TrendingUp} label="Pomodoro" value={pomodoroSessions} />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <GlassCard hover={false}>
          <h3 className="mb-4 text-sm font-medium text-slate-700 dark:text-slate-300">
            Today&apos;s progress
          </h3>
          <div className="space-y-4">
            <div>
              <div className="mb-1 flex justify-between text-sm">
                <span>Tasks</span>
                <span>{completionRate}%</span>
              </div>
              <ProgressBar value={completionRate} />
            </div>
            <div>
              <div className="mb-1 flex justify-between text-sm">
                <span>Goals</span>
                <span>{goalProgress}%</span>
              </div>
              <ProgressBar value={goalProgress} />
            </div>
            <div>
              <div className="mb-1 flex justify-between text-sm">
                <span>
                  Study ({todayStudyHours}h / {dailyStudyGoal}h)
                </span>
                <span>{studyGoalProgress}%</span>
              </div>
              <ProgressBar
                value={Math.min(todayStudyHours, dailyStudyGoal)}
                max={dailyStudyGoal}
              />
              <p className="mt-1 text-xs text-slate-500">
                Counts completed Pomodoro sessions (25 min each). Use log below for other study.
              </p>
              <div className="mt-2 flex flex-wrap gap-2">
                <Button
                  variant="secondary"
                  size="sm"
                  icon={Plus}
                  onClick={() => logStudyMinutes(30)}
                >
                  +30 min
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => logStudyMinutes(60)}
                >
                  +1 hour
                </Button>
              </div>
            </div>
          </div>
        </GlassCard>

        <GlassCard hover={false}>
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-sm font-medium text-slate-700 dark:text-slate-300">
              Quote of the day
            </h3>
            <button
              type="button"
              onClick={refreshQuote}
              className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              aria-label="Refresh quote"
            >
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>
          {loading ? (
            <div className="flex justify-center py-8">
              <LoadingSpinner />
            </div>
          ) : (
            <>
              <p className="text-sm text-slate-700 dark:text-slate-200">
                &ldquo;{quote.content}&rdquo;
              </p>
              <p className="mt-2 text-xs text-slate-500">— {quote.author}</p>
            </>
          )}
        </GlassCard>
      </div>
    </div>
  );
}
