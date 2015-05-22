require('babel/register');
var imageHelper = require('./helpers/image');

const defaultOptions = {
    width: 640,
    height: 480,
    pixelSize: 4,
    palette: 'none',
    supportedPalettes: {
        'none': null,
        'grayscale': require('./palettes/grayscale'),
        'game-boy-light': require('./palettes/game-boy-light'),
        'game-boy-dark': require('./palettes/game-boy-dark'),
        'nes': require('./palettes/nes'),
        'teletext': require('./palettes/teletext'),
    }
};

class RetroMirror {
    constructor(canvasId) {
        this.options = defaultOptions;
        this.canvas = document.getElementById(canvasId);
        this.buffer = null;
        this.ctx = null;
        this.bctx = null;
        this.video = null;

        if (!this.canvas.getContext || !this.canvas.getContext('2d')) {
            console.error('Error: No canvas, dude.');
            return;
        }

        this.canvas.width = this.options.width;
        this.canvas.height = this.options.height;
        this.ctx = this.canvas.getContext('2d');

        // Disable canvas smoothing so we can pixelate when scaling up.
        this.ctx.imageSmoothingEnabled = false;
        this.ctx.webkitImageSmoothingEnabled = false;
        this.ctx.mozImageSmoothingEnabled = false;
        this.ctx.msImageSmoothingEnabled = false;

        this.buffer = document.createElement('canvas');
        this.bctx = this.buffer.getContext('2d');

        // Setting pixelSize updates the size of the buffer.
        this.pixelSize = this.options.pixelSize;

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
        var imageData = this.bctx.getImageData(0, 0, this.buffer.width, this.buffer.height);

        if (this.options.palette && this.options.palette !== 'none') {
            imageData = imageHelper.quantize(imageData, this.options.palette);
        }

        this.bctx.putImageData(imageData, 0, 0);

        this.ctx.drawImage(this.buffer, 0, 0, this.canvas.width, this.canvas.height);

        window.requestAnimationFrame(this.loop.bind(this));
    }

    get pixelSize() {
        return this.options.pixelSize;
    }

    set pixelSize(pixelSize) {
        this.options.pixelSize = Math.max(pixelSize, 1);

        this.buffer.width = this.canvas.width / pixelSize;
        this.buffer.height = this.canvas.height / pixelSize;
    }

    get palette() {
        return this.options.palette;
    }

    set palette(palette) {
        this.options.palette = this.options.supportedPalettes[palette];
    }
}

module.exports = RetroMirror;
