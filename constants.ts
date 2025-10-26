import { Note, Deck, Card } from './types';

export const sampleNotes: Note[] = [
  {
    id: 'note-1',
    title: 'Introduction to Photosynthesis',
    content: `Photosynthesis is a process used by plants, algae, and certain bacteria to convert light energy into chemical energy, through a process that converts carbon dioxide and water into glucose (a sugar) and oxygen.

The overall chemical equation for photosynthesis is:
6CO2 + 6H2O + Light Energy → C6H12O6 + 6O2

Key concepts:
- Chlorophyll: The green pigment responsible for absorbing light energy. It's what gives plants their green color.
- Chloroplasts: The organelles within plant cells where photosynthesis takes place.
- Stomata: Small pores on the surface of leaves that allow for gas exchange (CO2 in, O2 out).

There are two main stages:
1. Light-dependent reactions: Occur in the thylakoid membrane and require a continuous supply of light energy. Water is split to produce oxygen, ATP, and NADPH.
2. Calvin Cycle (light-independent reactions): Occurs in the stroma. It uses ATP and NADPH from the light-dependent reactions to convert carbon dioxide into glucose. This stage does not directly require light.

The chemical formula E = mc^2 describes the principle of mass-energy equivalence.`,
    tags: ['biology', 'science', 'plants'],
    updatedAt: new Date('2024-10-25T10:00:00Z'),
  },
  {
    id: 'note-2',
    title: 'React Hooks Basics',
    content: `React Hooks are functions that let you “hook into” React state and lifecycle features from function components. Hooks don’t work inside classes — they let you use React without classes.

Key Hooks:
- useState: Lets you add React state to function components. You pass the initial state to this function and it returns a variable with the current state value and another function to update this value.
- useEffect: Lets you perform side effects in function components. It is a close replacement for componentDidMount, componentDidUpdate, and componentWillUnmount in React classes.
- useContext: Lets you subscribe to React context without introducing nesting.

Rules of Hooks:
1. Only call Hooks at the top level. Don’t call Hooks inside loops, conditions, or nested functions.
2. Only call Hooks from React function components.`,
    tags: ['react', 'frontend', 'javascript', 'webdev'],
    updatedAt: new Date('2024-10-26T14:30:00Z'),
  }
];

export const sampleCards: Record<string, Card> = {
    'card-1': {
        id: 'card-1',
        deckId: 'deck-1',
        sourceNoteId: 'note-1',
        front: 'What is the main purpose of photosynthesis?',
        back: 'To convert light energy into chemical energy in the form of glucose.',
        explanation: 'This process is essential for plants to create their own food.',
        cardType: 'QA',
        interval: 2,
        repetition: 1,
        easeFactor: 2.5,
        dueDate: new Date(Date.now() - 86400000) // Yesterday
    },
    'card-2': {
        id: 'card-2',
        deckId: 'deck-1',
        sourceNoteId: 'note-1',
        front: 'The green pigment in plants that absorbs light is called {{c1::chlorophyll}}.',
        back: 'chlorophyll',
        cardType: 'Cloze',
        interval: 5,
        repetition: 2,
        easeFactor: 2.6,
        dueDate: new Date(Date.now() + 86400000 * 3) // 3 days from now
    },
    'card-3': {
        id: 'card-3',
        deckId: 'deck-2',
        sourceNoteId: 'note-2',
        front: 'Which hook is used to add state to a functional component?',
        back: 'useState',
        cardType: 'QA',
        interval: 0,
        repetition: 0,
        easeFactor: 2.5,
        dueDate: new Date(Date.now() - 86400000 * 2) // 2 days ago (due)
    }
};


export const sampleDecks: Deck[] = [
    {
        id: 'deck-1',
        name: 'Biology 101',
        cardIds: ['card-1', 'card-2']
    },
    {
        id: 'deck-2',
        name: 'React Fundamentals',
        cardIds: ['card-3']
    }
];