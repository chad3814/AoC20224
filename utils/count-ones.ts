export function countOnes(x: number): number {
    let count: number = 0;
    while (x != 0) {
        count++;
        x = x & (x - 1);
    }
    return count;
}