/**
 * 防抖函数
 * @param fn 事件触发的操作
 * @param duration 多少毫秒内连续触发事件，不会执行
 * @returns {Function}
 */
export function debounce(fn, duration = 200) {
  let timer = null
  return function() {
    const self = this
    const args = arguments
    timer && clearTimeout(timer)
    timer = setTimeout(function() {
      fn.apply(self, args)
    }, duration)
  }
}

/**
 * @description 绑定事件 on(element, event, handler)
 */
export const on = (function() {
  if (document.addEventListener) {
    return function(element, event, handler, options = false) {
      if (element && event && handler) {
        element.addEventListener(event, handler, options)
      }
    }
  } else {
    return function(element, event, handler) {
      if (element && event && handler) {
        element.attachEvent('on' + event, handler)
      }
    }
  }
})(document)

/**
 * @description 解绑事件 off(element, event, handler)
 */
export const off = (function() {
  if (document.removeEventListener) {
    return function(element, event, handler, options = false) {
      if (element && event) {
        element.removeEventListener(event, handler, options)
      }
    }
  } else {
    return function(element, event, handler) {
      if (element && event) {
        element.detachEvent('on' + event, handler)
      }
    }
  }
})(document)

/**
 * * 获取节点 getBoundingClientRect
 * @param {节点} target
 */
export const getDomClientRect = function(target) {
  if (!target) console.error('获取id节点失败')
  const targetRect = target.getBoundingClientRect()
  const top = targetRect.top
  const bottom = targetRect.bottom
  const left = targetRect.left
  const right = targetRect.right
  const width = targetRect.width || right - left
  const height = targetRect.height || bottom - top
  return {
    width,
    height,
    top,
    right,
    bottom,
    left,
    centerX: left + width / 2,
    centerY: top + height / 2
  }
}

/**
 * 删除dom节点
 * @param {content} self
 * @param {node ref} ref
 */
export const removeBody = function(self, ref) {
  const pos = self.$refs[ref]
  if (pos && pos.$el && pos.$el.parentNode === document.body) {
    document.body.removeChild(pos.$el)
  } else if (pos && pos.parentNode === document.body) {
    document.body.removeChild(pos)
  }
}
