'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

var reduce = require('lodash/reduce');
var isFunction = require('lodash/isFunction');
var isPlainObject = require('lodash/isPlainObject');
var isUndefined = require('lodash/isUndefined');

var React = require('react');
var ColumnNames = require('./column_names');

module.exports = React.createClass({
    displayName: 'Table',

    propTypes: {
        columnNames: React.PropTypes.oneOfType([React.PropTypes.object, React.PropTypes.func]),
        data: React.PropTypes.array,
        columns: React.PropTypes.array,
        row: React.PropTypes.func,
        children: React.PropTypes.object,
        rowKey: React.PropTypes.string.isRequired
    },

    getDefaultProps: function getDefaultProps() {
        return {
            columnNames: {},
            data: [],
            columns: [],
            row: function row() {}
        };
    },
    render: function render() {
        var _props = this.props;
        var columnNames = _props.columnNames;
        var data = _props.data;
        var columns = _props.columns;
        var rowKey = _props.rowKey;
        var row = _props.row;

        var props = _objectWithoutProperties(_props, ['columnNames', 'data', 'columns', 'rowKey', 'row']);

        return React.createElement(
            'table',
            props,
            isFunction(columnNames) ? columnNames(columns) : React.createElement(
                'thead',
                null,
                React.createElement(ColumnNames, { config: columnNames, columns: columns })
            ),
            React.createElement(
                'tbody',
                null,
                data.map(function (r, i) {
                    return React.createElement(
                        'tr',
                        _extends({ key: (r[rowKey] || i) + '-row' }, row(r, i)),
                        columns.map(function (column, j) {
                            var property = column.property;
                            var value = r[property];
                            var cell = column.cell || [function () {}];
                            var content;

                            cell = isFunction(cell) ? [cell] : cell;

                            content = reduce(cell, function (v, fn) {
                                if (React.isValidElement(v.value)) {
                                    return v;
                                }

                                var val = fn(v.value, data, i, property);

                                if (!isPlainObject(val) || isUndefined(val.value)) {
                                    // formatter shortcut
                                    val = { value: val };
                                }

                                return {
                                    value: isUndefined(val.value) ? v.value : val.value,
                                    props: _extends({}, v.props, val.props)
                                };
                            }, { value: value, props: {} });

                            content = content || {};

                            return React.createElement(
                                'td',
                                _extends({ key: j + '-cell' }, content.props),
                                content.value
                            );
                        })
                    );
                })
            ),
            this.props.children
        );
    }
});