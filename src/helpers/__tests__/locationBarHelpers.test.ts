import { IntervalTestSpec, parseLocationBar, toLocationBar } from "../locationBarHelpers";

describe("parseLocationBar", () => {
    describe("when it returns an interval test", () => {
        it("returns nothing if there is nothing present", () => {
            const result = parseLocationBar({ hash: "" });

            expect(result).undefined;
        });

        it("returns the correct interval test", () => {
            const result = parseLocationBar({ hash: "#type=interval&notes=A3,C#3&keySignature=C#" });

            if (result?.type !== "interval") throw new Error("Expected 'interval' test spec");

            expect(result!.keySignature).toEqual("C#");
            expect(result!.notes).toEqual(["A3", "C#3"]);
        });

        it("returns the correct fretboard test", () => {
            const result = parseLocationBar({ hash: "#type=fretboard&note=C#3&keySignature=C#" });

            if (result?.type !== "fretboard") throw new Error("Expected 'fretboard' test spec");

            expect(result!.keySignature).toEqual("C#");
            expect(result.note).toEqual("C#3");
        });
    });
});

describe("toLocationBar", () => {
    it("converts a TestSpec to a location bar string", () => {
        const testSpec: IntervalTestSpec = {
            type: "interval",
            keySignature: "C#",
            notes: ["Cb", "A#", "F"]
        };

        expect(toLocationBar(testSpec)).toEqual("type=interval&keySignature=C#&notes=Cb,A#,F");
    });
});
