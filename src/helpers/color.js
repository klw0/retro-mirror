/**
 * Returns the nearest color in |palette|, given |sourceColor|.
 */
export function nearestColor(sourceColor, palette) {
    let color = null;
    let minDistance = Number.MAX_VALUE;

    palette.forEach((paletteColor) => {
        let distance = this.distance(sourceColor, paletteColor);
        minDistance = Math.min(minDistance, distance);

        if (minDistance === distance) { color = paletteColor; }
    });

    return color;
}

/**
 * Returns the Euclidean distance between two RGBA colors.
 */
export function distance(a, b) {
    let rDiff = a[0] - b[0];
    let gDiff = a[1] - b[1];
    let bDiff = a[2] - b[2];
    let aDiff = a[3] - b[3];

    // Math.pow() is slow...
    return Math.sqrt(rDiff * rDiff +
            gDiff * gDiff +
            bDiff * bDiff +
            aDiff * aDiff);
}
