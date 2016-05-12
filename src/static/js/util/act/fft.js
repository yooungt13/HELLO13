/**
 * 快速傅里叶算法实现
 * @author youngtian
 * @date   2016.05.04
 * @return {Object} fft 快速傅里叶算法函数
 */
define([], function() {
    var Complex = function(real, imaginary) {
        if (arguments.length == 0) {
            this.real = 0;
            this.imaginary = 0;
        } else if (arguments.length == 1) {
            this.real = arguments[0].real;
            this.imaginary = arguments[0].imaginary;
        } else {
            this.real = real;
            this.imaginary = imaginary;
        }

        this.setReal = function(real) {
            this.real = real;
        };

        this.setImaginary = function(imaginary) {
            this.imaginary = imaginary;
        };

        this.getReal = function() {
            return this.real;
        }

        this.plus = function(op) {
            var result = new Complex();
            result.setReal(this.real + op.real);
            result.setImaginary(this.imaginary + op.imaginary);
            return result;
        };

        this.minus = function(op) {
            var result = new Complex();
            result.setReal(this.real - op.real);
            result.setImaginary(this.imaginary - op.imaginary);
            return result;
        };

        this.mul = function(op) {
            var result = new Complex();
            result.setReal(this.real * op.real - this.imaginary * op.imaginary);
            result.setImaginary(this.real * op.imaginary + this.imaginary * op.real);
            return result;
        };

        this.div = function(op) {
            var result = new Complex();
            result.setReal(this.real / op);
            result.setImaginary(this.imaginary / op);
            return result;
        }

        this.norm = function() {
            return Math.sqrt(this.real * this.real + this.imaginary * this.imaginary);
        }

        this.angle = function() {
            return Math.atan2(this.imaginary, this.real);
        }

        this.conjugate = function() {
            return new Complex(this.real, this.imaginary * (-1));
        }

        this.toString = function() {
            if (this.real == 0) {
                if (this.imaginary == 0) {
                    return "0";
                } else {
                    return this.imaginary + "i";
                }
            } else {
                if (this.imaginary == 0) {
                    return this.real + "";
                } else if (this.imaginary < 0) {
                    return this.real + "" + this.imaginary + "j";
                } else {
                    return this.real + "+" + this.imaginary + "j";
                }
            }
        };
    };

    var center = function(mat) {
        var f = [];
        for (var i = 0; i < mat.row; i++) {
            for (var j = 0; j < mat.col; j++) {
                f[i * mat.row + j] = mat.at(i, j) * Math.pow(-1, i + j);
                //f[i * mat.row + j] = mat.at(i, j);
            }
        }
        return f;
    };

    var scale = function(mat, Fu) {
        var max = -9999999999,
            min = 9999999999;
        for (var i = 0; i < Fu.length; i++) {
            if (Fu[i].norm() > max) {
                max = Fu[i].norm();
            }
            if (Fu[i].norm() < min) {
                min = Fu[i].norm();
            }
        }
        var data = mat.data;
        for (var i = 0; i < mat.data.length; i += 4) {
            data[i] = data[i + 1] = data[i + 2] = 255 * ((Fu[i / 4].norm() - min) / (max - min));
            data[i + 3] = 255;
        }
    };

    var fft = function(fx) {

        var _2k = fx.length;
        if (_2k == 1) return [fx[0]];

        // caculate the Feven
        var Feven = [];
        for (var i = 0; i < _2k / 2; i++) {
            Feven[i] = fx[i * 2];
        }
        var even = fft(Feven);

        // caculate the Fodd
        var Fodd = [];
        for (var i = 0; i < _2k / 2; i++) {
            Fodd[i] = fx[i * 2 + 1];
        }
        var odd = fft(Fodd);

        var Fu = [];
        // Complex w2k is multiplied by every odd.
        var w2k = new Complex();

        for (var n = 0; n < _2k / 2; n++) {
            w2k.real = Math.cos(2 * Math.PI * n / _2k);
            w2k.imaginary = Math.sin((-2) * Math.PI * n / _2k);

            var oddw = odd[n].mul(w2k);
            Fu[n] = even[n].plus(oddw);
            Fu[n + _2k / 2] = even[n].minus(oddw);
        }

        return Fu;
    };

    var fft1D = function(fx, Fu, _2k, stride, start) {
        var tmp = [];

        if (stride == 1) {
            for (var i = 0; i < _2k; i++) {
                // Notice: the params of Constructor
                tmp[i] = new Complex(fx[start + i], 0);
            }
            tmp = ifft(tmp);
            for (var i = 0; i < tmp.length; i++) {
                Fu[start + i] = tmp[i];
            }
        } else {
            for (var i = 0; i < _2k; i++) {
                tmp[i] = new Complex(fx[start + i * stride]);
            }
            tmp = ifft(tmp);
            for (var i = 0; i < tmp.length; i++) {
                Fu[start + i * stride] = tmp[i];
            }
        }
    };

    var fft2D = function(f, width, height) {

        // Direct line
        var Fu = [];
        for (var i = 0; i < height; i++) {
            fft1D(f, Fu, width, 1, i * width);
        }

        // Direct column
        for (var i = 0; i < width; i++) {
            fft1D(Fu, Fu, height, width, i);
        }
        return Fu;
    };

    var ifft = function(fx) {
        var _2k = fx.length;

        var Fu = [];

        for (var i = 0; i < _2k; i++) {
            Fu[i] = fx[i].conjugate();
        }
        Fu = fft(Fu);

        for (var i = 0; i < _2k; i++) {
            Fu[i] = Fu[i].conjugate();
            Fu[i] = Fu[i].div(_2k);
        }

        return Fu;
    }

    var ifft1D = function(fx, Fu, _2k, stride, start) {
        var tmp = [];

        if (stride == 1) {
            for (var i = 0; i < _2k; i++) {
                tmp[i] = new Complex(fx[start + i]);
            }
            tmp = ifft(tmp);
            for (var i = 0; i < tmp.length; i++) {
                Fu[start + i] = tmp[i];
            }
        } else {
            for (var i = 0; i < _2k; i++) {
                tmp[i] = new Complex(fx[start + i * stride]);
            }
            tmp = ifft(tmp);
            for (var i = 0; i < tmp.length; i++) {
                Fu[start + i * stride] = tmp[i];
            }
        }
    };

    var ifft2D = function(f, width, height) {

        // Direct line
        var Fu = [];
        for (var i = 0; i < height; i++) {
            ifft1D(f, Fu, width, 1, i * width);
        }

        // Direct column
        for (var i = 0; i < width; i++) {
            ifft1D(Fu, Fu, height, width, i);
        }
        return Fu;
    };

    var test = function() {

        var c1 = new Complex(-0.13480425839330703, 0);
        var c2 = new Complex(0.27910192950176387, 0);
        var c3 = new Complex(0.3233322451735928, 0);
        var c4 = new Complex(0.4659819820667019, 0);
        var c5 = new Complex(0.5659819820667019, 0);
        var c6 = new Complex(0.6659819820667019, 0);
        var c7 = new Complex(0.7659819820667019, 0);
        var c8 = new Complex(0.8659819820667019, 0);

        var fx = [
            c1, c2, c3, c4,
            //c5, c6, c7, c8
        ];

        var Fu = fft2D(fx, 2, 2);
        var iFu = ifft2D(Fu, 2, 2);
        alert(iFu[0].real * 4);
        alert(iFu[1].real * 4);
        alert(iFu[2].real * 4);
        alert(iFu[3].real * 4);
    };

    return {
        center: center,
        scale: scale,
        fft2D: fft2D,
        ifft2D: ifft2D
    }
});