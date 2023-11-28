import { Note, Scale } from "tonal";
import { Prompt } from "./prompts/Prompt";

export class PromptGenerator {
    private prompt: Prompt | undefined;

    /**
     * @param preventRepetitions If true, make sure that the same prompt is not repeated. Set this to false when restricting the input to a single note.
     */
    constructor(
        private readonly allowedKeySignatures: string[],
        private readonly lowestNote: string,
        private readonly highestNote: string,
        private readonly ctor: (keySignature: string, note: string) => Prompt,
        private readonly preventRepetitions = true) { }

    next(): Prompt {
        const newPrompt = this.makeRandomPrompt();

        if (this.preventRepetitions && newPrompt.equals(this.prompt)) {
            return this.next();
        }

        this.prompt = this.makeRandomPrompt();

        return this.prompt;
    }

    makeRandomPrompt(): Prompt {
        const keySignature = this.pickRandomKeySignature();

        const candidateNotes = this.candidateNotes(keySignature);

        const randomIndex = Math.floor(Math.random() * candidateNotes.length);

        const note = candidateNotes[randomIndex];

        return this.ctor(keySignature, note);
    }

    private candidateNotes(keySignature: string): string[] {
        const range = Scale.rangeOf(`${keySignature} major`);

        const allNotes = range(this.lowestNote, this.highestNote).filter(isNotNull);

        // Extra emphasis on notes with accidentals since we want to learn those
        const notesWithAccidentals = allNotes.filter(note => Note.get(note).acc !== "");

        return [...allNotes, ...notesWithAccidentals];
    }

    private pickRandomKeySignature() {
        const sigs = this.allowedKeySignatures;

        const randomIndex = Math.floor(Math.random() * sigs.length);

        return sigs[randomIndex];
    }
}

function isNotNull<T>(item: T | undefined | null): item is T {
    return !!item;
}
