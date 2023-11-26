type Modifier = "sharp" | "natural" | "flat";

export type NoteAndModifier = {
    note: string,
    modifier?: Modifier | undefined;
};

export type ChordNotes = {
    name: string;
    notes: NoteAndModifier[];
};

export function buildRegularChords(): ChordNotes[] {
    const E = [
        { note: "E/3" },
        { note: "B/3" },
        { note: "E/4" },
        { note: "G/4", modifier: "sharp" as Modifier },
        { note: "B/4" },
        { note: "E/5" }
    ];

    return [{ name: "E", notes: E }];
}
