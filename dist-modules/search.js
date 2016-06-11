'use strict';

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var isNumber = require('lodash/isNumber');
var isString = require('lodash/isString');
var React = require('react');

var formatters = require('./formatters');
var predicates = require('./predicates');

module.exports = React.createClass({
    displayName: 'Search',

    propTypes: {
        columns: React.PropTypes.array,
        data: React.PropTypes.array,
        onChange: React.PropTypes.func,
        i18n: React.PropTypes.shape({
            all: React.PropTypes.string
        })
    },

    getDefaultProps: function getDefaultProps() {
        return {
            columns: [],
            data: [],
            onChange: function onChange() {},
            i18n: {
                all: 'All'
            }
        };
    },
    getInitialState: function getInitialState() {
        return {
            column: 'all',
            query: ''
        };
    },
    getOptions: function getOptions() {
        var columns = this.props.columns;
        var i18n = this.props.i18n;

        return [{
            value: 'all',
            name: i18n.all
        }].concat(columns.map(function (column) {
            if (column.property && column.header) {
                return {
                    value: column.property,
                    name: column.header
                };
            }
        }).filter(function (column) {
            return column && !React.isValidElement(column.name);
        }));
    },
    render: function render() {
        return React.createElement(
            'span',
            { className: 'search' },
            React.createElement(
                'select',
                { onChange: this.onColumnChange, value: this.state.column },
                this.getOptions().map(function (option) {
                    return React.createElement(
                        'option',
                        { key: option.value + '-option', value: option.value },
                        option.name
                    );
                })
            ),
            React.createElement('input', { onChange: this.onQueryChange, value: this.state.query })
        );
    },
    onColumnChange: function onColumnChange(event) {
        var column = event.target.value;
        var query = this.state.query;
        this.setState({
            column: column
        });

        this.props.onChange(_defineProperty({}, column, query));
    },
    onQueryChange: function onQueryChange(event) {
        var column = this.state.column;
        var query = event.target.value;
        this.setState({
            query: query
        });
        this.props.onChange(_defineProperty({}, column, query));
    },
    componentDidMount: function componentDidMount() {
        this.props.onChange(_defineProperty({}, this.state.column, this.state.query));
    }
});

var searchColumn = function searchColumn(data, columns, column, query, options) {
    if (!query) {
        return data;
    }

    options = options || {
        strategy: predicates.infix,
        transform: formatters.lowercase
    };

    if (column !== 'all') {
        columns = columns.filter(function (col) {
            return col.property === column;
        });
    }

    return data.filter(function (row) {
        return columns.filter(isColumnVisible.bind(undefined, row)).length > 0;
    });

    function isColumnVisible(row, col) {
        var property = col.property;
        var value = row[property];
        var formatter = col.search || formatters.identity;
        var formattedValue = formatter(value);

        if (!formattedValue && isNaN(formattedValue)) {
            return false;
        }

        if (isNumber(formattedValue)) {
            formattedValue = formattedValue.toString();
        } else if (!isString(formattedValue)) {
            formattedValue = '';
        }

        var predicate = options.strategy(options.transform(query));

        return predicate.evaluate(options.transform(formattedValue));
    }
};
module.exports.searchColumn = searchColumn;

module.exports.search = function (data, columns, query, options) {
    if (!query) {
        return data;
    }

    var searchColumns = Object.keys(query);

    data = searchColumns.reduce(function (filteredData, column) {
        return searchColumn(filteredData, columns, column, query[column], options);
    }, data);

    return data;
};

module.exports.matches = function (column, value, query, options) {
    if (!query) {
        return {};
    }

    options = options || {
        strategy: predicates.infix,
        transform: formatters.lowercase
    };

    var predicate = options.strategy(options.transform(query));

    return predicate.matches(options.transform(value));
};