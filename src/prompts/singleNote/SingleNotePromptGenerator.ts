import { correctForKey } from "../../helpers/correctForKey";
import { pickRandomKeySignature, pickRandomNote } from "../../helpers/promptGeneratorHelpers";
import { SingleNotePrompt } from "./SingleNotePrompt";

const allowedKeySignatures = ["C", "F", "Bb", "Eb", "G", "D", "A", "E"];

export class SingleNotePromptGenerator {
    constructor(
        private readonly lowestNote: string,
        private readonly highestNote: string) {
    }


    makeRandomPrompt = () => {
        const keySignature = pickRandomKeySignature(allowedKeySignatures);

        const note = pickRandomNote(keySignature, this.lowestNote, this.highestNote);

        const correctedNote = correctForKey(note, keySignature);

        return new SingleNotePrompt(keySignature, correctedNote);
    }
}

