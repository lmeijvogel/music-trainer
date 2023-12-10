import { Key, Note, Scale } from "tonal";
import { Prompt } from "./prompts/Prompt";

export abstract class PromptGenerator {
    private prompt: Prompt | undefined;

    /**
     * @param preventRepetitions If true, make sure that the same prompt is not repeated. Set this to false when restricting the input to a single note.
     */
    constructor(
        private readonly allowedKeySignatures: string[],
        protected readonly lowestNote: string,
        protected readonly highestNote: string,
        private readonly preventRepetitions = true) { }

    next(): Prompt {
        let newPrompt = this.makeRandomPrompt();

        while (this.preventRepetitions && newPrompt.equals(this.prompt)) {
            newPrompt = this.makeRandomPrompt();
        }

        this.prompt = newPrompt;

        return this.prompt;
    }

    abstract makeRandomPrompt(): Prompt;

    protected pickRandomKeySignature() {
        const sigs = this.allowedKeySignatures;

        const randomIndex = Math.floor(Math.random() * sigs.length);

        return sigs[randomIndex];
    }

    protected pickRandomNote(keySignature: string) {
        const candidateNotes = this.candidateNotes(keySignature);

        const randomIndex = Math.floor(Math.random() * candidateNotes.length);

        return candidateNotes[randomIndex];
    }

    protected candidateNotes(keySignature: string): string[] {
        if (this.lowestNote === this.highestNote) return [this.lowestNote];

        const range = Scale.rangeOf(`${keySignature} major`);

        const allNotes = range(this.lowestNote, this.highestNote).filter(isNotNull);

        // Extra emphasis on notes with accidentals since we want to learn those
        const notesWithAccidentals = allNotes.filter(note => Note.get(note).acc !== "");

        return [...allNotes, ...notesWithAccidentals];
    }


    protected correctAccidentals(note: string, keySignature: string) {
        const key = Key.majorKey(keySignature);

        const accidentalsAreDifferent = (Note.get(note).acc.startsWith("#") && key.alteration < 0) ||
            (Note.get(note).acc.startsWith("b") && key.alteration > 0);
        return accidentalsAreDifferent ? Note.enharmonic(note) : note;
    }
}

function isNotNull<T>(item: T | undefined | null): item is T {
    return !!item;
}
