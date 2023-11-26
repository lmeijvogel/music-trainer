import { Note } from "tonal";
import { Prompt } from "../Prompt";

export class FretboardPrompt extends Prompt {
    constructor(keySignature: string, readonly note: string) {
        super(keySignature);
    }

    check(answer: string) {
        console.log("Received answer: ", answer, ". Should be ", this.note);
        return answer === this.note;
    }

    toVex(): string {
        return `${Note.pitchClass(this.note)}/${Note.octave(this.note)}`;
    }

    equals(other: Prompt | undefined) {
        if (other instanceof FretboardPrompt) {
            return this.keySignature === other.keySignature && this.note === other.note;
        }

        return false;
    }

    toString(): string {
        return Note.pitchClass(this.note).toLowerCase();
    }
}
