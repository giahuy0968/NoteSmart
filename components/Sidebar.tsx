import React from 'react';
import { LayoutDashboard, NotebookText, MessageSquareQuote, BrainCircuit, Folder, CircleDot } from 'lucide-react';
import { View, Deck } from '../types';

interface SidebarProps {
    currentView: View;
    onNavigate: (view: View, id?: string) => void;
    decks: Deck[];
}

const NavItem: React.FC<{
    icon: React.ReactNode;
    label: string;
    isActive: boolean;
    onClick: () => void;
    isSubItem?: boolean;
}> = ({ icon, label, isActive, onClick, isSubItem = false }) => (
    <button
        onClick={onClick}
        className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-md text-sm font-medium transition-colors ${
            isActive
                ? 'bg-primary/20 text-white'
                : 'text-slate-400 hover:bg-slate-700/50 hover:text-slate-200'
        } ${isSubItem ? 'pl-11' : ''}`}
    >
        {icon}
        <span>{label}</span>
    </button>
);

const Sidebar: React.FC<SidebarProps> = ({ currentView, onNavigate, decks }) => {
    return (
        <aside className="w-64 bg-slate-900 p-4 border-r border-slate-700/50 hidden md:flex flex-col">
            <nav className="space-y-1">
                <NavItem 
                    icon={<LayoutDashboard size={20} />}
                    label="Dashboard"
                    isActive={currentView === View.Dashboard}
                    onClick={() => onNavigate(View.Dashboard)}
                />
                <NavItem 
                    icon={<NotebookText size={20} />}
                    label="Notes"
                    isActive={currentView === View.Notes || currentView === View.Editor}
                    onClick={() => onNavigate(View.Notes)}
                />
                 <NavItem 
                    icon={<MessageSquareQuote size={20} />}
                    label="RAG Query"
                    isActive={currentView === View.RAG}
                    onClick={() => onNavigate(View.RAG)}
                />
                 <NavItem 
                    icon={<BrainCircuit size={20} />}
                    label="AI Explain"
                    isActive={currentView === View.Explain}
                    onClick={() => onNavigate(View.Explain)}
                />
            </nav>
            <div className="mt-6 pt-4 border-t border-slate-700/50">
                <h3 className="px-4 mb-2 text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-2"><Folder size={16}/> Decks</h3>
                <div className="space-y-1">
                    {decks.map(deck => (
                        <NavItem
                            key={deck.id}
                            icon={<CircleDot size={12} className="ml-1"/>}
                            label={deck.name}
                            isActive={currentView === View.Deck && false /* Need activeDeckId here */}
                            onClick={() => onNavigate(View.Deck, deck.id)}
                            isSubItem={true}
                        />
                    ))}
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;