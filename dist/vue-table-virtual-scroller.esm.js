import { DynamicScroller, DynamicScrollerItem } from 'vue-virtual-scroller';

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

var install = function install(Vue) {
  components.forEach(function (component) {
    Vue.component(component.name, component);
  });
};

if (typeof window !== 'undefined' && window.Vue) {
  install(window.Vue);
}

export default install;
export { __vue_component__$2 as Table, TableColumn };
