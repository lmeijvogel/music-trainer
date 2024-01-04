import { Interval, Note } from "tonal";
import { PromptGenerator } from "../../PromptGenerator";
import { IntervalPrompt } from "./IntervalPrompt";

export class IntervalPromptGenerator extends PromptGenerator<IntervalPrompt> {
    makeRandomPrompt(): IntervalPrompt {
        const keySignature = this.pickRandomKeySignature();

        return new IntervalPrompt(keySignature, this.pickRandomNotes(keySignature, 1));
    }

    pickRandomNotes(keySignature: string, octaves: number): string[] {
        const firstNote = this.pickRandomNote(keySignature);

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
