// 节流函数
let startTime = new Date()
export function throttle(fn, time = 300) {
  if (typeof fn !== 'function') {
    throw new Error('必须传入一个函数作为参数')
  }
  const currentTime = new Date()
  if (currentTime - startTime > time) {
    startTime = currentTime
    fn()
  }
}

// 防抖函数
let timer
export function debounce(fn, time = 300) {
  if (typeof fn !== 'function') {
    throw new Error('必须传入一个函数作为参数')
  }
  timer && clearTimeout(timer)
  timer = setTimeout(() => {
    fn()
  }, time)
}

// 获取translate距离
export function getTranslate(el, axis = 'x') {
  let matrix;
  let curTransform;
  let transformMatrix;

  const curStyle = window.getComputedStyle(el, null);

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