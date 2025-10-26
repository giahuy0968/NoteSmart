import React, { useState, useRef, useEffect } from 'react';
import { Note, ChatMessage, Source, View } from '../types';
import { queryWithContext } from '../services/geminiService';
import { Send, LoaderCircle, MessageSquareQuote, Bot, User, NotebookText, AlertTriangle } from 'lucide-react';

const SimpleMarkdown: React.FC<{ text: string }> = ({ text }) => {
    const lines = text.split('\n').map((line, index) => {
        if (line.startsWith('### ')) return <h3 key={index} className="text-lg font-bold mt-3 mb-1">{line.substring(4)}</h3>;
        if (line.startsWith('## ')) return <h2 key={index} className="text-xl font-bold mt-4 mb-2">{line.substring(3)}</h2>;
        if (line.startsWith('- ')) return <li key={index} className="ml-5 list-disc">{line.substring(2)}</li>;
        if (line.trim() === '') return <br key={index} />;
        return <p key={index} className="my-1">{line}</p>;
    });
    return <div className="prose prose-invert text-slate-300 leading-relaxed">{lines}</div>;
};

interface RAGQueryViewProps {
    notes: Note[];
    onNavigate: (view: View, id: string) => void;
}

const RAGQueryView: React.FC<RAGQueryViewProps> = ({ notes, onNavigate }) => {
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [query, setQuery] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const chatEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const findRelevantNotes = (q: string): { context: string, sources: Source[] } => {
        const queryWords = q.toLowerCase().split(/\s+/).filter(w => w.length > 2);
        const relevantNotes = new Set<Note>();

        notes.forEach(note => {
            const content = `${note.title.toLowerCase()} ${note.content.toLowerCase()}`;
            if (queryWords.some(word => content.includes(word))) {
                relevantNotes.add(note);
            }
        });

        const sources: Source[] = Array.from(relevantNotes).map(note => ({
            noteId: note.id,
            title: note.title,
            snippet: note.content.substring(0, 150) + '...'
        }));

        const context = Array.from(relevantNotes).map(note => `Note Title: ${note.title}\nContent:\n${note.content}`).join('\n\n---\n\n');
        
        return { context, sources };
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!query.trim() || isLoading) return;

        const userMessage: ChatMessage = { id: `user-${Date.now()}`, role: 'user', text: query };
        setMessages(prev => [...prev, userMessage]);
        setQuery('');
        setIsLoading(true);
        setError(null);
        
        try {
            const { context, sources } = findRelevantNotes(query);

            if (!context) {
                const noContextMessage: ChatMessage = {
                    id: `asst-${Date.now()}`,
                    role: 'assistant',
                    text: "I couldn't find any notes relevant to your query to form a context.",
                    sources: [],
                };
                setMessages(prev => [...prev, noContextMessage]);
                return;
            }

            const responseText = await queryWithContext(query, context);
            
            const assistantMessage: ChatMessage = {
                id: `asst-${Date.now()}`,
                role: 'assistant',
                text: responseText,
                sources: sources,
            };
            setMessages(prev => [...prev, assistantMessage]);

        } catch (e: any) {
            setError(e.message || "An error occurred.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col h-full bg-slate-900 rounded-lg border border-slate-700/50">
            <header className="flex-shrink-0 p-4 border-b border-slate-700">
                 <h1 className="text-xl font-bold text-white flex items-center gap-3">
                    <MessageSquareQuote size={24} className="text-primary-light"/>
                    Query Your Notes
                </h1>
            </header>
            
            <div className="flex-grow p-4 overflow-y-auto space-y-6">
                {messages.map((msg) => (
                    <div key={msg.id} className={`flex items-start gap-3 ${msg.role === 'user' ? 'justify-end' : ''}`}>
                        {msg.role === 'assistant' && <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary flex items-center justify-center"><Bot size={20} /></div>}
                        <div className={`w-full max-w-2xl rounded-lg p-4 ${msg.role === 'user' ? 'bg-slate-700 text-slate-200' : 'bg-slate-800'}`}>
                           <SimpleMarkdown text={msg.text} />
                           {msg.sources && msg.sources.length > 0 && (
                               <div className="mt-4 pt-3 border-t border-slate-600/50">
                                   <h4 className="text-sm font-semibold text-slate-400 mb-2 flex items-center gap-2"><NotebookText size={16}/> Sources</h4>
                                   <div className="space-y-2">
                                       {msg.sources.map(source => (
                                           <button 
                                                key={source.noteId} 
                                                onClick={() => onNavigate(View.Editor, source.noteId)}
                                                className="block w-full text-left p-2 bg-slate-700/50 rounded-md hover:bg-slate-700 transition-colors"
                                            >
                                               <p className="font-medium text-primary-light text-sm">{source.title}</p>
                                               <p className="text-xs text-slate-500 italic mt-1 line-clamp-2">"{source.snippet}"</p>
                                           </button>
                                       ))}
                                   </div>
                               </div>
                           )}
                        </div>
                        {msg.role === 'user' && <div className="flex-shrink-0 w-8 h-8 rounded-full bg-slate-600 flex items-center justify-center"><User size={20} /></div>}
                    </div>
                ))}
                {isLoading && (
                     <div className="flex items-start gap-3">
                         <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary flex items-center justify-center"><Bot size={20} /></div>
                        <div className="w-full max-w-2xl rounded-lg p-4 bg-slate-800 flex items-center gap-3 text-slate-400">
                           <LoaderCircle className="animate-spin" /> Thinking...
                        </div>
                    </div>
                )}
                 {error && (
                     <div className="flex items-center justify-center gap-2 p-3 bg-error/10 text-error-light rounded-md">
                           <AlertTriangle size={20}/>
                           <p className="text-sm">{error}</p>
                     </div>
                )}
                <div ref={chatEndRef} />
            </div>

            <footer className="flex-shrink-0 p-4 border-t border-slate-700">
                <form onSubmit={handleSubmit} className="flex items-center gap-3">
                    <input
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Ask a question about your notes..."
                        className="flex-grow p-3 bg-slate-800 border border-slate-700 rounded-lg focus:ring-2 focus:ring-primary focus:outline-none"
                        disabled={isLoading}
                    />
                    <button type="submit" disabled={isLoading || !query.trim()} className="p-3 bg-primary rounded-lg text-white hover:bg-primary-dark disabled:bg-slate-600 disabled:cursor-not-allowed transition-colors">
                        <Send size={24}/>
                    </button>
                </form>
            </footer>
        </div>
    );
};

export default RAGQueryView;
