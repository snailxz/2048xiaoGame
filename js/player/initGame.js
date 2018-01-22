// 获取屏幕宽高
const screenWidth = window.innerWidth
const screenHeight = window.innerHeight
const DPR = window.devicePixelRatio

// 设置canvas大小
canvas.width = screenWidth * DPR
canvas.height = screenHeight * DPR
console.log(canvas.width, canvas.height, DPR)

// 主题色
const mainColor = '#fbf8ef'
// 最大方格颜色
const maxBoxColor = '#bbada0'
// 小方格颜色
const minBoxColor = '#cdbfb2'

// 计算大方框的大小
const maxBoxWidth = (canvas.width - canvas.width / 5)
// 计算大方框的位置
const maxBoxX = canvas.width / 10
const maxBoxY = canvas.height - (maxBoxWidth + canvas.height / 6.18)

// 边框宽度
const borderWidth = canvas.width / 60

// 小方框大小
const minBoxWidth = (maxBoxWidth - borderWidth * 5) / 4

// 大分数位置
const scoreX = maxBoxX
const scoreY = maxBoxY - canvas.height / 5 // 这个参数通用 历史分 当前最高分
// 分数相关方框宽度
const scoreBlockW = canvas.width / 5
// 高度
const scoreBlockH = minBoxWidth / 1.8
// 历史最高分框位置
const hisScoreX = canvas.width - (canvas.width / 10) - scoreBlockW
// 历史最高分标题位置
const hisScoreTitleX = hisScoreX + scoreBlockW / 2
// 当前总分框位置
const totalScoreX = hisScoreX - scoreBlockW - 20
// 当前总分标题位置
const totalScoreTitleX = totalScoreX + scoreBlockW / 2

// 小方框的各种颜色
const minBlockStyle = [{
		bg: '#eee4da',
		fc: '#776e65',
		fz: 2.3
	},
	{
		bg: '#ede0c8',
		fc: '#776e65',
		fz: 2.3
	},
	{
		bg: '#f2b179',
		fc: '#fff',
		fz: 2.3
	},
	{
		bg: '#f59563',
		fc: '#fff',
		fz: 2.3
	},
	{
		bg: '#f67c5f',
		fc: '#fff',
		fz: 2.3
	},
	{
		bg: '#f65e3b',
		fc: '#fff',
		fz: 2.3
	},
	{
		bg: '#edcf72',
		fc: '#fff',
		fz: 2.3
	},
	{
		bg: '#edcc61',
		fc: '#fff',
		fz: 2.5
	},
	{
		bg: '#ecc755',
		fc: '#fff',
		fz: 2.5
	},
	{
		bg: '#edc53f',
		fc: '#fff',
		fz: 2.5
	},
	{
		bg: '#edcf72',
		fc: '#fff',
		fz: 2.7
	},
	{
		bg: '#edcf72',
		fc: '#fff',
		fz: 2.7
	},
	{
		bg: '#edcf72',
		fc: '#fff',
		fz: 2.7
	},
	{
		bg: '#edcf72',
		fc: '#fff',
		fz: 3
	},
	{
		bg: '#edcf72',
		fc: '#fff',
		fz: 3
	},
	{
		bg: '#edcf72',
		fc: '#fff',
		fz: 3
	},
	{
		bg: '#edcf72',
		fc: '#fff',
		fz: 3
	}
]
// 数组
let digit = [
	[0, 0, 0, 0],
	[0, 0, 0, 0],
	[0, 0, 0, 0],
	[0, 0, 0, 0],
]
// 当前最高
let score = 0
// 历史最高
let bast = 0
// 是否生成新的小方框
let isCreate = true
// 移动速率
const rate = 0.3

