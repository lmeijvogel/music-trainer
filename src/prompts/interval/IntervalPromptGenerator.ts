import { Interval, Note } from "tonal";
import { IntervalPrompt } from "./IntervalPrompt";
import { pickRandomKeySignature, pickRandomNote } from "../../helpers/promptGeneratorHelpers";

export class IntervalPromptGenerator {
    constructor(
        private readonly lowestNote: string,
        private readonly highestNote: string) {
    }


    protected allowedKeySignatures(): string[] {
        return ["C", "F", "Bb", "Eb", "G", "D", "A", "E"];
    }

    makeRandomPrompt = () => {
        const keySignature = pickRandomKeySignature(this.allowedKeySignatures());

        return new IntervalPrompt(keySignature, this.pickRandomNotes(keySignature, 1));
    }

    pickRandomNotes(keySignature: string, octaves: number): string[] {
        const firstNote = pickRandomNote(keySignature, this.lowestNote, this.highestNote);

        const intervalInSemitones = Math.floor(Math.random() * octaves * 12);

        const secondNoteTooHigh = (Note.get(firstNote).height! + intervalInSemitones > Note.get(this.highestNote).height!);

        if (secondNoteTooHigh) {
            const correctedInterval = -intervalInSemitones;

            const secondNote = Note.transpose(firstNote, Interval.fromSemitones(correctedInterval))!;
            return [secondNote, firstNote];
        }

        const secondNote = Note.transpose(firstNote, Interval.fromSemitones(intervalInSemitones))!;

        return [firstNote, secondNote];
    }
}
