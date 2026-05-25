import { useState, useMemo } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import { useAppData } from '../../context/AppDataContext';

export default function Layout({ activeSection, onNavigate, children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { tasks, notes, goals } = useAppData();

  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return null;
    const q = searchQuery.toLowerCase();
    return {
      tasks: tasks.filter((t) => t.title.toLowerCase().includes(q)),
      notes: notes.filter(
        (n) =>
          n.title.toLowerCase().includes(q) ||
          n.content.toLowerCase().includes(q)
      ),
      goals: goals.filter((g) => g.title.toLowerCase().includes(q)),
    };
  }, [searchQuery, tasks, notes, goals]);

  return (
    <div className="page-bg">
      <Sidebar
        activeSection={activeSection}
        onNavigate={onNavigate}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div className="lg:pl-64">
        <Header
          onMenuClick={() => setSidebarOpen(true)}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />

        {searchResults && (
          <div className="mx-4 mb-4 rounded-lg border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900 md:mx-6">
            <p className="mb-2 text-sm font-medium text-slate-700 dark:text-slate-200">
              Results for &quot;{searchQuery}&quot;
            </p>
            <div className="grid gap-3 text-sm text-slate-600 sm:grid-cols-3 dark:text-slate-400">
              <div>
                <p className="font-medium text-slate-800 dark:text-slate-200">
                  Tasks ({searchResults.tasks.length})
                </p>
                {searchResults.tasks.slice(0, 3).map((t) => (
                  <p key={t.id} className="truncate">
                    {t.title}
                  </p>
                ))}
              </div>
              <div>
                <p className="font-medium text-slate-800 dark:text-slate-200">
                  Notes ({searchResults.notes.length})
                </p>
                {searchResults.notes.slice(0, 3).map((n) => (
                  <p key={n.id} className="truncate">
                    {n.title}
                  </p>
                ))}
              </div>
              <div>
                <p className="font-medium text-slate-800 dark:text-slate-200">
                  Goals ({searchResults.goals.length})
                </p>
                {searchResults.goals.slice(0, 3).map((g) => (
                  <p key={g.id} className="truncate">
                    {g.title}
                  </p>
                ))}
              </div>
            </div>
          </div>
        )}

        <main className="p-4 md:p-6">{children}</main>
      </div>
    </div>
  );
}
