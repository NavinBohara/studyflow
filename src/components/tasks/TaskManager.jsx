import { useState } from 'react';
import { Plus, Pencil, Trash2, Check, Calendar } from 'lucide-react';
import { useAppData } from '../../context/AppDataContext';
import { PRIORITIES, PRIORITY_LABELS, TASK_FILTERS } from '../../utils/constants';
import {
  formatDueDate,
  isOverdue,
  isDueToday,
  sortTasksByDue,
} from '../../utils/dateHelpers';
import GlassCard from '../ui/GlassCard';
import Button from '../ui/Button';
import SectionHeader from '../ui/SectionHeader';

const inputClass =
  'w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 dark:border-slate-600 dark:bg-slate-800 dark:text-white';

const priorityStyles = {
  high: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  medium: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
  low: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
};

export default function TaskManager() {
  const { tasks, addTask, updateTask, deleteTask, toggleTask, overdueTasks } = useAppData();
  const [title, setTitle] = useState('');
  const [priority, setPriority] = useState(PRIORITIES.MEDIUM);
  const [dueDate, setDueDate] = useState('');
  const [filter, setFilter] = useState('all');
  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDueDate, setEditDueDate] = useState('');

  const filteredTasks = sortTasksByDue(
    tasks.filter((t) => {
      if (filter === 'completed') return t.completed;
      if (filter === 'pending') return !t.completed;
      if (filter === 'overdue') return isOverdue(t.dueDate, t.completed);
      return true;
    })
  );

  const handleAdd = (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    addTask(title, priority, dueDate || null);
    setTitle('');
    setDueDate('');
  };

  const startEdit = (task) => {
    setEditingId(task.id);
    setEditTitle(task.title);
    setEditDueDate(task.dueDate || '');
  };

  const saveEdit = (id) => {
    if (!editTitle.trim()) return;
    updateTask(id, {
      title: editTitle.trim(),
      dueDate: editDueDate || null,
    });
    setEditingId(null);
  };

  return (
    <div className="space-y-6">
      <SectionHeader
        title="Tasks"
        description={
          overdueTasks > 0
            ? `${overdueTasks} overdue task${overdueTasks > 1 ? 's' : ''}`
            : 'Add and manage your to-do list'
        }
      />

      <GlassCard hover={false}>
        <form onSubmit={handleAdd} className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <div className="sm:col-span-2">
            <label className="mb-1 block text-sm text-slate-600 dark:text-slate-400">
              Task
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="What needs to be done?"
              className={inputClass}
            />
          </div>
          <div>
            <label className="mb-1 block text-sm text-slate-600 dark:text-slate-400">
              Priority
            </label>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              className={inputClass}
            >
              {Object.entries(PRIORITY_LABELS).map(([k, v]) => (
                <option key={k} value={k}>
                  {v}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1 block text-sm text-slate-600 dark:text-slate-400">
              Due date
            </label>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className={inputClass}
            />
          </div>
          <div className="sm:col-span-2 lg:col-span-4">
            <Button type="submit" icon={Plus}>
              Add task
            </Button>
          </div>
        </form>
      </GlassCard>

      <div className="flex flex-wrap gap-2">
        {TASK_FILTERS.map((f) => (
          <button
            key={f}
            type="button"
            onClick={() => setFilter(f)}
            className={`rounded-md px-3 py-1.5 text-sm capitalize ${
              filter === f
                ? 'bg-brand-600 text-white'
                : 'border border-slate-300 text-slate-600 dark:border-slate-600 dark:text-slate-300'
            }`}
          >
            {f}
            {f === 'overdue' && overdueTasks > 0 && ` (${overdueTasks})`}
          </button>
        ))}
      </div>

      <div className="space-y-2">
        {filteredTasks.length === 0 ? (
          <p className="text-sm text-slate-500">No tasks in this view.</p>
        ) : (
          filteredTasks.map((task) => {
            const overdue = isOverdue(task.dueDate, task.completed);
            const dueToday = isDueToday(task.dueDate, task.completed);

            return (
              <GlassCard
                key={task.id}
                className={`flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between ${
                  task.completed ? 'opacity-60' : ''
                }`}
                hover={false}
              >
                <div className="flex flex-1 flex-col gap-2 sm:flex-row sm:items-center">
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => toggleTask(task.id)}
                      className={`flex h-5 w-5 shrink-0 items-center justify-center rounded border ${
                        task.completed
                          ? 'border-brand-600 bg-brand-600 text-white'
                          : 'border-slate-300 dark:border-slate-600'
                      }`}
                    >
                      {task.completed && <Check className="h-3 w-3" />}
                    </button>

                    {editingId === task.id ? (
                      <div className="flex flex-1 flex-col gap-2 sm:flex-row">
                        <input
                          type="text"
                          value={editTitle}
                          onChange={(e) => setEditTitle(e.target.value)}
                          className={inputClass}
                          autoFocus
                        />
                        <input
                          type="date"
                          value={editDueDate}
                          onChange={(e) => setEditDueDate(e.target.value)}
                          className={inputClass}
                        />
                        <Button size="sm" onClick={() => saveEdit(task.id)}>
                          Save
                        </Button>
                      </div>
                    ) : (
                      <span
                        className={`text-sm ${
                          task.completed ? 'line-through text-slate-400' : ''
                        } ${overdue ? 'text-red-600 dark:text-red-400' : ''}`}
                      >
                        {task.title}
                      </span>
                    )}
                  </div>

                  {editingId !== task.id && (
                    <div className="flex flex-wrap items-center gap-2 pl-8 sm:pl-0">
                      <span
                        className={`rounded px-2 py-0.5 text-xs ${priorityStyles[task.priority]}`}
                      >
                        {PRIORITY_LABELS[task.priority]}
                      </span>
                      {task.dueDate && (
                        <span
                          className={`flex items-center gap-1 text-xs ${
                            overdue
                              ? 'font-medium text-red-600 dark:text-red-400'
                              : dueToday
                                ? 'text-brand-600 dark:text-brand-400'
                                : 'text-slate-500'
                          }`}
                        >
                          <Calendar className="h-3 w-3" />
                          {formatDueDate(task.dueDate)}
                          {overdue && ' · Overdue'}
                          {dueToday && ' · Today'}
                        </span>
                      )}
                    </div>
                  )}
                </div>

                {editingId !== task.id && (
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm" icon={Pencil} onClick={() => startEdit(task)} />
                    <Button variant="danger" size="sm" icon={Trash2} onClick={() => deleteTask(task.id)} />
                  </div>
                )}
              </GlassCard>
            );
          })
        )}
      </div>
    </div>
  );
}
