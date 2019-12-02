export const getCell = function(event) {
  let cell = event.target

  while (cell && cell.tagName.toUpperCase() !== 'HTML') {
    if (/v-table_\d_column_\d/.test(cell.className)) {
      return cell
    }
    cell = cell.parentNode
  }

  return null
}

export const getColumnById = function(table, columnId) {
  let column = null
  table.columns.forEach(function(item) {
    if (item.columnId === +columnId) {
      column = item
    }
  })
  return column
}

export const getColumnByCell = function(table, cell) {
  const matches = (cell.className || '').match(/v-table_[^\s]+/gm)
  if (matches) {
    const arr = cell.className.split('_')
    const columnId = arr[arr.length - 1]
    return getColumnById(table, columnId)
  }
  return null
}
