/**
 * Safe localStorage helpers with JSON parse/stringify
 */
export function getStorageItem(key, fallback = null) {
  try {
    const raw = localStorage.getItem(key);
    if (raw === null) return fallback;
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}

export function setStorageItem(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch {
    return false;
  }
}

export function generateId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

/** Returns today's date as YYYY-MM-DD */
export function getTodayKey() {
  return new Date().toISOString().split('T')[0];
}

/** Weekly chart data — only real stored values, no fake demo data */
export function getWeeklyProductivity(stored) {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  if (stored && stored.length === 7) return stored;
  return days.map((day) => ({ day, tasks: 0, hours: 0 }));
}

/** Study hours by date — only real stored values, no fake demo data */
export function getStudyHoursHistory(stored) {
  if (!stored || typeof stored !== 'object') return {};
  return stored;
}
