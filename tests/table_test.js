'use strict';
var React = require('react');
var TestUtils = require('react-addons-test-utils');
var Table = require('../src/table');

var Footer = React.createClass({
    displayName: 'Footer',
    render() {
        return (
            <tfoot>
                <tr>Dancing is the poetry of the foot.</tr>
            </tfoot>
        );
    }
});

describe('Table', function() {
    it('should render a header based on `header` fields', function() {
        var columns = [
            {
                property: 'name',
                header: 'Name',
            },
            {
                property: 'position',
                header: 'Position',
            },
            {
                property: 'age',
                header: 'Age',
            },
        ];
        var table = TestUtils.renderIntoDocument(
            <Table columns={columns} rowKey='id' />
        );

        var ths = TestUtils.scryRenderedDOMComponentsWithTag(
            table, 'th');

        expect(ths.length).to.equal(columns.length);
    });

    it('should render content based on data', function() {
        var columns = [
            {
                property: 'name',
                header: 'Name',
            },
            {
                property: 'position',
                header: 'Position',
            },
            {
                property: 'age',
                header: 'Age',
            },
        ];
        var data = [
            {name: 'foo', id: 0},
            {position: 'demo', id: 1},
            {age: 123, id: 2}
        ];
        var table = TestUtils.renderIntoDocument(
            <Table columns={columns} data={data} rowKey='id' />
        );

        var trs = TestUtils.scryRenderedDOMComponentsWithTag(
            table, 'tr');

        expect(trs.length).to.equal(data.length + 1);
    });

    it('should allow manipulation of complex objects in cell functions', function() {
        var columns = [
            {
                property: 'basic',
                header: 'Basic',
            },
            {
                property: 'identity',
                header: 'Identity',
                cell: (v) => v,
            },
            {
                property: 'math',
                header: 'Simple Math',
                cell: (v) => v - 23,
            },
            {
                property: 'complex',
                header: 'Cell Props',
                cell: (v) => ({ value: v, props: {className: 'complex'}}),
            },
            {
                property: 'jsx',
                header: 'JSX',
                cell: (v) => (<a href={'http://' + v.id}>{v.name}</a>),
            },
        ];
        var data = [
            {
                basic: 'basic',
                identity: 'ident',
                math: 23, // deliberately chosen to make cell function return 0, a falsy value
                complex: 'somestr',
                jsx: {id: 'some_id_123', name: 'helloworld'},
                id: 0
            },
        ];
        var table = TestUtils.renderIntoDocument(
            <Table columns={columns} data={data} rowKey='id' />
        );

        var tds = TestUtils.scryRenderedDOMComponentsWithTag(table, 'td');
        expect(tds.length).to.equal(columns.length);
        expect(tds[0].innerHTML).to.equal('basic');
        expect(tds[1].innerHTML).to.equal('ident');
        expect(tds[2].innerHTML).to.equal('0');

        expect(tds[3].className).to.equal('complex');
        expect(tds[3].innerHTML).to.equal('somestr');

        var link = TestUtils.findRenderedDOMComponentWithTag(table, 'a');
        expect(link.parentNode).to.equal(tds[4]);
        expect(link.href).to.equal('http://some_id_123/');
        expect(link.innerHTML).to.equal('helloworld');
    });

    it('should aggregate returned props and values by the cell functions', function(){
        var columns = [
            {
                property: 'someData',
                header: '',
                cell: [
                    v => ({props: {className: 'fooClass'}, value: v}),
                    v => ({props: {id: 'fooId'}, value: 'fooContent'+v}),
                ]
            }
        ]

        var data = [
            {
                someData: 0,
                id: 0
            }
        ]

        var table = TestUtils.renderIntoDocument(
            <Table columns={columns} data={data} rowKey='id' />
        )

        var tds = TestUtils.scryRenderedDOMComponentsWithTag(table, 'td');
        expect(tds).to.have.length(1);
        expect(tds[0]).to.have.property('className', 'fooClass')
        expect(tds[0]).to.have.property('id', 'fooId')
        expect(tds[0]).to.have.property('innerHTML', 'fooContent0')
    })

    it('should call cell functions for every column, even when column property conflicts', function(){
        var columns = [
            {
                property: 'nestedData',
                header: '',
                cell: [v => <span>{v.key1}</span>]
            },
            {
                property: 'nestedData',
                header: '',
                cell: [v => <span>{v.key2}</span>]
            },
        ];

        var data = [
            {
                nestedData: {
                    key1: 'foo', key2: 'bar'
                },
                id: 0
            }
        ];

        var table = TestUtils.renderIntoDocument(
            <Table columns={columns} data={data} rowKey='id' />
        );

        var tds = TestUtils.scryRenderedDOMComponentsWithTag(table, 'td');
        expect(tds[0]).to.have.deep.property('childNodes[0].innerHTML', 'foo');
        expect(tds[1]).to.have.deep.property('childNodes[0].innerHTML', 'bar');
    });

    it('should render correctly with only rowKey', function() {
        var renderedTable = TestUtils.renderIntoDocument(
            <Table rowKey='id' />
        );

        expect(renderedTable.props.data).to.be.empty;
        expect(renderedTable.props.columns).to.be.empty;
        expect(renderedTable.props.header).to.be.empty;
    });

    it('should render children correctly', function() {
        var renderedTable = TestUtils.renderIntoDocument(
            <Table rowKey='id'>
                <Footer/>
            </Table>
        );

        TestUtils.findRenderedComponentWithType(renderedTable, Footer);
    });
});
