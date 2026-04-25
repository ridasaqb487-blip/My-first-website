import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Droplets, Plus, Minus, RotateCcw, Settings, History, CheckCircle2, TrendingUp, GlassWater, Waves } from 'lucide-react';

interface DrinkEntry {
  id: string;
  amount: number;
  timestamp: number;
}

export default function App() {
  const [currentAmount, setCurrentAmount] = useState(0);
  const [goal, setGoal] = useState(2500);
  const [entries, setEntries] = useState<DrinkEntry[]>([]);
  const [showSettings, setShowSettings] = useState(false);
  const [showHistory, setShowHistory] = useState(false);

  // Initialize data from localStorage
  useEffect(() => {
    const today = new Date().toDateString();
    const savedData = localStorage.getItem('h2o_tracker_data');
    if (savedData) {
      const parsed = JSON.parse(savedData);
      // Only keep today's entries for the daily tracker
      if (parsed.date === today) {
        setEntries(parsed.entries || []);
        setCurrentAmount(parsed.currentAmount || 0);
        setGoal(parsed.goal || 2500);
      } else {
        // Reset for a new day
        localStorage.removeItem('h2o_tracker_data');
      }
    }
  }, []);

  // Sync data to localStorage
  useEffect(() => {
    const today = new Date().toDateString();
    const dataToSave = {
      date: today,
      entries,
      currentAmount,
      goal
    };
    localStorage.setItem('h2o_tracker_data', JSON.stringify(dataToSave));
  }, [entries, currentAmount, goal]);

  const addWater = (amount: number) => {
    const newEntry: DrinkEntry = {
      id: Math.random().toString(36).substr(2, 9),
      amount,
      timestamp: Date.now()
    };
    setEntries(prev => [newEntry, ...prev]);
    setCurrentAmount(prev => prev + amount);
  };

  const removeEntry = (id: string) => {
    const entryToRemove = entries.find(e => e.id === id);
    if (entryToRemove) {
      setEntries(prev => prev.filter(e => e.id !== id));
      setCurrentAmount(prev => Math.max(0, prev - entryToRemove.amount));
    }
  };

  const resetToday = () => {
    if (window.confirm('Reset today\'s progress?')) {
      setEntries([]);
      setCurrentAmount(0);
    }
  };

  const progress = Math.min(1, currentAmount / goal);
  const percentage = Math.round(progress * 100);

  return (
    <div className="min-h-screen bg-natural-bg text-natural-text selection:bg-natural-water flex flex-col items-center py-10 px-4 sm:px-6">
      <main className="w-full max-w-lg relative z-10 flex flex-col gap-10">
        {/* Header */}
        <header className="flex justify-between items-end mb-4">
          <div>
            <span className="text-natural-accent text-[10px] font-bold uppercase tracking-[0.2em] mb-1 block">Wellness Tracker</span>
            <h1 className="text-4xl font-serif italic text-natural-text">AquaBalance</h1>
          </div>
          <div className="flex gap-3">
            <button 
              onClick={() => setShowHistory(!showHistory)}
              className="p-3 bg-white border border-natural-border rounded-2xl hover:bg-natural-bg transition-colors text-natural-accent shadow-sm"
              title="History"
            >
              <History size={20} />
            </button>
            <button 
              onClick={() => setShowSettings(!showSettings)}
              className="p-3 bg-white border border-natural-border rounded-2xl hover:bg-natural-bg transition-colors text-natural-accent shadow-sm"
              title="Settings"
            >
              <Settings size={20} />
            </button>
          </div>
        </header>

        {/* Main Progress Card */}
        <div className="natural-card bg-white p-12 flex flex-col items-center justify-center relative overflow-hidden min-h-[400px]">
          {/* Water Level Background */}
          <motion.div 
            initial={false}
            animate={{ 
              height: `${progress * 100}%`,
            }}
            transition={{ type: 'spring', damping: 20, stiffness: 40 }}
            className="absolute bottom-0 left-0 right-0 bg-natural-water opacity-30 w-full"
          />
          
          <div className="relative z-10 flex flex-col items-center">
            {/* Circular Progress */}
            <div className="w-64 h-64 rounded-full border-[10px] border-natural-bg flex items-center justify-center relative shadow-inner">
              <svg className="absolute inset-0 w-full h-full -rotate-90 transform" viewBox="0 0 100 100">
                <motion.circle 
                  cx="50" cy="50" r="45" 
                  fill="transparent" 
                  stroke="currentColor" 
                  strokeWidth="3.5" 
                  strokeDasharray="283" 
                  initial={{ strokeDashoffset: 283 }}
                  animate={{ strokeDashoffset: 283 - (283 * progress) }}
                  className="text-natural-accent"
                  strokeLinecap="round"
                />
              </svg>
              <div className="text-center">
                <span className="text-6xl font-serif italic block leading-none">
                  {currentAmount.toLocaleString()}
                </span>
                <span className="block text-natural-muted uppercase text-[10px] font-bold tracking-widest mt-3">
                  of {goal.toLocaleString()} ml
                </span>
              </div>
            </div>

            <div className="mt-10 text-center">
              <p className="text-2xl font-serif italic text-natural-text">{percentage}% of daily goal</p>
              <p className="text-natural-muted text-sm mt-2 italic">
                {percentage >= 100 
                  ? "Daily target reached! Stay balanced." 
                  : percentage > 50 
                    ? "Over halfway there. Keep going!" 
                    : "A fresh start to a hydrated day."}
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4">
          <motion.button 
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => addWater(250)}
            className="flex-1 bg-natural-accent text-white py-5 rounded-2xl font-medium shadow-md hover:brightness-95 transition-all text-sm tracking-wide"
          >
            + 250ml Glass
          </motion.button>
          <motion.button 
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => addWater(500)}
            className="flex-1 bg-natural-sage text-white py-5 rounded-2xl font-medium shadow-md hover:brightness-95 transition-all text-sm tracking-wide"
          >
            + 500ml Bottle
          </motion.button>
          <motion.button 
            whileHover={{ rotate: 90 }}
            onClick={() => {
              const val = prompt("Custom amount (ml):");
              if (val && parseInt(val) > 0) addWater(parseInt(val));
            }}
            className="w-16 h-16 flex items-center justify-center border-2 border-natural-border rounded-2xl text-natural-accent hover:border-natural-accent hover:bg-white transition-all bg-white shadow-sm"
          >
            <Plus size={24} />
          </motion.button>
        </div>

        {/* History Preview */}
        <section className="natural-card p-8">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xs font-bold uppercase tracking-widest text-natural-muted">Recent Activity</h3>
            <button 
              onClick={resetToday}
              className="text-[10px] font-bold text-natural-muted hover:text-red-800 uppercase tracking-widest transition-colors flex items-center gap-2"
            >
              <RotateCcw size={12} /> Reset Day
            </button>
          </div>
          
          <div className="space-y-6">
            <AnimatePresence mode='popLayout'>
              {entries.length === 0 ? (
                <p className="text-center py-6 text-sm italic text-natural-muted">No records yet for today.</p>
              ) : (
                entries.slice(0, 4).map((entry) => (
                  <motion.div
                    key={entry.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    layout
                    className="flex items-center justify-between group"
                  >
                    <div className="flex items-center gap-5">
                      <div className="w-11 h-11 rounded-full bg-natural-bg flex items-center justify-center text-natural-accent">
                        <Droplets size={16} fill="currentColor" />
                      </div>
                      <div>
                        <div className="text-sm font-bold text-natural-text">
                          {entry.amount >= 500 ? 'Flask Refill' : 'Glass Intake'}
                        </div>
                        <div className="text-[11px] font-semibold text-natural-muted uppercase tracking-tighter">
                          {new Date(entry.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="font-serif italic text-lg text-natural-accent">{entry.amount}ml</span>
                      <button 
                        onClick={() => removeEntry(entry.id)}
                        className="p-2 text-natural-border hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all border border-transparent hover:border-red-100 rounded-lg"
                      >
                        <Minus size={14} />
                      </button>
                    </div>
                  </motion.div>
                ))
              )}
            </AnimatePresence>
          </div>
        </section>

        <footer className="mt-4 pt-8 border-t border-natural-border flex justify-between items-center text-[10px] text-natural-muted font-bold uppercase tracking-[0.2em]">
          <div className="flex gap-8">
            <span className="text-natural-accent border-b-2 border-natural-accent pb-1 cursor-pointer">Tracker</span>
            <span className="cursor-pointer hover:text-natural-accent transition-colors">Insights</span>
            <span className="cursor-pointer hover:text-natural-accent transition-colors">Daily Goal</span>
          </div>
          <div>Balance is key</div>
        </footer>
      </main>

      {/* Settings Modal */}
      <AnimatePresence>
        {showSettings && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowSettings(false)}
              className="absolute inset-0 bg-[#3A3A2F]/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white w-full max-w-sm rounded-[40px] p-10 relative z-10 shadow-2xl space-y-8 border border-natural-border"
            >
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-serif italic">Preferences</h2>
                <button onClick={() => setShowSettings(false)} className="text-natural-muted hover:text-natural-text transition-colors">
                  <Plus className="rotate-45" size={24} />
                </button>
              </div>
              
              <div className="space-y-3">
                <label className="text-[10px] font-bold text-natural-muted uppercase tracking-[0.2em] pl-1">Daily Goal (ml)</label>
                <input 
                  type="number" 
                  value={goal}
                  onChange={(e) => setGoal(Number(e.target.value))}
                  className="w-full bg-natural-bg px-6 py-4 rounded-2xl border border-natural-border focus:outline-none focus:ring-2 focus:ring-natural-accent/10 font-serif italic text-xl"
                />
              </div>

              <button 
                onClick={() => setShowSettings(false)}
                className="w-full bg-natural-accent text-white py-5 rounded-2xl font-bold shadow-lg shadow-natural-accent/20 hover:brightness-95 transition-all"
              >
                Apply Changes
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* History Modal */}
      <AnimatePresence>
        {showHistory && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowHistory(false)}
              className="absolute inset-0 bg-[#3A3A2F]/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white w-full max-w-md rounded-[40px] p-10 relative z-10 shadow-2xl flex flex-col max-h-[80vh] border border-natural-border"
            >
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-serif italic text-natural-text">Daily Journal</h2>
                <button onClick={() => setShowHistory(false)} className="text-natural-muted hover:text-natural-text transition-colors">
                  <Plus className="rotate-45" size={24} />
                </button>
              </div>
              
              <div className="flex-1 overflow-y-auto pr-2 space-y-4 custom-scrollbar">
                {entries.length === 0 ? (
                    <p className="text-center py-12 text-natural-muted italic">The log is quiet today.</p>
                ) : (
                  entries.map((entry) => (
                    <div
                      key={entry.id}
                      className="bg-natural-bg p-5 rounded-3xl border border-natural-border flex justify-between items-center"
                    >
                      <div className="flex items-center gap-5">
                        <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-natural-accent border border-natural-border">
                          <Droplets size={18} fill="currentColor" />
                        </div>
                        <div>
                          <p className="font-bold text-natural-text text-sm">
                            {entry.amount >= 500 ? 'Flask Session' : 'Glass Refresh'}
                          </p>
                          <p className="text-[10px] font-semibold text-natural-muted uppercase tracking-widest">
                            {new Date(entry.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="font-serif italic text-xl text-natural-accent">{entry.amount}ml</span>
                        <button 
                          onClick={() => removeEntry(entry.id)}
                          className="p-2 text-natural-muted hover:text-red-400 hover:bg-white rounded-xl transition-all border border-transparent hover:border-red-50"
                        >
                          <Minus size={18} />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 3px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #E6E6E1; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #8E9280; }
      `}</style>
    </div>
  );
}
