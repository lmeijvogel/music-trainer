import { Note } from "tonal";
import { NotesPerBeat, Prompt } from "../Prompt";
import { SingleNoteTestSpec } from "../../helpers/locationBarHelpers";

export class SingleNotePrompt extends Prompt {
    static fromTestSpec(testSpec: SingleNoteTestSpec): Prompt | (() => Prompt) {
        return new SingleNotePrompt(testSpec.keySignature, testSpec.note);
    }

    constructor(keySignature: string, readonly note: string) {
        super(keySignature);
    }

    check(answer: string) {
        if (answer.toLowerCase() === Note.pitchClass(this.note).toLowerCase())
            return undefined;

        return `Wrong answer: You answered ${answer} while the answer was ${Note.pitchClass(this.note)}.`;
    }

    toVex(): NotesPerBeat[] {
        return [new NotesPerBeat([this.note])];
    }

    toTestSpec(): SingleNoteTestSpec {
        return {
            type: "singleNote",
            keySignature: this.keySignature,
            note: this.note
        };
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
