import { FretboardPrompt } from "./FretboardPrompt";
import { PromptGenerator } from "../../PromptGenerator";
import { StartAndEndFret, startAndEndFrets } from "./StartAndEndFret";
import { getLowestAndHighestNotes } from "../../helpers/getLowestAndHighestNotes";
import { correctForKey } from "../../helpers/correctForKey";

export class FretboardPromptGenerator extends PromptGenerator<FretboardPrompt> {
    makeRandomPrompt(): FretboardPrompt {
        const keySignature = this.pickRandomKeySignature();

        const fretGroup = this.pickRandomFretGroup();

        const [lowestNote, highestNote] = getLowestAndHighestNotes(fretGroup);

        const note = this.pickRandomNote(keySignature, lowestNote, highestNote);

        const correctedNote = correctForKey(note, keySignature);

        return new FretboardPrompt(keySignature, correctedNote, fretGroup.start, fretGroup.end);
    }

    pickRandomFretGroup(): StartAndEndFret {
        const index = Math.floor(Math.random() * startAndEndFrets.length);

        return startAndEndFrets[index];
    }
}

