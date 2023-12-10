import { Interval } from "tonal";
import { NotesPerBeat, Prompt } from "../Prompt";
import { checkIntervalInput } from "./checkIntervalInput";

export class IntervalPrompt extends Prompt {
    constructor(keySignature: string, private readonly notes: string[]) {
        super(keySignature);
    }
    check(input: string) {
        const answer = Interval.distance(this.notes[0], this.notes[1])

        if (checkIntervalInput(input.trim(), answer))
            return undefined;

        return `Answer is ${answer} (${this.notes[0]} -> ${this.notes[1]}), but you answered ${input}`;

    }
    toVex(): NotesPerBeat[] {
        return [new NotesPerBeat(this.notes)];
    }
    equals(other: Prompt | undefined): boolean {
        if (!(other instanceof IntervalPrompt)) return false;

        if (this.keySignature !== other?.keySignature) return false;

        if (this.notes.length !== other.notes.length) return false;

        for (let i = 0; i < this.notes.length; i++) {
            if (this.notes[i] !== other.notes[i]) return false;
        }

        return true;
    }

    toString() {
        return Interval.distance(this.notes[0], this.notes[1]);
    }
}
