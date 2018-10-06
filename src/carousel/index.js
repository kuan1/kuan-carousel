import BaseCarousel from './BaseCarousel'

// 添加拖拽事件
class Carousel extends BaseCarousel {
  constructor(params) {
    super(params)
    this.actionEvents = (() => {
      if ('ontouchstart' in window) {
        return ['ontouchstart', 'touchmove', 'touchend']
      }
      return ['onmousedown', 'mousemove', 'mouseup']
    })()
    this.dragData = {
      originTranslate: 0,
      startX: 0,
      startY: 0,
      X: 0,
      Y: 0
    }
    this.saveCurrentDragData = this.saveCurrentDragData.bind(this)
    this.dragEnd = this.dragEnd.bind(this)

    // 设置拖拽
    this.setDragable()
  }

  setDragable() {
    // touchstart
    this.container[this.actionEvents[0]] = (e) => {
      this.saveStartDragData(e, 'startX')
      this.stop()
      this.setTransition(true)

      // touchmove
      document.addEventListener(this.actionEvents[1], this.saveCurrentDragData)

      // touchend
      document.addEventListener([this.actionEvents[2]], this.dragEnd)
    }
  }

  saveStartDragData(e) {
    this.dragData.originTranslate = this.getTranslate()

    this.dragData.startX = (e.changedTouches ? e.changedTouches[0].pageX : e.pageX) || 0
  }

  saveCurrentDragData(e) {
    this.dragData.X = (e.changedTouches ? e.changedTouches[0].pageX : e.pageX) || 0
    const {
      originTranslate,
      X,
      startX
    } = this.dragData
    this.setTranslate(originTranslate + X - startX)
  }

  dragEnd() {
    document.removeEventListener(this.actionEvents[1], this.saveCurrentDragData)
    document.removeEventListener(this.actionEvents[2], this.dragEnd)
    this.setTransition()
    const {
      X,
      startX
    } = this.dragData
    if (X - startX > 30) {
      this.runPrev()
    } else if (X - startX < -30) {
      this.runNext()
    } else {
      this.run()
    }
  }
}

export default Carousel