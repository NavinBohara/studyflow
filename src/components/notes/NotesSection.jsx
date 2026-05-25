import { useState, useEffect, useRef } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { useAppData } from '../../context/AppDataContext';
import GlassCard from '../ui/GlassCard';
import Button from '../ui/Button';
import SectionHeader from '../ui/SectionHeader';

const inputClass =
  'w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 dark:border-slate-600 dark:bg-slate-800 dark:text-white';

export default function NotesSection() {
  const { notes, addNote, updateNote, deleteNote } = useAppData();
  const [selectedId, setSelectedId] = useState(notes[0]?.id ?? null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const saveTimeout = useRef(null);

  const selectedNote = notes.find((n) => n.id === selectedId);

  useEffect(() => {
    if (selectedNote) {
      setTitle(selectedNote.title);
      setContent(selectedNote.content);
    }
  }, [selectedId, selectedNote?.title, selectedNote?.content]);

  const handleCreate = () => {
    const note = addNote('New Note', '');
    setSelectedId(note.id);
    setTitle(note.title);
    setContent('');
  };

  const autoSave = (id, updates) => {
    if (saveTimeout.current) clearTimeout(saveTimeout.current);
    saveTimeout.current = setTimeout(() => updateNote(id, updates), 500);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <SectionHeader title="Notes" description="Auto-saved locally" />
        <Button icon={Plus} onClick={handleCreate}>
          New
        </Button>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="space-y-2 lg:col-span-1">
          {notes.length === 0 ? (
            <p className="text-sm text-slate-500">No notes yet.</p>
          ) : (
            notes.map((note) => (
              <button
                key={note.id}
                type="button"
                onClick={() => setSelectedId(note.id)}
                className={`w-full rounded-md border px-3 py-2 text-left text-sm transition-colors ${
                  selectedId === note.id
                    ? 'border-brand-600 bg-brand-50 dark:bg-brand-900/20'
                    : 'border-slate-200 bg-white hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:hover:bg-slate-800'
                }`}
              >
                <p className="font-medium truncate">{note.title}</p>
                <p className="mt-0.5 truncate text-slate-500">{note.content || 'Empty'}</p>
              </button>
            ))
          )}
        </div>

        <GlassCard className="lg:col-span-2 min-h-[360px]" hover={false}>
          {selectedId && selectedNote ? (
            <>
              <div className="mb-3 flex items-center justify-between gap-2">
                <input
                  type="text"
                  value={title}
                  onChange={(e) => {
                    setTitle(e.target.value);
                    autoSave(selectedId, { title: e.target.value });
                  }}
                  className={`${inputClass} font-medium`}
                  placeholder="Title"
                />
                <Button
                  variant="danger"
                  size="sm"
                  icon={Trash2}
                  onClick={() => {
                    deleteNote(selectedId);
                    const next = notes.find((n) => n.id !== selectedId);
                    setSelectedId(next?.id ?? null);
                  }}
                />
              </div>
              <textarea
                value={content}
                onChange={(e) => {
                  setContent(e.target.value);
                  autoSave(selectedId, { content: e.target.value });
                }}
                placeholder="Write your note..."
                className={`${inputClass} min-h-[280px] resize-y`}
              />
            </>
          ) : (
            <p className="py-20 text-center text-sm text-slate-500">
              Select or create a note
            </p>
          )}
        </GlassCard>
      </div>
    </div>
  );
}
