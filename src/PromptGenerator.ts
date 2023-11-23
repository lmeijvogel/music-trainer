import { Scale } from "tonal";
import { Prompt } from "./prompts/Prompt";
import { SingleNotePrompt } from "./prompts/singleNote/SingleNotePrompt";

export class PromptGenerator {
    private prompt: Prompt | undefined;

    constructor(readonly allowedKeySignatures: string[]) { }

    next(): Prompt {
        this.prompt = this.makeRandomPrompt();

        return this.prompt;
    }

    makeRandomPrompt(): Prompt {
        const keySignature = this.pickRandomKeySignature();

        const candidateNotes = this.candidateNotes(keySignature);

        const randomIndex = Math.floor(Math.random() * candidateNotes.length);

        const note = candidateNotes[randomIndex];

        return new SingleNotePrompt(keySignature, note);
    }

    private candidateNotes(keySignature: string): string[] {
        const range = Scale.rangeOf(`${keySignature} major`);

        const allNotes = range("E3", "A5");

        return allNotes.filter(isNotNull);
    }

    private pickRandomKeySignature() {
        const sigs = this.allowedKeySignatures;

        const randomIndex = Math.floor(Math.random() * sigs.length);

        console.log({ randomIndex });
        return sigs[randomIndex];
    }
}

function isNotNull<T>(item: T | undefined | null): item is T {
    return !!item;
}
