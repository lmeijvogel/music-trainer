import { Key, Note } from "tonal";

/**
 * Converts the given note so its accidentals match the key alterations.
 *
 * For example: If the key is G and the input is Gb, this corrects it to
 * F#, since that's what we expect in this key.
 */
export function correctForKey(note: string, keySignature: string): string {
    const key = Key.majorKey(keySignature);

    if (
        (key.alteration < 0 && Note.get(note)!.acc.startsWith("#")) ||
        (key.alteration > 0 && Note.get(note)!.acc.startsWith("b"))
    ) {
        return Note.enharmonic(note);
    }

    return note;
}
