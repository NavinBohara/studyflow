import { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { useAppData } from '../../context/AppDataContext';
import GlassCard from '../ui/GlassCard';
import Button from '../ui/Button';
import ProgressBar from '../ui/ProgressBar';
import SectionHeader from '../ui/SectionHeader';

const inputClass =
  'flex-1 rounded-md border border-slate-300 bg-white px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 dark:border-slate-600 dark:bg-slate-800 dark:text-white';

export default function GoalsTracker() {
  const { goals, addGoal, toggleGoal, deleteGoal, goalProgress, completedGoals, streak } =
    useAppData();
  const [newGoal, setNewGoal] = useState('');

  const handleAdd = (e) => {
    e.preventDefault();
    if (!newGoal.trim()) return;
    addGoal(newGoal);
    setNewGoal('');
  };

  return (
    <div className="space-y-6">
      <SectionHeader title="Daily goals" description={`${goalProgress}% complete · ${streak} day streak`} />

      <div className="grid gap-3 sm:grid-cols-3 text-sm">
        <GlassCard hover={false}>
          <p className="text-slate-500">Progress</p>
          <p className="text-xl font-semibold">{goalProgress}%</p>
        </GlassCard>
        <GlassCard hover={false}>
          <p className="text-slate-500">Completed</p>
          <p className="text-xl font-semibold">{completedGoals}</p>
        </GlassCard>
        <GlassCard hover={false}>
          <p className="text-slate-500">Streak</p>
          <p className="text-xl font-semibold">{streak} days</p>
        </GlassCard>
      </div>

      <GlassCard hover={false}>
        <ProgressBar value={goalProgress} className="mb-4" />
        <form onSubmit={handleAdd} className="flex gap-2">
          <input
            type="text"
            value={newGoal}
            onChange={(e) => setNewGoal(e.target.value)}
            placeholder="Add a goal..."
            className={inputClass}
          />
          <Button type="submit" icon={Plus}>
            Add
          </Button>
        </form>
      </GlassCard>

      <div className="space-y-2">
        {goals.length === 0 ? (
          <p className="text-sm text-slate-500">No goals yet.</p>
        ) : (
          goals.map((goal) => (
            <GlassCard key={goal.id} className="flex items-center gap-3" hover={false}>
              <input
                type="checkbox"
                checked={goal.completed}
                onChange={() => toggleGoal(goal.id)}
                className="h-4 w-4 rounded accent-brand-600"
              />
              <span
                className={`flex-1 text-sm ${
                  goal.completed ? 'line-through text-slate-400' : ''
                }`}
              >
                {goal.title}
              </span>
              <Button variant="ghost" size="sm" icon={Trash2} onClick={() => deleteGoal(goal.id)} />
            </GlassCard>
          ))
        )}
      </div>
    </div>
  );
}
