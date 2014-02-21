function reverseColor(mat) {
	var dst = new Matrix(mat.row, mat.col);

	for (var i = 0; i < mat.row; i++) {
		// RGBA to Gray: Y = 0.299*R + 0.587*G + 0.114*B
		for (var j = 0; j < mat.col; j++) {
			dst.setValue(i, j, 255 - mat.at(i, j));
		}
	}

	return dst;
}

function scaleDown(mat) {
	var row = mat.row / 2,
		col = mat.col / 2;
	var dst = new Matrix(row, col),
		data = dst.data,
		data2 = mat.data;

	var offset = 0;
	for (i = 0; i < row * col * 4; i += 4) {
		if (!(i % (4 * col))) { //alert(i);
			offset++;
		}
		// 2*col*4 = mat.row * channel
		data[i] = data[i + 1] = data[i + 2] = data2[2 * i + offset * col * 8];
		data[i + 3] = 255;
	}

	return dst;
}

function scaleUp(mat) {
	var row = mat.row * 2,
		col = mat.col * 2;
	var dst = new Matrix(row, col),
		data = dst.data,
		data2 = mat.data;

	var offset = 0;
	for (var i = 0; i < row * col * 4; i += 4) {
		if (!(i % (4 * col))) { //alert(i);
			offset++;
		}
		data[i] = data[i + 1] = data[i + 2] = data2[i / 2 + offset * col * 2];
		data[i + 3] = 255;
	}

	return dst;
}

function log(mat, c) {
	var dst = new Matrix(mat.row, mat.col);

	for (var i = 0; i < mat.row; i++) {
		for (var j = 0; j < mat.col; j++) {
			dst.setValue(i, j, Math.floor(c * (Math.log(1 + mat.at(i, j)) / Math.log(2))));
		}
	}

	return dst;
}

function histogram(mat) {
	var dst = new Matrix(mat.row, mat.col);
	var mn = mat.data.length / 4;

	var h = getHistogram(mat);

	// normalized
	for (var i = 0; i < 256; i++) {
		h[i] = h[i] / mn;
	}

	// caculate the pdf
	for (var i = 1; i < 256; i++) {
		h[i] = h[i] + h[i - 1];
	}

	for (var i = 0; i < mat.row; i++) {
		for (var j = 0; j < mat.col; j++) {
			dst.setValue(i, j, Math.floor(h[mat.at(i, j)] * 255));
		}
	}

	return dst;
}

function spatialFilter(mat, h) {
	var dst = new Matrix(mat.row, mat.col);
	var window = [
		[h[0], h[1], h[2]],
		[h[3], h[4], h[5]],
		[h[6], h[7], h[8]]
	];

	var total = 0;
	for (var i = 0; i < 9; i++) total += h[i];

	for (var i = 1; i < mat.row - 1; i++) {
		for (var j = 1; j < mat.col - 1; j++) {
			var v1 = mat.at(i - 1, j - 1) * window[0][0] + mat.at(i - 1, j) * window[0][1] + mat.at(i - 1, j + 1) * window[0][2],
				v2 = mat.at(i, j - 1) * window[1][0] + mat.at(i, j) * window[1][1] + mat.at(i, j + 1) * window[1][2],
				v3 = mat.at(i + 1, j - 1) * window[2][0] + mat.at(i + 1, j) * window[2][1] + mat.at(i + 1, j + 1) * window[2][2];
			dst.setValue(i, j, (v1 + v2 + v3) / total);
		}
	}

	return dst;
}

function laplacian(mat) {

	var dst = new Matrix(mat.row, mat.col);
	var window = [
		[1, 1, 1],
		[1, -8, 1],
		[1, 1, 1]
	];

	for (var i = 1; i < mat.row - 1; i++) {
		for (var j = 1; j < mat.col - 1; j++) {
			var v1 = mat.at(i - 1, j - 1) * window[0][0] + mat.at(i - 1, j) * window[0][1] + mat.at(i - 1, j + 1) * window[0][2],
				v2 = mat.at(i, j - 1) * window[1][0] + mat.at(i, j) * window[1][1] + mat.at(i, j + 1) * window[1][2],
				v3 = mat.at(i + 1, j - 1) * window[2][0] + mat.at(i + 1, j) * window[2][1] + mat.at(i + 1, j + 1) * window[2][2];
			dst.setValue(i, j, (v1 + v2 + v3));
		}
	}

	return dst;
}

function unsharp(mat, k) {
	var dst = new Matrix(mat.row, mat.col);
	var lap = laplacian(mat);
	for (var i = 0; i < mat.row; i++) {
		for (var j = 0; j < mat.col; j++) {
			dst.setValue(i, j, k * mat.at(i, j) - lap.at(i, j));
		}
	}

	return dst;
}

