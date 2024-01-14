import { PromptGenerator } from "../../PromptGenerator";
import { correctForKey } from "../../helpers/correctForKey";
import { SingleNotePrompt } from "./SingleNotePrompt";

export class SingleNotePromptGenerator extends PromptGenerator<SingleNotePrompt> {
    makeRandomPrompt(): SingleNotePrompt {
        const keySignature = this.pickRandomKeySignature();

        const note = this.pickRandomNote(keySignature);

        const correctedNote = correctForKey(note, keySignature);

        return new SingleNotePrompt(keySignature, correctedNote);
    }
}

