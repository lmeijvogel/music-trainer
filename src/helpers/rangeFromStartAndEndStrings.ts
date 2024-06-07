import { allStrings } from "../prompts/fretboard/constants";

export function rangeFromStartAndEndString(minString: string, maxString: string): string[] {
    const minStringIndex = allStrings.indexOf(minString);
    const maxStringIndex = allStrings.indexOf(maxString);

    return allStrings.slice(minStringIndex, maxStringIndex + 1);
}
