import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import { pay, setPayStatus } from 'redux/modules/cart';
import { asyncConnect } from 'redux-async-connect';
import { isLoaded, getCards } from 'redux/modules/bankAPI';
import AsyncButton from 'react-async-button';

@asyncConnect([{
  deferred: true,
  promise: ({store: {dispatch, getState}}) => {
    if (!isLoaded(getState())) {
      return dispatch(getCards());
    }
  }
}])
@connect(
    state => ({ user: state.auth.user,
                cart: state.cart.data,
                cards: state.bankAPI.cards,
                payStatus: state.cart.payStatus,
                loadingCards: state.bankAPI.loadingCards }),
    { pay, pushState: push, setPayStatus, getCards })
export default class Checkout extends Component {
  static propTypes = {
    user: PropTypes.object,
    cart: PropTypes.object,
    pushState: PropTypes.func.isRequired,
    pay: PropTypes.func,
    cards: PropTypes.array,
    payStatus: PropTypes.object,
    setPayStatus: PropTypes.func,
    loadingCards: PropTypes.bool,
    getCards: PropTypes.func
  }

  constructor(props) {
    super(props);
    this.handleOnSubmit = this.handleOnSubmit.bind(this);
    this.props.getCards();
  }

  componentWillMount() {
    this.props.setPayStatus(null);
  }

  handleOnSubmit() {
    return this.props.pay({ shippingAddress: this.refs.shippingAddress.value,
      phoneNumber: this.refs.phoneNumber.value,
      cardId: this.refs.cardId.value,
      amount: this.props.cart.total });
  }
  render() {
    const { user, cart, cards, payStatus } = this.props;
    const styles = require('./Checkout.scss');

    return (
      <div className="container">
        {payStatus && payStatus.message === 'OK' &&
        <div className="col-sm-10"
             style={{paddingLeft: 0, paddingRight: 0}}>
          <div className="modal-dialog modal-lg" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h4 className="modal-title">Payment status</h4>
              </div>
              <div className="modal-body">
                <h1><font color="green">Payment success. Let's go to</font> <a href="/orders">Orders</a></h1>
              </div>
            </div>
          </div>
        </div>
        }
        {user && cart &&
        <div className="row">
          <div className="col-md-7">
            <h1>Ordering</h1>

            <div className="form-group">
              <label>Full name</label>
              <input type="text" className="form-control"
                     defaultValue={user.firstName + ' ' + user.lastName} required />
            </div>

            <div className="form-group">
              <label>Shipping address</label>
              <input type="text" className="form-control"
                     placeholder="for example, lviv stepana bandery 21"
                     defaultValue={user.address}
                     ref="shippingAddress" required/>
            </div>
            <div className="form-group">
              <label>Phone number</label>
              <input type="number" className="form-control"
                     defaultValue={user.phoneNumber}
                     ref = "phoneNumber" required/>
            </div>
            <div className="form-group">
              <label>Select the card</label><br />
              {!cards || !cards.length && <label>You dont have any card yet.</label>}
              {this.props.loadingCards && <i className="fa fa-spinner fa-spin fa-3x fa-fw"></i>}
              {cards && cards.length && !this.props.loadingCards &&
              <select onChange={() => this.props.setPayStatus(null)} ref="cardId" className="form-control">
                {cards.map((card) => <option value={card._id}
                                             key={card._id}>
                                      {card.name} | *{card.number.split('...')[1]} | {card.balance} $
                                    </option>)}
              </select>}
            </div>
            {payStatus && payStatus.message === 'BAD' &&
            <div className="form-group">
              <div className="col-sm-10 col-md-10 col-md-offset-1"
                   style={{paddingLeft: 0, paddingRight: 0}}>
                <div className="modal-dialog modal-sm" role="document">
                  <div className="modal-content">
                    <div className="modal-header">
                      <button type="button" onClick={() => this.props.setPayStatus(null)} className="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                      <h4 className="modal-title"><span className="glyphicon glyphicon-warning-sign"></span> Warning</h4>
                    </div>
                    <div className="modal-body">
                      <font color="red">You have not enough money for payment.</font>
                    </div>
                  </div>
                </div>
              </div>
            </div>}

            <div className="form-group">
              <AsyncButton className="btn btn-success btn-lg"
                           text="Submit"
                           pendingText="Submiting"
                           onClick={this.handleOnSubmit} />
            </div>

          </div>
          <div className="col-md-5">
          <div className = {styles.panel + ' panel panel-default'}>
            <div className = "panel-body">
            <table className="table">
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
                cart.order.products.map((item) =>
                  <tr key={item._id}>
                    <td><image height="50" width="60" src={decodeURIComponent(item.images[0])} /></td>
                    <td className="col-md-4"><a href="#">{item.name}</a></td>
                    <td>{item.quantity}</td>
                    <td>{item.price * item.quantity + ' $'}</td>
                  </tr>)
              }
              </tbody>
            </table>
            </div>
          </div>
          <strong><font size="6">Total price: <font color="#eae600">{cart.total} $</font></font></strong><br/>
          <button type="button" className="btn btn-warning"
                  onClick={() => this.props.pushState('/cart')}>
            <span className="glyphicon glyphicon-edit"></span> Edit order</button>
          </div>
        </div>}
      </div>
    );
  }
}
