import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { useAppData } from '../../context/AppDataContext';
import GlassCard from '../ui/GlassCard';
import StatCard from '../ui/StatCard';
import { CheckCircle2, Clock, BarChart3, Target } from 'lucide-react';
import SectionHeader from '../ui/SectionHeader';

const PIE_COLORS = ['#4f46e5', '#94a3b8'];

export default function AnalyticsDashboard() {
  const {
    completedTasks,
    pendingTasks,
    weekly,
    studyHistory,
    todayStudyHours,
    goalProgress,
    pomodoroSessions,
  } = useAppData();

  const taskPieData = [
    { name: 'Completed', value: completedTasks || 0 },
    { name: 'Pending', value: pendingTasks || 0 },
  ];

  const weeklyBarData = weekly.map((d) => ({
    day: d.day,
    tasks: d.tasks,
  }));

  const studyLineData = Object.entries(studyHistory)
    .sort(([a], [b]) => a.localeCompare(b))
    .slice(-7)
    .map(([date, hours]) => ({
      date: new Date(date).toLocaleDateString('en-US', { weekday: 'short' }),
      hours,
    }));

  return (
    <div className="space-y-6">
      <SectionHeader title="Analytics" description="Your productivity overview" />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={CheckCircle2} label="Completed" value={completedTasks} />
        <StatCard icon={Clock} label="Study today" value={`${todayStudyHours}h`} />
        <StatCard icon={BarChart3} label="Pomodoro" value={pomodoroSessions} />
        <StatCard icon={Target} label="Goals" value={`${goalProgress}%`} />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <GlassCard hover={false}>
          <h3 className="mb-3 text-sm font-medium text-slate-700 dark:text-slate-300">
            Tasks breakdown
          </h3>
          <ResponsiveContainer width="100%" height={240}>
            <PieChart>
              <Pie
                data={taskPieData}
                cx="50%"
                cy="50%"
                outerRadius={80}
                dataKey="value"
                label={({ name, value }) => `${name}: ${value}`}
              >
                {taskPieData.map((_, i) => (
                  <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </GlassCard>

        <GlassCard hover={false}>
          <h3 className="mb-3 text-sm font-medium text-slate-700 dark:text-slate-300">
            Weekly tasks
          </h3>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={weeklyBarData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="day" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Bar dataKey="tasks" fill="#4f46e5" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </GlassCard>

        <GlassCard className="lg:col-span-2" hover={false}>
          <h3 className="mb-3 text-sm font-medium text-slate-700 dark:text-slate-300">
            Study hours (7 days)
          </h3>
          <ResponsiveContainer width="100%" height={240}>
            <LineChart data={studyLineData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="date" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Line type="monotone" dataKey="hours" stroke="#4f46e5" strokeWidth={2} dot={{ r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </GlassCard>
      </div>
    </div>
  );
}
