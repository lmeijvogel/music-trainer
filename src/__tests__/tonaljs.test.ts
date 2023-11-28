import { Note, Scale } from "tonal";

describe("Tonal", () => {
    it("decodes a note", () => {
        const note = Note.get("C#4");
        expect(note.acc).toEqual("#");
        expect(note.letter).toEqual("C");
        expect(note.oct).toEqual(4);
    });

    it("finds enharmonics", () => {
        expect(Note.enharmonic("D#5")).toEqual("Eb5");
        expect(Note.enharmonic("Eb5")).toEqual("D#5");
        expect(Note.enharmonic("E5")).toEqual("E5");
    });

    it("gives scale info", () => {
        const scale = Scale.get("B5 major");

        expect(scale.notes.length).toEqual(7);
        expect(scale.tonic).toEqual("B5");
    });
});

