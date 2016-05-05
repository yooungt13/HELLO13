define(['util/act/matrix.js'], function(Matrix) {
    var iCanvas = document.createElement("canvas"),
        iCtx = iCanvas.getContext("2d");

    var DIP = {
        init: function(img, options) {
            // 缓存参数
            this.options = options || {};
            // 读取图片数据
            this.read(img);
            return this;
        },
        // 读取图片数据, 转化为矩阵
        read: function(image) {
            var width = image.width,
                height = image.height;

            this.resize(width, height);
            iCtx.drawImage(image, 0, 0);
            var imageData = iCtx.getImageData(0, 0, width, height),
                tempMat = new Matrix(height, width, imageData.data);

            imageData = null;
            iCtx.clearRect(0, 0, width, height);

            this.matrix = tempMat;
            return this;
        },
        // 调整canvas尺寸与图片一致
        resize: function(width, height) {
            iCanvas.width = width;
            iCanvas.height = height;
            return this;
        },
        // 处理矩阵数据
        act: function(action) {
            // 将action转化为matrix传入处理
            arguments[0] = this.matrix;
            this.matrix = Matrix.prototype[action].apply(this, arguments);
            return this;
        },
        // 输出图片数据
        show: function() {
            var cid = this.options.canvas ? this.options.canvas : 'canvas',
                canvas = document.getElementById(cid),
                ctx = canvas.getContext('2d');

            canvas.width = this.matrix.col;
            canvas.height = this.matrix.row;
            ctx.putImageData(this._transform(this.matrix), 0, 0);
            return this;
        },
        // 将RGB数据转化为图像数据
        _transform: function() {
            var width = this.matrix.col,
                height = this.matrix.row,
                imageData = iCtx.createImageData(width, height);
            imageData.data.set(this.matrix.data);
            return imageData;
        }
    }

    return DIP;
});