export abstract class Prompt {
    constructor(readonly keySignature: string) { }

    abstract check(answer: string): boolean;
}
