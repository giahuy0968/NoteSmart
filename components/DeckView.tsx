import React from 'react';
import { Deck, Card } from '../types';
import { Play, CalendarCheck } from 'lucide-react';

interface DeckViewProps {
    deck: Deck;
    cards: Card[];
    onStartReview: (deckId: string) => void;
}

const DeckView: React.FC<DeckViewProps> = ({ deck, cards, onStartReview }) => {
    const now = new Date();
    const dueCardsCount = cards.filter(c => new Date(c.dueDate) <= now).length;

    return (
        <div className="flex flex-col h-full bg-slate-900 rounded-lg p-6 border border-slate-700/50">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-6 pb-4 border-b border-slate-700">
                <div>
                    <h1 className="text-3xl font-bold text-white">{deck.name}</h1>
                    <p className="text-slate-400">{cards.length} cards total</p>
                </div>
                <button
                    onClick={() => onStartReview(deck.id)}
                    disabled={dueCardsCount === 0}
                    className="inline-flex items-center justify-center gap-2 px-6 py-3 font-semibold text-white bg-success rounded-lg hover:bg-success-dark disabled:bg-slate-600 disabled:cursor-not-allowed transition-colors shadow-lg shadow-success/20"
                >
                    <Play className="h-5 w-5" />
                    Review Due Cards ({dueCardsCount})
                </button>
            </div>
            
            <div className="flex-grow overflow-y-auto pr-2 -mr-2">
                {cards.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-center text-slate-500 py-16">
                        <p className="text-lg">This deck is empty.</p>
                        <p>Go to the editor to generate some flashcards!</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {cards.map(card => (
                            <div key={card.id} className="bg-slate-800 p-4 rounded-lg border border-slate-700 flex flex-col justify-between hover:border-primary-light transition-colors">
                                <div>
                                    <p className="text-slate-300 text-sm break-words line-clamp-3">{card.front}</p>
                                    <hr className="border-slate-700 my-2"/>
                                    <p className="text-primary-light text-sm break-words line-clamp-2">{card.back}</p>
                                </div>
                                <div className="text-xs text-slate-500 mt-3 pt-2 border-t border-slate-700/50 flex items-center gap-1.5">
                                    <CalendarCheck size={14}/>
                                    Due: {new Date(card.dueDate).toLocaleDateString()}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default DeckView;