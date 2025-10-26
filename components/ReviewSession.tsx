import React, { useState, useEffect, useCallback } from 'react';
import { Card } from '../types';
import { SM2Grade } from '../services/sm2';
import { ArrowRight, CheckCircle } from 'lucide-react';

interface ReviewSessionProps {
    cardIds: string[];
    getCard: (id: string) => Card | undefined;
    onUpdateCardGrade: (cardId: string, grade: SM2Grade) => Card;
    onFinish: () => void;
}

const ReviewSession: React.FC<ReviewSessionProps> = ({ cardIds, getCard, onUpdateCardGrade, onFinish }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isFlipped, setIsFlipped] = useState(false);
    
    const currentCardId = cardIds[currentIndex];
    const currentCard = currentCardId ? getCard(currentCardId) : null;

    useEffect(() => {
        // If the card being reviewed is changed (e.g., from an empty queue to a populated one),
        // reset the flip state.
        setIsFlipped(false);
    }, [currentCardId]);

    const handleNextCard = useCallback((grade: SM2Grade) => {
        if (!currentCard) return;

        onUpdateCardGrade(currentCard.id, grade);

        if (currentIndex + 1 < cardIds.length) {
            setCurrentIndex(currentIndex + 1);
        } else {
            onFinish();
        }
    }, [currentCard, currentIndex, cardIds.length, onUpdateCardGrade, onFinish]);

    const handleKeyDown = useCallback((event: KeyboardEvent) => {
        if (!currentCard) return;
        
        if (!isFlipped) {
            if (event.key === ' ' || event.key === 'Enter') {
                event.preventDefault();
                setIsFlipped(true);
            }
        } else {
            switch (event.key) {
                case '1': handleNextCard(0); break; // Again
                case '2': handleNextCard(1); break; // Hard
                case '3': handleNextCard(2); break; // Good
                case '4': handleNextCard(3); break; // Easy
                default: break;
            }
        }
    }, [isFlipped, handleNextCard, currentCard]);

    useEffect(() => {
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [handleKeyDown]);
    
    if (!currentCard) {
        return (
            <div className="flex flex-col items-center justify-center h-full text-center bg-slate-900 rounded-lg p-6 border border-slate-700/50">
                 <CheckCircle size={64} className="text-success mb-4" />
                <h2 className="text-2xl font-bold text-white">Review Complete!</h2>
                <p className="text-slate-400">You've finished all due cards for this session.</p>
            </div>
        )
    }

    const progress = ((currentIndex) / cardIds.length) * 100;

    return (
        <div className="flex flex-col h-full justify-between bg-slate-900 rounded-lg p-6 border border-slate-700/50">
            <div>
                 <div className="w-full bg-slate-700 rounded-full h-2 mb-6">
                    <div className="bg-primary h-2 rounded-full transition-all duration-300" style={{ width: `${progress}%` }}></div>
                </div>
                <div 
                  className="w-full aspect-video bg-slate-800 rounded-lg flex items-center justify-center p-8 text-center cursor-pointer border border-slate-700"
                  onClick={() => setIsFlipped(true)}
                >
                    <p className="text-2xl md:text-3xl text-slate-200">{currentCard.front}</p>
                </div>
                {isFlipped && (
                    <div className="mt-4 p-8 bg-slate-850 rounded-lg border border-slate-700/50">
                        <p className="text-2xl md:text-3xl text-primary-light">{currentCard.back}</p>
                        {currentCard.explanation && (
                             <p className="text-slate-400 mt-4 pt-4 border-t border-slate-700">{currentCard.explanation}</p>
                        )}
                    </div>
                )}
            </div>
            
            <div className="flex flex-col items-center pt-6">
                 {!isFlipped ? (
                     <button
                         onClick={() => setIsFlipped(true)}
                         className="inline-flex items-center gap-2 px-8 py-3 font-semibold text-white bg-primary rounded-lg hover:bg-primary-dark transition-colors"
                     >
                         Show Answer <ArrowRight size={18}/>
                     </button>
                 ) : (
                     <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full max-w-2xl">
                         <button onClick={() => handleNextCard(0)} className="p-4 font-semibold text-white bg-error rounded-lg hover:bg-error-dark transition-colors">Again <span className="text-xs text-red-200">(1)</span></button>
                         <button onClick={() => handleNextCard(1)} className="p-4 font-semibold text-white bg-warning rounded-lg hover:bg-warning-dark transition-colors">Hard <span className="text-xs text-orange-200">(2)</span></button>
                         <button onClick={() => handleNextCard(2)} className="p-4 font-semibold text-white bg-success rounded-lg hover:bg-success-dark transition-colors">Good <span className="text-xs text-green-200">(3)</span></button>
                         <button onClick={() => handleNextCard(3)} className="p-4 font-semibold text-white bg-primary rounded-lg hover:bg-primary-dark transition-colors">Easy <span className="text-xs text-blue-200">(4)</span></button>
                     </div>
                 )}
            </div>
        </div>
    );
};

export default ReviewSession;