function fourier(mat) {
	var dst = new Matrix(mat.row, mat.col);
	var fx = center(mat);
	var Fu = fft2D(fx, mat.col, mat.row);

	// normalized
	scale(dst, Fu);
	return log(dst, 50);
}

function glpfilter(mat, Do) {
	var height = mat.row,
		width = mat.col,
		len = height * width;
	var dst = new Matrix(height, width);
	var fx = center(mat);
	var Fu = fft2D(fx, width, height);

	//glpf
	for (var i = 0; i < len; i++) {
		var u = i / width,
			v = i % width;
		var H = Math.exp(-(Math.pow(u - height / 2, 2) + Math.pow(v - width / 2, 2)) / (2 * Do));
		Fu[i].real = Fu[i].real * H;
		Fu[i].imaginary = Fu[i].imaginary * H;
	}

	var iFu = ifft2D(Fu, width, height);

	// value need to be rotate/scale/recenter 
	for (var i = 0; i < height; i++) {
		for (var j = 0; j < width; j++) {
			dst.setValue(i, j, iFu[len - 1 - (i * width + j)].real * len * Math.pow(-1, i + j));
		}
	}
	return dst;
}

function ghpfilter(mat, Do) {
	var height = mat.row,
		width = mat.col,
		len = height * width;
	var dst = new Matrix(height, width);
	var fx = center(mat);
	var Fu = fft2D(fx, width, height);

	//glpf
	for (var i = 0; i < len; i++) {
		var u = i / width,
			v = i % width;
		var H = 1 - Math.exp(-(Math.pow(u - height / 2, 2) + Math.pow(v - width / 2, 2)) / (2 * Do));
		Fu[i].real = Fu[i].real * H;
		Fu[i].imaginary = Fu[i].imaginary * H;
	}

	var iFu = ifft2D(Fu, width, height);

	// value need to be rotate/scale/recenter 
	for (var i = 0; i < height; i++) {
		for (var j = 0; j < width; j++) {
			dst.setValue(i, j, iFu[len - 1 - (i * width + j)].real * len * Math.pow(-1, i + j));
		}

	}
	return dst;
}

function sapNoise(mat, pa, pb) {
	var dst = new Matrix(mat.row, mat.col);
	var h = getHistogram(mat);
	var n = mat.row * mat.col;

	var r, p;
	for (var i = 0; i < mat.row; i++) {
		for (var j = 0; j < mat.col; j++) {
			r = Math.random();
			p = 0;
			if (r < pa) p = 255;
			else if (r >= pa && r < pa + pb) p = 1;

			dst.setValue(i, j, p > 0 ? p : mat.at(i, j));
		}
	}

	return dst;
}

function gsNoise(mat, mean, variance) {
	var dst = new Matrix(mat.row, mat.col);
	var h = getHistogram(mat);
	var n = mat.row * mat.col;

	// 标准差
	var dev = Math.sqrt(variance);

	var p = [];
	for (var i = 0; i < 256; i++) {
		p[i] = Math.exp(-Math.pow(i - mean, 2) / (2 * variance)) / (Math.sqrt(2 * Math.PI) * dev);
	}

	var r;
	for (var i = 0; i < mat.row; i++) {
		for (var j = 0; j < mat.col; j++) {
			r = Math.random();
			dst.setValue(i, j, r < p[mat.at(i, j)] ? r * 255 : mat.at(i, j));
		}
	}

	return dst;
}

function medianFilter(mat) {
	var dst = new Matrix(mat.row, mat.col),
		h = [];

	var comp = function(a, b) {
		return a - b;
	};

	for (var i = 1; i < mat.row - 1; i++) {
		for (var j = 1; j < mat.col - 1; j++) {
			h = [
				mat.at(i - 1, j - 1), mat.at(i - 1, j), mat.at(i - 1, j + 1),
				mat.at(i, j - 1), mat.at(i, j), mat.at(i, j + 1),
				mat.at(i + 1, j - 1), mat.at(i + 1, j), mat.at(i + 1, j + 1)
			];
			h.sort(comp);
			dst.setValue(i, j, h[4]);
		}
	}

	return dst;
}

