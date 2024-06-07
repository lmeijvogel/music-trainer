import { paddingTop } from "./constants";

export function range(first: number, last: number): number[] {
    return new Array(last - first + 1).fill(0).map((_val, i) => first + i);
}

export function getY(stringNumber: number, stringDistance: number): number {
    return stringNumber * stringDistance + paddingTop;
}
