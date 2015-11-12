function GreenRun() {}
GreenRun.prototype = {
	BlogsSet: [ //人物方块设置
		[
			[1, 1],
			[1, 1],
			[1, 1],
		]
	],
	GameMap: [], //游戏地图，对应table中的td值
	BlokWidth: 28, //方块集的宽高
	HorizontalNum: 20, //水平td数量
	VerticalNum: 10, //垂直td数量
	BlokSize: 3, //设置方块占用位置
	BlockWidth: 0, //获取当前方块的非0的最大宽度
	BlockHeight: 0, //获取当前方块的非0的最大高度
	GroundLine: 2, // 地平线起始高度
	BlokCurrent: [], //当前人物方块
	InitPosition: {}, //当前方块运动的x,y
	IsPlay: false, //是否开始游戏
	IsOver: false, //游戏是否结束
	IsOverIndex: 0, //设置游戏结束的索引还有空几行
	Time: 0, // 记录运行时间，控制地图移动
	Score: 0, // 记录获得金币数量
	ScoreIndex: 100, // 单个金币分数
	MapCash: [
		[0, 0],
		[0, 0],
		[0, 0],
		[0, 0],
		[0, 0],
		[0, 0]
	], //保存当前地图块，用于恢复地图
	ColorEnum: [
		[0, 0],
		[-28, 0],
		[0, -28],
		[-28, -28],
		[0, -56],
		[-28, -56]
	], //颜色的枚举，对应BlogsSet
	CreateMap: function() {
		//加载地图，设置其宽高，根据HorizontalNum,VerticalNum的数量决定
		var map = document.getElementById("map");
		var w = this.BlokWidth * this.HorizontalNum;
		var h = this.BlokWidth * this.VerticalNum;
		map.style.width = w + "px";
		map.style.height = h + "px";
		//获得人物初始位置
		this.GetInitPosition();
		//加载地图对应的数组，初始化为0，当被占据时为1
		for (var i = 0; i < this.VerticalNum; i++) {
			this.GameMap.push([]);

			for (var j = 0; j < this.HorizontalNum; j++) {
				if ((i <= this.VerticalNum - this.GroundLine) && (i < this.InitPosition.y) && (j > this.InitPosition.x + this.BlockWidth + 1 || j < this.InitPosition.x)) {
					// 随机产生金币
					var r = Math.random();
					if (r < 0.1) this.GameMap[i][j] = 2;
					else this.GameMap[i][j] = 0;
				} else {
					this.GameMap[i][j] = 0;
				}
			}
		}
		//创建table td填充div根据HorizontalNum,VerticalNum的数量决定，创建HorizontalNum * VerticalNum的表格区域
		var table = document.createElement("table");
		table.id = "area";
		var tbody = document.createElement("tbody");
		table.cellPadding = 0;
		table.cellSpacing = 0;
		table.appendChild(tbody);
		for (var i = 0; i < this.VerticalNum; i++) {
			var tr = document.createElement("tr");
			for (var j = 0; j < this.HorizontalNum; j++) {
				var td = document.createElement("td");
				// 绘制背景地图
				if (this.GameMap[i][j] == 0) {
					td.style.backgroundImage = "url(images/bg.jpeg)";
					td.style.backgroundPosition = (-j) * this.BlokWidth + "px" + " " + (-i) * this.BlokWidth + "px";
				} else {
					td.style.backgroundImage = "url(images/coin.jpg)";
				}
				// 绘制地平线
				// if (i == this.VerticalNum - this.GroundLine) {
				// 	td.style.borderBottom = "2px solid #000";
				// }
				// 绘制网格下标
				// if (i == this.VerticalNum - 1) {
				// 	td.innerHTML = "<font color=white>" + j + "</font>";
				// }
				tr.appendChild(td);
			}
			tbody.appendChild(tr);
		}
		map.appendChild(table);
	},
	RefreshMap: function() {
		this.Time++;
		var tb = this.getTable();

		// 保存最后一列地形信息
		var tmp = [];
		for (var i = 0; i < this.VerticalNum; i++) {
			tmp[i] = this.GameMap[i][0];
		}
		// 刷新地形信息
		for (var j = 0; j < this.HorizontalNum; j++) {
			for (var i = 0; i < this.VerticalNum; i++) {
				if (j == this.HorizontalNum - 1)
					this.GameMap[i][j] = tmp[i];
				else
					this.GameMap[i][j] = this.GameMap[i][j + 1];
			}
		}

		for (var i = 0; i < this.VerticalNum; i++) {
			for (var j = 0; j < this.HorizontalNum; j++) {
				if (this.GameMap[i][j] == 0) {
					tb.rows[i].cells[j].style.backgroundImage = "url(images/bg.jpg)";
					tb.rows[i].cells[j].style.backgroundPosition = -(j + this.Time) * this.BlokWidth + "px" + " " + (-i) * this.BlokWidth + "px";
				} else {
					tb.rows[i].cells[j].style.backgroundImage = "url(images/coin.jpg)";
				}

			}
		}
		if (this.InitPosition.y + this.BlockHeight < this.VerticalNum - this.GroundLine) {
			this.MoveDown();
			this.MoveRight();
		}
	},
	SetBlock: function() { //设置地图中方块的背景图片
		var tb = this.getTable(),
			index = 0,
			imgSrc = "";

		// 设置跳起动作
		if (this.InitPosition.y < this.VerticalNum - this.BlockHeight - this.GroundLine)
			imgSrc = "man_jump.jpg";
		else
			imgSrc = "man.jpg";

		for (var i = 0; i <= this.BlockHeight; i++) {
			for (var j = 0; j <= this.BlockWidth; j++) {
				if (this.BlokCurrent[i][j] == 1) {
					tb.rows[this.InitPosition.y + i].cells[this.InitPosition.x + j].style.backgroundImage = "url(images/" + imgSrc + ")";
					tb.rows[this.InitPosition.y + i].cells[this.InitPosition.x + j].style.backgroundPosition = this.ColorEnum[index][0] + "px" + " " + this.ColorEnum[index++][1] + "px";
				}
			}
		}
	},
	SetMapCash: function() {
		var index = 0;

		for (var i = 0; i <= this.BlockHeight; i++) {
			for (var j = 0; j <= this.BlockWidth; j++) {
				this.MapCash[index][0] = -(this.InitPosition.x + j + this.Time) * this.BlokWidth;
				this.MapCash[index++][1] = -(this.InitPosition.y + i) * this.BlokWidth;
			}
		}
	},
	CanMove: function(x, y) { //根据传过来的x,y，检测方块是否能左右下移动
		if (y + this.BlockHeight == this.VerticalNum - 1) { //判断是否有到最底部，如果到底部的话停止向下移动
			this.IsOver = true;
			return false;
		}

		for (var i = this.BlockHeight; i >= 0; i--) { //检测方块的移动轨迹在地图中是否有被标记为1，如果有被标记为1就是下一步的轨迹不能运行。
			for (var j = 0; j <= this.BlockWidth; j++) {
				if (this.GameMap[y + i][x + j] == 2) {
					this.GameMap[y + i][x + j] = 0; // 如果为金币则取消标记，代表吃掉金币
					this.SetScore();
				}
				if (this.GameMap[y + i][x + j] == 1 && this.BlokCurrent[i][j] == 1) { //判断方块的下一步轨迹是否是1并且判断下一步方块的轨迹在地图中是否有为1。
					return false;
				}
			}
		}
		return true;
	},
	ClearOldBlok: function() { //当this.InitPosition.y>=0 也就是显示在地图的时候，每次左右下移动时清除方块，使得重新绘制方块
		this.SetMapCash();

		var tb = this.getTable(),
			index = 0;
		if (this.InitPosition.y >= 0) {
			for (var i = 0; i <= this.BlockHeight; i++) {
				for (var j = 0; j <= this.BlockWidth; j++) {
					if (this.BlokCurrent[i][j] == 1) {
						//tb.rows[this.InitPosition.y + i].cells[this.InitPosition.x + j].style.backgroundImage = "";
						tb.rows[this.InitPosition.y + i].cells[this.InitPosition.x + j].style.backgroundImage = "url(images/bg.jpg)";
						tb.rows[this.InitPosition.y + i].cells[this.InitPosition.x + j].style.backgroundPosition = this.MapCash[index][0] + "px" + " " + this.MapCash[index++][1] + "px";
					}
				}
			}
		}
	},
	MoveLeft: function() { //向左移动
		var x = this.InitPosition.x - 1;
		if (x < 0 || this.InitPosition.y == -1) {
			this.SetBlock();
			return;
		}
		if (this.CanMove(x, this.InitPosition.y)) {
			this.ClearOldBlok();
			this.InitPosition.x = x;
			this.SetBlock();
		} else {
			if (this.IsOver) {
				window.clearTimeout(OverTime);
				this.GameOver();
				return;
			}
		}
	},
	MoveRight: function() { //向右移动
		var x = this.InitPosition.x + 1;
		if (x + this.BlockWidth >= this.HorizontalNum || this.InitPosition.y == -1)
			return;
		if (this.CanMove(x, this.InitPosition.y)) {
			this.ClearOldBlok();
			this.InitPosition.x = x;
			this.SetBlock();
		}
	},
	MoveUp: function() { //向上移动
		if (this.InitPosition.y < this.VerticalNum - this.BlockHeight - this.GroundLine)
			return;

		var y = this.InitPosition.y - 3;
		if (y < 0 || this.InitPosition.x == -1)
			return;
		if (this.CanMove(this.InitPosition.x, y)) {
			this.ClearOldBlok();
			this.InitPosition.y = y;
			this.MoveRight();
		}
		//this.SetBlock();
	},
	MoveDown: function() { //向下移动
		var y = this.InitPosition.y + 1;
		if (y + this.BlockHeight + this.GroundLine - 1 >= this.VerticalNum || this.InitPosition.x == -1)
			return;
		if (this.CanMove(this.InitPosition.x, y)) { //判断是否能向下移动，不能的话表示该方块停止运行，继续判断是否游戏结束，如果游戏还没结束重新创建个方块继续游戏
			this.ClearOldBlok();
			this.InitPosition.y = y;
			this.SetBlock();
		}
	},
	GameOver: function() { //游戏结束
		this.IsPlay = false;
		alert("游戏结束");
	},
	SetGameMap: function() { //设置游戏地图被占有的位置标记为1
		for (var i = 0; i <= this.BlockHeight; i++)
			for (var j = 0; j <= this.BlockWidth; j++)
				if (this.BlokCurrent[i][j] == 1) {
					this.GameMap[this.InitPosition.y + i][this.InitPosition.x + j] = 1; //减1是因为每次y加1，然后在去进行判断，所以当碰到方块或底部的时候要减去多加的1
				}
	},
	SetScore: function() {
		this.getScore().innerHTML = parseInt(this.getScore().innerHTML) + this.ScoreIndex;
	},
	SetGrid: function(IsGrid) { // 设置网格
		var tb = this.getTable();
		if (!IsGrid) {
			for (var i = 0; i < t.VerticalNum; i++) {
				for (var j = 0; j < t.HorizontalNum; j++) {
					tb.rows[i].cells[j].style.border = "0px";
				}
			}
		} else {
			for (var i = 0; i < t.VerticalNum; i++) {
				for (var j = 0; j < t.HorizontalNum; j++) {
					tb.rows[i].cells[j].style.borderRight = "1px dotted #ccc";
					tb.rows[i].cells[j].style.borderBottom = "1px solid #ccc";
				}
			}
		}
	},
	Start: function() { //游戏开始
		this.IsPlay = true;
		this.CurrentIndex = 0;
		this.BlokCurrent = this.BlogsSet[this.CurrentIndex];
		this.BlockWidth = this.GetWidth(this.BlokCurrent);
		this.BlockHeight = this.GetHeight(this.BlokCurrent);
		this.GetInitPosition();
	},
	GetHeight: function(blokArr) { //获取当前方块不是0的最大高值
		for (var i = blokArr.length - 1; i >= 0; i--)
			for (var j = 0; j < blokArr[i].length; j++)
				if (blokArr[i][j] == 1)
					return i;
	},
	GetWidth: function(blokArr) { //获取当前方块不是0的最大宽值
		for (var i = blokArr.length - 1; i >= 0; i--)
			for (var j = 0; j < blokArr[i].length; j++)
				if (blokArr[j][i] == 1)
					return i;
	},
	GetInitPosition: function() { //获取方块的初始位置
		this.InitPosition = {
			x: 3,
			y: this.VerticalNum - this.BlockHeight - this.GroundLine
		};
	},
	getTable: function() {
		return document.getElementById("area");
	},
	getScore: function() {
		return document.getElementById("score");
	}
};

