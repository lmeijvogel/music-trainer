import { FretboardPrompt } from "./FretboardPrompt";
import { StartAndEndFret, startAndEndFrets } from "./StartAndEndFret";
import { getLowestAndHighestNotes } from "../../helpers/getLowestAndHighestNotes";
import { correctForKey } from "../../helpers/correctForKey";
import { pickRandomNote } from "../../helpers/promptGeneratorHelpers";
import { FretboardTestSettings } from "./FretboardTestSettings";
import { allStrings } from "./constants";

export class FretboardPromptGenerator {
    emphasizedNotes: string[] = [];

    constructor(private settings: FretboardTestSettings) { }

    setEmphasizedNotes(emphasizedNotes: string[]) {
        this.emphasizedNotes = emphasizedNotes;
    }

    makeRandomPrompt = () => {
        const keySignature = this.settings.keySignature;

        const fretGroup = this.pickRandomFretGroup();

        const [lowestString, highestString] = this.getStringsFromLevel();
        const [lowestNote, highestNote] = getLowestAndHighestNotes(fretGroup, highestString, lowestString);

        const note = pickRandomNote(keySignature, lowestNote, highestNote, this.emphasizedNotes);

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
        const highestString = this.settings.minString ?? allStrings[0];

        const lowestString = this.settings.maxString ?? allStrings[0];

        return [lowestString, highestString];
    }
}
