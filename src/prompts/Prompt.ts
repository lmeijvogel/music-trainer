import { Note } from "tonal";

export abstract class Prompt {
    constructor(readonly keySignature: string) {}

    abstract check(answer: string): string | undefined;

    abstract toVex(): NotesPerBeat[];

    abstract equals(other: Prompt | undefined): boolean;
}

export class NotesPerBeat {
    constructor(private readonly tonalNotes: string[]) {}

    toVex(): string[] {
        return this.tonalNotes.map((note) => `${Note.pitchClass(note)}/${Note.octave(note)}`);
    }
}