var t = new GreenRun();
var OverTime = null;
var IsPause = false;
var IsGrid = true;
var Speed = 500;
var btn_start;
window.onload = InitGame;
addEvent(window,'keydown',KeyDown);

function InitGame() {
	t.CreateMap();
	btn_start = document.getElementById("start");
	btn_start.disabled = "";
	btn_start.onclick = function() {
		t.Start();
		this.value = "P 暂停游戏"
		OverTime = setInterval(Runnable, Speed);
		this.disabled = "disabled";
		document.getElementById('grid').disabled = "disabled";
	}
}

function addEvent(o, e, f) {
	o.addEventListener ? o.addEventListener(e, f, false) : o.attachEvent('on' + e, function() {
		f.call(o)
	});
}

function SetSpeed(spd) {
	if (!t.IsPlay) return;

	Speed = spd;
	window.clearInterval(OverTime);
	OverTime = setInterval(Runnable, Speed);
}

function SetGrid() {
	if (t.IsPlay) return;

	t.SetGrid(IsGrid);
	IsGrid = !IsGrid;
}

function Runnable() {
	t.RefreshMap();
	t.MoveLeft();
}

function KeyDown(e) {
	if (!t.IsPlay || t.IsOver) return;
	e = e || window.event;
	var keyCode = e.keyCode || e.which || e.charCode;
	switch (keyCode) {
		case 37: //左
			if (!IsPause) t.MoveLeft();
			break;
		case 38: //上
			if (!IsPause) t.MoveUp();
			break;
		case 39: //右
			if (!IsPause) t.MoveRight();
			break;
		case 40: //下
			if (!IsPause) t.MoveDown();
			break;
		case 80: //p 暂停or开始
			IsPause = !IsPause;
			if (IsPause) {
				btn_start.value = "P 开始游戏";
				window.clearInterval(OverTime);
			} else {
				btn_start.value = "P 暂停游戏";
				OverTime = setInterval(Runnable, Speed);
			}
			break;
	}
}