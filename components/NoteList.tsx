import React from 'react';
import { Note } from '../types';
import { PenSquare, Tag, Clock } from 'lucide-react';

interface NoteListProps {
    notes: Note[];
    onSelectNote: (id: string) => void;
}

const NoteList: React.FC<NoteListProps> = ({ notes, onSelectNote }) => {
    return (
        <div className="flex flex-col h-full bg-slate-900 rounded-lg p-6 border border-slate-700/50">
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-white">All Notes</h1>
                <p className="text-slate-400">Browse, search, and manage your notes.</p>
                <div className="mt-4">
                    <input 
                        type="text" 
                        placeholder="Search notes..."
                        className="w-full max-w-sm p-2 bg-slate-800 border border-slate-700 rounded-md focus:ring-2 focus:ring-primary focus:outline-none"
                    />
                </div>
            </div>

            <div className="flex-grow overflow-y-auto pr-2 -mr-2 space-y-3">
                {notes.map(note => (
                    <button 
                        key={note.id} 
                        onClick={() => onSelectNote(note.id)}
                        className="w-full text-left p-4 bg-slate-800 rounded-lg border border-slate-700 hover:border-primary-light transition-colors flex items-start gap-4"
                    >
                        <div className="flex-shrink-0 mt-1">
                           <PenSquare className="text-primary-light" size={20}/>
                        </div>
                        <div className="flex-grow">
                            <h2 className="font-semibold text-white">{note.title}</h2>
                            <div className="flex items-center gap-4 text-xs text-slate-500 mt-2">
                                <div className="flex items-center gap-1.5">
                                    <Clock size={14} />
                                    <span>Updated: {note.updatedAt.toLocaleDateString()}</span>
                                </div>
                                {note.tags.length > 0 &&
                                    <div className="flex items-center gap-1.5">
                                        <Tag size={14} />
                                        <span>{note.tags.join(', ')}</span>
                                    </div>
                                }
                            </div>
                        </div>
                    </button>
                ))}
            </div>
        </div>
    );
};

export default NoteList;
