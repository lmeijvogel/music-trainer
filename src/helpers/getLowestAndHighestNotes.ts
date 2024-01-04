import { Interval, Note } from "tonal";
import { StartAndEndFret } from "../prompts/fretboard/StartAndEndFret";

const lowestStringBaseNote = "E3";
const highestStringBaseNote = "E5";

export function getLowestAndHighestNotes(lowestAndHighestFret: StartAndEndFret): [string, string] {
    const lowestNote = Note.transpose(lowestStringBaseNote, Interval.fromSemitones(lowestAndHighestFret.start));
    const highestNote = Note.transpose(highestStringBaseNote, Interval.fromSemitones(lowestAndHighestFret.end));

    return [lowestNote, highestNote];
}
