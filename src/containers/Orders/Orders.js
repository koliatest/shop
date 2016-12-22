import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { asyncConnect } from 'redux-async-connect';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';

import {isLoaded, load as loadOrders, setData } from 'redux/modules/orders';
import parseDate from '../../helpers/parseDate';

class ProductsFormatter extends Component {
  static propTypes = {
    items: PropTypes.array
  };
  render() {
    const styles = require('./Orders.scss');
    return (
      <div className = {styles.panelProducts + ' panel panel-default'}>
        <div className = "panel-body">
      <table className="table col-md-6">
        <thead>
        <tr>
          <th>Image</th>
          <th>Name</th>
          <th>Quantity</th>
          <th>Sum</th>
        </tr>
        </thead>
        <tbody>
        {
          this.props.items.map((itemProduct) =>
            <tr key={itemProduct._id}>
              <td><image height="50" width="60" src={decodeURIComponent(itemProduct.images[0])} /></td>
              <td className="col-md-4"><a href="#">{itemProduct.name}</a></td>
              <td>{itemProduct.quantity}</td>
              <td>{itemProduct.price * itemProduct.quantity + ' $'}</td>
            </tr>)
        }
        </tbody>
      </table>
        </div>
        </div>
    );
  }
}

@asyncConnect([{
  deferred: true,
  promise: ({store: {dispatch, getState}}) => {
    if (!isLoaded(getState())) {
      return dispatch(loadOrders());
    }
  }
}])
@connect(
    state => ({ user: state.auth.user,
                orders: state.orders.data,
                loading: state.orders.loading }),
    { loadOrders, setData })
export default
class Orders extends Component {
  static propTypes = {
    user: PropTypes.object,
    orders: PropTypes.object,
    loadOrders: PropTypes.func,
    setData: PropTypes.func,
    loading: PropTypes.bool
  }

  constructor(props) {
    super(props);
    this.sortOrdersByDate = this.sortOrdersByDate.bind(this);
    this.props.loadOrders();
  }
  val = -1;
  sortOrdersByDate() {
    const arr = this.props.orders.orders.slice();
    this.val *= -1;
    arr
      .sort((first, second) => {
        const dateA = new Date(Number(parseDate(first.date.paid).year),
          parseDate(first.date.paid).month,
          parseDate(first.date.paid).day,
          parseDate(first.date.paid).hour,
          parseDate(first.date.paid).minute,
          parseDate(first.date.paid).second);
        console.log(dateA);
        const dateB = new Date(Number(parseDate(second.date.paid).year),
          parseDate(second.date.paid).month,
          parseDate(second.date.paid).day,
          parseDate(second.date.paid).hour,
          parseDate(second.date.paid).minute,
          parseDate(second.date.paid).second);
        return this.val > 0 ? dateB - dateA : dateA - dateB;
      });
    this.props.setData({ orders: arr });
  }
  groupByStatus = () => {
    const arr = this.props.orders.orders.slice();
    arr
      .sort((first, second) => {
        if (first.status < second.status) return 1;
        if (first.status > second.status) return -1;
        return 0;
      });
    this.props.setData({ orders: arr });
  };
  renderShowsTotal(start, to, total) {
    return (
      <p style={ { color: 'blue' } }>
        From { start } to { to }, totals is { total }&nbsp;&nbsp;
      </p>
    );
  }
  render() {
    const { user, orders } = this.props;
    function productsFormatter(cell) {
      return (
        <ProductsFormatter items = {cell} />
      );
    }
    function paidDateFormatter(cell) {
      let resHtml = `<b>Paid date:</b> ${parseDate(cell.paid).year}-${parseDate(cell.paid).month}-${parseDate(cell.paid).day}/${parseDate(cell.paid).hour}:${parseDate(cell.paid).minute}:${parseDate(cell.paid).second}`;
      if (cell.delivering) {
        resHtml += `<br /><b>Delivering date:</b> ${parseDate(cell.delivering).year}-${parseDate(cell.delivering).month}-${parseDate(cell.delivering).day}/${parseDate(cell.delivering).hour}:${parseDate(cell.delivering).minute}:${parseDate(cell.delivering).second}`;
      }
      return resHtml;
    }
    const options = {
      page: 1,  // which page you want to show as default
      sizePerPageList: [ {
        text: '3', value: 3
      }, {
        text: '10', value: 10
      } ], // you can change the dropdown list for size per page
      sizePerPage: 3,  // which size per page you want to locate as default
      pageStartIndex: 1, // where to start counting the pages
      paginationSize: 3,  // the pagination bar size.
      prePage: 'Prev', // Previous page button text
      nextPage: 'Next', // Next page button text
      firstPage: 'First', // First page button text
      lastPage: 'Last', // Last page button text
      paginationShowsTotal: this.renderShowsTotal,  // Accept bool or function
      hideSizePerPage: true
    };
    return (user &&
      <div className="container">
        {this.props.loading &&
        <div style={{
          boxSizing: 'bordered-box',
          textAlign: 'center',
          margin: '100px'
        }}>
          <i className={' fa fa-refresh fa-spin fa-3x fa-fw'} style={{
            color: 'grey',
            marginTop: '10%'
          }}></i>
        </div>
        }
        {!orders && !this.props.loading && <h1>Orders are empty</h1>}
        {orders && orders.orders.length && !this.props.loading &&
          <div>
            <div className="form-group">
              <button className="btn btn-primary" style={{marginTop: '10px'}}
                      onClick={this.sortOrdersByDate}>Sort by paid date
                              {this.val < 0 ? <i className="fa fa-sort-desc" aria-hidden="true"></i> : <i className="fa fa-sort-asc" aria-hidden="true"></i>}
              </button>
              <button className="btn btn-success" style={{marginTop: '10px', marginLeft: '10px'}}
                      onClick={this.groupByStatus}>Group by status</button>
            </div>
            <BootstrapTable data={orders.orders} striped hover pagination options={options}>
              <TableHeaderColumn dataField="products" width="500" dataFormat={productsFormatter}>Products</TableHeaderColumn>
              <TableHeaderColumn dataField="phoneNumber">Phone number</TableHeaderColumn>
              <TableHeaderColumn dataField="shippingAddress">Address</TableHeaderColumn>
              <TableHeaderColumn dataField="date" dataFormat={paidDateFormatter}>Date</TableHeaderColumn>
              <TableHeaderColumn dataField="status" isKey>Status</TableHeaderColumn>
            </BootstrapTable>
          </div>
        }
      </div>
    );
  }
}
