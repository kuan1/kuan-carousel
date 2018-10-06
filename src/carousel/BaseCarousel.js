// 轮播基础组件
class BaseCarousel {
  constructor(containerId = 'carousel-container', params = {}) {
    const {
      delay = 3000,
        speed = 300,
        autoHeight = true,
        autoplay = true,
        on = {}
    } = params

    this.containerId = containerId
    this.itemClassName = 'carousel-item'

    this.activeIndex = 0
    this.autoHeight = autoHeight
    this.speed = speed
    this.delay = delay
    this.autoplay = autoplay

    // dom
    this.container = ''
    this.items = ''

    // events
    this.eventsListeners = {}
    Object.keys(on).forEach(eventName => {
      this.on(eventName, on[eventName])
    })
    // 初始化
    this.init()

    // resize
    window.addEventListener('resize', this.resize.bind(this))

    // 绑定this
    this.setTransition = this.setTransition.bind(this)
  }

  on(events, handler) {
    if (typeof handler !== 'function') return this
    events.split(' ').forEach(event => {
      if (!this.eventsListeners[event]) this.eventsListeners[event] = []
      this.eventsListeners[event].push(handler)
    })
    return this
  }

  emit(events, ...data) {
    const eventsArray = Array.isArray(events) ? events : events.split(' ')
    eventsArray.forEach(event => {
      if (this.eventsListeners && this.eventsListeners[event]) {
        this.eventsListeners[event].forEach(eventHandler => {
          eventHandler(...data)
        })
      }
    })
    return this
  }

  init() {
    // 获取轮播dom
    const outerContainer = document.getElementById(this.containerId)
    outerContainer.style.overflow = 'hidden'
    this.container = outerContainer.getElementsByClassName('carousel-wrapper')[0]
    this.items = document.getElementsByClassName(this.itemClassName || 'carousel-item')
    if (!this.container || !this.items || !this.items.length) {
      throw new Error('carousel dom not found')
      return
    }

    // 设置transition, css默认设置.3s
    this.setTransition()

    // 平铺每一页轮播页面
    this.resize()

    // 自动切换
    this.run()
  }

  // 轮播切换
  run(index = this.activeIndex) {
    this.slideTo(index)

    // 自动播放
    if (this.playTimer) clearTimeout(this.playTimer)
    if (this.autoplay) {
      this.playTimer = setTimeout(() => {
        this.playTimer = null
        this.activeIndex += 1
        if (this.items.length <= this.activeIndex) {
          this.activeIndex = 0
        }
        this.run()
      }, this.delay)
    }
  }

  runNext() {
    this.run(this.activeIndex + 1)
  }

  runPrev() {
    this.run(this.activeIndex - 1)
  }

  // 停止自动切换
  stop() {
    if (this.playTimer) clearTimeout(this.playTimer)
  }

  // 切换轮播
  slideTo(activeIndex = 0) {
    this.activeIndex = activeIndex
    if (activeIndex < 0) this.activeIndex = 0
    if (this.items.length - 1 < activeIndex) this.activeIndex = this.items.length - 1

    this.setTranslate(-this.container.clientWidth * this.activeIndex)

    // 设置高度
    if (this.autoHeight) {
      const activeItem = this.items[this.activeIndex]
      if (!activeItem) return
      this.container.style.height = `${activeItem.clientHeight}px`
    }
  }

  // 平铺轮播
  resize() {
    const containerWidth = this.container.clientWidth
    for (let i = 0; i < this.items.length; i++) {
      this.items[i].style.left = `${containerWidth * i}px`
    }
  }

  // 设置transition
  setTransition(disable = false) {
    const speed = disable ? 0 : (this.speed < 300 ? 300 : this.speed)
    this.container.style.transition = `transform ${speed / 1000}s`
    this.container.style.webkitTransition = `transform ${speed / 1000}s`
  }

  // 设置translate
  setTranslate(x = 0, y = 0, z = 0) {
    const transform = `translate3d(${x}px, ${y}px, ${z}px)`
    this.container.style.transform = transform
    this.container.style.webkitTransform = transform
  }

  // 获取translate
  getTranslate(axis = 'x') {
    let matrix;
    let curTransform;
    let transformMatrix;

    const curStyle = window.getComputedStyle(this.container, null);

    if (window.WebKitCSSMatrix) {
      curTransform = curStyle.transform || curStyle.webkitTransform;
      if (curTransform.split(',').length > 6) {
        curTransform = curTransform.split(', ').map(a => a.replace(',', '.')).join(', ');
      }
      // Some old versions of Webkit choke when 'none' is passed; pass
      // empty string instead in this case
      transformMatrix = new window.WebKitCSSMatrix(curTransform === 'none' ? '' : curTransform);
    } else {
      transformMatrix = curStyle.MozTransform || curStyle.OTransform || curStyle.MsTransform || curStyle.msTransform || curStyle.transform || curStyle.getPropertyValue('transform').replace('translate(', 'matrix(1, 0, 0, 1,');
      matrix = transformMatrix.toString().split(',');
    }

    if (axis === 'x') {
      // Latest Chrome and webkits Fix
      if (window.WebKitCSSMatrix) curTransform = transformMatrix.m41;
      // Crazy IE10 Matrix
      else if (matrix.length === 16) curTransform = parseFloat(matrix[12]);
      // Normal Browsers
      else curTransform = parseFloat(matrix[4]);
    }
    if (axis === 'y') {
      // Latest Chrome and webkits Fix
      if (window.WebKitCSSMatrix) curTransform = transformMatrix.m42;
      // Crazy IE10 Matrix
      else if (matrix.length === 16) curTransform = parseFloat(matrix[13]);
      // Normal Browsers
      else curTransform = parseFloat(matrix[5]);
    }
    return curTransform || 0;
  }
}

export default BaseCarousel