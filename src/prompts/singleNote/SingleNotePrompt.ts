import { Note } from "tonal";
import { Prompt } from "../Prompt";

export class SingleNotePrompt extends Prompt {
    constructor(keySignature: string, readonly note: string) {
        super(keySignature);
    }

    check(answer: string) {
        return answer.toLowerCase() === Note.pitchClass(this.note).toLowerCase();
    }

    toVex(): string {
        return `${Note.pitchClass(this.note)}/${Note.octave(this.note)}`;
    }

    equals(other: Prompt | undefined) {
        if (other instanceof SingleNotePrompt) {
            return this.keySignature === other.keySignature && this.note === other.note;
        }

        return false;
    }

    toString(): string {
        return Note.pitchClass(this.note).toLowerCase();
    }
}
