export function checkIntervalInput(input: string, interval: string): boolean {
    if (input === interval) return true;

    if (normalizeInterval(input) === interval) return true;

    return false;
}

export function normalizeInterval(input: string): string {
    if (["1", "4", "5"].includes(input)) {
        return `${input}P`;
    };

    input = input.replace("p", "P");

    const numberFirstMatch = input.match(/(\d)([Mmad])/);

    if (numberFirstMatch) {
        return input;
    }

    const qualityFirstMatch = input.match(/([PMmAd])(\d)/);

    if (qualityFirstMatch) {
        return `${qualityFirstMatch[2]}${qualityFirstMatch[1]}`;
    }

    return input;
}
