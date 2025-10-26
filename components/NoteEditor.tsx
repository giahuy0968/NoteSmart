import React, { useState, useRef, useEffect } from 'react';
import { Note } from '../types';
import { generateFlashcardsFromText, GeneratedCardData } from '../services/geminiService';
import { Sparkles, LoaderCircle } from 'lucide-react';
import FlashcardGeneratorModal from './FlashcardGeneratorModal';

interface NoteEditorProps {
    note: Note;
    onAddCards: (cards: GeneratedCardData[], noteId: string) => void;
}

const NoteEditor: React.FC<NoteEditorProps> = ({ note, onAddCards }) => {
    const [content, setContent] = useState(note.content);
    const [selectedText, setSelectedText] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);
    const [generatedCards, setGeneratedCards] = useState<GeneratedCardData[] | null>(null);
    const [error, setError] = useState<string | null>(null);
    const editorRef = useRef<HTMLTextAreaElement>(null);

    useEffect(() => {
        setContent(note.content);
    }, [note]);

    const handleSelection = () => {
        const text = window.getSelection()?.toString() || '';
        if (editorRef.current && editorRef.current.contains(window.getSelection()?.anchorNode ?? null)) {
          setSelectedText(text);
        } else {
          setSelectedText('');
        }
    };
    
    useEffect(() => {
        document.addEventListener('selectionchange', handleSelection);
        return () => document.removeEventListener('selectionchange', handleSelection);
    }, []);

    const handleGenerate = async () => {
        const textToProcess = selectedText.trim() || content;
        if (!textToProcess) return;

        setIsGenerating(true);
        setError(null);
        setGeneratedCards(null);
        try {
            const cards = await generateFlashcardsFromText(textToProcess);
            setGeneratedCards(cards);
        } catch (e: any) {
            setError(e.message || "An unknown error occurred.");
        } finally {
            setIsGenerating(false);
        }
    };
    
    const handleModalClose = () => {
        setGeneratedCards(null);
        setError(null);
    }

    const handleSaveCards = (cards: GeneratedCardData[]) => {
        onAddCards(cards, note.id);
        handleModalClose();
    }

    return (
        <div className="flex flex-col h-full bg-slate-900 rounded-lg p-6 border border-slate-700/50">
            <div className="mb-4 pb-4 border-b border-slate-700">
                <h1 className="text-3xl font-bold text-white">{note.title}</h1>
                <div className="flex gap-2 mt-2">
                    {note.tags.map(tag => (
                        <span key={tag} className="bg-primary/20 text-primary-light text-xs font-medium px-2.5 py-0.5 rounded-full">{tag}</span>
                    ))}
                </div>
            </div>
            <div className="relative flex-grow">
                <textarea
                    ref={editorRef}
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className="w-full h-full bg-transparent text-slate-300 leading-relaxed resize-none focus:outline-none placeholder-slate-500 p-1"
                    placeholder="Start writing your notes here..."
                />
            </div>
            <div className="pt-4 mt-4 border-t border-slate-700 flex justify-end">
                <button
                    onClick={handleGenerate}
                    disabled={isGenerating || (!selectedText.trim() && !content.trim())}
                    className="inline-flex items-center gap-2 px-6 py-3 font-semibold text-white bg-primary rounded-lg hover:bg-primary-dark disabled:bg-slate-600 disabled:cursor-not-allowed transition-colors shadow-lg shadow-primary/20"
                >
                    {isGenerating ? (
                        <>
                            <LoaderCircle className="animate-spin h-5 w-5" />
                            Generating...
                        </>
                    ) : (
                        <>
                            <Sparkles className="h-5 w-5" />
                            {selectedText.trim() ? 'Generate from Selection' : 'Generate from Note'}
                        </>
                    )}
                </button>
            </div>
            {(isGenerating || generatedCards || error) && (
                 <FlashcardGeneratorModal
                    isOpen={true}
                    isLoading={isGenerating}
                    cards={generatedCards}
                    error={error}
                    onClose={handleModalClose}
                    onSave={handleSaveCards}
                 />
            )}
        </div>
    );
};

export default NoteEditor;