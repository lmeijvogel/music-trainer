import { PromptGenerator } from "../../PromptGenerator";
import { Prompt } from "../Prompt";
import { SingleNotePrompt } from "./SingleNotePrompt";

export class SingleNotePromptGenerator extends PromptGenerator {
    makeRandomPrompt(): Prompt {
        const keySignature = this.pickRandomKeySignature();

        const note = this.pickRandomNote(keySignature);

        const correctedNote = this.correctAccidentals(note, keySignature);

        return new SingleNotePrompt(keySignature, correctedNote);
    }
}

