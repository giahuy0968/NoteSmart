import React, { useState, useEffect } from 'react';
import { GeneratedCardData } from '../services/geminiService';
import { X, Save, AlertTriangle, LoaderCircle, Wand2 } from 'lucide-react';

interface FlashcardGeneratorModalProps {
    isOpen: boolean;
    isLoading: boolean;
    cards: GeneratedCardData[] | null;
    error: string | null;
    onClose: () => void;
    onSave: (cards: GeneratedCardData[]) => void;
}

const FlashcardGeneratorModal: React.FC<FlashcardGeneratorModalProps> = ({
    isOpen,
    isLoading,
    cards,
    error,
    onClose,
    onSave,
}) => {
    const [editableCards, setEditableCards] = useState<GeneratedCardData[]>([]);

    useEffect(() => {
        if (cards) {
            setEditableCards(cards);
        }
    }, [cards]);
    
    if (!isOpen) return null;

    const handleCardChange = (index: number, field: 'front' | 'back', value: string) => {
        const updatedCards = [...editableCards];
        updatedCards[index] = { ...updatedCards[index], [field]: value };
        setEditableCards(updatedCards);
    };

    const renderCardType = (type: string) => {
        const colors = {
            'QA': 'bg-primary/20 text-primary-light border-primary/30',
            'Cloze': 'bg-secondary/20 text-secondary-light border-secondary/30',
            'MCQ': 'bg-success/20 text-success-light border-success/30',
        };
        const typeClasses = colors[type as keyof typeof colors] || 'bg-slate-500/20 text-slate-300';
        return <span className={`px-2 py-1 text-xs font-medium rounded-full border ${typeClasses}`}>{type}</span>;
    };

    return (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-slate-800 border border-slate-700 rounded-2xl shadow-2xl w-full max-w-4xl h-[90vh] flex flex-col">
                <header className="flex items-center justify-between p-6 border-b border-slate-700">
                    <div className="flex items-center gap-3">
                        <Wand2 className="text-primary-light" size={24}/>
                        <h2 className="text-2xl font-bold text-white">AI Generated Flashcards</h2>
                    </div>
                    <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
                        <X size={24} />
                    </button>
                </header>
                
                <div className="flex-grow overflow-y-auto p-6 space-y-4">
                    {isLoading && (
                        <div className="flex flex-col items-center justify-center h-full text-slate-400">
                            <LoaderCircle className="animate-spin h-12 w-12 mb-4 text-primary-light" />
                            <p className="text-lg">Generating flashcards...</p>
                            <p className="text-sm">This may take a moment.</p>
                        </div>
                    )}
                    {error && (
                        <div className="flex flex-col items-center justify-center h-full text-error-light">
                            <AlertTriangle className="h-12 w-12 mb-4" />
                            <p className="text-lg font-semibold">Generation Failed</p>
                            <p className="text-sm text-center max-w-md">{error}</p>
                        </div>
                    )}
                    {editableCards.map((card, index) => (
                        <div key={index} className="bg-slate-900/50 p-4 rounded-lg border border-slate-700">
                            <div className="flex justify-between items-center mb-3">
                                <h3 className="font-semibold text-slate-300">Card {index + 1}</h3>
                                {renderCardType(card.cardType)}
                            </div>
                            <div className="space-y-3">
                                <div>
                                    <label className="text-sm font-medium text-slate-400">Front</label>
                                    <textarea
                                        value={card.front}
                                        onChange={(e) => handleCardChange(index, 'front', e.target.value)}
                                        className="w-full p-2 mt-1 bg-slate-700/50 border border-slate-600 rounded-md focus:ring-2 focus:ring-primary focus:outline-none text-slate-200"
                                        rows={3}
                                    />
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-slate-400">Back</label>
                                    <textarea
                                        value={card.back}
                                        onChange={(e) => handleCardChange(index, 'back', e.target.value)}
                                        className="w-full p-2 mt-1 bg-slate-700/50 border border-slate-600 rounded-md focus:ring-2 focus:ring-primary focus:outline-none text-slate-200"
                                        rows={2}
                                    />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {cards && cards.length > 0 && (
                    <footer className="p-6 border-t border-slate-700 flex justify-end gap-4">
                        <button onClick={onClose} className="px-6 py-2 font-semibold text-slate-300 bg-slate-700 rounded-lg hover:bg-slate-600 transition-colors">
                            Cancel
                        </button>
                        <button onClick={() => onSave(editableCards)} className="inline-flex items-center gap-2 px-6 py-2 font-semibold text-white bg-primary rounded-lg hover:bg-primary-dark transition-colors">
                            <Save size={18}/>
                            Save to Deck
                        </button>
                    </footer>
                )}
            </div>
        </div>
    );
};

export default FlashcardGeneratorModal;