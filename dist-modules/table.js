'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _ = require('lodash');

var merge = _.merge;
var reduce = _.reduce;
var isFunction = _.isFunction;
var isPlainObject = _.isPlainObject;
var isUndefined = _.isUndefined;

var React = require('react');
var update = require('react/lib/update');
var ColumnNames = require('./column_names');

module.exports = React.createClass({
    displayName: 'Table',

    propTypes: {
        columnNames: React.PropTypes.oneOfType([React.PropTypes.object, React.PropTypes.func]),
        data: React.PropTypes.array,
        columns: React.PropTypes.array,
        row: React.PropTypes.func,
        children: React.PropTypes.object,
        rowKey: React.PropTypes.string
    },

    getDefaultProps: function getDefaultProps() {
        return {
            columnNames: {},
            data: [],
            columns: []
        };
    },

    render: function render() {
        var columnNames = this.props.columnNames;
        var data = this.props.data;
        var columns = this.props.columns;
        var rowKey = this.props.rowKey;
        var rowProps = this.props.row || noop;

        var props = update(this.props, {
            $merge: {
                columnNames: undefined,
                data: undefined,
                columns: undefined
            }
        });

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
                data.map(function (row, i) {
                    return React.createElement(
                        'tr',
                        _extends({ key: (row[rowKey] || i) + '-row' }, rowProps(row, i)),
                        columns.map(function (column, j) {
                            var property = column.property;
                            var value = row[property];
                            var cell = column.cell || [id];
                            var content;

                            cell = isFunction(cell) ? [cell] : cell;

                            content = reduce(cell, function (v, fn) {
                                if (React.isValidElement(v.value)) {
                                    return v;
                                }

                                var val = fn(v.value, data, i, property);

                                if (val && isUndefined(val.value)) {
                                    // formatter shortcut
                                    val = { value: val };
                                }

                                return merge(v, val);
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

function id(a) {
    return a;
}
function noop() {}