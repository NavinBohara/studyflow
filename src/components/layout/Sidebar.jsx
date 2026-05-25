import {
  LayoutDashboard,
  CheckSquare,
  Timer,
  StickyNote,
  Target,
  BarChart3,
  Settings,
  X,
} from 'lucide-react';
import { NAV_ITEMS } from '../../utils/constants';

const iconMap = {
  LayoutDashboard,
  CheckSquare,
  Timer,
  StickyNote,
  Target,
  BarChart3,
  Settings,
};

export default function Sidebar({ activeSection, onNavigate, isOpen, onClose }) {
  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <aside
        className={`fixed left-0 top-0 z-50 flex h-full w-64 flex-col border-r border-slate-200 bg-white transition-transform dark:border-slate-800 dark:bg-slate-900 lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between border-b border-slate-200 px-4 py-4 dark:border-slate-800">
          <h1 className="text-lg font-semibold text-slate-900 dark:text-white">StudyFlow</h1>
          <button
            type="button"
            onClick={onClose}
            className="p-1 text-slate-500 hover:text-slate-700 lg:hidden dark:hover:text-slate-300"
            aria-label="Close menu"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex-1 space-y-0.5 p-3">
          {NAV_ITEMS.map((item) => {
            const Icon = iconMap[item.icon];
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  onNavigate(item.id);
                  onClose();
                }}
                className={`flex w-full items-center gap-3 rounded-md px-3 py-2 text-left text-sm ${
                  isActive
                    ? 'bg-brand-600 text-white'
                    : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'
                }`}
              >
                <Icon className="h-4 w-4 shrink-0" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </aside>
    </>
  );
}
