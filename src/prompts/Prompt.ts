import { Key, Note } from "tonal";

export abstract class Prompt {
    constructor(readonly keySignature: string) { }

    abstract check(answer: string): boolean;

    correctForKey(note: string): string {
        const key = Key.majorKey(this.keySignature);

        if (key.alteration < 0 && Note.get(note)!.acc.startsWith("#")) {
            return Note.enharmonic(note);
        }

        return note;
    }

    abstract toVex(): string;

    abstract equals(other: Prompt | undefined): boolean;
}
