'use strict';

module.exports = function (columns, column, done) {
    // reset old classes
    columns.forEach(function (col) {
        col.headerClass = null;
    });

    column.sort = column.sort === 'asc' ? 'desc' : 'asc';

    // push sorting hint
    column.headerClass = 'sort-' + column.sort;

    done({
        sortingColumn: column,
        columns: columns
    });
};

// sorter === lodash orderBy
// https://lodash.com/docs#orderBy
module.exports.sort = function (data, column, sorter) {
    if (!column) {
        return data;
    }

    return sorter(data, [column.property], [column.sort]);
};