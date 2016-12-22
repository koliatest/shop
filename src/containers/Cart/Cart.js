import React, {Component, PropTypes} from 'react';
import Helmet from 'react-helmet';
import {connect} from 'react-redux';
import {isLoaded, load as loadCart} from 'redux/modules/cart';
import * as cartActions from 'redux/modules/cart';
import { asyncConnect } from 'redux-async-connect';
import { push } from 'react-router-redux';
import { goBack } from 'react-router-redux';
import AsyncButton from 'react-async-button';

@asyncConnect([{
  deferred: true,
  promise: ({store: {dispatch, getState}}) => {
    if (!isLoaded(getState())) {
      return dispatch(loadCart());
    }
  }
}])
@connect(
  state => ({
    cart: state.cart.data,
    error: state.cart.error,
    validQuantity: state.cart.validQuantity,
    prevPath: state.cart.prevPath
  }),
  { ...cartActions, pushState: push, goBack })
export default class Cart extends Component {
  static propTypes = {
    cart: PropTypes.object,
    error: PropTypes.object,
    deleteProduct: PropTypes.func,
    updateQuantity: PropTypes.func,
    checkQuantity: PropTypes.func,
    validQuantity: PropTypes.object,
    pushState: PropTypes.func.isRequired,
    setValidQuantity: PropTypes.func,
    prevPath: PropTypes.string,
    goBack: PropTypes.func
  };

  constructor(props) {
    super(props);
    this.handleOnChange = this.handleOnChange.bind(this);
    this.handleToOrder = this.handleToOrder.bind(this);
  }

  componentWillMount() {
    this.props.setValidQuantity(null);
  }

  handleOnChange(event) {
    const productId = event.target.name;
    const quantity = event.target.value;
    this.props.updateQuantity({ productId, quantity });
  }

  handleToOrder() {
    this.props.checkQuantity()
      .then(() => {
        if (!this.props.validQuantity) {
          this.props.pushState('/checkout');
        }
      });
  }

  handleDeleteProduct = (productId) => {
    return this.props.deleteProduct({ productId });
  };

  render() {
    const { cart, error, validQuantity } = this.props;
    const styles = require('./Cart.scss');

    return (
      <div className="container">
        <div>
          <div className="modal-dialog modal-lg" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h4 className="modal-title">Cart</h4>
              </div>
              <div className="modal-body">
                {!cart && <h1>Cart is empty</h1>}
                <Helmet title="Cart"/>
                {error &&
                <div className="alert alert-danger" role="alert">
                  <span className="glyphicon glyphicon-exclamation-sign" aria-hidden="true"></span>
                  {' '}
                  {error}
                </div>}
                {cart && cart.order.products.length &&
                <div className = {styles.panel + ' panel panel-default'}>
                  <div className = "panel-body">
                    <div className="table-responsive">
                      {validQuantity &&
                      <div className="col-sm-10 col-sm-offset-1"
                           style={{paddingLeft: 0, paddingRight: 0}}>
                        <div className="modal-dialog modal-md" role="document">
                          <div className="modal-content">
                            <div className="modal-header">
                              <button type="button" onClick={() => this.props.setValidQuantity(null)} className="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                              <h4 className="modal-title">
                                <span className="glyphicon glyphicon-warning-sign"></span> Warning. Products which quantity was exceeded</h4>
                            </div>
                            <div className="modal-body">
                              <table className="table">
                                <thead>
                                <tr>
                                  <th>Name</th>
                                  <th>Max quantity</th>
                                </tr>
                                </thead>
                                <tbody>
                                {
                                  validQuantity.outOfStock.map((item) =>
                                    <tr key={item._id}>
                                      <td>
                                        {item.name}
                                      </td>
                                      <td>
                                        {item.inStock}
                                      </td>
                                    </tr>)
                                }
                                </tbody>
                              </table>
                            </div>
                          </div>
                        </div>
                      </div>}
                      <table className="table">
                        <thead>
                        <tr>
                          <th>Image</th>
                          <th>Name</th>
                          <th>Price</th>
                          <th>Quantity</th>
                          <th>Sum</th>
                          <th>Action</th>
                        </tr>
                        </thead>
                        <tbody>
                        {
                          cart.order.products.map((item) =>
                            <tr key={item._id}>
                              <td><image height="50" width="60" src={decodeURIComponent(item.images[0])} /></td>
                              <td className="col-md-2 col-sm-2 col-xs-2"><a href="#">{item.name}</a></td>
                              <td>{item.price + ' $'}</td>
                              <td>
                                <div className="input-group">
                                  <input name={item.productId} type="number"
                                         onChange={this.handleOnChange} min="1"
                                         className={styles.quantity + ' form-control'} defaultValue = {item.quantity} />
                                </div>
                              </td>
                              <td>{item.price * item.quantity + ' $'}</td>
                              <td><AsyncButton className="btn btn-danger"
                                               onClick={() => this.handleDeleteProduct(item.productId)}>
                                <span className="glyphicon glyphicon-trash"></span>
                              </AsyncButton></td>
                            </tr>)
                        }
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>}
                {cart && cart.order.products.length &&
                  <div className="table-responsive">
                    <table className="table">
                      <tbody>
                      <tr>
                        <td><button className = "btn btn-warning btn-lg"
                                    onClick={this.props.goBack}>Back to shopping</button></td>
                        <td><strong><font size="6">Total price: <font color="#eae600">{cart.total} $</font></font></strong></td>
                        <td><button className = "btn btn-success btn-lg"
                                    onClick={this.handleToOrder}>To order</button></td>
                      </tr>
                      </tbody>
                    </table>
                  </div>
                }
              </div>
            </div>
          </div>
        </div>


      </div>
    );
  }
}
