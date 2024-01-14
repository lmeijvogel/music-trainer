import { Note, Scale } from "tonal";
import { Prompt } from "./prompts/Prompt";
import { parseLocationBar } from "./helpers/locationBarHelpers";

export abstract class PromptGenerator<T extends Prompt> {
    private prompt: T | undefined;

    constructor(
        private readonly allowedKeySignatures: string[],
        protected readonly lowestNote: string,
        protected readonly highestNote: string) { }

    next(): T {
        let newPrompt = this.makeRandomPrompt();

        // If window.location.hash exists, that means that the prompt is fixed.
        while (!window.location.hash && newPrompt.equals(this.prompt)) {
            newPrompt = this.makeRandomPrompt();
        }

        this.prompt = newPrompt;

        return this.prompt;
    }

    abstract makeRandomPrompt(): T;

    protected pickRandomKeySignature() {
        const testSpec = parseLocationBar(window.location);

        if (testSpec?.keySignature) {
            return testSpec.keySignature;
        }

        const sigs = this.allowedKeySignatures;

        const randomIndex = Math.floor(Math.random() * sigs.length);

        return sigs[randomIndex];
    }

    protected pickRandomNote(keySignature: string, lowestNote = this.lowestNote, highestNote = this.highestNote) {
        const candidateNotes = this.candidateNotes(keySignature, lowestNote, highestNote);

        const randomIndex = Math.floor(Math.random() * candidateNotes.length);

        return candidateNotes[randomIndex];
    }

    protected candidateNotes(keySignature: string, lowestNote: string, highestNote: string): string[] {
        if (lowestNote === highestNote) return [lowestNote];

        const range = Scale.rangeOf(`${keySignature} major`);

        const allNotes = range(lowestNote, highestNote).filter(isNotNull);

        // Extra emphasis on notes with accidentals since we want to learn those
        const notesWithAccidentals = allNotes.filter(note => Note.get(note).acc !== "");

        return [...allNotes, ...notesWithAccidentals];
    }
}

function isNotNull<T>(item: T | undefined | null): item is T {
    return !!item;
}
