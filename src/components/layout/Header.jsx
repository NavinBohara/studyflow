import { Menu, Moon, Sun } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useDateTime } from '../../hooks/useDateTime';
import SearchBar from '../ui/SearchBar';

export default function Header({ onMenuClick, searchQuery, onSearchChange }) {
  const { isDark, toggleTheme } = useTheme();
  const { dateStr, timeStr } = useDateTime();

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white px-4 py-3 dark:border-slate-800 dark:bg-slate-900 md:px-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onMenuClick}
            className="p-2 text-slate-600 lg:hidden dark:text-slate-300"
            aria-label="Open menu"
          >
            <Menu className="h-5 w-5" />
          </button>
          <div className="text-sm text-slate-600 dark:text-slate-400">
            <span className="font-medium text-slate-900 dark:text-white">{timeStr}</span>
            <span className="mx-2">·</span>
            <span>{dateStr}</span>
          </div>
        </div>

        <SearchBar
          value={searchQuery}
          onChange={onSearchChange}
          placeholder="Search..."
          className="w-full sm:max-w-xs"
        />

        <button
          type="button"
          onClick={toggleTheme}
          className="self-end rounded-md border border-slate-300 p-2 text-slate-600 sm:self-auto dark:border-slate-600 dark:text-slate-300"
          aria-label="Toggle theme"
        >
          {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </button>
      </div>
    </header>
  );
}
