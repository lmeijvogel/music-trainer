import { FretboardPrompt } from "./FretboardPrompt";
import { StartAndEndFret, startAndEndFrets } from "./StartAndEndFret";
import { getLowestAndHighestNotes } from "../../helpers/getLowestAndHighestNotes";
import { correctForKey } from "../../helpers/correctForKey";
import { pickRandomNote } from "../../helpers/promptGeneratorHelpers";
import { FretboardTestSettings } from "./FretboardTestSettings";

export class FretboardPromptGenerator {
    constructor(private settings: FretboardTestSettings) { }

    makeRandomPrompt = () => {
        const keySignature = this.settings.keySignature;

        const fretGroup = this.pickRandomFretGroup();

        const [lowestString, highestString] = this.getStringsFromLevel();
        const [lowestNote, highestNote] = getLowestAndHighestNotes(fretGroup, highestString, lowestString);

        const note = pickRandomNote(keySignature, lowestNote, highestNote);

        const correctedNote = correctForKey(note, keySignature);

        return new FretboardPrompt(keySignature, correctedNote, fretGroup.start, fretGroup.end);
    };

    private pickRandomFretGroup(): StartAndEndFret {
        const availablePositions = startAndEndFrets.filter(
            ({ start }) => this.settings.minPosition <= start && start <= this.settings.maxPosition
        );

        const position = Math.floor(Math.random() * availablePositions.length);

        return availablePositions[position] ?? startAndEndFrets[0];
    }

    private getStringsFromLevel() {
        const allStrings = ["E5", "B4", "G4", "D4", "A3", "E3"];

        const highestNote = allStrings[0];

        const lowestNote = this.settings.strings[this.settings.strings.length - 1];

        return [lowestNote, highestNote];
    }
}