export default class initGame {
	constructor() {
		// 初始化格子数据
		digit = digit.map(item => {
			return item.map(val => {
				return {
					'val': 0,
					'toX': 0,
					'toY': 0,
					'bomb': 1,
					'type': 0,
				}
			})
		})
		isCreate = true
		console.log(digit)
	}
	// 画背景 与数据无关的
	draw(ctx) {
		ctx.clearRect(0, 0, canvas.width, canvas.height)
		// 画出背景
		ctx.fillStyle = mainColor
		ctx.fillRect(0, 0, canvas.width, canvas.height)

		// 画出大方框
		ctx.fillStyle = maxBoxColor
		ctx.fillRect(maxBoxX, maxBoxY, maxBoxWidth, maxBoxWidth)

		// 画出小方框
		ctx.fillStyle = minBoxColor
		for (let i = 0; i < 4; i++) {
			for (let j = 0; j < 4; j++) {
				let x = (j + 1) * borderWidth + j * minBoxWidth + maxBoxX
				let y = (i + 1) * borderWidth + i * minBoxWidth + maxBoxY
				ctx.fillStyle = minBoxColor
				ctx.fillRect(x, y, minBoxWidth, minBoxWidth)
			}
		}

		// 画总分 和 历史最高分框
		ctx.fillStyle = maxBoxColor
		ctx.fillRect(totalScoreX, scoreY, scoreBlockW, scoreBlockH)
		ctx.fillRect(hisScoreX, scoreY, scoreBlockW, scoreBlockH)
		ctx.fillStyle = mainColor
		ctx.font = (scoreBlockH / 4) + "px Arial"
		ctx.textBaseline = "top"
		ctx.textAlign = "center"
		ctx.fillText('BAST', hisScoreTitleX, scoreY + scoreY / 30)
		ctx.fillText('SCORE', totalScoreTitleX, scoreY + scoreY / 30)
	}

	// 画分数
	drawScore(ctx, score, totalScore, hisScore) {
		// 大分数
		ctx.fillStyle = "#666"
		ctx.font = scoreBlockH + "px Arial"
		ctx.textBaseline = "top"
		ctx.textAlign = "start"
		ctx.fillText(score, scoreX, scoreY)
		// 总分 和 历史分
		ctx.fillStyle = mainColor
		ctx.font = (scoreBlockH / 2) + "px Arial"
		ctx.textBaseline = "top"
		ctx.textAlign = "center"
		ctx.fillText(totalScore, totalScoreTitleX, scoreY + (scoreBlockH / 4) + scoreY / 30)
		ctx.fillText(hisScore, hisScoreTitleX, scoreY + (scoreBlockH / 4) + scoreY / 30)
	}

	// 游戏结束
	gameOver(ctx) {
		ctx.fillStyle = "#666"
		ctx.font = scoreBlockH + "px Arial"
		ctx.textBaseline = "top"
		ctx.textAlign = "center"
		ctx.fillText("游戏结束", canvas.width / 2, maxBoxY - 150)
	}

	// 计算小方框位置
	countBlock(ctx) {
		for (let i = 0; i < 4; i++) {
			for (let j = 0; j < 4; j++) {
				if(digit[i][j].val) {
					this.drawBlock(digit[i][j], j, i, ctx)
				}
			}
		}
		if(isCreate && this.moveOk()) {
			isCreate = false
			setTimeout(() => {
				this.createNewBlock(ctx)
			}, 100)
		}
		let newval = this.operateDigit()
		score = newval.max
		bast = bast > score ? bast : score
		this.drawScore(ctx, score, newval.add, bast)
		if (!this.canMoveLeft() && !this.canMoveRight() && !this.canMoveTop() && !this.canMoveBottom()) {
			this.gameOver(ctx)
		}
	}

	// 用来对应小方框样式
	getCube(num) {
		let s = 0
		for (let i = num; i >= 2; i = i / 2) {
			s++
		}
		return s - 1
	}

	// 自动创建新的方框
	createNewBlock(ctx) {
		let oldval = this.operateDigit()
		let max = oldval.max
		let min = oldval.min
		let addSun = 0
		if (max == 0) {
			addSun = 2
		} else if (min > 0) {

		} else {
			addSun = 1
		}
		for (let i = 0; i < addSun; i++) {
			let x = parseInt(Math.random() * 4)
			let y = parseInt(Math.random() * 4)

			while (true) {
				if (digit[y][x].val == 0) {
					break;
				}
				x = parseInt(Math.random() * 4)
				y = parseInt(Math.random() * 4)
			}

			let num = Math.random() > 0.3 ? 2 : 4
			digit[y][x].val = num
			digit[y][x].bomb = 0
			this.drawBlock(digit[y][x], x, y, ctx)
		}
	}

