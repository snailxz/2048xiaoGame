import initGame from './player/initGame'

// 获取画布方法
let ctx = canvas.getContext('2d')

export default class Main {
	constructor() {
		this.restart()
		this.initEvent()
	}

	// 启动 and 重新启动
	restart() {
		this.GameOver = false
		this.drawGame = new initGame()
		this.loop()
	}

	// 事件绑定
	initEvent() {
		let _this = this
		let x = 0
		let y = 0
		let start = 0
		canvas.addEventListener('touchstart', function (e) {
			start = window.performance.now()
			x = e.changedTouches[0].clientX
			y = e.changedTouches[0].clientY
		})
		canvas.addEventListener('touchend', function (e) {
			let stop = window.performance.now() - start
			let endx = x - e.changedTouches[0].clientX
			let endy = y - e.changedTouches[0].clientY
			if ((Math.abs(endx) > 30 || Math.abs(endy) > 30) && stop < 0.5) {
				if (Math.abs(endx) > Math.abs(endy)) {
					if (endx > 0) {
						if (_this.drawGame.canMoveLeft()) {
							_this.drawGame.moveLeft()
						}
					} else {
						if (_this.drawGame.canMoveRight()) {
							_this.drawGame.moveRight()
						}
					}
				} else {
					if (endy > 0) {
						if (_this.drawGame.canMoveTop()) {
							_this.drawGame.moveTop()
						}
					} else {
						if (_this.drawGame.canMoveBottom()) {
							_this.drawGame.moveBottom()
						}
					}
				}
			} else if (Math.abs(endx) < 5 && Math.abs(endy) < 5 && stop > 1) {
				console.log('刷新')
				_this.drawGame = new initGame()
			}
		})
	}
	loop() {
		this.drawGame.draw(ctx)
		this.drawGame.countBlock(ctx)
		let _this = this
		setTimeout(function(){
			_this.loop()
		}, 17)
		// window.requestAnimationFrame(
		// 	console.log(111),
		// 	_this.loop()
		// )
	}
}