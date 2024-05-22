import { StartAndEndFret } from "../../prompts/fretboard/StartAndEndFret";
import { getLowestAndHighestNotes } from "../getLowestAndHighestNotes";

describe("getLowestAndHighestNotes", () => {
    it("finds the correct notes", () => {
        const startAndEndFret: StartAndEndFret = {
            start: 3,
            end: 7
        };

        const expectedLowestNote = "G3";
        const expectedHighestNote = "B5";

        expect(getLowestAndHighestNotes(startAndEndFret, "E5", "E3")).toEqual([expectedLowestNote, expectedHighestNote]);
    });
});
