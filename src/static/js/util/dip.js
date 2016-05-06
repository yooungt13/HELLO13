define(['util/act/matrix.js'], function(Matrix) {
    var DIP = {
        canvas: null,
        ctx: null,
        matrix: null,
        init: function(img, options) {
            // 缓存参数
            this.options = options || {};

            // 初始化画布
            this.canvas = this.options.canvas ? document.getElementById(this.options.canvas) : document.getElementsByTagName('canvas')[0];
            this.ctx = this.canvas.getContext('2d');

            // 读取图片数据
            img = img || document.getElementsByTagName('img')[0];
            this.read(img);
            return this;
        },
        // 读取图片数据, 转化为矩阵
        read: function(image) {
            var width = image.width,
                height = image.height;

            // 绘制原图
            this.resize(width, height);
            this.ctx.drawImage(image, 0, 0);

            // 获取图像数据
            var imageData = this.ctx.getImageData(0, 0, width, height);

            // 初始化图像矩阵
            this.matrix = new Matrix(height, width, imageData.data);

            imageData = null;

            return this;
        },
        // 调整canvas尺寸与图片一致
        resize: function(width, height) {
            this.canvas.width = width;
            this.canvas.height = height;
            return this;
        },
        // 处理矩阵数据
        act: function(action) {
            // 处理计时开始
            var start = +new Date();

            // 将action转化为matrix传入处理
            arguments[0] = this.matrix;
            // 执行act
            this.matrix = Matrix.prototype[action].apply(this, arguments);

            // 处理计时结束
            var end = +new Date();
            var $cost = document.getElementById('cost');
            $cost && ($cost.innerHTML = end - start);

            return this;
        },
        draw: function() {
            this.ctx.fillText('processing', 50, 50);
        },
        // 输出图片数据
        show: function() {
            this.ctx.putImageData(this._transform(this.matrix), 0, 0);
            return this;
        },
        // 将RGB数据转化为图像数据
        _transform: function() {
            var width = this.matrix.col,
                height = this.matrix.row,
                imageData = this.ctx.createImageData(width, height);
            imageData.data.set(this.matrix.data);
            return imageData;
        }
    }

    return DIP;
});