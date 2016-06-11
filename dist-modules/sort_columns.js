'use strict';

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

module.exports = function (columns, sortColumns, column, done) {
    var newSortCols = undefined;

    if (typeof sortColumns === 'undefined') {
        newSortCols = [column];
    } else if (sortColumns.includes(column)) {
        newSortCols = sortColumns;
    } else {
        newSortCols = [].concat(_toConsumableArray(sortColumns), [column]);
    }

    // cycle through: asc, desc, no sort
    if (typeof column.sort === 'undefined' || column.sort === '') {
        column.sort = 'asc';
        column.headerClass = 'sort-asc';
    } else if (column.sort === 'asc') {
        column.sort = 'desc';
        column.headerClass = 'sort-desc';
    } else {
        var idx = newSortCols.indexOf(column);
        if (idx > -1) {
            newSortCols.splice(idx, 1);
        }
        column.headerClass = null;
        column.sort = '';
    }

    done({
        sortingColumns: newSortCols,
        columns: columns
    });
};

// sorter === lodash orderBy
// https://lodash.com/docs#orderBy
module.exports.sort = function (data, sortColumns, sorter) {
    if (!sortColumns) {
        return data;
    }

    var propertyList = [];
    var orderList = [];

    sortColumns.forEach(function (column) {
        propertyList.push(column.property);
        orderList.push(column.sort);
    });

    return sorter(data, propertyList, orderList);
};