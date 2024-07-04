import { Scale, Note } from "tonal";
import { isNotNull } from "./generalHelpers";
import { parseLocationBar } from "./locationBarHelpers";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function findNextPrompt<T extends { equals: (other: any) => boolean }>(generator: () => T, currentPrompt: T | undefined): T {
    let newPrompt = generator();

    // If window.location.hash exists, that means that the prompt is fixed.
    while (!window.location.hash && newPrompt.equals(currentPrompt)) {
        newPrompt = generator();
    }

    return newPrompt;
}

export function pickRandomKeySignature(allowedKeySignatures: string[]) {
    const testSpec = parseLocationBar(window.location);

    if (testSpec?.keySignature) {
        return testSpec.keySignature;
    }

    const randomIndex = Math.floor(Math.random() * allowedKeySignatures.length);

    return allowedKeySignatures[randomIndex];
}

export function pickRandomNote(keySignature: string, lowestNote: string, highestNote: string, emphasizedNotes: string[] = []) {
    const candidateNotes = enumerateCandidateNotes(keySignature, lowestNote, highestNote);

    // Only pick emphasized notes that are selectable
    const emphasizedNotesInRange = emphasizedNotes.filter(note => candidateNotes.includes(note));

    // Emphasized notes will be picked about twice as much
    const candidateNotesWithEmphasizedNotes = [...candidateNotes, ...emphasizedNotesInRange];

    const randomIndex = Math.floor(Math.random() * candidateNotesWithEmphasizedNotes.length);

    return candidateNotesWithEmphasizedNotes[randomIndex];
}

function enumerateCandidateNotes(keySignature: string, lowestNote: string, highestNote: string): string[] {
    if (lowestNote === highestNote) return [lowestNote];

    const range = Scale.rangeOf(`${keySignature} major`);

    const allNotes = range(lowestNote, highestNote).filter(isNotNull);

    // Extra emphasis on notes with accidentals since we want to learn those
    const notesWithAccidentals = allNotes.filter(note => Note.get(note).acc !== "");

    return [...allNotes, ...notesWithAccidentals];
}
