/**
 * Manipulates image data objects.
 */
class ImageProcessor {
    constructor(imageData) {
        this._imageData = imageData;
    }

    get imageData() {
        return this._imageData;
    }

    set imageData(imageData) {
        this._imageData = imageData;
    }

    getPixel(x, y) {
        var i = this.coordinatesToIndex(x, y);

        var r = this._imageData.data[i];
        var g = this._imageData.data[i + 1];
        var b = this._imageData.data[i + 2];
        var a = this._imageData.data[i + 3];

        return [r, g, b, a];
    }

    setPixel(x, y, value) {
        var i = this.coordinatesToIndex(x, y);
        var [r, g, b, a] = value;

        this._imageData.data[i] = r;
        this._imageData.data[i + 1] = g;
        this._imageData.data[i + 2] = b;
        this._imageData.data[i + 3] = a;
    }

    coordinatesToIndex(x, y) {
        return x * 4 + y * this._imageData.width * 4;
    }
}

module.exports = ImageProcessor;
