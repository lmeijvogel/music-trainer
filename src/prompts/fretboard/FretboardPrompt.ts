import { Note } from "tonal";
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
        // correctForKey changes sharps to flats or vice versa, depending on the
        // key signature. (e.g. If the key signature is F, we interpret Bb as Bb and not as A#)
        const correctedInput = correctForKey(input, this.keySignature);

        // Note.simplify() returns the simplest enharmonic note, e.g. B# will
        // be simplified to C. This makes it easier to check.
        if (Note.simplify(this.note) === Note.simplify(correctedInput))
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
