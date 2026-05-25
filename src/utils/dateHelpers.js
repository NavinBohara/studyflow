/** Format YYYY-MM-DD for display */
export function formatDueDate(dateStr) {
  if (!dateStr) return null;
  const d = new Date(`${dateStr}T12:00:00`);
  return d.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export function isOverdue(dueDate, completed) {
  if (!dueDate || completed) return false;
  const today = new Date().toISOString().split('T')[0];
  return dueDate < today;
}

export function isDueToday(dueDate, completed) {
  if (!dueDate || completed) return false;
  const today = new Date().toISOString().split('T')[0];
  return dueDate === today;
}

/** Sort: overdue first, then by due date, no-date last */
export function sortTasksByDue(tasks) {
  const today = new Date().toISOString().split('T')[0];
  return [...tasks].sort((a, b) => {
    if (a.completed !== b.completed) return a.completed ? 1 : -1;
    const aOver = a.dueDate && !a.completed && a.dueDate < today;
    const bOver = b.dueDate && !b.completed && b.dueDate < today;
    if (aOver !== bOver) return aOver ? -1 : 1;
    if (a.dueDate && b.dueDate) return a.dueDate.localeCompare(b.dueDate);
    if (a.dueDate) return -1;
    if (b.dueDate) return 1;
    return 0;
  });
}
