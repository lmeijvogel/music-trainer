type WithHash = { hash: string };

export type SingleNoteTestSpec = {
    type: "singleNote";
    keySignature: string;
    note: string;
};

export type FretboardTestSpec = {
    type: "fretboard";
    keySignature: string;
    note: string;
};

export type IntervalTestSpec = {
    type: "interval";
    keySignature: string;
    notes: string[];
};

export type TestSpec = SingleNoteTestSpec | FretboardTestSpec | IntervalTestSpec;

export function parseLocationBar(location: WithHash): TestSpec | undefined {
    if (!location.hash.startsWith("#")) return undefined;

    const typeMatch = location.hash.match(/type=([^&]*)/);
    if (!typeMatch) return undefined;

    const keySignatureMatch = location.hash.match(/keySignature=([^&]*)/);

    switch (typeMatch[1]) {
        case "singleNote": {
            const noteMatch = location.hash.match(/note=([^&]*)/);

            if (!keySignatureMatch || !noteMatch) return undefined;

            return {
                type: "singleNote",
                keySignature: keySignatureMatch[1],
                note: noteMatch[1]
            }
        }
        case "fretboard": {
            const noteMatch = location.hash.match(/note=([^&]*)/);

            if (!keySignatureMatch || !noteMatch) return undefined;

            return {
                type: "fretboard",
                keySignature: keySignatureMatch[1],
                note: noteMatch[1]
            }
        }
        case "interval": {
            const notesMatch = location.hash.match(/notes=([^&]*)/);

            if (!keySignatureMatch || !notesMatch) return undefined;

            return {
                type: "interval",
                keySignature: keySignatureMatch[1],
                notes: notesMatch[1].split(",")
            }
        }
        default:
            return undefined;
    }

}

export function toLocationBar(testSpec: TestSpec): string {
    return Object.entries(testSpec).map(([key, value]) => `${key}=${value}`).join("&");
}
