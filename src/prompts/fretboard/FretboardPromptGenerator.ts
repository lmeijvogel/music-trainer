import { FretboardPrompt } from "./FretboardPrompt";
import { Prompt } from "../Prompt";
import { PromptGenerator } from "../../PromptGenerator";

export class FretboardPromptGenerator extends PromptGenerator {
    makeRandomPrompt(): Prompt {
        const keySignature = this.pickRandomKeySignature();

        const note = this.pickRandomNote(keySignature);

        const correctedNote = this.correctAccidentals(note, keySignature);

        return new FretboardPrompt(keySignature, correctedNote);
    }
}

