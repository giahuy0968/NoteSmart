export interface Note {
    id: string;
    title: string;
    content: string;
    tags: string[];
    updatedAt: Date;
}

export interface Card {
    id:string;
    deckId: string;
    sourceNoteId: string;
    front: string;
    back:string;
    explanation?: string;
    cardType: 'QA' | 'Cloze' | 'MCQ';

    // SM-2 fields
    interval: number; // in days
    repetition: number;
    easeFactor: number;
    dueDate: Date;
}

export interface Deck {
    id: string;
    name: string;
    cardIds: string[];
}

export enum View {
    Dashboard = 'dashboard',
    Notes = 'notes',
    Editor = 'editor',
    Deck = 'deck',
    Review = 'review',
    RAG = 'rag',
    Explain = 'explain',
}

export interface Source {
    noteId: string;
    title: string;
    snippet: string;
}
  
export interface ChatMessage {
    id: string;
    role: 'user' | 'assistant';
    text: string;
    sources?: Source[];
}
