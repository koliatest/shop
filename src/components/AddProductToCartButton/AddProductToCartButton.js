import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { replace } from 'react-router-redux';
import AsyncButton from 'react-async-button';

import { addProductToCart } from 'redux/modules/cart';

@connect(
  (state) => ({ error: state.cart.error,
                data: state.cart.data }),
  { addProductToCart, pushState: replace }
)
export default class AddProductToCartButton extends Component {
  static propTypes = {
    addProductToCart: PropTypes.func,
    pushState: PropTypes.func,
    error: PropTypes.object,
    productId: PropTypes.string.isRequired,
    disabled: PropTypes.bool,
    data: PropTypes.object
  }

  constructor(props) {
    super(props);
    this.handleOnClick = this.handleOnClick.bind(this);
    this.isProductInCart = this.isProductInCart.bind(this);
  }

  handleOnClick() {
    return this.props.addProductToCart({ productId: this.props.productId, quantity: 1 })
      .then(() => {
        this.props.pushState('/cart');
      });
  }

  isProductInCart() {
    if (this.props.data) {
      return this.props.data.order.products
          .map((item) => item.productId)
          .indexOf(this.props.productId) !== -1;
    }
  }

  render() {
    return (
      <div>
        <AsyncButton className={!this.isProductInCart() ? 'btn btn-success' : 'btn btn-primary'}
                     disabled={this.props.disabled}
                     onClick={!this.isProductInCart() ? this.handleOnClick : () => this.props.pushState('/cart')}>
          {!this.isProductInCart() &&
            <div>
              <i className="fa fa-cart-plus" aria-hidden="true"></i> Buy
            </div>
          }
          {this.isProductInCart() &&
          <div>
            <i className="fa fa-cart-arrow-down" aria-hidden="true"></i> In the cart
          </div>
          }
        </AsyncButton>
      </div>
    );
  }
}
