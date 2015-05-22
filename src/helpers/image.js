/* global ImageData */

// TODO: Rename the original class to something clearer
var ImageDataWrapper = require('../image-data');
var colorHelper = require('./color');

var ImageHelper = {
    /**
     * Quantizes an image to a given palette.
     */
    quantize: function(rawImageData, palette) {
        var newImageData = new ImageData(rawImageData.width, rawImageData.height);

        var originalImageDataObj = new ImageDataWrapper(rawImageData);
        var quantizedImageDataObj = new ImageDataWrapper(newImageData);

        for (let x = 0; x < rawImageData.width; x++) {
            for (let y = 0; y < rawImageData.height; y++) {
                var color = originalImageDataObj.getPixel(x, y);
                var nearestColor = colorHelper.nearestColor(color, palette);
                quantizedImageDataObj.setPixel(x, y, nearestColor);
            }
        }

        return quantizedImageDataObj.imageData;
    },
};

module.exports = ImageHelper;
