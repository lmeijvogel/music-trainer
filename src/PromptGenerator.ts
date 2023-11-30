import { Key, Note, Scale } from "tonal";
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

        const note = this.pickRandomNote(keySignature);

        const correctedNote = this.correctAccidentals(note, keySignature);

        return this.ctor(keySignature, correctedNote);
    }

    private pickRandomKeySignature() {
        const sigs = this.allowedKeySignatures;

        const randomIndex = Math.floor(Math.random() * sigs.length);

        return sigs[randomIndex];
    }

    private pickRandomNote(keySignature: string) {
        const candidateNotes = this.candidateNotes(keySignature);

        const randomIndex = Math.floor(Math.random() * candidateNotes.length);

        return candidateNotes[randomIndex];
    }

    private candidateNotes(keySignature: string): string[] {
        if (this.lowestNote === this.highestNote) return [this.lowestNote];

        const range = Scale.rangeOf(`${keySignature} major`);

        const allNotes = range(this.lowestNote, this.highestNote).filter(isNotNull);

        // Extra emphasis on notes with accidentals since we want to learn those
        const notesWithAccidentals = allNotes.filter(note => Note.get(note).acc !== "");

        return [...allNotes, ...notesWithAccidentals];
    }


    private correctAccidentals(note: string, keySignature: string) {
        const key = Key.majorKey(keySignature);

        const accidentalsAreDifferent = (Note.get(note).acc.startsWith("#") && key.alteration < 0) ||
            (Note.get(note).acc.startsWith("b") && key.alteration > 0);
        return accidentalsAreDifferent ? Note.enharmonic(note) : note;
    }
}

function isNotNull<T>(item: T | undefined | null): item is T {
    return !!item;
}
