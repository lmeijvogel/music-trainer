import { Interval, Note } from "tonal";
import { StartAndEndFret } from "../prompts/fretboard/StartAndEndFret";

export function getLowestAndHighestNotes(lowestAndHighestFret: StartAndEndFret, highestString: string, lowestString: string): [string, string] {
    const lowestNote = Note.transpose(lowestString, Interval.fromSemitones(lowestAndHighestFret.start));
    const highestNote = Note.transpose(highestString, Interval.fromSemitones(lowestAndHighestFret.end));

    return [lowestNote, highestNote];
}