function maximumFilter(mat) {
	var dst = new Matrix(mat.row, mat.col);

	// var window = [
	// 	[1, 1, 1],
	// 	[1, 1, 1],
	// 	[1, 1, 1]
	// ];

	var window = [
		[1, 1, 1, 1, 1, 1, 1],
		[1, 1, 1, 1, 1, 1, 1],
		[1, 1, 1, 1, 1, 1, 1],
		[1, 1, 1, 1, 1, 1, 1],
		[1, 1, 1, 1, 1, 1, 1],
		[1, 1, 1, 1, 1, 1, 1],
		[1, 1, 1, 1, 1, 1, 1]
	];

	// var window = [
	// 	[1, 1, 1, 1, 1, 1, 1, 1, 1],
	// 	[1, 1, 1, 1, 1, 1, 1, 1, 1],
	// 	[1, 1, 1, 1, 1, 1, 1, 1, 1],
	// 	[1, 1, 1, 1, 1, 1, 1, 1, 1],
	// 	[1, 1, 1, 1, 1, 1, 1, 1, 1],
	// 	[1, 1, 1, 1, 1, 1, 1, 1, 1],
	// 	[1, 1, 1, 1, 1, 1, 1, 1, 1],
	// 	[1, 1, 1, 1, 1, 1, 1, 1, 1],
	// 	[1, 1, 1, 1, 1, 1, 1, 1, 1]
	// ];

	var len = window.length,
		offset = (len - 1) / 2;

	var comp = function(a, b) {
		return a - b;
	};

	for (var i = offset; i < mat.row - offset; i++) {
		for (var j = offset; j < mat.col - offset; j++) {
			var result = [];
			for (var m = 0; m < len; m++) {
				for (var n = 0; n < len; n++) {
					// TODO
					result.push(mat.at(i - offset + m, j - offset + n) * window[m][n]);
				}
			}
			result.sort(comp);
			dst.setValue(i, j, result[result.length - 1]);
		}
	}

	return dst;
}

function ArithmeticMeanFilter(mat, h) {
	var dst = new Matrix(mat.row, mat.col);
	//dst.data = mat.data;
	// var window = [
	// 	[1, 1, 1],
	// 	[1, 1, 1],
	// 	[1, 1, 1]
	// ];

	// var window = [
	// 	[1, 1, 1, 1, 1, 1, 1],
	// 	[1, 1, 1, 1, 1, 1, 1],
	// 	[1, 1, 1, 1, 1, 1, 1],
	// 	[1, 1, 1, 1, 1, 1, 1],
	// 	[1, 1, 1, 1, 1, 1, 1],
	// 	[1, 1, 1, 1, 1, 1, 1],
	// 	[1, 1, 1, 1, 1, 1, 1]
	// ];

	var window = [
		[1, 1, 1, 1, 1, 1, 1, 1, 1],
		[1, 1, 1, 1, 1, 1, 1, 1, 1],
		[1, 1, 1, 1, 1, 1, 1, 1, 1],
		[1, 1, 1, 1, 1, 1, 1, 1, 1],
		[1, 1, 1, 1, 1, 1, 1, 1, 1],
		[1, 1, 1, 1, 1, 1, 1, 1, 1],
		[1, 1, 1, 1, 1, 1, 1, 1, 1],
		[1, 1, 1, 1, 1, 1, 1, 1, 1],
		[1, 1, 1, 1, 1, 1, 1, 1, 1]
	];

	var len = window.length,
		offset = (len - 1) / 2;

	for (var i = offset; i < mat.row - offset; i++) {
		for (var j = offset; j < mat.col - offset; j++) {
			var result = 0;
			for (var m = 0; m < len; m++) {
				for (var n = 0; n < len; n++) {
					// TODO
					result += mat.at(i - offset + m, j - offset + n) * window[m][n];
				}
			}
			dst.setValue(i, j, result / (len * len));
		}
	}

	return dst;
}

function harmonicFilter(mat, h) {
	var dst = new Matrix(mat.row, mat.col);
	//dst.data = mat.data;
	// var window = [
	// 	[1, 1, 1],
	// 	[1, 1, 1],
	// 	[1, 1, 1]
	// ];

	// var window = [
	// 	[1, 1, 1, 1, 1, 1, 1],
	// 	[1, 1, 1, 1, 1, 1, 1],
	// 	[1, 1, 1, 1, 1, 1, 1],
	// 	[1, 1, 1, 1, 1, 1, 1],
	// 	[1, 1, 1, 1, 1, 1, 1],
	// 	[1, 1, 1, 1, 1, 1, 1],
	// 	[1, 1, 1, 1, 1, 1, 1]
	// ];

	var window = [
		[1, 1, 1, 1, 1, 1, 1, 1, 1],
		[1, 1, 1, 1, 1, 1, 1, 1, 1],
		[1, 1, 1, 1, 1, 1, 1, 1, 1],
		[1, 1, 1, 1, 1, 1, 1, 1, 1],
		[1, 1, 1, 1, 1, 1, 1, 1, 1],
		[1, 1, 1, 1, 1, 1, 1, 1, 1],
		[1, 1, 1, 1, 1, 1, 1, 1, 1],
		[1, 1, 1, 1, 1, 1, 1, 1, 1],
		[1, 1, 1, 1, 1, 1, 1, 1, 1]
	];

	var len = window.length,
		offset = (len - 1) / 2;

	for (var i = offset; i < mat.row - offset; i++) {
		for (var j = offset; j < mat.col - offset; j++) {
			var result = 0;
			for (var m = 0; m < len; m++) {
				for (var n = 0; n < len; n++) {
					// TODO
					result += 1 / (mat.at(i - offset + m, j - offset + n) * window[m][n]);
				}
			}
			dst.setValue(i, j, (len * len) / result);
		}
	}

	return dst;
}

