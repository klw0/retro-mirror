/**
 * Manipulates image data objects.
 */
export default class ImageProcessor {
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
        let i = this.coordinatesToIndex(x, y);

        let r = this._imageData.data[i];
        let g = this._imageData.data[i + 1];
        let b = this._imageData.data[i + 2];
        let a = this._imageData.data[i + 3];

        return [r, g, b, a];
    }

    setPixel(x, y, value) {
        let i = this.coordinatesToIndex(x, y);
        let [r, g, b, a] = value;

        this._imageData.data[i] = r;
        this._imageData.data[i + 1] = g;
        this._imageData.data[i + 2] = b;
        this._imageData.data[i + 3] = a;
    }

    coordinatesToIndex(x, y) {
        return x * 4 + y * this._imageData.width * 4;
    }
}
