var iCanvas = document.createElement("canvas"),
	iCtx = iCanvas.getContext("2d");

function iResize(width, height) {
	iCanvas.width = width;
	iCanvas.height = height;
}

function Matrix(row, col, data, buffer) {
	this.row = row || 0;
	this.col = col || 0;
	this.channel = 4;
	this.buffer = buffer || new ArrayBuffer(row * col * this.channel);
	this.data = new Uint8ClampedArray(this.buffer);
	data && this.data.set(data);
	this.bytes = 1;
	this.type = "CV_RGBA";
	this.at = function(x, y) {
		return this.data[4 * col * x + 4 * y];
	}
	this.setValue = function(x, y, value) {
		var offset = 4 * col * x + 4 * y;
		this.data[offset] = this.data[offset + 1] = this.data[offset + 2] = value;
		this.data[offset + 3] = 255;
	}
}

function imread(image) {
	var width = image.width,
		height = image.height;

	iResize(width, height);
	iCtx.drawImage(image, 0, 0);
	var imageData = iCtx.getImageData(0, 0, width, height),
		tempMat = new Matrix(height, width, imageData.data);

	imageData = null;
	iCtx.clearRect(0, 0, width, height);
	return tempMat;
}

function getHistogram(mat) {
	var h = [];
	var k = 256;
	while (k--) h[k] = 0;

	// caculate the histo
	for (var i = 0; i < mat.row; i++) {
		for (var j = 0; j < mat.col; j++) {
			h[mat.at(i, j)]++;
		}
	}
	return h;
}

function RGBA2ImageData(mat) {
	var width = mat.col,
		height = mat.row,
		imageData = iCtx.createImageData(width, height);
	imageData.data.set(mat.data);
	return imageData;
}

function RGBA2Gray(mat) {
	var dst = new Matrix(mat.row, mat.col),
		data = dst.data,
		data2 = mat.data;
	var pix = mat.data.length;
	for (var i = 0; i < pix; i += 4) {
		// RGBA to Gray: Y = 0.299*R + 0.587*G + 0.114*B
		data[i] = data[i + 1] = data[i + 2] = data2[i] * 0.299 + data2[i + 1] * 0.587 + data2[i + 2] * 0.114;
		data[i + 3] = 255;
	}

	return dst;
}