	// 小方框数据更新 and 画
	drawBlock(item, x, y, ctx) {
		// 弹出效果递增
		if(item.bomb < 1) {
			item.bomb = item.bomb + 0.08 < 1 ? item.bomb + 0.08 : 1
		} else if(item.bomb > 1) {
			item.bomb = item.bomb - 0.08 > 1 ? item.bomb - 0.08 : 1
		}
		// 左右移动递增
		if(item.toX > 0) {
			item.toX = item.toX - rate > 0 ? item.toX - rate:0
		} else if (item.toX < 0) {
			item.toX = item.toX + rate < 0 ? item.toX + rate:0
		}
		// 上下移动递增
		if(item.toY > 0) {
			item.toY = item.toY - rate > 0 ? item.toY - rate:0
		} else if (item.toY < 0) {
			item.toY = item.toY + rate < 0 ? item.toY + rate:0
		}
		// 更新小方框数据
		if(item.toX == 0 && item.toY == 0 && item.type) {
			digit[y][x].type = 0
			digit[y][x].bomb = 1.3
		}
		// 如果满足这几个条件 说明正在进行合并
		if((item.toX != 0 || item.toY != 0) && item.type) {
			// 公共位置
			let dx = maxBoxX + borderWidth + (borderWidth + minBoxWidth) * x
			let dy = maxBoxY + borderWidth + (borderWidth + minBoxWidth) * y
			let index = this.getCube(item.val / 2)
			// 小方框背景
			ctx.fillStyle = minBlockStyle[index].bg
			ctx.fillRect(dx + (minBoxWidth / 2 - minBoxWidth * item.bomb / 2), dy + (minBoxWidth / 2 - minBoxWidth * item.bomb / 2), minBoxWidth * item.bomb, minBoxWidth * item.bomb)
			// 小方框数字
			ctx.fillStyle = minBlockStyle[index].fc
			ctx.font = minBoxWidth / minBlockStyle[index].fz * item.bomb  + "px Arial"
			ctx.textBaseline = "middle"
			ctx.textAlign = "center"
			ctx.fillText(item.val / 2, dx + minBoxWidth / 2, dy + minBoxWidth / 2)

			// 公共位置
			x = maxBoxX + borderWidth + (borderWidth + minBoxWidth) * (x + item.toX)
			y = maxBoxY + borderWidth + (borderWidth + minBoxWidth) * (y + item.toY)
			// 小方框背景
			ctx.fillStyle = minBlockStyle[index].bg
			ctx.fillRect(x + (minBoxWidth / 2 - minBoxWidth * item.bomb / 2), y + (minBoxWidth / 2 - minBoxWidth * item.bomb / 2), minBoxWidth * item.bomb, minBoxWidth * item.bomb)
			// 小方框数字
			ctx.fillStyle = minBlockStyle[index].fc
			ctx.font = minBoxWidth / minBlockStyle[index].fz * item.bomb  + "px Arial"
			ctx.textBaseline = "middle"
			ctx.textAlign = "center"
			ctx.fillText(item.val / 2, x + minBoxWidth / 2, y + minBoxWidth / 2)
		} else { // 合并完成 或者 不用合并
			// 公共位置
			x = maxBoxX + borderWidth + (borderWidth + minBoxWidth) * (x + item.toX)
			y = maxBoxY + borderWidth + (borderWidth + minBoxWidth) * (y + item.toY)
			let index = this.getCube(item.val)
			// 小方框背景
			ctx.fillStyle = minBlockStyle[index].bg
			ctx.fillRect(x + (minBoxWidth / 2 - minBoxWidth * item.bomb / 2), y + (minBoxWidth / 2 - minBoxWidth * item.bomb / 2), minBoxWidth * item.bomb, minBoxWidth * item.bomb)
			// 小方框数字
			ctx.fillStyle = minBlockStyle[index].fc
			ctx.font = minBoxWidth / minBlockStyle[index].fz * item.bomb  + "px Arial"
			ctx.textBaseline = "middle"
			ctx.textAlign = "center"
			ctx.fillText(item.val, x + minBoxWidth / 2, y + minBoxWidth / 2)
		}

	}

	// 求 和、最大、最小
	operateDigit() {
		let add = 0
		let max = 0
		let min = 0
		digit.map(itemA => {
			return itemA.map(item => {
				add += item.val
				max = max > item.val ? max : item.val
				min = min < item.val ? min : item.val
			})
		})
		return {
			'add': add,
			'max': max,
			'min': min
		}
	}

