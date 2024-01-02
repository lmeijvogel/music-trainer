import { Interval } from "tonal";
import { NotesPerBeat, Prompt } from "../Prompt";
import { checkIntervalInput } from "./checkIntervalInput";
import { IntervalTestSpec } from "../../helpers/locationBarHelpers";

export class IntervalPrompt extends Prompt {
    static fromTestSpec(testSpec: IntervalTestSpec): Prompt | (() => Prompt) {
        return new IntervalPrompt(testSpec.keySignature, testSpec.notes);
    }

    constructor(keySignature: string, private readonly notes: string[]) {
        super(keySignature);
    }
    check(input: string) {
        const answer = Interval.distance(this.notes[0], this.notes[1])

        if (checkIntervalInput(input.trim(), answer))
            return undefined;

        return `Answer is ${this.intervalToString(answer)} (${this.notes[0]} -> ${this.notes[1]}), but you answered ${this.intervalToString(input)}`;

    }
    toVex(): NotesPerBeat[] {
        return [new NotesPerBeat(this.notes)];
    }

    toTestSpec(): IntervalTestSpec {
        return {
            type: "interval",
            keySignature: this.keySignature,
            notes: this.notes
        };
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

    intervalToString(intervalToParse: string): string {
        const parsedInterval = this.parseInterval(intervalToParse);

        if (!parsedInterval) return intervalToParse;

        const { interval, modifier } = parsedInterval;

        return `${this.modifierToString(modifier)} ${this.numberToString(interval)}`;
    }

    parseInterval(interval: string): { interval: number, modifier: string } | undefined {
        const intervalFirstMatch = interval.match(/^(\d+)(.*)$/);

        if (intervalFirstMatch) {
            const interval = parseInt(intervalFirstMatch[1]);
            const modifier = intervalFirstMatch[2];

            return {
                interval,
                modifier
            };
        }

        const intervalLastMatch = interval.match(/^([A-Za-z]*)(\d+)$/);

        if (intervalLastMatch) {
            const modifier = intervalLastMatch[1];
            const interval = parseInt(intervalLastMatch[2]);

            return {
                interval,
                modifier
            };
        }

        return undefined;
    }

    numberToString(nr: number): string {
        let postfix = "th";
        switch (nr) {
            case 1:
                postfix = "st";
                break;
            case 2:
                postfix = "nd";
                break;
            case 3:
                postfix = "rd";
                break;
        }

        return `${nr}${postfix}`;
    }

    modifierToString(modifier: string): string {
        switch (modifier) {
            case "A":
            case "a":
                return "Augmented";
            case "D":
            case "d":
                return "Diminished";
            case "m":
                return "Minor";
            case "M":
                return "Major"
            default:
                return "Perfect";
        }
    }

    toString() {
        return Interval.distance(this.notes[0], this.notes[1]);
    }
}
