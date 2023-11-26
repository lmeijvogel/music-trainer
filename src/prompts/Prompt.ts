export abstract class Prompt {
    constructor(readonly keySignature: string) { }

    abstract check(answer: string): boolean;

    abstract toVex(): string;

    abstract equals(other: Prompt | undefined): boolean;
}
