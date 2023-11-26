export function calculateFretPosition(fretNumber: number, scaleLength: number) {
    return scaleLength - (scaleLength / (2 ** (fretNumber / 12)));
}


