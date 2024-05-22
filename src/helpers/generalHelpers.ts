export function isNotNull<T>(item: T | undefined | null): item is T {
    return !!item;
}
