import React, { useState, useCallback, useMemo } from 'react';
import { Note, Deck, Card, View } from './types';
import NoteEditor from './components/NoteEditor';
import DeckView from './components/DeckView';
import ReviewSession from './components/ReviewSession';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import NoteList from './components/NoteList';
import AIExplainView from './components/AIExplainView';
import RAGQueryView from './components/RAGQueryView';
import { updateCardWithSm2, SM2Grade } from './services/sm2';
import { sampleNotes, sampleDecks, sampleCards } from './constants';

const App: React.FC = () => {
  const [view, setView] = useState<View>(View.Dashboard);
  const [notes, setNotes] = useState<Note[]>(sampleNotes);
  const [decks, setDecks] = useState<Deck[]>(sampleDecks);
  const [cards, setCards] = useState<Record<string, Card>>(sampleCards);
  const [activeNoteId, setActiveNoteId] = useState<string | null>(null);
  const [activeDeckId, setActiveDeckId] = useState<string | null>(null);
  const [reviewQueue, setReviewQueue] = useState<string[]>([]);

  const activeNote = useMemo(() => notes.find(n => n.id === activeNoteId), [notes, activeNoteId]);
  const activeDeck = useMemo(() => decks.find(d => d.id === activeDeckId), [decks, activeDeckId]);
  const deckCards = useMemo(() => {
    if (!activeDeck) return [];
    return activeDeck.cardIds.map(id => cards[id]).filter(Boolean);
  }, [activeDeck, cards]);

  const handleAddCards = useCallback((newCards: Omit<Card, 'id' | 'deckId' | 'interval' | 'repetition' | 'easeFactor' | 'dueDate'>[], noteId: string) => {
    // For now, add all cards to a single, existing deck.
    const targetDeckId = decks[0]?.id;
    if (!targetDeckId) {
        console.error("No decks available to add cards to.");
        return;
    }

    const newCardEntries: Record<string, Card> = {};
    const newCardIds: string[] = [];

    newCards.forEach(c => {
      const id = `card-${Date.now()}-${Math.random()}`;
      newCardEntries[id] = {
        ...c,
        id,
        deckId: targetDeckId,
        interval: 0,
        repetition: 0,
        easeFactor: 2.5,
        dueDate: new Date(),
        sourceNoteId: noteId,
      };
      newCardIds.push(id);
    });

    setCards(prev => ({ ...prev, ...newCardEntries }));
    setDecks(prevDecks => prevDecks.map(d => 
      d.id === targetDeckId ? { ...d, cardIds: [...d.cardIds, ...newCardIds] } : d
    ));
    setActiveDeckId(targetDeckId);
    setView(View.Deck);
  }, [decks]);

  const startReviewSession = useCallback((deckId: string) => {
    const deck = decks.find(d => d.id === deckId);
    if (!deck) return;
    const now = new Date();
    const dueCardIds = deck.cardIds
      .map(id => cards[id])
      .filter(card => card && new Date(card.dueDate) <= now)
      .map(card => card.id);
    
    setReviewQueue(dueCardIds);
    setView(View.Review);
  }, [decks, cards]);

  const handleFinishReview = useCallback(() => {
    setReviewQueue([]);
    setView(View.Deck); // Go back to the active deck view
  }, []);
  
  const handleUpdateCardGrade = (cardId: string, grade: SM2Grade): Card => {
      const card = cards[cardId];
      if (!card) throw new Error("Card not found");
      const updatedCard = updateCardWithSm2(card, grade);
      setCards(prev => ({...prev, [cardId]: updatedCard}));
      return updatedCard;
  };

  const navigateTo = (newView: View, id: string | null = null) => {
    setView(newView);
    if (newView === View.Deck && id) setActiveDeckId(id);
    else setActiveDeckId(null);

    if (newView === View.Editor && id) setActiveNoteId(id);
    else setActiveNoteId(null);

     if(newView === View.Notes) setActiveNoteId(null);
  }

  const renderContent = () => {
    switch(view) {
      case View.Dashboard:
        return <Dashboard stats={{ noteCount: notes.length, cardCount: Object.keys(cards).length }} onNavigate={navigateTo} />;
      case View.Notes:
        return <NoteList notes={notes} onSelectNote={(id) => navigateTo(View.Editor, id)} />;
      case View.Editor:
        if (activeNote) {
            return <NoteEditor note={activeNote} onAddCards={handleAddCards} />;
        }
        return <NoteList notes={notes} onSelectNote={(id) => navigateTo(View.Editor, id)} />;
      case View.Deck:
        if (activeDeck) {
            return <DeckView deck={activeDeck} cards={deckCards} onStartReview={startReviewSession} />;
        }
        // Fallback if no active deck
        return <div>Select a deck to view.</div>;
      case View.Review:
        return <ReviewSession 
                  cardIds={reviewQueue}
                  getCard={(id) => cards[id]}
                  onUpdateCardGrade={handleUpdateCardGrade}
                  onFinish={handleFinishReview}
               />;
      case View.Explain:
        return <AIExplainView />;
      case View.RAG:
        return <RAGQueryView notes={notes} onNavigate={navigateTo} />;
      default:
        return <Dashboard stats={{ noteCount: notes.length, cardCount: Object.keys(cards).length }} onNavigate={navigateTo} />;
    }
  }

  return (
    <div className="min-h-screen bg-slate-850 font-sans flex flex-col">
      <Header />
      <div className="flex-grow flex">
          <Sidebar currentView={view} onNavigate={navigateTo} decks={decks} />
          <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
              {renderContent()}
          </main>
      </div>
    </div>
  );
};

export default App;