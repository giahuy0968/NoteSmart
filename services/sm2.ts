
import { Card } from '../types';

export type SM2Grade = 0 | 1 | 2 | 3; // 0: Again, 1: Hard, 2: Good, 3: Easy

export const updateCardWithSm2 = (card: Card, grade: SM2Grade): Card => {
  let { repetition, interval, easeFactor } = card;

  if (grade < 2) { // Again / Hard
    repetition = 0;
    interval = 1;
  } else { // Good / Easy
    repetition += 1;
    
    // Update ease factor
    const newEaseFactor = easeFactor + 0.1 - (3 - grade) * (0.08 + (3 - grade) * 0.02);
    easeFactor = Math.max(1.3, newEaseFactor);

    if (repetition === 1) {
      interval = 1;
    } else if (repetition === 2) {
      interval = 6;
    } else {
      interval = Math.round(interval * easeFactor);
    }
  }

  const dueDate = new Date();
  dueDate.setDate(dueDate.getDate() + interval);
  
  return {
    ...card,
    repetition,
    interval,
    easeFactor,
    dueDate,
  };
};
