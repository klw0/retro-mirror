var ColorHelper = {
    /**
     * Returns the nearest color in |palette|, given |color|.
     */
    nearestColor: function(color, palette) {
        var nearestColor = null;
        var minDistance = Number.MAX_VALUE;

        palette.forEach((paletteColor) => {
            var distance = this.distance(color, paletteColor);
            minDistance = Math.min(minDistance, distance);

            if (minDistance === distance) { nearestColor = paletteColor; }
        });

        return nearestColor;
    },

    /**
     * Returns the Euclidean distance between two RGBA colors.
     */
    distance: function(a, b) {
        var rDiff = a[0] - b[0];
        var gDiff = a[1] - b[1];
        var bDiff = a[2] - b[2];
        var aDiff = a[3] - b[3];

        // Math.pow() is slow...
        return Math.sqrt(rDiff * rDiff +
                         gDiff * gDiff +
                         bDiff * bDiff +
                         aDiff * aDiff);
    },
};

module.exports = ColorHelper;
