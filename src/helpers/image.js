/* global ImageData */

var ImageProcessor = require('../image-processor');
var colorHelper = require('./color');

var ImageHelper = {
    /**
     * Quantizes an image to a given palette.
     */
    quantize: function(rawImageData, palette) {
        var newImageData = new ImageData(rawImageData.width, rawImageData.height);

        var originalImageProcessor = new ImageProcessor(rawImageData);
        var quantizedImageProcessor = new ImageProcessor(newImageData);

        for (let x = 0; x < rawImageData.width; x++) {
            for (let y = 0; y < rawImageData.height; y++) {
                var color = originalImageProcessor.getPixel(x, y);
                var nearestColor = colorHelper.nearestColor(color, palette);
                quantizedImageProcessor.setPixel(x, y, nearestColor);
            }
        }

        return quantizedImageProcessor.imageData;
    },
};

module.exports = ImageHelper;
