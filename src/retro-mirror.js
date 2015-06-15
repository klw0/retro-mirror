import 'babel/register';
import * as imageHelper from './helpers/image';
import * as palettes from './palettes/palettes';

const defaults = {
    width: 640,
    height: 480,
    pixelSize: 4,
    palette: 'none',
    isGlitchingEnabled: false,
};

export default class RetroMirror {
    constructor(canvasId) {
        this._pixelSize = defaults.pixelSize;
        this._palette = defaults.palette;
        this._isGlitchingEnabled = defaults.isGlitchingEnabled;

        this.canvas = document.getElementById(canvasId);
        this.buffer = null;
        this.ctx = null;
        this.bctx = null;
        this.video = null;

        if (!this.canvas.getContext || !this.canvas.getContext('2d')) {
            console.error('Error: No canvas, dude.');
            return;
        }

        this.canvas.width = defaults.width;
        this.canvas.height = defaults.height;
        this.ctx = this.canvas.getContext('2d');

        // Disable canvas smoothing so we can pixelate when scaling up.
        this.ctx.imageSmoothingEnabled = false;
        this.ctx.mozImageSmoothingEnabled = false;
        this.ctx.msImageSmoothingEnabled = false;

        this.buffer = document.createElement('canvas');
        this.bctx = this.buffer.getContext('2d');

        // Setting pixelSize updates the size of the buffer.
        this.pixelSize = defaults.pixelSize;

        navigator.getUserMedia = navigator.getUserMedia ||
                navigator.webkitGetUserMedia ||
                navigator.mozGetUserMedia ||
                navigator.msGetUserMedia;

        navigator.getUserMedia({video: true}, (stream) => {
            this.video = document.createElement('video');
            this.video.src = window.URL.createObjectURL(stream);
            this.video.play();
            this.video.addEventListener('canplay', () => { this.loop(); });
        }, function(error) {
            console.error(error);
        });
    }

    /**
     * Main application loop.
     */
    loop() {
        this.bctx.drawImage(this.video, 0, 0, this.buffer.width, this.buffer.height);
        let imageData = this.bctx.getImageData(0, 0, this.buffer.width, this.buffer.height);

        if (this.palette !== 'none') {
            imageData = imageHelper.quantize(imageData, this.palette);
        }

        if (this.isGlitchingEnabled) {
            imageData = imageHelper.glitch(imageData);
        }

        this.bctx.putImageData(imageData, 0, 0);

        this.ctx.drawImage(this.buffer, 0, 0, this.canvas.width, this.canvas.height);

        window.requestAnimationFrame(this.loop.bind(this));
    }

    /**
     * Gets the current pixel size.
     */
    get pixelSize() {
        return this._pixelSize;
    }

    /**
     * Sets the current pixel size.
     */
    set pixelSize(pixelSize) {
        this._pixelSize = Math.max(pixelSize, 1);

        // Adjust the size of the buffer so that it scales to the canvas size,
        // which gives us the desired pixel size (since smoothing is off).
        this.buffer.width = this.canvas.width / pixelSize;
        this.buffer.height = this.canvas.height / pixelSize;
    }

    /**
     * Gets the current color palette.
     */
    get palette() {
        return this._palette;
    }

    /**
     * Sets the current color palette.
     */
    set palette(palette) {
        this._palette = palettes[palette] || defaults.palette;
    }

    /**
     * Gets if gitching is enabled.
     */
    get isGlitchingEnabled() {
        return this._isGlitchingEnabled;
    }

    /**
     * Sets if glitching should be enabled.
     */
    set isGlitchingEnabled(enable) {
        this._isGlitchingEnabled = enable;
    }
}
