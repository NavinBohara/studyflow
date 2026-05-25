import { useState, useEffect, useRef, useCallback } from 'react';
import { Play, Pause, RotateCcw, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAppData } from '../../context/AppDataContext';
import { POMODORO_FOCUS, POMODORO_BREAK } from '../../utils/constants';
import GlassCard from '../ui/GlassCard';
import Button from '../ui/Button';
import SectionHeader from '../ui/SectionHeader';

function playNotificationSound() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.frequency.value = 880;
    gain.gain.setValueAtTime(0.2, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.3);
  } catch {
    /* audio unavailable */
  }
}

function formatSessionTime(iso) {
  return new Date(iso).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

export default function PomodoroTimer() {
  const {
    pomodoroSessions,
    pomodoroHistory,
    incrementPomodoro,
    clearPomodoroHistory,
    settings,
  } = useAppData();

  const [mode, setMode] = useState('focus');
  const [secondsLeft, setSecondsLeft] = useState(POMODORO_FOCUS);
  const [isRunning, setIsRunning] = useState(false);

  const totalSeconds = mode === 'focus' ? POMODORO_FOCUS : POMODORO_BREAK;
  const progress = ((totalSeconds - secondsLeft) / totalSeconds) * 100;
  const circumference = 2 * Math.PI * 100;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  const intervalRef = useRef(null);

  const formatTime = (s) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
  };

  const handleTimerEnd = useCallback(() => {
    setIsRunning(false);
    if (settings.soundEnabled) playNotificationSound();

    if (mode === 'focus') {
      incrementPomodoro();
      toast.success('Focus done. Take a break.');
      setMode('break');
      setSecondsLeft(POMODORO_BREAK);
    } else {
      toast.success('Break over.');
      setMode('focus');
      setSecondsLeft(POMODORO_FOCUS);
    }
  }, [mode, settings.soundEnabled, incrementPomodoro]);

  useEffect(() => {
    if (isRunning && secondsLeft > 0) {
      intervalRef.current = setInterval(() => setSecondsLeft((s) => s - 1), 1000);
    }
    return () => clearInterval(intervalRef.current);
  }, [isRunning, secondsLeft]);

  useEffect(() => {
    if (secondsLeft === 0 && isRunning) handleTimerEnd();
  }, [secondsLeft, isRunning, handleTimerEnd]);

  const reset = () => {
    setIsRunning(false);
    setSecondsLeft(mode === 'focus' ? POMODORO_FOCUS : POMODORO_BREAK);
  };

  const switchMode = (newMode) => {
    setIsRunning(false);
    setMode(newMode);
    setSecondsLeft(newMode === 'focus' ? POMODORO_FOCUS : POMODORO_BREAK);
  };

  return (
    <div className="space-y-6">
      <SectionHeader
        title="Pomodoro"
        description={`${pomodoroSessions} focus sessions completed`}
      />

      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => switchMode('focus')}
          className={`rounded-md px-3 py-1.5 text-sm ${
            mode === 'focus' ? 'bg-brand-600 text-white' : 'border border-slate-300 dark:border-slate-600'
          }`}
        >
          Focus (25 min)
        </button>
        <button
          type="button"
          onClick={() => switchMode('break')}
          className={`rounded-md px-3 py-1.5 text-sm ${
            mode === 'break' ? 'bg-brand-600 text-white' : 'border border-slate-300 dark:border-slate-600'
          }`}
        >
          Break (5 min)
        </button>
      </div>

      <GlassCard className="flex flex-col items-center py-8" hover={false}>
        <div className="relative">
          <svg className="h-56 w-56 -rotate-90" viewBox="0 0 220 220">
            <circle
              cx="110"
              cy="110"
              r="100"
              fill="none"
              stroke="currentColor"
              className="text-slate-200 dark:text-slate-700"
              strokeWidth="6"
            />
            <circle
              cx="110"
              cy="110"
              r="100"
              fill="none"
              stroke="#4f46e5"
              strokeWidth="6"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              className="transition-all duration-1000"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <p className="text-4xl font-semibold tabular-nums">{formatTime(secondsLeft)}</p>
            <p className="mt-1 text-sm text-slate-500">
              {mode === 'focus' ? 'Focus' : 'Break'}
            </p>
          </div>
        </div>

        <div className="mt-6 flex gap-2">
          <Button icon={isRunning ? Pause : Play} onClick={() => setIsRunning(!isRunning)}>
            {isRunning ? 'Pause' : 'Start'}
          </Button>
          <Button variant="secondary" icon={RotateCcw} onClick={reset}>
            Reset
          </Button>
        </div>
      </GlassCard>

      <GlassCard hover={false}>
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-sm font-medium text-slate-700 dark:text-slate-300">
            Session history
          </h3>
          {pomodoroHistory.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              icon={Trash2}
              onClick={() => {
                if (confirm('Clear all Pomodoro history?')) clearPomodoroHistory();
              }}
            >
              Clear
            </Button>
          )}
        </div>

        {pomodoroHistory.length === 0 ? (
          <p className="text-sm text-slate-500">
            Completed focus sessions will appear here.
          </p>
        ) : (
          <ul className="max-h-64 space-y-2 overflow-y-auto">
            {pomodoroHistory.map((session) => (
              <li
                key={session.id}
                className="flex items-center justify-between rounded-md border border-slate-200 px-3 py-2 text-sm dark:border-slate-700"
              >
                <span className="text-slate-700 dark:text-slate-200">
                  Focus · {session.durationMinutes} min
                </span>
                <span className="text-xs text-slate-500">
                  {formatSessionTime(session.completedAt)}
                </span>
              </li>
            ))}
          </ul>
        )}
      </GlassCard>
    </div>
  );
}
