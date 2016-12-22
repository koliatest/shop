import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { IndexLink } from 'react-router';
import { LinkContainer } from 'react-router-bootstrap';
import Navbar from 'react-bootstrap/lib/Navbar';
import Nav from 'react-bootstrap/lib/Nav';
import NavItem from 'react-bootstrap/lib/NavItem';
import Helmet from 'react-helmet';
import { isLoaded as isAuthLoaded, load as loadAuth, logout } from 'redux/modules/auth';
import {isLoaded, load as loadCart} from 'redux/modules/cart';
import { push } from 'react-router-redux'; // can be "replace" instead of "push"
import config from '../../config';
import { asyncConnect } from 'redux-async-connect';

@asyncConnect([{
  promise: ({store: {dispatch, getState}}) => {
    const promises = [];
    if (!isAuthLoaded(getState())) {
      promises.push(dispatch(loadAuth()));
    }
    if (getState().auth.user && !isLoaded(getState())) {
      promises.push(dispatch(loadCart()));
    }

    return Promise.all(promises);
  }
}])
@connect(
  state => ({user: state.auth.user,
             cart: state.cart.data}),
  {logout, pushState: push})
export default class App extends Component {
  static propTypes = {
    children: PropTypes.object.isRequired,
    user: PropTypes.object,
    logout: PropTypes.func.isRequired,
    pushState: PropTypes.func.isRequired,
    cart: PropTypes.object
  };

  static contextTypes = {
    store: PropTypes.object.isRequired
  };

  componentWillReceiveProps(nextProps) {
    if (!this.props.user && nextProps.user) {
      // login
      if (nextProps.user.bankId.length) {
        this.props.pushState('/');
      } else {
        this.props.pushState('/attach-bank');
      }
    } else if (this.props.user && !nextProps.user) {
      // logout
      this.props.pushState('/');
    }
  }

  handleLogout = (event) => {
    event.preventDefault();
    this.props.logout()
      .then(() => {
        window.location.reload();
      });
  };

  render() {
    const { user, cart } = this.props;
    const styles = require('./App.scss');

    let totalQuantity = 0;
    if (user) {
      if (cart && cart.order.products.length) {
        totalQuantity = cart.order.products
          .map(item => item.quantity)
          .reduce((prev, curr) => prev + curr);
      }
    }

    return (
      <div className={styles.app}>
        <Helmet {...config.app.head}/>
        <Navbar fixedTop>
          <Navbar.Header>
            <Navbar.Brand>
              <IndexLink to="/" activeStyle={{color: '#33e0ff'}}>
                <div className={styles.brand}/>
                <span>{config.app.title}</span>
              </IndexLink>
            </Navbar.Brand>
            <Navbar.Toggle/>
          </Navbar.Header>

          <Navbar.Collapse eventKey={0}>
            <Nav navbar>

              {user &&
              <LinkContainer to="/cart">
                <NavItem eventKey={1}>
                  <span className="glyphicon glyphicon-shopping-cart"></span> Cart <font color="red">({totalQuantity})</font>
                </NavItem>
              </LinkContainer>}

              {user &&
              <LinkContainer to="/orders">
                <NavItem eventKey={2}>
                  <span className="glyphicon glyphicon-list-alt"></span> Orders
                </NavItem>
              </LinkContainer>}

              {user &&
              <LinkContainer to="/logout">
                <NavItem eventKey={3} className="logout-link" onClick={this.handleLogout}>
                  <span className="glyphicon glyphicon-log-out"></span> Logout
                </NavItem>
              </LinkContainer>}

            </Nav>
            <Nav navbar pullRight>
            {user &&
            <p className={styles.loggedInMessage + ' navbar-text'}>Hello,
              <LinkContainer to="/profile">
                <font color="blue"> <i className="fa fa-user-circle-o" aria-hidden="true"></i>
                   <strong> {user.firstName} {user.lastName}</strong> </font>
              </LinkContainer> </p>}
              {!user &&
              <LinkContainer to="/login">
                <NavItem eventKey={2}><span className="glyphicon glyphicon-log-in"></span> Sign in </NavItem>
              </LinkContainer> }

              {!user &&
              <LinkContainer to="/signup">
                <NavItem eventKey={3}><span className="glyphicon glyphicon-new-window"></span> Sign up </NavItem>
              </LinkContainer>}
            </Nav>
          </Navbar.Collapse>
        </Navbar>

        <div className={styles.appContent}>
          {this.props.children}
        </div>

        <div className="well text-center">
          (c) <a href = "http://www.eliftech.com/">ElifTech</a> School 2016
        </div>
      </div>
    );
  }
}
