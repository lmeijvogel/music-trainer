import { correctForKey } from "../../helpers/correctForKey";
import { FretboardTestSpec } from "../../helpers/locationBarHelpers";
import { NotesPerBeat, Prompt } from "../Prompt";

export class FretboardPrompt extends Prompt {
    static fromTestSpec(testSpec: FretboardTestSpec): Prompt | (() => Prompt) {
        return new FretboardPrompt(testSpec.keySignature, testSpec.note);
    }

    constructor(keySignature: string, readonly note: string) {
        super(keySignature);
    }

    check(input: string) {
        const correctedInput = correctForKey(input, this.keySignature);

        if (this.note === correctedInput)
            return undefined;

        return `Answer was ${this.note}, you answered ${correctedInput}.`;
    }

    toVex(): NotesPerBeat[] {
        return [new NotesPerBeat([this.note])];
    }

    toTestSpec(): FretboardTestSpec {
        return {
            type: "fretboard",
            keySignature: this.keySignature,
            note: this.note
        };
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
