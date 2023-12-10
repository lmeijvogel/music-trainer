import { Interval, Note, Scale } from "tonal";

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

    it("finds ascending or descending intervals", () => {
        const g5 = Note.get("G5")
        const gs5 = Note.get("G#5")
        const a5 = Note.get("A5")
        const b5 = Note.get("B5")

        if (g5.empty) return;
        if (gs5.empty) return;
        if (a5.empty) return;
        if (b5.empty) return;

        expect(Note.ascending(g5, gs5)).toEqual(-1);
        expect(Note.ascending(g5, gs5)).toEqual(-1);
        expect(Note.ascending(g5, a5)).toEqual(-2);
        expect(Note.ascending(g5, b5)).toEqual(-4);
    });

    it("can add intervals", () => {
        const firstNote = "G5";
        const interval = 12;

        const result = Note.transpose(firstNote, Interval.fromSemitones(interval));

        expect(result).toEqual("G6");
    });

    it("can find intervals", () => {
        const firstNote = "C5";
        const perfectFifth = "G5";

        expect(Interval.distance(firstNote, perfectFifth)).toEqual("5P");

        const majorSixth = "A5";
        expect(Interval.distance(firstNote, majorSixth)).toEqual("6M");
    });
});
