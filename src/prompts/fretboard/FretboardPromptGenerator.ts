import { FretboardPrompt } from "./FretboardPrompt";
import { PromptGenerator } from "../../PromptGenerator";

export class FretboardPromptGenerator extends PromptGenerator<FretboardPrompt> {
    makeRandomPrompt(): FretboardPrompt {
        const keySignature = this.pickRandomKeySignature();

        const note = this.pickRandomNote(keySignature);

        const correctedNote = this.correctAccidentals(note, keySignature);

        return new FretboardPrompt(keySignature, correctedNote);
    }
}

