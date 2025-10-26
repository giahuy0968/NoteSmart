import React from 'react';
import { View } from '../types';
import { PlusCircle, PenSquare, Play, HelpCircle, BarChart3, Star } from 'lucide-react';

interface DashboardProps {
  stats: {
    noteCount: number;
    cardCount: number;
  };
  // Fix: Update onNavigate to allow an optional second argument (id).
  onNavigate: (view: View, id?: string) => void;
}

const StatCard: React.FC<{ icon: React.ReactNode; label: string; value: number | string; color: string }> = ({ icon, label, value, color }) => (
  <div className={`bg-slate-800 p-6 rounded-lg border border-slate-700 flex items-center gap-4 ${color}`}>
    <div className="bg-slate-900 p-3 rounded-full">
        {icon}
    </div>
    <div>
      <p className="text-3xl font-bold text-white">{value}</p>
      <p className="text-slate-400">{label}</p>
    </div>
  </div>
);

const ActionButton: React.FC<{ icon: React.ReactNode; label: string; onClick: () => void; color: string }> = ({ icon, label, onClick, color }) => (
    <button onClick={onClick} className={`flex flex-col items-center justify-center gap-2 p-6 rounded-lg bg-slate-800 hover:bg-slate-700/50 border border-slate-700 transition-colors ${color}`}>
        {icon}
        <span className="font-semibold text-white">{label}</span>
    </button>
);


const Dashboard: React.FC<DashboardProps> = ({ stats, onNavigate }) => {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white">Dashboard</h1>
        <p className="text-slate-400">Welcome back! Here's a summary of your workspace.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard icon={<PenSquare size={28} />} label="Total Notes" value={stats.noteCount} color="text-primary-light" />
        <StatCard icon={<Play size={28} />} label="Total Flashcards" value={stats.cardCount} color="text-secondary-light" />
        <StatCard icon={<BarChart3 size={28} />} label="Reviews Today" value={0} color="text-success-light" />
        <StatCard icon={<Star size={28} />} label="Study Streak" value="0 Days" color="text-warning-light" />
      </div>

      <div>
        <h2 className="text-2xl font-bold text-white mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <ActionButton icon={<PlusCircle size={32} />} label="Create Note" onClick={() => onNavigate(View.Editor)} color="text-primary-light"/>
            <ActionButton icon={<Play size={32} />} label="Review Flashcards" onClick={() => onNavigate(View.Deck, 'deck-1')} color="text-success-light"/>
            <ActionButton icon={<HelpCircle size={32} />} label="RAG Query" onClick={() => alert('Coming soon!')} color="text-secondary-light"/>
            <ActionButton icon={<HelpCircle size={32} />} label="AI Explain" onClick={() => alert('Coming soon!')} color="text-warning-light"/>
        </div>
      </div>

       <div>
        <h2 className="text-2xl font-bold text-white mb-4">Recent Notes</h2>
        <div className="bg-slate-800 p-4 rounded-lg border border-slate-700">
            <p className="text-slate-400">Recent notes will be shown here.</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
