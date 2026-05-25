import { STORAGE_KEYS } from './constants';
import { getStorageItem, setStorageItem, getTodayKey } from './storage';

const EXPORT_VERSION = 1;

/** Collect all app data from localStorage for backup */
export function buildExportPayload() {
  const data = {};
  Object.entries(STORAGE_KEYS).forEach(([, key]) => {
    const value = getStorageItem(key);
    if (value !== null) data[key] = value;
  });
  return {
    version: EXPORT_VERSION,
    app: 'StudyFlow',
    exportedAt: new Date().toISOString(),
    data,
  };
}

/** Download JSON backup file */
export function downloadDataExport() {
  const payload = buildExportPayload();
  const blob = new Blob([JSON.stringify(payload, null, 2)], {
    type: 'application/json',
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `studyflow-backup-${getTodayKey()}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/** Restore data from imported JSON; returns error message or null on success */
export function importDataFromJson(parsed) {
  if (!parsed || typeof parsed !== 'object') {
    return 'Invalid file format.';
  }
  if (!parsed.data || typeof parsed.data !== 'object') {
    return 'Missing data in backup file.';
  }

  const allowedKeys = new Set(Object.values(STORAGE_KEYS));
  let count = 0;

  Object.entries(parsed.data).forEach(([key, value]) => {
    if (allowedKeys.has(key)) {
      setStorageItem(key, value);
      count += 1;
    }
  });

  if (count === 0) return 'No valid data found in file.';
  return null;
}

export function readJsonFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        resolve(JSON.parse(reader.result));
      } catch {
        reject(new Error('Could not parse JSON file.'));
      }
    };
    reader.onerror = () => reject(new Error('Could not read file.'));
    reader.readAsText(file);
  });
}
