'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

var reduce = require('lodash/reduce');
var React = require('react');

module.exports = React.createClass({
    displayName: 'ColumnNames',

    propTypes: {
        config: React.PropTypes.object,
        columns: React.PropTypes.array
    },

    render: function render() {
        var config = this.props.config;
        var columns = this.props.columns;

        return React.createElement(
            'tr',
            null,
            columns.map(function (column, i) {
                var columnHeader = reduce(config, function (result, v, k) {
                    result[k] = k.indexOf('on') === 0 ? v.bind(null, column) : v;

                    return result;
                }, {});
                var className = columnHeader.className;

                var props = _objectWithoutProperties(columnHeader, ['className']);

                // sort column - XXX: tidy up somehow, maybe
                // there should be access to header specific classes?


                className = className || '';
                className += ' ' + column.headerClass;

                return React.createElement(
                    'th',
                    _extends({
                        key: i + '-header',
                        className: className
                    }, props),
                    column.header
                );
            })
        );
    }
});