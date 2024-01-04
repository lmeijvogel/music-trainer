import { correctForKey } from "../../helpers/correctForKey";
import { FretboardTestSpec } from "../../helpers/locationBarHelpers";
import { NotesPerBeat, Prompt } from "../Prompt";

export class FretboardPrompt extends Prompt {
    static fromTestSpec(testSpec: FretboardTestSpec): FretboardPrompt {
        return new FretboardPrompt(testSpec.keySignature, testSpec.note, testSpec.startFret, testSpec.endFret);
    }

    constructor(keySignature: string, readonly note: string, readonly startFret?: number, readonly endFret?: number) {
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
            note: this.note,
            startFret: this.startFret,
            endFret: this.endFret
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