	// 判断是否有进行动画
	moveOk() {
		let isOk = true
		digit.map(itemA => {
			return itemA.map(item => {
				if (item.toX != 0 || item.toY != 0 || item.bomb != 1) {
					isOk = false
				}
			})
		})
		return true
	}

	// 左移
	moveLeft() {
		for (let i = 0; i < 3; i++) {
			for (let j = 0; j < 4; j++) {
				for (let k = i + 1; k < 4; k++) {
					if (digit[j][k].val) {
						if (digit[j][i].val) {
							if (digit[j][k].val == digit[j][i].val) {
								digit[j][i].type = 1
								digit[j][i].val *= 2
								digit[j][i].toX = k - i
								digit[j][k].val = 0
							}
							k = 4
						} else {
							digit[j][i].val = digit[j][k].val
							digit[j][i].toX = k - i
							digit[j][k].val = 0
							k--
						}
					}
				}
			}
		}
		isCreate = true
	}

	// 右移
	moveRight() {
		for (let i = 3; i > 0; i--) {
			for (let j = 0; j < 4; j++) {
				for (let k = i - 1; k >= 0; k--) {
					if (digit[j][k].val) {
						if (digit[j][i].val) {
							if (digit[j][k].val == digit[j][i].val) {
								digit[j][i].type = 1
								digit[j][i].val *= 2
								digit[j][i].toX = k - i
								digit[j][k].val = 0
							}
							k = 0
						} else {
							digit[j][i].val = digit[j][k].val
							digit[j][i].toX = k - i
							digit[j][k].val = 0
							k++
						}

					}
				}
			}
		}
		isCreate = true
	}

	// 上移
	moveTop() {
		for (let i = 0; i < 3; i++) {
			for (let j = 0; j < 4; j++) {
				for (let k = i + 1; k < 4; k++) {
					if (digit[k][j].val) {
						if (digit[i][j].val) {
							if (digit[k][j].val == digit[i][j].val) {
								digit[i][j].type = 1
								digit[i][j].val *= 2
								digit[i][j].toY = k - i
								digit[k][j].val = 0
							}
							k = 4
						} else {
							digit[i][j].val = digit[k][j].val
							digit[i][j].toY = k - i
							digit[k][j].val = 0
							k--
						}

					}
				}
			}
		}
		isCreate = true
	}

	// 下移
	moveBottom() {
		for (let i = 3; i > 0; i--) {
			for (let j = 0; j < 4; j++) {
				for (let k = i - 1; k >= 0; k--) {
					if (digit[k][j].val) {
						if (digit[i][j].val) {
							if (digit[k][j].val == digit[i][j].val) {
								digit[i][j].type = 1
								digit[i][j].val *= 2
								digit[i][j].toY = k - i
								digit[k][j].val = 0
							}
							k = 0
						} else {
							digit[i][j].val = digit[k][j].val
							digit[i][j].toY = k - i
							digit[k][j].val = 0
							k++
						}

					}
				}
			}
		}
		isCreate = true
	}

	// 能否左移
	canMoveLeft() {
		for (var i = 0; i < 4; i++) {
			for (var j = 1; j < 4; j++) {
				if (digit[i][j].val) {
					if (digit[i][j].val == digit[i][j - 1].val || digit[i][j - 1].val == 0) {
						return true;
					}
				}
			}
		}
		return false;
	}

	// 能否右移
	canMoveRight() {
		for (var i = 0; i < 4; i++) {
			for (var j = 2; j >= 0; j--) {
				if (digit[i][j].val != 0) {
					if (digit[i][j].val == digit[i][j + 1].val || digit[i][j + 1].val == 0) {
						return true;
					}
				}
			}
		}
		return false;
	}

	// 能否上移
	canMoveTop() {
		for (var i = 1; i < 4; i++) {
			for (var j = 0; j < 4; j++) {
				if (digit[i][j].val != 0) {
					if (digit[i][j].val == digit[i - 1][j].val || digit[i - 1][j].val == 0) {
						return true;
					}
				}
			}
		}
		return false;
	}

	// 能否下移
	canMoveBottom() {
		for (var i = 2; i >= 0; i--) {
			for (var j = 0; j < 4; j++) {
				if (digit[i][j].val != 0) {
					if (digit[i][j].val == digit[i + 1][j].val || digit[i + 1][j].val == 0) {
						return true;
					}
				}
			}
		}
		return false;
	}
}