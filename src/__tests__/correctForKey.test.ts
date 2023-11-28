import { correctForKey } from "../helpers/correctForKey";

describe("correctForKey", () => {
    it("doesn't correct anything in C", () => {
        expect(correctForKey("D#5", "C")).toEqual("D#5");
        expect(correctForKey("Eb5", "C")).toEqual("Eb5");
    });

    it("corrects appropriately in a flatted key", () => {
        expect(correctForKey("D#5", "Bb")).toEqual("Eb5");
        expect(correctForKey("C", "Bb")).toEqual("C");
        expect(correctForKey("Eb5", "Bb")).toEqual("Eb5");
    });

    it("corrects appropriately in a sharped key", () => {
        expect(correctForKey("D#5", "G")).toEqual("D#5");
        expect(correctForKey("C", "G")).toEqual("C");
        expect(correctForKey("Eb5", "G")).toEqual("D#5");
    });
});
