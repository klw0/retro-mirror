/* global ImageData */

import ImageProcessor from '../image-processor';
import * as colorHelper from './color';
import * as dataHelper from './data';

/**
 * Returns a random int in the range [min, max].
 */
function randomInt(min, max) {
    return Math.floor(Math.random() * ((max + 1) - min)) + min;
}

/**
 * Quantizes an image to a given palette.
 */
export function quantize(rawImageData, palette) {
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
}

/**
 * Glitches/corrupts the image data.
 */
export function glitch(imageData) {
    var mediaType = 'image/jpeg';
    var dataUriScheme = `data:${mediaType};base64,`;

    var canvas = document.createElement('canvas');
    canvas.width = imageData.width;
    canvas.height = imageData.height;

    var ctx = canvas.getContext('2d');
    ctx.putImageData(imageData, 0, 0);

    // Get the image data as a JPEG data URI and convert it to a byte array.
    var encodedData = canvas.toDataURL(mediaType, 0.8).replace(dataUriScheme, '');
    var byteArray = dataHelper.base64ToByteArray(encodedData);

    // Find the beginning of the JPEG scan data.
    var jpegDataStartIndex = 0;
    var jpegDataEndIndex = byteArray.length - 2;    // Last two bytes are the End of Image (EOI) marker.
    for (let i = 0; i < byteArray.length; i++) {
        // If we found the Start of Scan (SOS) marker...
        if (byteArray[i] === 0xFF && byteArray[i + 1] === 0xDA) {
            // The next two bytes contain the SOS header length.
            var scanHeaderLength = byteArray[i + 2] + byteArray[i + 3];
            jpegDataStartIndex = i + 2 + scanHeaderLength;  // +2 bytes to account for 0xFFDA.

            break;
        }
    }

    // When a JPEG comes along, you must glitch it.
    for (let j = 0; j < randomInt(0, 10); j++) {
        byteArray[randomInt(jpegDataStartIndex, jpegDataEndIndex)] = 0;
    }

    var image = new Image(imageData.width, imageData.height);
    image.src = dataUriScheme + dataHelper.byteArrayToBase64(byteArray);
    ctx.drawImage(image, 0, 0);
    var newImageData = ctx.getImageData(0, 0, imageData.width, imageData.height);

    return newImageData;
}
