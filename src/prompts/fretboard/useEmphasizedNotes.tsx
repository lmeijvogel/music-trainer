import { useState } from "react";

/**
 * Stores notes that the user didn't answer correctly, so they can be
 * prompted more often.
 *
 * Internally, it keeps a counter for each note that it increments when
 * a note is marked incorrect. If the counter is > 0, the note is marked
 * to be emphasized.
 */

// Keep CORRECT_WEIGHT significantly smaller than INCORRECT_WEIGHT, so the note
// is proposed more often.
const CORRECT_WEIGHT = -1;
const INCORRECT_WEIGHT = 3;

export const useEmphasizedNotes: () => [string[], (note: string) => void, (note: string) => void] = () => {
    const [emphasizedNotes, setEmphasizedNotes] = useState<string[]>([]);
    const [emphasizedNotesWeights, setEmphasizeNotesWeights] = useState<Map<string, number>>(new Map());

    const markCorrect: (note: string) => void = (note) => {
        addValue(note, CORRECT_WEIGHT);
    };

    const markIncorrect: (note: string) => void = (note) => {
        addValue(note, INCORRECT_WEIGHT);
    };

    function addValue(note: string, delta: number) {
        const emphasis = emphasizedNotesWeights.get(note) ?? 0;

        const newValue = Math.max(-1, emphasis + delta);

        emphasizedNotesWeights.set(note, newValue);

        setEmphasizeNotesWeights(new Map(emphasizedNotesWeights));

        recalculateEmphasizedNotes();
    }

    function recalculateEmphasizedNotes() {
        const result: string[] = [];
        for (const [note, value] of emphasizedNotesWeights.entries()) {
            if (value > 0) {
                result.push(note);
            }
        }

        setEmphasizedNotes(result);
    }

    return [emphasizedNotes, markCorrect, markIncorrect];
};

