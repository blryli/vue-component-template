(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (global = global || self, factory(global['vue-table-virtual-scroller'] = {}));
}(this, (function (exports) { 'use strict';

  function _typeof(obj) {
    if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
      _typeof = function (obj) {
        return typeof obj;
      };
    } else {
      _typeof = function (obj) {
        return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
      };
    }

    return _typeof(obj);
  }

  function _toConsumableArray(arr) {
    return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread();
  }

  function _arrayWithoutHoles(arr) {
    if (Array.isArray(arr)) {
      for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) arr2[i] = arr[i];

      return arr2;
    }
  }

  function _iterableToArray(iter) {
    if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter);
  }

  function _nonIterableSpread() {
    throw new TypeError("Invalid attempt to spread non-iterable instance");
  }

  var VTableHeaderColumn = {
    name: 'VTableHeaderColumn',
    props: {
      column: {
        type: Object,
        default: function _default() {}
      },
      columnIndex: {
        type: Number,
        default: 0
      }
    },
    inject: ['table'],
    computed: {
      width: function width() {
        return this.column.width || (this.column.minWidth || 80) + this.table.offset;
      },
      columnClass: function columnClass() {
        var classes = "v-table_1_column_".concat(this.columnIndex + 1);
        this.column.fixed && this.table.bodyOverflowX && (classes += " is--fixed-".concat(this.column.fixed));
        this.column.labelClassName && (classes += " ".concat(this.column.labelClassName));
        return classes;
      }
    },
    render: function render(h) {
      var column = this.column,
          $index = this.columnIndex;
      var slot = this.column.renderHeader(h, {
        column: column,
        $index: $index
      }) || this.column.header || (this.column.type === 'selection' ? this.renderSelection(h) : this.column.type === 'index' ? this.column.label || '#' : this.column.label);
      return h('div', {
        class: this.columnClass,
        style: this.table.setColumnStyle(this.column, this.columnIndex, this.width)
      }, [h('div', {
        class: 'cell'
      }, [slot])]);
    },
    methods: {
      renderSelection: function renderSelection(h) {
        return h('el-checkbox', {
          attrs: {
            value: this.table.selectionAll,
            key: this.index,
            indeterminate: this.table.indeterminate
          },
          on: {
            change: this.selectionChange
          }
        });
      },
      selectionChange: function selectionChange(val) {
        this.table.$emit('all.selection.change', val);
      }
    }
  };

  var VTableHeader = {
    name: 'VTableHeader',
    components: {
      VTableHeaderColumn: VTableHeaderColumn
    },
    inject: ['table'],
    watch: {
      'table.bodyScrollLeft': function tableBodyScrollLeft(val) {
        this.$el.scrollLeft = val;
      }
    },
    render: function render(h) {
      var slots = this.table.columnsSort.reduce(function (acc, column, columnIndex) {
        var slot = h('VTableHeaderColumn', {
          attrs: {
            column: column,
            columnIndex: columnIndex
          }
        });
        return acc.concat([slot]);
      }, []);
      return h('div', {
        class: 'v-table__header-container',
        ref: 'headerWrapper'
      }, [h('div', {
        class: 'v-table__header',
        style: this.table.rowStyle,
        ref: 'header'
      }, [slots])]);
    },
    mounted: function mounted() {
      var _this = this;

      this.$nextTick(function () {
        var headerWrapper = _this.$refs.headerWrapper;
        var header = _this.$refs.header;
        var headerWrapperWidth = headerWrapper.getBoundingClientRect().width;
        var headerWidth = header.getBoundingClientRect().width;
        _this.table.bodyOverflowX = headerWidth > headerWrapperWidth;
      });
    }
  };

  var config = {
    itemsLimit: 1000
  };

  function getInternetExplorerVersion() {
  	var ua = window.navigator.userAgent;

  	var msie = ua.indexOf('MSIE ');
  	if (msie > 0) {
  		// IE 10 or older => return version number
  		return parseInt(ua.substring(msie + 5, ua.indexOf('.', msie)), 10);
  	}

  	var trident = ua.indexOf('Trident/');
  	if (trident > 0) {
  		// IE 11 => return version number
  		var rv = ua.indexOf('rv:');
  		return parseInt(ua.substring(rv + 3, ua.indexOf('.', rv)), 10);
  	}

  	var edge = ua.indexOf('Edge/');
  	if (edge > 0) {
  		// Edge (IE 12+) => return version number
  		return parseInt(ua.substring(edge + 5, ua.indexOf('.', edge)), 10);
  	}

  	// other browser
  	return -1;
  }

  var isIE = void 0;

  function initCompat() {
  	if (!initCompat.init) {
  		initCompat.init = true;
  		isIE = getInternetExplorerVersion() !== -1;
  	}
  }

  var ResizeObserver = { render: function render() {
  		var _vm = this;var _h = _vm.$createElement;var _c = _vm._self._c || _h;return _c('div', { staticClass: "resize-observer", attrs: { "tabindex": "-1" } });
  	}, staticRenderFns: [], _scopeId: 'data-v-b329ee4c',
  	name: 'resize-observer',

  	methods: {
  		compareAndNotify: function compareAndNotify() {
  			if (this._w !== this.$el.offsetWidth || this._h !== this.$el.offsetHeight) {
  				this._w = this.$el.offsetWidth;
  				this._h = this.$el.offsetHeight;
  				this.$emit('notify');
  			}
  		},
  		addResizeHandlers: function addResizeHandlers() {
  			this._resizeObject.contentDocument.defaultView.addEventListener('resize', this.compareAndNotify);
  			this.compareAndNotify();
  		},
  		removeResizeHandlers: function removeResizeHandlers() {
  			if (this._resizeObject && this._resizeObject.onload) {
  				if (!isIE && this._resizeObject.contentDocument) {
  					this._resizeObject.contentDocument.defaultView.removeEventListener('resize', this.compareAndNotify);
  				}
  				delete this._resizeObject.onload;
  			}
  		}
  	},

  	mounted: function mounted() {
  		var _this = this;

  		initCompat();
  		this.$nextTick(function () {
  			_this._w = _this.$el.offsetWidth;
  			_this._h = _this.$el.offsetHeight;
  		});
  		var object = document.createElement('object');
  		this._resizeObject = object;
  		object.setAttribute('aria-hidden', 'true');
  		object.setAttribute('tabindex', -1);
  		object.onload = this.addResizeHandlers;
  		object.type = 'text/html';
  		if (isIE) {
  			this.$el.appendChild(object);
  		}
  		object.data = 'about:blank';
  		if (!isIE) {
  			this.$el.appendChild(object);
  		}
  	},
  	beforeDestroy: function beforeDestroy() {
  		this.removeResizeHandlers();
  	}
  };

  // Install the components
  function install(Vue$$1) {
  	Vue$$1.component('resize-observer', ResizeObserver);
  	Vue$$1.component('ResizeObserver', ResizeObserver);
  }

  // Plugin
  var plugin$2 = {
  	// eslint-disable-next-line no-undef
  	version: "0.4.5",
  	install: install
  };

  // Auto-install
  var GlobalVue$1 = null;
  if (typeof window !== 'undefined') {
  	GlobalVue$1 = window.Vue;
  } else if (typeof global !== 'undefined') {
  	GlobalVue$1 = global.Vue;
  }
  if (GlobalVue$1) {
  	GlobalVue$1.use(plugin$2);
  }

  var _typeof$1 = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
    return typeof obj;
  } : function (obj) {
    return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
  };





  var classCallCheck = function (instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  };

  var createClass = function () {
    function defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
      }
    }

    return function (Constructor, protoProps, staticProps) {
      if (protoProps) defineProperties(Constructor.prototype, protoProps);
      if (staticProps) defineProperties(Constructor, staticProps);
      return Constructor;
    };
  }();









































  var toConsumableArray = function (arr) {
    if (Array.isArray(arr)) {
      for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i];

      return arr2;
    } else {
      return Array.from(arr);
    }
  };

  function processOptions(value) {
  	var options = void 0;
  	if (typeof value === 'function') {
  		// Simple options (callback-only)
  		options = {
  			callback: value
  		};
  	} else {
  		// Options object
  		options = value;
  	}
  	return options;
  }

  function throttle(callback, delay) {
  	var timeout = void 0;
  	var lastState = void 0;
  	var currentArgs = void 0;
  	var throttled = function throttled(state) {
  		for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
  			args[_key - 1] = arguments[_key];
  		}

  		currentArgs = args;
  		if (timeout && state === lastState) return;
  		lastState = state;
  		clearTimeout(timeout);
  		timeout = setTimeout(function () {
  			callback.apply(undefined, [state].concat(toConsumableArray(currentArgs)));
  			timeout = 0;
  		}, delay);
  	};
  	throttled._clear = function () {
  		clearTimeout(timeout);
  	};
  	return throttled;
  }

  function deepEqual(val1, val2) {
  	if (val1 === val2) return true;
  	if ((typeof val1 === 'undefined' ? 'undefined' : _typeof$1(val1)) === 'object') {
  		for (var key in val1) {
  			if (!deepEqual(val1[key], val2[key])) {
  				return false;
  			}
  		}
  		return true;
  	}
  	return false;
  }

  var VisibilityState = function () {
  	function VisibilityState(el, options, vnode) {
  		classCallCheck(this, VisibilityState);

  		this.el = el;
  		this.observer = null;
  		this.frozen = false;
  		this.createObserver(options, vnode);
  	}

  	createClass(VisibilityState, [{
  		key: 'createObserver',
  		value: function createObserver(options, vnode) {
  			var _this = this;

  			if (this.observer) {
  				this.destroyObserver();
  			}

  			if (this.frozen) return;

  			this.options = processOptions(options);

  			this.callback = this.options.callback;
  			// Throttle
  			if (this.callback && this.options.throttle) {
  				this.callback = throttle(this.callback, this.options.throttle);
  			}

  			this.oldResult = undefined;

  			this.observer = new IntersectionObserver(function (entries) {
  				var entry = entries[0];
  				if (_this.callback) {
  					// Use isIntersecting if possible because browsers can report isIntersecting as true, but intersectionRatio as 0, when something very slowly enters the viewport.
  					var result = entry.isIntersecting && entry.intersectionRatio >= _this.threshold;
  					if (result === _this.oldResult) return;
  					_this.oldResult = result;
  					_this.callback(result, entry);
  					if (result && _this.options.once) {
  						_this.frozen = true;
  						_this.destroyObserver();
  					}
  				}
  			}, this.options.intersection);

  			// Wait for the element to be in document
  			vnode.context.$nextTick(function () {
  				_this.observer.observe(_this.el);
  			});
  		}
  	}, {
  		key: 'destroyObserver',
  		value: function destroyObserver() {
  			if (this.observer) {
  				this.observer.disconnect();
  				this.observer = null;
  			}

  			// Cancel throttled call
  			if (this.callback && this.callback._clear) {
  				this.callback._clear();
  				this.callback = null;
  			}
  		}
  	}, {
  		key: 'threshold',
  		get: function get$$1() {
  			return this.options.intersection && this.options.intersection.threshold || 0;
  		}
  	}]);
  	return VisibilityState;
  }();

  function bind(el, _ref, vnode) {
  	var value = _ref.value;

  	if (typeof IntersectionObserver === 'undefined') {
  		console.warn('[vue-observe-visibility] IntersectionObserver API is not available in your browser. Please install this polyfill: https://github.com/w3c/IntersectionObserver/tree/master/polyfill');
  	} else {
  		var state = new VisibilityState(el, value, vnode);
  		el._vue_visibilityState = state;
  	}
  }

  function update(el, _ref2, vnode) {
  	var value = _ref2.value,
  	    oldValue = _ref2.oldValue;

  	if (deepEqual(value, oldValue)) return;
  	var state = el._vue_visibilityState;
  	if (state) {
  		state.createObserver(value, vnode);
  	} else {
  		bind(el, { value: value }, vnode);
  	}
  }

  function unbind(el) {
  	var state = el._vue_visibilityState;
  	if (state) {
  		state.destroyObserver();
  		delete el._vue_visibilityState;
  	}
  }

  var ObserveVisibility = {
  	bind: bind,
  	update: update,
  	unbind: unbind
  };

  // Install the components
  function install$1(Vue$$1) {
  	Vue$$1.directive('observe-visibility', ObserveVisibility);
  	/* -- Add more components here -- */
  }

  /* -- Plugin definition & Auto-install -- */
  /* You shouldn't have to modify the code below */

  // Plugin
  var plugin$4 = {
  	// eslint-disable-next-line no-undef
  	version: "0.4.3",
  	install: install$1
  };

  // Auto-install
  var GlobalVue$2 = null;
  if (typeof window !== 'undefined') {
  	GlobalVue$2 = window.Vue;
  } else if (typeof global !== 'undefined') {
  	GlobalVue$2 = global.Vue;
  }
  if (GlobalVue$2) {
  	GlobalVue$2.use(plugin$4);
  }

  var commonjsGlobal = typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};





  function createCommonjsModule(fn, module) {
  	return module = { exports: {} }, fn(module, module.exports), module.exports;
  }

  var scrollparent = createCommonjsModule(function (module) {
  (function (root, factory) {
    if ( module.exports) {
      module.exports = factory();
    } else {
      root.Scrollparent = factory();
    }
  }(commonjsGlobal, function () {
    var regex = /(auto|scroll)/;

    var parents = function (node, ps) {
      if (node.parentNode === null) { return ps; }

      return parents(node.parentNode, ps.concat([node]));
    };

    var style = function (node, prop) {
      return getComputedStyle(node, null).getPropertyValue(prop);
    };

    var overflow = function (node) {
      return style(node, "overflow") + style(node, "overflow-y") + style(node, "overflow-x");
    };

    var scroll = function (node) {
     return regex.test(overflow(node));
    };

    var scrollParent = function (node) {
      if (!(node instanceof HTMLElement || node instanceof SVGElement)) {
        return ;
      }

      var ps = parents(node.parentNode, []);

      for (var i = 0; i < ps.length; i += 1) {
        if (scroll(ps[i])) {
          return ps[i];
        }
      }

      return document.scrollingElement || document.documentElement;
    };

    return scrollParent;
  }));
  });

  var _typeof$1$1 = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
    return typeof obj;
  } : function (obj) {
    return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
  };













  var defineProperty = function (obj, key, value) {
    if (key in obj) {
      Object.defineProperty(obj, key, {
        value: value,
        enumerable: true,
        configurable: true,
        writable: true
      });
    } else {
      obj[key] = value;
    }

    return obj;
  };

  var _extends = Object.assign || function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];

      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }

    return target;
  };

  var props = {
    items: {
      type: Array,
      required: true
    },

    keyField: {
      type: String,
      default: 'id'
    },

    direction: {
      type: String,
      default: 'vertical',
      validator: function validator(value) {
        return ['vertical', 'horizontal'].includes(value);
      }
    }
  };

  function simpleArray() {
    return this.items.length && _typeof$1$1(this.items[0]) !== 'object';
  }

  var supportsPassive = false;

  if (typeof window !== 'undefined') {
    supportsPassive = false;
    try {
      var opts = Object.defineProperty({}, 'passive', {
        get: function get() {
          supportsPassive = true;
        }
      });
      window.addEventListener('test', null, opts);
    } catch (e) {}
  }

  var uid = 0;

  var RecycleScroller = { render: function render() {
      var _vm = this;var _h = _vm.$createElement;var _c = _vm._self._c || _h;return _c('div', { directives: [{ name: "observe-visibility", rawName: "v-observe-visibility", value: _vm.handleVisibilityChange, expression: "handleVisibilityChange" }], staticClass: "vue-recycle-scroller", class: defineProperty({ ready: _vm.ready, 'page-mode': _vm.pageMode }, 'direction-' + _vm.direction, true), on: { "&scroll": function scroll($event) {
            return _vm.handleScroll($event);
          } } }, [_vm.$slots.before ? _c('div', { staticClass: "vue-recycle-scroller__slot" }, [_vm._t("before")], 2) : _vm._e(), _vm._v(" "), _c('div', { ref: "wrapper", staticClass: "vue-recycle-scroller__item-wrapper", style: defineProperty({}, _vm.direction === 'vertical' ? 'minHeight' : 'minWidth', _vm.totalSize + 'px') }, _vm._l(_vm.pool, function (view) {
        return _c('div', { key: view.nr.id, staticClass: "vue-recycle-scroller__item-view", class: { hover: _vm.hoverKey === view.nr.key }, style: _vm.ready ? { transform: 'translate' + (_vm.direction === 'vertical' ? 'Y' : 'X') + '(' + view.position + 'px)' } : null, on: { "mouseenter": function mouseenter($event) {
              _vm.hoverKey = view.nr.key;
            }, "mouseleave": function mouseleave($event) {
              _vm.hoverKey = null;
            } } }, [_vm._t("default", null, { item: view.item, index: view.nr.index, active: view.nr.used })], 2);
      }), 0), _vm._v(" "), _vm.$slots.after ? _c('div', { staticClass: "vue-recycle-scroller__slot" }, [_vm._t("after")], 2) : _vm._e(), _vm._v(" "), _c('ResizeObserver', { on: { "notify": _vm.handleResize } })], 1);
    }, staticRenderFns: [],
    name: 'RecycleScroller',

    components: {
      ResizeObserver: ResizeObserver
    },

    directives: {
      ObserveVisibility: ObserveVisibility
    },

    props: _extends({}, props, {

      itemSize: {
        type: Number,
        default: null
      },

      minItemSize: {
        type: [Number, String],
        default: null
      },

      sizeField: {
        type: String,
        default: 'size'
      },

      typeField: {
        type: String,
        default: 'type'
      },

      buffer: {
        type: Number,
        default: 200
      },

      pageMode: {
        type: Boolean,
        default: false
      },

      prerender: {
        type: Number,
        default: 0
      },

      emitUpdate: {
        type: Boolean,
        default: false
      }
    }),

    data: function data() {
      return {
        pool: [],
        totalSize: 0,
        ready: false,
        hoverKey: null
      };
    },


    computed: {
      sizes: function sizes() {
        if (this.itemSize === null) {
          var sizes = {
            '-1': { accumulator: 0 }
          };
          var items = this.items;
          var field = this.sizeField;
          var minItemSize = this.minItemSize;
          var accumulator = 0;
          var current = void 0;
          for (var i = 0, l = items.length; i < l; i++) {
            current = items[i][field] || minItemSize;
            accumulator += current;
            sizes[i] = { accumulator: accumulator, size: current };
          }
          return sizes;
        }
        return [];
      },


      simpleArray: simpleArray
    },

    watch: {
      items: function items() {
        this.updateVisibleItems(true);
      },
      pageMode: function pageMode() {
        this.applyPageMode();
        this.updateVisibleItems(false);
      },


      sizes: {
        handler: function handler() {
          this.updateVisibleItems(false);
        },

        deep: true
      }
    },

    created: function created() {
      this.$_startIndex = 0;
      this.$_endIndex = 0;
      this.$_views = new Map();
      this.$_unusedViews = new Map();
      this.$_scrollDirty = false;

      if (this.$isServer) {
        this.updateVisibleItems(false);
      }
    },
    mounted: function mounted() {
      var _this = this;

      this.applyPageMode();
      this.$nextTick(function () {
        _this.updateVisibleItems(true);
        _this.ready = true;
      });
    },
    beforeDestroy: function beforeDestroy() {
      this.removeListeners();
    },


    methods: {
      addView: function addView(pool, index, item, key, type) {
        var view = {
          item: item,
          position: 0
        };
        var nonReactive = {
          id: uid++,
          index: index,
          used: true,
          key: key,
          type: type
        };
        Object.defineProperty(view, 'nr', {
          configurable: false,
          value: nonReactive
        });
        pool.push(view);
        return view;
      },
      unuseView: function unuseView(view) {
        var fake = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

        var unusedViews = this.$_unusedViews;
        var type = view.nr.type;
        var unusedPool = unusedViews.get(type);
        if (!unusedPool) {
          unusedPool = [];
          unusedViews.set(type, unusedPool);
        }
        unusedPool.push(view);
        if (!fake) {
          view.nr.used = false;
          view.position = -9999;
          this.$_views.delete(view.nr.key);
        }
      },
      handleResize: function handleResize() {
        this.$emit('resize');
        if (this.ready) this.updateVisibleItems(false);
      },
      handleScroll: function handleScroll(event) {
        var _this2 = this;

        if (!this.$_scrollDirty) {
          this.$_scrollDirty = true;
          requestAnimationFrame(function () {
            _this2.$_scrollDirty = false;

            var _updateVisibleItems = _this2.updateVisibleItems(false),
                continuous = _updateVisibleItems.continuous;

            // It seems sometimes chrome doesn't fire scroll event :/
            // When non continous scrolling is ending, we force a refresh


            if (!continuous) {
              clearTimeout(_this2.$_refreshTimout);
              _this2.$_refreshTimout = setTimeout(_this2.handleScroll, 100);
            }
          });
        }
      },
      handleVisibilityChange: function handleVisibilityChange(isVisible, entry) {
        var _this3 = this;

        if (this.ready) {
          if (isVisible || entry.boundingClientRect.width !== 0 || entry.boundingClientRect.height !== 0) {
            this.$emit('visible');
            requestAnimationFrame(function () {
              _this3.updateVisibleItems(false);
            });
          } else {
            this.$emit('hidden');
          }
        }
      },
      updateVisibleItems: function updateVisibleItems(checkItem) {
        var itemSize = this.itemSize;
        var typeField = this.typeField;
        var keyField = this.simpleArray ? null : this.keyField;
        var items = this.items;
        var count = items.length;
        var sizes = this.sizes;
        var views = this.$_views;
        var unusedViews = this.$_unusedViews;
        var pool = this.pool;
        var startIndex = void 0,
            endIndex = void 0;
        var totalSize = void 0;

        if (!count) {
          startIndex = endIndex = totalSize = 0;
        } else if (this.$isServer) {
          startIndex = 0;
          endIndex = this.prerender;
          totalSize = null;
        } else {
          var scroll = this.getScroll();
          var buffer = this.buffer;
          scroll.start -= buffer;
          scroll.end += buffer;

          // Variable size mode
          if (itemSize === null) {
            var h = void 0;
            var a = 0;
            var b = count - 1;
            var i = ~~(count / 2);
            var oldI = void 0;

            // Searching for startIndex
            do {
              oldI = i;
              h = sizes[i].accumulator;
              if (h < scroll.start) {
                a = i;
              } else if (i < count - 1 && sizes[i + 1].accumulator > scroll.start) {
                b = i;
              }
              i = ~~((a + b) / 2);
            } while (i !== oldI);
            i < 0 && (i = 0);
            startIndex = i;

            // For container style
            totalSize = sizes[count - 1].accumulator;

            // Searching for endIndex
            for (endIndex = i; endIndex < count && sizes[endIndex].accumulator < scroll.end; endIndex++) {}
            if (endIndex === -1) {
              endIndex = items.length - 1;
            } else {
              endIndex++;
              // Bounds
              endIndex > count && (endIndex = count);
            }
          } else {
            // Fixed size mode
            startIndex = ~~(scroll.start / itemSize);
            endIndex = Math.ceil(scroll.end / itemSize);

            // Bounds
            startIndex < 0 && (startIndex = 0);
            endIndex > count && (endIndex = count);

            totalSize = count * itemSize;
          }
        }

        if (endIndex - startIndex > config.itemsLimit) {
          this.itemsLimitError();
        }

        this.totalSize = totalSize;

        var view = void 0;

        var continuous = startIndex <= this.$_endIndex && endIndex >= this.$_startIndex;
        var unusedIndex = void 0;

        if (this.$_continuous !== continuous) {
          if (continuous) {
            views.clear();
            unusedViews.clear();
            for (var _i = 0, l = pool.length; _i < l; _i++) {
              view = pool[_i];
              this.unuseView(view);
            }
          }
          this.$_continuous = continuous;
        } else if (continuous) {
          for (var _i2 = 0, _l = pool.length; _i2 < _l; _i2++) {
            view = pool[_i2];
            if (view.nr.used) {
              // Update view item index
              if (checkItem) {
                view.nr.index = items.findIndex(function (item) {
                  return keyField ? item[keyField] === view.item[keyField] : item === view.item;
                });
              }

              // Check if index is still in visible range
              if (view.nr.index === -1 || view.nr.index < startIndex || view.nr.index >= endIndex) {
                this.unuseView(view);
              }
            }
          }
        }

        if (!continuous) {
          unusedIndex = new Map();
        }

        var item = void 0,
            type = void 0,
            unusedPool = void 0;
        var v = void 0;
        for (var _i3 = startIndex; _i3 < endIndex; _i3++) {
          item = items[_i3];
          var key = keyField ? item[keyField] : item;
          view = views.get(key);

          if (!itemSize && !sizes[_i3].size) {
            if (view) this.unuseView(view);
            continue;
          }

          // No view assigned to item
          if (!view) {
            type = item[typeField];

            if (continuous) {
              unusedPool = unusedViews.get(type);
              // Reuse existing view
              if (unusedPool && unusedPool.length) {
                view = unusedPool.pop();
                view.item = item;
                view.nr.used = true;
                view.nr.index = _i3;
                view.nr.key = key;
                view.nr.type = type;
              } else {
                view = this.addView(pool, _i3, item, key, type);
              }
            } else {
              unusedPool = unusedViews.get(type);
              v = unusedIndex.get(type) || 0;
              // Use existing view
              // We don't care if they are already used
              // because we are not in continous scrolling
              if (unusedPool && v < unusedPool.length) {
                view = unusedPool[v];
                view.item = item;
                view.nr.used = true;
                view.nr.index = _i3;
                view.nr.key = key;
                view.nr.type = type;
                unusedIndex.set(type, v + 1);
              } else {
                view = this.addView(pool, _i3, item, key, type);
                this.unuseView(view, true);
              }
              v++;
            }
            views.set(key, view);
          } else {
            view.nr.used = true;
            view.item = item;
          }

          // Update position
          if (itemSize === null) {
            view.position = sizes[_i3 - 1].accumulator;
          } else {
            view.position = _i3 * itemSize;
          }
        }

        this.$_startIndex = startIndex;
        this.$_endIndex = endIndex;

        if (this.emitUpdate) this.$emit('update', startIndex, endIndex);

        return {
          continuous: continuous
        };
      },
      getListenerTarget: function getListenerTarget() {
        var target = scrollparent(this.$el);
        // Fix global scroll target for Chrome and Safari
        if (window.document && (target === window.document.documentElement || target === window.document.body)) {
          target = window;
        }
        return target;
      },
      getScroll: function getScroll() {
        var el = this.$el,
            direction = this.direction;

        var isVertical = direction === 'vertical';
        var scrollState = void 0;

        if (this.pageMode) {
          var bounds = el.getBoundingClientRect();
          var boundsSize = isVertical ? bounds.height : bounds.width;
          var start = -(isVertical ? bounds.top : bounds.left);
          var size = isVertical ? window.innerHeight : window.innerWidth;
          if (start < 0) {
            size += start;
            start = 0;
          }
          if (start + size > boundsSize) {
            size = boundsSize - start;
          }
          scrollState = {
            start: start,
            end: start + size
          };
        } else if (isVertical) {
          scrollState = {
            start: el.scrollTop,
            end: el.scrollTop + el.clientHeight
          };
        } else {
          scrollState = {
            start: el.scrollLeft,
            end: el.scrollLeft + el.clientWidth
          };
        }

        return scrollState;
      },
      applyPageMode: function applyPageMode() {
        if (this.pageMode) {
          this.addListeners();
        } else {
          this.removeListeners();
        }
      },
      addListeners: function addListeners() {
        this.listenerTarget = this.getListenerTarget();
        this.listenerTarget.addEventListener('scroll', this.handleScroll, supportsPassive ? {
          passive: true
        } : false);
        this.listenerTarget.addEventListener('resize', this.handleResize);
      },
      removeListeners: function removeListeners() {
        if (!this.listenerTarget) {
          return;
        }

        this.listenerTarget.removeEventListener('scroll', this.handleScroll);
        this.listenerTarget.removeEventListener('resize', this.handleResize);

        this.listenerTarget = null;
      },
      scrollToItem: function scrollToItem(index) {
        var scroll = void 0;
        if (this.itemSize === null) {
          scroll = index > 0 ? this.sizes[index - 1].accumulator : 0;
        } else {
          scroll = index * this.itemSize;
        }
        this.scrollToPosition(scroll);
      },
      scrollToPosition: function scrollToPosition(position) {
        if (this.direction === 'vertical') {
          this.$el.scrollTop = position;
        } else {
          this.$el.scrollLeft = position;
        }
      },
      itemsLimitError: function itemsLimitError() {
        var _this4 = this;

        setTimeout(function () {
          console.log('It seems the scroller element isn\'t scrolling, so it tries to render all the items at once.', 'Scroller:', _this4.$el);
          console.log('Make sure the scroller has a fixed height (or width) and \'overflow-y\' (or \'overflow-x\') set to \'auto\' so it can scroll correctly and only render the items visible in the scroll viewport.');
        });
        throw new Error('Rendered items limit reached');
      }
    }
  };

  var DynamicScroller = { render: function render() {
      var _vm = this;var _h = _vm.$createElement;var _c = _vm._self._c || _h;return _c('RecycleScroller', _vm._g(_vm._b({ ref: "scroller", attrs: { "items": _vm.itemsWithSize, "min-item-size": _vm.minItemSize, "direction": _vm.direction, "key-field": "id" }, on: { "resize": _vm.onScrollerResize, "visible": _vm.onScrollerVisible }, scopedSlots: _vm._u([{ key: "default", fn: function fn(_ref) {
            var itemWithSize = _ref.item,
                index = _ref.index,
                active = _ref.active;
            return [_vm._t("default", null, null, {
              item: itemWithSize.item,
              index: index,
              active: active,
              itemWithSize: itemWithSize
            })];
          } }]) }, 'RecycleScroller', _vm.$attrs, false), _vm.listeners), [_c('template', { slot: "before" }, [_vm._t("before")], 2), _vm._v(" "), _c('template', { slot: "after" }, [_vm._t("after")], 2)], 2);
    }, staticRenderFns: [],
    name: 'DynamicScroller',

    components: {
      RecycleScroller: RecycleScroller
    },

    inheritAttrs: false,

    provide: function provide() {
      return {
        vscrollData: this.vscrollData,
        vscrollParent: this
      };
    },


    props: _extends({}, props, {

      minItemSize: {
        type: [Number, String],
        required: true
      }
    }),

    data: function data() {
      return {
        vscrollData: {
          active: true,
          sizes: {},
          validSizes: {},
          keyField: this.keyField,
          simpleArray: false
        }
      };
    },


    computed: {
      simpleArray: simpleArray,

      itemsWithSize: function itemsWithSize() {
        var result = [];
        var items = this.items,
            keyField = this.keyField,
            simpleArray$$1 = this.simpleArray;

        var sizes = this.vscrollData.sizes;
        for (var i = 0; i < items.length; i++) {
          var item = items[i];
          var id = simpleArray$$1 ? i : item[keyField];
          var size = sizes[id];
          if (typeof size === 'undefined' && !this.$_undefinedMap[id]) {
            // eslint-disable-next-line vue/no-side-effects-in-computed-properties
            this.$_undefinedSizes++;
            // eslint-disable-next-line vue/no-side-effects-in-computed-properties
            this.$_undefinedMap[id] = true;
            size = 0;
          }
          result.push({
            item: item,
            id: id,
            size: size
          });
        }
        return result;
      },
      listeners: function listeners() {
        var listeners = {};
        for (var key in this.$listeners) {
          if (key !== 'resize' && key !== 'visible') {
            listeners[key] = this.$listeners[key];
          }
        }
        return listeners;
      }
    },

    watch: {
      items: function items() {
        this.forceUpdate(false);
      },


      simpleArray: {
        handler: function handler(value) {
          this.vscrollData.simpleArray = value;
        },

        immediate: true
      },

      direction: function direction(value) {
        this.forceUpdate(true);
      }
    },

    created: function created() {
      this.$_updates = [];
      this.$_undefinedSizes = 0;
      this.$_undefinedMap = {};
    },
    activated: function activated() {
      this.vscrollData.active = true;
    },
    deactivated: function deactivated() {
      this.vscrollData.active = false;
    },


    methods: {
      onScrollerResize: function onScrollerResize() {
        var scroller = this.$refs.scroller;
        if (scroller) {
          this.forceUpdate();
        }
        this.$emit('resize');
      },
      onScrollerVisible: function onScrollerVisible() {
        this.$emit('vscroll:update', { force: false });
        this.$emit('visible');
      },
      forceUpdate: function forceUpdate() {
        var clear = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;

        if (clear || this.simpleArray) {
          this.vscrollData.validSizes = {};
        }
        this.$emit('vscroll:update', { force: true });
      },
      scrollToItem: function scrollToItem(index) {
        var scroller = this.$refs.scroller;
        if (scroller) scroller.scrollToItem(index);
      },
      getItemSize: function getItemSize(item) {
        var index = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;

        var id = this.simpleArray ? index != null ? index : this.items.indexOf(item) : item[this.keyField];
        return this.vscrollData.sizes[id] || 0;
      },
      scrollToBottom: function scrollToBottom() {
        var _this = this;

        if (this.$_scrollingToBottom) return;
        this.$_scrollingToBottom = true;
        var el = this.$el;
        // Item is inserted to the DOM
        this.$nextTick(function () {
          // Item sizes are computed
          var cb = function cb() {
            el.scrollTop = el.scrollHeight;
            if (_this.$_undefinedSizes === 0) {
              _this.$_scrollingToBottom = false;
            } else {
              requestAnimationFrame(cb);
            }
          };
          requestAnimationFrame(cb);
        });
      }
    }
  };

  var DynamicScrollerItem = {
    name: 'DynamicScrollerItem',

    inject: ['vscrollData', 'vscrollParent'],

    props: {
      item: {
        required: true
      },

      watchData: {
        type: Boolean,
        default: false
      },

      active: {
        type: Boolean,
        required: true
      },

      index: {
        type: Number,
        default: undefined
      },

      sizeDependencies: {
        type: [Array, Object],
        default: null
      },

      emitResize: {
        type: Boolean,
        default: false
      },

      tag: {
        type: String,
        default: 'div'
      }
    },

    computed: {
      id: function id() {
        return this.vscrollData.simpleArray ? this.index : this.item[this.vscrollData.keyField];
      },
      size: function size() {
        return this.vscrollData.validSizes[this.id] && this.vscrollData.sizes[this.id] || 0;
      }
    },

    watch: {
      watchData: 'updateWatchData',

      id: function id() {
        if (!this.size) {
          this.onDataUpdate();
        }
      },
      active: function active(value) {
        if (value && this.$_pendingVScrollUpdate === this.id) {
          this.updateSize();
        }
      }
    },

    created: function created() {
      var _this = this;

      if (this.$isServer) return;

      this.$_forceNextVScrollUpdate = null;
      this.updateWatchData();

      var _loop = function _loop(k) {
        _this.$watch(function () {
          return _this.sizeDependencies[k];
        }, _this.onDataUpdate);
      };

      for (var k in this.sizeDependencies) {
        _loop(k);
      }

      this.vscrollParent.$on('vscroll:update', this.onVscrollUpdate);
      this.vscrollParent.$on('vscroll:update-size', this.onVscrollUpdateSize);
    },
    mounted: function mounted() {
      if (this.vscrollData.active) {
        this.updateSize();
      }
    },
    beforeDestroy: function beforeDestroy() {
      this.vscrollParent.$off('vscroll:update', this.onVscrollUpdate);
      this.vscrollParent.$off('vscroll:update-size', this.onVscrollUpdateSize);
    },


    methods: {
      updateSize: function updateSize() {
        if (this.active && this.vscrollData.active) {
          if (this.$_pendingSizeUpdate !== this.id) {
            this.$_pendingSizeUpdate = this.id;
            this.$_forceNextVScrollUpdate = null;
            this.$_pendingVScrollUpdate = null;
            if (this.active && this.vscrollData.active) {
              this.computeSize(this.id);
            }
          }
        } else {
          this.$_forceNextVScrollUpdate = this.id;
        }
      },
      getBounds: function getBounds() {
        return this.$el.getBoundingClientRect();
      },
      updateWatchData: function updateWatchData() {
        var _this2 = this;

        if (this.watchData) {
          this.$_watchData = this.$watch('data', function () {
            _this2.onDataUpdate();
          }, {
            deep: true
          });
        } else if (this.$_watchData) {
          this.$_watchData();
          this.$_watchData = null;
        }
      },
      onVscrollUpdate: function onVscrollUpdate(_ref) {
        var force = _ref.force;

        if (!this.active && force) {
          this.$_pendingVScrollUpdate = this.id;
        }
        if (this.$_forceNextVScrollUpdate === this.id || force || !this.size) {
          this.updateSize();
        }
      },
      onDataUpdate: function onDataUpdate() {
        this.updateSize();
      },
      computeSize: function computeSize(id) {
        var _this3 = this;

        this.$nextTick(function () {
          if (_this3.id === id) {
            var bounds = _this3.getBounds();
            var size = Math.round(_this3.vscrollParent.direction === 'vertical' ? bounds.height : bounds.width);
            if (size && _this3.size !== size) {
              if (_this3.vscrollParent.$_undefinedMap[id]) {
                _this3.vscrollParent.$_undefinedSizes--;
                _this3.vscrollParent.$_undefinedMap[id] = undefined;
              }
              _this3.$set(_this3.vscrollData.sizes, _this3.id, size);
              _this3.$set(_this3.vscrollData.validSizes, _this3.id, true);
              if (_this3.emitResize) _this3.$emit('resize', _this3.id);
            }
          }
          _this3.$_pendingSizeUpdate = null;
        });
      }
    },

    render: function render(h) {
      return h(this.tag, this.$slots.default);
    }
  };

  function registerComponents(Vue$$1, prefix) {
    Vue$$1.component(prefix + 'recycle-scroller', RecycleScroller);
    Vue$$1.component(prefix + 'RecycleScroller', RecycleScroller);
    Vue$$1.component(prefix + 'dynamic-scroller', DynamicScroller);
    Vue$$1.component(prefix + 'DynamicScroller', DynamicScroller);
    Vue$$1.component(prefix + 'dynamic-scroller-item', DynamicScrollerItem);
    Vue$$1.component(prefix + 'DynamicScrollerItem', DynamicScrollerItem);
  }

  var plugin = {
    // eslint-disable-next-line no-undef
    version: "1.0.0-rc.2",
    install: function install(Vue$$1, options) {
      var finalOptions = Object.assign({}, {
        installComponents: true,
        componentsPrefix: ''
      }, options);

      for (var key in finalOptions) {
        if (typeof finalOptions[key] !== 'undefined') {
          config[key] = finalOptions[key];
        }
      }

      if (finalOptions.installComponents) {
        registerComponents(Vue$$1, finalOptions.componentsPrefix);
      }
    }
  };

  // Auto-install
  var GlobalVue = null;
  if (typeof window !== 'undefined') {
    GlobalVue = window.Vue;
  } else if (typeof global !== 'undefined') {
    GlobalVue = global.Vue;
  }
  if (GlobalVue) {
    GlobalVue.use(plugin);
  }

  var TableBodyColumn = {
    name: 'TableBodyColumn',
    props: {
      index: {
        type: Number,
        default: 0
      },
      item: {
        type: Object,
        default: function _default() {}
      },
      column: {
        type: Object,
        default: function _default() {}
      },
      columnIndex: {
        type: Number,
        default: 0
      }
    },
    inject: ['table'],
    data: function data() {
      return {
        checked: false,
        columnId: null
      };
    },
    render: function render(h) {
      var _this = this;

      var renderSlot = this.renderSlot(h);
      var slot = renderSlot || (this.column.type === 'selection' ? this.renderSelection(h) : this.column.type === 'index' ? this.renderIndex() : this.column.prop ? this.item[this.column.prop] : '');
      return h('div', {
        class: this.columnClass,
        style: this.table.setColumnStyle(this.column, this.columnIndex, this.width),
        on: {
          mouseenter: function mouseenter(event) {
            return _this.handleMouseenter(event, slot);
          },
          mouseleave: function mouseleave(event) {
            return _this.handleMouseleave(event, slot);
          }
        }
      }, [h('div', {
        class: {
          cell: true,
          'v-tooltip': this.showOverflowTooltip
        },
        ref: 'cell'
      }, [slot])]);
    },
    computed: {
      width: function width() {
        return this.column.width || (this.column.minWidth || 80) + this.table.offset;
      },
      showOverflowTooltip: function showOverflowTooltip() {
        return this.table.showOverflowTooltip || this.column.showOverflowTooltip;
      },
      columnClass: function columnClass() {
        var classes = "v-table_".concat(this.index + 1, "_column_").concat(this.columnIndex + 1);
        this.column.fixed && this.table.bodyOverflowX && (classes += " is--fixed-".concat(this.column.fixed));
        this.column.className && (classes += " ".concat(this.column.className));
        return classes;
      }
    },
    methods: {
      renderSelection: function renderSelection(h) {
        return h('el-checkbox', {
          attrs: {
            value: this.table.isChecked(this.index),
            key: this.index
          },
          on: {
            change: this.selectionRowChange
          }
        });
      },
      handleMouseenter: function handleMouseenter(event, slot) {
        var item = this.item,
            column = this.column;
        var cell = this.$refs.cell;
        this.table.$emit('cell.mouse.enter', item, column, cell, event, slot);

        if (!cell.classList.contains('v-tooltip') && cell.childNodes.length) {
          return;
        } // 如果文本溢出 显示tooltip


        var range = document.createRange();
        range.setStart(cell, 0);
        range.setEnd(cell, cell.childNodes.length);
        var rangeWidth = range.getBoundingClientRect().width;
        var padding = parseInt(this.getStyle(cell, 'paddingLeft')) + parseInt(this.getStyle(cell, 'paddingRight'));

        if (padding + rangeWidth > this.width) {
          this.table.show = true;
          this.table.reference = cell;
          this.table.popoverSlot = slot;
        }
      },
      getStyle: function getStyle(elem, prop) {
        if (prop) prop = prop.replace(/([A-Z])/g, function (str) {
          return '-' + str.toLowerCase();
        });
        return window.getComputedStyle(elem, null).getPropertyValue(prop);
      },
      handleMouseleave: function handleMouseleave(event, slot) {
        var item = this.item,
            column = this.column;
        var cell = this.$refs.cell;
        this.table.$emit('cell.mouse.leave', item, column, cell, event, slot);
        this.table.show = false;
      },
      renderIndex: function renderIndex() {
        return this.index + 1;
      },
      renderSlot: function renderSlot(h) {
        return this.column.renderSlot(h, {
          row: this.item,
          $index: this.index
        });
      },
      selectionRowChange: function selectionRowChange(selected) {
        this.table.$emit('row.selection.change', this.index, selected);
      }
    }
  };

  var getCell = function getCell(event) {
    var cell = event.target;

    while (cell && cell.tagName.toUpperCase() !== 'HTML') {
      if (/v-table_\d_column_\d/.test(cell.className)) {
        return cell;
      }

      cell = cell.parentNode;
    }

    return null;
  };
  var getColumnById = function getColumnById(table, columnId) {
    var column = null;
    table.columns.forEach(function (item) {
      if (item.columnId === +columnId) {
        column = item;
      }
    });
    return column;
  };
  var getColumnByCell = function getColumnByCell(table, cell) {
    var matches = (cell.className || '').match(/v-table_[^\s]+/gm);

    if (matches) {
      var arr = cell.className.split('_');
      var columnId = arr[arr.length - 1];
      return getColumnById(table, columnId);
    }

    return null;
  };

  var VTableBody = {
    name: 'TableBody',
    components: {
      TableBodyColumn: TableBodyColumn
    },
    props: {
      item: {
        type: Object,
        default: function _default() {}
      },
      index: Number
    },
    inject: ['table'],
    render: function render(h) {
      var _this = this;

      var slots = this.table.columnsSort.reduce(function (acc, column, columnIndex) {
        var item = _this.item,
            index = _this.index;
        var slot = h('TableBodyColumn', {
          attrs: {
            item: item,
            index: index,
            column: column,
            columnIndex: columnIndex
          }
        });
        return acc.concat([slot]);
      }, []);
      var classes = 'v-table__body';
      this.table.currentRow === this.index && (classes += ' current-row');
      return h('div', {
        class: classes,
        style: this.table.rowStyle,
        on: {
          click: function click(event) {
            return _this.handleClick(event);
          },
          dblclick: function dblclick(event) {
            return _this.handleDoubleClick(event);
          }
        }
      }, [slots]);
    },
    methods: {
      handleClick: function handleClick(event) {
        this.table.highlightCurrentRow && (this.table.currentRow = this.index);
        this.handleEvent(event, 'click');
      },
      handleDoubleClick: function handleDoubleClick(event) {
        this.handleEvent(event, 'dblclick');
      },
      handleEvent: function handleEvent(event, name) {
        var table = this.table;
        var cell = getCell(event);
        var column;

        if (cell) {
          column = getColumnByCell(table, cell);

          if (column) {
            table.$emit("cell-".concat(name), this.item, column, cell, event);
          }
        }

        table.$emit("row-".concat(name), this.item, column, event);
      }
    }
  };

  /**
   * 防抖函数
   * @param fn 事件触发的操作
   * @param duration 多少毫秒内连续触发事件，不会执行
   * @returns {Function}
   */
  /**
   * @description 绑定事件 on(element, event, handler)
   */

  var on = function () {
    if (document.addEventListener) {
      return function (element, event, handler) {
        var options = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;

        if (element && event && handler) {
          element.addEventListener(event, handler, options);
        }
      };
    } else {
      return function (element, event, handler) {
        if (element && event && handler) {
          element.attachEvent('on' + event, handler);
        }
      };
    }
  }();
  /**
   * @description 解绑事件 off(element, event, handler)
   */

  var off = function () {
    if (document.removeEventListener) {
      return function (element, event, handler) {
        var options = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;

        if (element && event) {
          element.removeEventListener(event, handler, options);
        }
      };
    } else {
      return function (element, event, handler) {
        if (element && event) {
          element.detachEvent('on' + event, handler);
        }
      };
    }
  }();
  /**
   * * 获取节点 getBoundingClientRect
   * @param {节点} target
   */

  var getDomClientRect = function getDomClientRect(target) {
    if (!target) console.error('获取id节点失败');
    var targetRect = target.getBoundingClientRect();
    var top = targetRect.top;
    var bottom = targetRect.bottom;
    var left = targetRect.left;
    var right = targetRect.right;
    var width = targetRect.width || right - left;
    var height = targetRect.height || bottom - top;
    return {
      width: width,
      height: height,
      top: top,
      right: right,
      bottom: bottom,
      left: left,
      centerX: left + width / 2,
      centerY: top + height / 2
    };
  };
  /**
   * 删除dom节点
   * @param {content} self
   * @param {node ref} ref
   */

  var removeBody = function removeBody(self, ref) {
    var pos = self.$refs[ref];

    if (pos && pos.$el && pos.$el.parentNode === document.body) {
      document.body.removeChild(pos.$el);
    } else if (pos && pos.parentNode === document.body) {
      document.body.removeChild(pos);
    }
  };

  //
  var script = {
    components: {
      DynamicScroller: DynamicScroller,
      DynamicScrollerItem: DynamicScrollerItem,
      VTableBody: VTableBody
    },
    props: {
      data: {
        type: Array,
        default: function _default() {
          return [];
        }
      }
    },
    inject: ['table'],
    computed: {
      style: function style() {
        var height = parseInt(this.table.height);
        var maxHeight = parseInt(this.table.maxHeight);
        return {
          '--width': this.table.minWidth + 'px',
          height: height ? height + 'px' : '',
          maxHeight: maxHeight ? maxHeight + 'px' : ''
        };
      }
    },
    mounted: function mounted() {
      on(this.$el, 'scroll', this.handleScroll);
      this.addEmpty();
    },
    beforeDestroy: function beforeDestroy() {
      off(this.$el, 'scroll', this.handleScroll);
    },
    methods: {
      forceUpdate: function forceUpdate() {
        this.$refs.DynamicScroller.forceUpdate();
      },
      update: function update(startIndex, endIndex) {// console.log(startIndex, endIndex)
      },
      handleScroll: function handleScroll(e) {
        this.table.bodyScrollLeft = e.target.scrollLeft;
      },
      addEmpty: function addEmpty() {
        var wrapper = this.$el.querySelector('.vue-recycle-scroller__item-wrapper');
        !wrapper.offsetHeight && (wrapper.innerHTML = "<div id=\"empty\" class=\"empty-text\">".concat(this.table.emptyText, "</div>"));
      }
    }
  };

  function normalizeComponent(template, style, script, scopeId, isFunctionalTemplate, moduleIdentifier
  /* server only */
  , shadowMode, createInjector, createInjectorSSR, createInjectorShadow) {
    if (typeof shadowMode !== 'boolean') {
      createInjectorSSR = createInjector;
      createInjector = shadowMode;
      shadowMode = false;
    } // Vue.extend constructor export interop.


    var options = typeof script === 'function' ? script.options : script; // render functions

    if (template && template.render) {
      options.render = template.render;
      options.staticRenderFns = template.staticRenderFns;
      options._compiled = true; // functional template

      if (isFunctionalTemplate) {
        options.functional = true;
      }
    } // scopedId


    if (scopeId) {
      options._scopeId = scopeId;
    }

    var hook;

    if (moduleIdentifier) {
      // server build
      hook = function hook(context) {
        // 2.3 injection
        context = context || // cached call
        this.$vnode && this.$vnode.ssrContext || // stateful
        this.parent && this.parent.$vnode && this.parent.$vnode.ssrContext; // functional
        // 2.2 with runInNewContext: true

        if (!context && typeof __VUE_SSR_CONTEXT__ !== 'undefined') {
          context = __VUE_SSR_CONTEXT__;
        } // inject component styles


        if (style) {
          style.call(this, createInjectorSSR(context));
        } // register component module identifier for async chunk inference


        if (context && context._registeredComponents) {
          context._registeredComponents.add(moduleIdentifier);
        }
      }; // used by ssr in case component is cached and beforeCreate
      // never gets called


      options._ssrRegister = hook;
    } else if (style) {
      hook = shadowMode ? function () {
        style.call(this, createInjectorShadow(this.$root.$options.shadowRoot));
      } : function (context) {
        style.call(this, createInjector(context));
      };
    }

    if (hook) {
      if (options.functional) {
        // register for functional component in vue file
        var originalRender = options.render;

        options.render = function renderWithStyleInjection(h, context) {
          hook.call(context);
          return originalRender(h, context);
        };
      } else {
        // inject component registration as beforeCreate hook
        var existing = options.beforeCreate;
        options.beforeCreate = existing ? [].concat(existing, hook) : [hook];
      }
    }

    return script;
  }

  var normalizeComponent_1 = normalizeComponent;

  /* script */
  var __vue_script__ = script;
  /* template */

  var __vue_render__ = function __vue_render__() {
    var _vm = this;

    var _h = _vm.$createElement;

    var _c = _vm._self._c || _h;

    return _c("DynamicScroller", {
      ref: "DynamicScroller",
      staticClass: "v-scroller",
      style: _vm.style,
      attrs: {
        "key-field": _vm.table.keyField,
        "content-tag": "table",
        items: _vm.data,
        "min-item-size": 50
      },
      on: {
        update: _vm.update
      },
      scopedSlots: _vm._u([{
        key: "default",
        fn: function fn(ref) {
          var item = ref.item;
          var index = ref.index;
          var active = ref.active;
          return [_c("DynamicScrollerItem", {
            attrs: {
              item: item,
              active: active,
              "size-dependencies": [item.message],
              "data-index": index
            }
          }, [_c("v-table-body", {
            attrs: {
              item: item,
              index: index
            }
          })], 1)];
        }
      }])
    });
  };

  var __vue_staticRenderFns__ = [];
  __vue_render__._withStripped = true;
  /* style */

  var __vue_inject_styles__ = undefined;
  /* scoped */

  var __vue_scope_id__ = "data-v-49bb285a";
  /* module identifier */

  var __vue_module_identifier__ = undefined;
  /* functional template */

  var __vue_is_functional_template__ = false;
  /* style inject */

  /* style inject SSR */

  /* style inject shadow dom */

  var __vue_component__ = normalizeComponent_1({
    render: __vue_render__,
    staticRenderFns: __vue_staticRenderFns__
  }, __vue_inject_styles__, __vue_script__, __vue_scope_id__, __vue_is_functional_template__, __vue_module_identifier__, false, undefined, undefined, undefined);

  var Column = {
    data: function data() {
      return {
        leftWidth: 0,
        rightWidth: 0,
        columns: [],
        columnsWidth: [],
        columnCalcWidthLenght: 0
      };
    },
    created: function created() {
      this.$on('insert.column', this.insertColumn);
      this.$on('remove.column', this.removeColumn);
    },
    computed: {
      columnsSort: function columnsSort() {
        return this.columns.filter(function (d) {
          return d.fixed === 'left';
        }).concat(this.columns.filter(function (d) {
          return d.fixed !== 'left' && d.fixed !== 'right';
        })).concat(this.columns.filter(function (d) {
          return d.fixed === 'right';
        }));
      }
    },
    methods: {
      // 插入列
      insertColumn: function insertColumn(column) {
        // console.log(column)
        var width = column.width,
            minWidth = column.minWidth;
        var columnWidth = width || minWidth || 80;
        !width && this.columnCalcWidthLenght++;

        if (column.fixed) {
          this["".concat(column.fixed, "Width")] += columnWidth;
        }

        var columnIndex = this.$slots.default.filter(function (d) {
          return d.tag;
        }).findIndex(function (d) {
          return JSON.stringify(column) === JSON.stringify(d.componentInstance.columnConfig);
        });
        column.columnId = columnIndex + 1;
        this.columns.splice(columnIndex, 0, column);
        this.columnsWidth.splice(columnIndex, 0, columnWidth);
      },
      // 移除列
      removeColumn: function removeColumn(column) {
        var index = this.columns.findIndex(function (d) {
          return d.columnId === column.columnId;
        });

        if (index !== -1) {
          var width = column.width,
              minWidth = column.minWidth;
          var columnWidth = width || minWidth || 80;
          !width && this.columnCalcWidthLenght--;

          if (column.fixed) {
            this["".concat(column.fixed, "Width")] -= columnWidth;
          }

          this.columns.splice(index, 1);
          this.columnsWidth.splice(index, 1);
        }
      },
      setColumnStyle: function setColumnStyle(column, columnIndex, width) {
        var style = {};
        style.minWidth = width + 'px';
        style.maxWidth = width + 'px'; // 如果有横向滚动条 设置左右定位元素的位置

        if (this.bodyOverflowX) {
          column.fixed === 'left' && (style.left = (columnIndex ? this.columnsWidth[columnIndex - 1] : 0) + this.bodyScrollLeft + 'px');

          if (!this.isScrollRightEnd) {
            var firstRightFixedIndex = this.columnsSort.findIndex(function (d) {
              return d.fixed === 'right';
            });
            columnIndex === firstRightFixedIndex && (style.borderLeftColor = 'transparent');
          }

          column.fixed === 'right' && (style.right = (columnIndex !== this.columnsWidth.length - 1 ? this.columnsWidth[columnIndex + 1] : 0) + (this.width - this.bodyWidth) - this.bodyScrollLeft + this.scrollYwidth + 2 + 'px');
        }

        return style;
      }
    },
    beforeDestroy: function beforeDestroy() {
      this.$off('insert.column', this.headerColumn);
      this.$off('remove.column', this.removeColumn);
    }
  };

  var checkeds = new Set();
  var Selection = {
    data: function data() {
      return {
        selecteds: [],
        selectionAll: false,
        indeterminate: false
      };
    },
    created: function created() {
      this.$on('row.selection.change', this.rowSelectionChange);
      this.$on('all.selection.change', this.allselectionChange);
    },
    beforeDestroy: function beforeDestroy() {
      this.$off('row.selection.change', this.rowSelectionChange);
      this.$off('all.selection.change', this.allselectionChange);
    },
    watch: {
      selecteds: function selecteds(val) {
        var _this = this;

        this.$emit('selection-change', val.map(function (v) {
          return _this.data[v];
        }));
        var selectedsLength = this.selecteds.length;
        var dataLength = this.data.length;
        this.selectionAll = selectedsLength === dataLength;
        this.indeterminate = Boolean(selectedsLength && selectedsLength < dataLength);
      }
    },
    methods: {
      clearSelection: function clearSelection() {
        this.selecteds = [];
      },
      toggleRowSelection: function toggleRowSelection(row, selected) {
        var _this2 = this;

        var rowIndex = this.data.findIndex(function (d) {
          return _this2.isSame(d, row);
        });

        if (rowIndex !== -1) {
          this.toggleSelection(rowIndex, checkeds.has(rowIndex), selected);
        } else {
          console.error('methods toggleRowSelection (row) is not find');
        }
      },
      toggleAllSelection: function toggleAllSelection() {
        this.selectionAll = !this.selectionAll;
        this.allselectionChange(this.selectionAll);
      },
      rowSelectionChange: function rowSelectionChange(index, selected) {
        this.toggleSelection(index, !selected);
        this.$emit('select', this.selecteds, this.data[index]);
      },
      allselectionChange: function allselectionChange(selected) {
        this.selectionAll = selected;
        this.indeterminate = false;
        selected ? this.data.forEach(function (d, i) {
          return checkeds.add(i);
        }) : checkeds.clear();
        this.updateSelected();
        this.$emit('select-all', this.selecteds);
      },
      isSame: function isSame(obj1, obj2) {
        return JSON.stringify(obj1) === JSON.stringify(obj2);
      },
      toggleSelection: function toggleSelection(index, has, selected) {
        selected ? checkeds.add(index) : has ? checkeds.delete(index) : checkeds.add(index);
        this.updateSelected();
      },
      updateSelected: function updateSelected() {
        this.selecteds = _toConsumableArray(checkeds);
      },
      isChecked: function isChecked(index) {
        return this.selecteds.includes(index);
      }
    }
  };

  var Layout = {
    data: function data() {
      return {
        leftWidth: 0,
        rightWidth: 0,
        columns: [],
        columnsWidth: [],
        columnCalcWidthLenght: 0,
        width: 0,
        bodyWidth: 0,
        offset: 0,
        bodyOverflowX: false,
        bodyOverflowY: false,
        bodyScrollLeft: 0
      };
    },
    created: function created() {
      on(window, 'resize', this.resize, {
        passive: true
      });
    },
    watch: {
      data: function data(val) {
        this.forceUpdate();
        this.resize();
      }
    },
    computed: {
      tableClass: function tableClass() {
        var tClass = 'v-table';
        this.bodyOverflowX && (tClass += ' is-overflow-x');
        this.bodyOverflowY && (tClass += ' is-overflow-y');
        this.border && (tClass += ' is-border');
        return tClass;
      },
      rowStyle: function rowStyle() {
        var style = {};
        style.width = this.width + 'px';
        var leftWidth = this.leftWidth,
            rightWidth = this.rightWidth;

        if (this.bodyOverflowX) {
          leftWidth && (style.paddingLeft = "".concat(leftWidth + this.offset, "px"));
          rightWidth && (style.paddingRight = "".concat(rightWidth + this.offset, "px"));
        }

        return style;
      },
      scrollYwidth: function scrollYwidth() {
        return this.bodyOverflowY ? 17 : 0;
      },
      isScrollRightEnd: function isScrollRightEnd() {
        return this.bodyWidth + this.bodyScrollLeft > this.width + this.scrollYwidth;
      },
      minWidth: function minWidth() {
        return this.columnsWidth.reduce(function (acc, cur) {
          return acc + cur;
        }, 0);
      }
    },
    methods: {
      resize: function resize() {
        this.bodyWidth = this.$el.getBoundingClientRect().width;
        this.width = this.bodyWidth > this.minWidth ? this.bodyWidth : this.minWidth;

        var floor = function floor(num) {
          return Math.floor(num * 10000) / 10000;
        };

        this.offset = this.bodyWidth > this.minWidth ? floor((this.bodyWidth - this.minWidth) / this.columnCalcWidthLenght) : 0;
        this.bodyHeightChange();
      },
      bodyHeightChange: function bodyHeightChange() {
        var _this = this;

        this.$nextTick(function () {
          var body = _this.$el.querySelector('.vue-recycle-scroller');

          var scrollHeight = body.scrollHeight,
              clientHeight = body.clientHeight;
          _this.bodyOverflowY = scrollHeight > clientHeight;
        });
      }
    },
    mounted: function mounted() {
      this.resize();
    },
    beforeDestroy: function beforeDestroy() {
      off(window, 'resize', this.resize, {
        passive: true
      });
    }
  };

  var script$1 = {
    name: 'Popover',
    components: {
      VSlot: {
        props: ['content'],
        render: function render(h) {
          return this.content;
        }
      }
    },
    props: {
      show: {
        type: Boolean,
        default: true
      },
      effect: {
        type: [String, Object],
        default: 'dark'
      },
      // popover消息提示
      data: {
        type: [String, Object, Array],
        default: ''
      },
      placement: {
        type: String,
        default: 'top'
      },
      borderColor: {
        type: String,
        default: '#ccc'
      },
      popoverClass: {
        type: String,
        default: ''
      },
      reference: null,
      content: {
        type: [String, Array],
        default: function _default() {}
      }
    },
    data: function data() {
      return {
        addedBody: false,
        momentPlacement: this.placement
      };
    },
    computed: {
      pClass: function pClass() {
        return "".concat(this.effect ? "is-".concat(this.effect) : 'is-light', "  v-popover__").concat(this.momentPlacement, " ").concat(this.popoverClass, " ").concat(this.show ? 'v-popover--visible' : 'v-popover--hidden');
      },
      popoverStyle: function popoverStyle() {
        var style = {
          '--borderColor': '#ccc',
          '--bgColor': '#fff',
          '--color': '#303133'
        };

        if (!this.effect) {
          return style;
        }

        if (typeof this.effect === 'string') {
          switch (this.effect) {
            case 'light':
              style['--borderColor'] = '#ccc';
              style['--bgColor'] = '#fff';
              style['--color'] = '#303133';
              break;

            case 'dark':
              style['--borderColor'] = '#303133';
              style['--bgColor'] = '#303133';
              style['--color'] = '#fff';
              break;

            case 'info':
              style['--borderColor'] = '#e6a23c';
              style['--bgColor'] = '#e6a23c';
              style['--color'] = '#fff';
              break;

            case 'error':
              style['--borderColor'] = '#f56c6c';
              style['--bgColor'] = '#f56c6c';
              style['--color'] = '#fff';
              break;

            default:
              style['--borderColor'] = this.effect;
              style['--bgColor'] = this.effect;
              style['--color'] = '#fff';
              break;
          }
        } else if (_typeof(this.effect) === 'object') {
          if (Array.isArray(this.effect)) {
            console.error('effect 只能是对象或字符串');
          } else {
            style['--borderColor'] = this.effect.borderColor ? this.effect.borderColor : '#ccc';
            style['--bgColor'] = this.effect.backgroundColor ? this.effect.backgroundColor : '#fff';
            style['--color'] = this.effect.olor ? this.effect.olor : '#303133';
          }
        } else {
          console.error('effect 只能是对象或字符串');
        }

        return style;
      }
    },
    watch: {
      show: function show(val) {
        var _this = this;

        val && setTimeout(function () {
          _this.calculateCoordinate();
        }, 0);
      }
    },
    mounted: function mounted() {},
    beforeDestroy: function beforeDestroy() {
      removeBody(this, 'popover');
    },
    methods: {
      popoverAddedBody: function popoverAddedBody() {
        document.body.appendChild(this.$el);
        this.addedBody = true;
      },
      mouseenter: function mouseenter() {
        this.$emit('mouseenter');
      },
      mouseleave: function mouseleave() {
        this.$emit('mouseleave');
      },
      calculateCoordinate: function calculateCoordinate() {
        !this.addedBody && this.popoverAddedBody();
        var popover = this.$el;
        var referenceRect = getDomClientRect(this.reference);
        var popoverRect = getDomClientRect(popover);
        this.changeDirection(popoverRect, referenceRect);
        var top;
        var left = referenceRect.centerX - popoverRect.width / 2;

        switch (this.momentPlacement) {
          case 'top':
            top = referenceRect.top - popoverRect.height - 10;
            break;

          case 'bottom':
            top = referenceRect.bottom + 10;
            break;

          default:
            console.error('Wrong placement must top/bottom');
            break;
        }

        popover.style.left = left + 'px';
        popover.style.top = top + 'px';
      },
      changeDirection: function changeDirection(popoverRect, referenceRect) {
        var allHeight = referenceRect.bottom + popoverRect.height + 5;

        switch (this.placement) {
          case 'top':
            if (referenceRect.top - popoverRect.height - 5 < 10) {
              this.momentPlacement = 'bottom';
            } else {
              this.momentPlacement = 'top';
            }

            break;

          case 'bottom':
            if (window.innerHeight - allHeight < 10) {
              this.momentPlacement = 'top';
            } else {
              this.momentPlacement = 'bottom';
            }

            break;
        }
      }
    }
  };

  /* script */
  var __vue_script__$1 = script$1;
  /* template */

  var __vue_render__$1 = function __vue_render__() {
    var _vm = this;

    var _h = _vm.$createElement;

    var _c = _vm._self._c || _h;

    return _c("div", {
      staticClass: "v-popover",
      class: _vm.pClass,
      style: _vm.popoverStyle,
      on: {
        mouseenter: _vm.mouseenter,
        mouseleave: _vm.mouseleave
      }
    }, [_c("VSlot", {
      attrs: {
        content: _vm.content
      }
    }), _vm._v(" "), _c("div", {
      ref: "arrow",
      staticClass: "v-popover__arrow"
    })], 1);
  };

  var __vue_staticRenderFns__$1 = [];
  __vue_render__$1._withStripped = true;
  /* style */

  var __vue_inject_styles__$1 = undefined;
  /* scoped */

  var __vue_scope_id__$1 = "data-v-723c2b8c";
  /* module identifier */

  var __vue_module_identifier__$1 = undefined;
  /* functional template */

  var __vue_is_functional_template__$1 = false;
  /* style inject */

  /* style inject SSR */

  /* style inject shadow dom */

  var __vue_component__$1 = normalizeComponent_1({
    render: __vue_render__$1,
    staticRenderFns: __vue_staticRenderFns__$1
  }, __vue_inject_styles__$1, __vue_script__$1, __vue_scope_id__$1, __vue_is_functional_template__$1, __vue_module_identifier__$1, false, undefined, undefined, undefined);

  var script$2 = {
    name: 'VTable',
    components: {
      VTableHeader: VTableHeader,
      DynamicScroller: __vue_component__,
      Popover: __vue_component__$1
    },
    mixins: [Column, Layout, Selection],
    props: {
      data: {
        type: Array,
        default: function _default() {
          return [];
        }
      },
      height: {
        type: [String, Number],
        default: 400
      },
      maxHeight: {
        type: [String, Number],
        default: 0
      },
      highlightCurrentRow: {
        type: Boolean,
        default: false
      },
      border: {
        type: Boolean,
        default: false
      },
      keyField: {
        type: String,
        default: ''
      },
      emptyText: {
        type: String,
        default: '暂无数据'
      },
      showOverflowTooltip: {
        type: Boolean,
        default: false
      }
    },
    data: function data() {
      return {
        show: false,
        popoverSlot: null,
        reference: null,
        currentRow: null
      };
    },
    watch: {
      data: function data(val) {
        var _this = this;

        if (this.data.length) {
          if (!this.keyField) {
            console.error('v-table 必须设置 keyField 字段，且必须是 item 内具有唯一值的字段');
          } else {
            var values = this.data.map(function (d) {
              return d[_this.keyField];
            });
            this.data.length !== _toConsumableArray(new Set(values)).length && console.error("data\u6570\u636E item \u7684 ".concat(this.keyField, " \u5B57\u6BB5\u7684\u503C\u5FC5\u987B\u662F\u552F\u4E00\u7684"));
          }
        }
      }
    },
    provide: function provide() {
      return {
        table: this
      };
    },
    methods: {
      forceUpdate: function forceUpdate() {
        this.$refs.DynamicScroller.forceUpdate();
      }
    }
  };

  /* script */
  var __vue_script__$2 = script$2;
  /* template */

  var __vue_render__$2 = function __vue_render__() {
    var _vm = this;

    var _h = _vm.$createElement;

    var _c = _vm._self._c || _h;

    return _c("div", {
      class: _vm.tableClass
    }, [_c("div", {
      ref: "VHiddenColumns",
      staticClass: "v-hidden-columns"
    }, [_vm._t("default")], 2), _vm._v(" "), _c("div", {
      staticClass: "v-table__header-wrapper"
    }, [_c("v-table-header", {
      ref: "TableHeader"
    }), _vm._v(" "), _c("div", {
      directives: [{
        name: "show",
        rawName: "v-show",
        value: _vm.bodyOverflowY,
        expression: "bodyOverflowY"
      }],
      staticClass: "v-table__header-gutter"
    })], 1), _vm._v(" "), _c("div", {
      staticClass: "v-table__body-wrapper"
    }, [_c("DynamicScroller", {
      ref: "DynamicScroller",
      attrs: {
        data: _vm.data
      }
    }), _vm._v(" "), _c("div", {
      directives: [{
        name: "show",
        rawName: "v-show",
        value: _vm.bodyOverflowX && _vm.bodyScrollLeft,
        expression: "bodyOverflowX && bodyScrollLeft"
      }],
      staticClass: "v-table__shadow-left",
      style: {
        left: _vm.leftWidth - 2 + "px"
      }
    }), _vm._v(" "), _c("div", {
      directives: [{
        name: "show",
        rawName: "v-show",
        value: _vm.bodyOverflowX && _vm.rightWidth && !_vm.isScrollRightEnd,
        expression: "bodyOverflowX && rightWidth && !isScrollRightEnd"
      }],
      staticClass: "v-table__shadow-right",
      style: {
        right: _vm.rightWidth + _vm.scrollYwidth + "px"
      }
    }), _vm._v(" "), _c("Popover", {
      attrs: {
        show: _vm.show,
        reference: _vm.reference,
        content: _vm.popoverSlot
      }
    })], 1)]);
  };

  var __vue_staticRenderFns__$2 = [];
  __vue_render__$2._withStripped = true;
  /* style */

  var __vue_inject_styles__$2 = undefined;
  /* scoped */

  var __vue_scope_id__$2 = "data-v-04ba7c78";
  /* module identifier */

  var __vue_module_identifier__$2 = undefined;
  /* functional template */

  var __vue_is_functional_template__$2 = false;
  /* style inject */

  /* style inject SSR */

  /* style inject shadow dom */

  var __vue_component__$2 = normalizeComponent_1({
    render: __vue_render__$2,
    staticRenderFns: __vue_staticRenderFns__$2
  }, __vue_inject_styles__$2, __vue_script__$2, __vue_scope_id__$2, __vue_is_functional_template__$2, __vue_module_identifier__$2, false, undefined, undefined, undefined);

  var TableColumn = {
    name: 'VTableColumn',
    props: {
      type: String,
      width: {
        type: Number,
        default: 0
      },
      renderHeader: {
        type: Function,
        default: function _default() {}
      },
      minWidth: {
        type: Number,
        default: 0
      },
      label: {
        type: String,
        default: ''
      },
      prop: {
        type: String,
        default: ''
      },
      fixed: {
        type: String,
        default: ''
      },
      className: {
        type: String,
        default: ''
      },
      labelClassName: {
        type: String,
        default: ''
      },
      showOverflowTooltip: {
        type: Boolean,
        default: false
      }
    },
    data: function data() {
      return {
        columnConfig: null
      };
    },
    inject: ['table'],
    mounted: function mounted() {
      var _this = this;

      var header = this.$slots.header;
      var renderSlot = this.renderSlot;
      this.columnConfig = Object.keys(this.$options.props).reduce(function (acc, cur) {
        _this.$watch(cur, function (newVal) {
          _this.columnConfig[cur] = newVal;
        });

        acc[cur] = _this[cur];
        return acc;
      }, {
        header: header,
        renderSlot: renderSlot
      });
      this.table.$emit('insert.column', this.columnConfig);
    },
    destroyed: function destroyed() {
      this.table.$emit('remove.column', this.columnConfig);
    },
    methods: {
      renderSlot: function renderSlot(h, data) {
        return this.$scopedSlots.default ? this.$scopedSlots.default(data) : this.$slots.default ? this.$slots.default[0] : false;
      }
    },
    render: function render(h) {
      return h('div', {}, []);
    }
  };

  var components = [__vue_component__$2, TableColumn];

  var install$2 = function install(Vue) {
    components.forEach(function (component) {
      Vue.component(component.name, component);
    });
  };

  if (typeof window !== 'undefined' && window.Vue) {
    install$2(window.Vue);
  }

  exports.Table = __vue_component__$2;
  exports.TableColumn = TableColumn;
  exports.default = install$2;

  Object.defineProperty(exports, '__esModule', { value: true });

})));
