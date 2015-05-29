/**
 * Returns the nearest color in |palette|, given |sourceColor|.
 */
export function nearestColor(sourceColor, palette) {
    var color = null;
    var minDistance = Number.MAX_VALUE;

    palette.forEach((paletteColor) => {
        var distance = this.distance(sourceColor, paletteColor);
        minDistance = Math.min(minDistance, distance);

        if (minDistance === distance) { color = paletteColor; }
    });

    return color;
}

/**
 * Returns the Euclidean distance between two RGBA colors.
 */
export function distance(a, b) {
    var rDiff = a[0] - b[0];
    var gDiff = a[1] - b[1];
    var bDiff = a[2] - b[2];
    var aDiff = a[3] - b[3];

    // Math.pow() is slow...
    return Math.sqrt(rDiff * rDiff +
            gDiff * gDiff +
            bDiff * bDiff +
            aDiff * aDiff);
}
