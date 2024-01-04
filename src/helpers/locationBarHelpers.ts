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

    const type = getValue("type", location.hash);

    if (!type) return undefined;

    const keySignature = getValue("keySignature", location.hash);

    switch (type) {
        case "singleNote": {
            const note = getValue("note", location.hash);

            if (!keySignature || !note) return undefined;

            return {
                type: "singleNote",
                keySignature,
                note
            }
        }
        case "fretboard": {
            const note = getValue("note", location.hash);

            if (!keySignature || !note) return undefined;


            return {
                type: "fretboard",
                keySignature,
                note
            }
        }
        case "interval": {
            const notes = getValue("notes", location.hash);

            if (!keySignature || !notes) return undefined;

            return {
                type: "interval",
                keySignature,
                notes: notes.split(",")
            }
        }
        default:
            return undefined;
    }

}

export function toLocationBar(testSpec: TestSpec): string {
    return Object.entries(testSpec).map(([key, value]) => `${key}=${value}`).join("&");
}

function getValue(key: string, hash: string): string | undefined {
    const match = hash.match(new RegExp(`${key}=([^&]*)`));

    if (!match) return undefined;

    return match[1];
}
