import { useRef } from 'react';
import { Download, Upload } from 'lucide-react';
import { useAppData } from '../../context/AppDataContext';
import { useTheme } from '../../context/ThemeContext';
import GlassCard from '../ui/GlassCard';
import Button from '../ui/Button';
import SectionHeader from '../ui/SectionHeader';

const inputClass =
  'w-full max-w-md rounded-md border border-slate-300 bg-white px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 dark:border-slate-600 dark:bg-slate-800 dark:text-white';

export default function SettingsPanel() {
  const { settings, updateSettings, exportData, importData } = useAppData();
  const { theme, setTheme } = useTheme();
  const fileInputRef = useRef(null);

  const handleImport = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (
      !confirm(
        'Import will replace all current data with the backup. Continue?'
      )
    ) {
      e.target.value = '';
      return;
    }
    importData(file);
    e.target.value = '';
  };

  return (
    <div className="space-y-6">
      <SectionHeader title="Settings" description="Customize your experience" />

      <GlassCard hover={false}>
        <h3 className="mb-3 text-sm font-medium">Profile</h3>
        <label className="mb-1 block text-sm text-slate-600 dark:text-slate-400">Name</label>
        <input
          type="text"
          value={settings.userName}
          onChange={(e) => updateSettings({ userName: e.target.value })}
          className={inputClass}
        />
      </GlassCard>

      <GlassCard hover={false}>
        <h3 className="mb-3 text-sm font-medium">Theme</h3>
        <div className="flex gap-2">
          {['light', 'dark'].map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setTheme(t)}
              className={`rounded-md px-4 py-2 text-sm capitalize ${
                theme === t
                  ? 'bg-brand-600 text-white'
                  : 'border border-slate-300 dark:border-slate-600'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </GlassCard>

      <GlassCard hover={false}>
        <h3 className="mb-3 text-sm font-medium">Study goal</h3>
        <label className="mb-1 block text-sm text-slate-600 dark:text-slate-400">
          Daily study target (hours)
        </label>
        <input
          type="number"
          min={1}
          max={16}
          step={0.5}
          value={settings.dailyStudyGoal ?? 4}
          onChange={(e) =>
            updateSettings({ dailyStudyGoal: Math.max(1, Number(e.target.value) || 4) })
          }
          className={inputClass}
        />
      </GlassCard>

      <GlassCard hover={false}>
        <h3 className="mb-3 text-sm font-medium">Preferences</h3>
        <div className="space-y-3 text-sm">
          <label className="flex items-center justify-between">
            <span>Notifications</span>
            <input
              type="checkbox"
              checked={settings.notifications}
              onChange={(e) => updateSettings({ notifications: e.target.checked })}
              className="h-4 w-4 accent-brand-600"
            />
          </label>
          <label className="flex items-center justify-between">
            <span>Timer sound</span>
            <input
              type="checkbox"
              checked={settings.soundEnabled}
              onChange={(e) => updateSettings({ soundEnabled: e.target.checked })}
              className="h-4 w-4 accent-brand-600"
            />
          </label>
        </div>
      </GlassCard>

      <GlassCard hover={false}>
        <h3 className="mb-3 text-sm font-medium">Backup & restore</h3>
        <p className="mb-4 text-sm text-slate-600 dark:text-slate-400">
          Export all tasks, notes, goals, Pomodoro history, and settings as a JSON file.
          Import a previous backup to restore your data.
        </p>
        <div className="flex flex-wrap gap-3">
          <Button variant="secondary" icon={Download} onClick={exportData}>
            Export data
          </Button>
          <Button
            variant="secondary"
            icon={Upload}
            onClick={() => fileInputRef.current?.click()}
          >
            Import data
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".json,application/json"
            className="hidden"
            onChange={handleImport}
          />
        </div>
      </GlassCard>

      <GlassCard hover={false}>
        <p className="mb-3 text-sm text-slate-600 dark:text-slate-400">
          Clear all saved data from this browser.
        </p>
        <Button
          variant="danger"
          onClick={() => {
            if (confirm('Clear all data? This cannot be undone.')) {
              localStorage.clear();
              window.location.reload();
            }
          }}
        >
          Reset data
        </Button>
      </GlassCard>
    </div>
  );
}
