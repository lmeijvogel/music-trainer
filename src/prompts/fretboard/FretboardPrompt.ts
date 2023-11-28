import { Note } from "tonal";
import { correctForKey } from "../../helpers/correctForKey";
import { Prompt } from "../Prompt";

export class FretboardPrompt extends Prompt {
    constructor(keySignature: string, readonly note: string) {
        super(keySignature);
    }

    check(answer: string) {
        const correctedAnswer = correctForKey(answer, this.keySignature);

        return this.note === correctedAnswer;
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
        return this.note;
    }
}
