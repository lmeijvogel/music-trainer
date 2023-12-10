import { checkIntervalInput, normalizeInterval } from "../checkIntervalInput";

describe("checkIntervalInput", () => {
    it("returns true if the input matches the answer", () => {
        const answer = checkIntervalInput("2m", "2m");

        expect(answer).toBeTruthy();
    });

    it("returns false if the input does not match the answer", () => {
        const answer = checkIntervalInput("2M", "2m");

        expect(answer).toBeFalsy();
    });

    it("matches different M/m/P before the interval", () => {
        const answer = checkIntervalInput("M2", "2M");

        expect(answer).toBeTruthy();
    });
});

describe.only("normalizeInterval", () => {
    test.each([
        ["1m", "1m"],
        ["m1", "1m"],
        ["A4", "4A"],
        ["d5", "5d"],
        ["1p", "1P"],
        ["4p", "4P"],
        ["p5", "5P"],
        ["1", "1P"],
        ["4", "4P"],
        ["5", "5P"],
    ])("normalized %p to %p", (input, expected) => {
        expect(normalizeInterval(input)).toEqual(expected);
    });
});