function iharmonicFilter(mat, h, Q) {
	var dst = new Matrix(mat.row, mat.col);
	//dst.data = mat.data;
	// var window = [
	// 	[1, 1, 1],
	// 	[1, 1, 1],
	// 	[1, 1, 1]
	// ];

	// var window = [
	// 	[1, 1, 1, 1, 1, 1, 1],
	// 	[1, 1, 1, 1, 1, 1, 1],
	// 	[1, 1, 1, 1, 1, 1, 1],
	// 	[1, 1, 1, 1, 1, 1, 1],
	// 	[1, 1, 1, 1, 1, 1, 1],
	// 	[1, 1, 1, 1, 1, 1, 1],
	// 	[1, 1, 1, 1, 1, 1, 1]
	// ];

	var window = [
		[1, 1, 1, 1, 1, 1, 1, 1, 1],
		[1, 1, 1, 1, 1, 1, 1, 1, 1],
		[1, 1, 1, 1, 1, 1, 1, 1, 1],
		[1, 1, 1, 1, 1, 1, 1, 1, 1],
		[1, 1, 1, 1, 1, 1, 1, 1, 1],
		[1, 1, 1, 1, 1, 1, 1, 1, 1],
		[1, 1, 1, 1, 1, 1, 1, 1, 1],
		[1, 1, 1, 1, 1, 1, 1, 1, 1],
		[1, 1, 1, 1, 1, 1, 1, 1, 1]
	];

	var len = window.length,
		offset = (len - 1) / 2;

	for (var i = offset; i < mat.row - offset; i++) {
		for (var j = offset; j < mat.col - offset; j++) {
			var result = 0,
				divider = 0;
			for (var m = 0; m < len; m++) {
				for (var n = 0; n < len; n++) {
					// TODO
					var value = mat.at(i - offset + m, j - offset + n) * window[m][n];
					result += Math.pow(value, Q + 1);
					divider += Math.pow(value, Q);
				}
			}
			dst.setValue(i, j, result / divider);
		}
	}

	return dst;
}

function pseudoColor(mat) {
	var dst = new Matrix(mat.row, mat.col);

	var data = mat.data,
		data2 = dst.data;
	for (var i = 0; i < data.length; i += 4) {
		if (data[i] < 10) {
			data2[i] = data2[i + 1] = 255;
			data2[i + 2] = 0;
			data2[i + 3] = 255;
		} else {
			data2[i] = data2[i + 1] = data2[i + 2] = data[i];
			data2[i + 3] = 255;
		}
	}

	return dst;
}

function colorImgHE(mat) {
	var dst = new Matrix(mat.row, mat.col);
	var mn = mat.data.length / 4;

	var rh = gh = bh = [],
		k = 256;
	while (k--) rh[k] = gh[k] = bh[k] = 0;

	var data = mat.data,
		data2 = dst.data;
	// caculate the histo
	for (var i = 0; i < data.length; i += 4) {
		rh[data[i]]++;
		gh[data[i + 1]]++;
		bh[data[i + 2]]++;
	}

	// normalized
	for (var i = 0; i < 256; i++) {
		rh[i] = rh[i] / mn;
		gh[i] = gh[i] / mn;
		bh[i] = bh[i] / mn;
	}

	// caculate the pdf
	for (var i = 1; i < 256; i++) {
		rh[i] = rh[i] + rh[i - 1];
		gh[i] = gh[i] + gh[i - 1];
		bh[i] = bh[i] + bh[i - 1];
	}

	for (var i = 0; i < data.length; i += 4) {
		data2[i] = Math.floor(rh[data[i]] * 255);
		data2[i + 1] = Math.floor(gh[data[i + 1]] * 255);
		data2[i + 2] = Math.floor(bh[data[i + 2]] * 255);
		data2[i + 3] = 255;
	}

	return dst;
}