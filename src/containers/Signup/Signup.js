import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';
import { replace } from 'react-router-redux';

import { SignupForm } from 'components';
import { signup } from 'redux/modules/signup';
import * as bankActions from 'redux/modules/bankAPI';

@connect(
  () => ({}),
  { ...bankActions, signup, pushState: replace })
export default class Signup extends Component {
   static propTypes = {
     signup: PropTypes.func.isRequired,
     pushState: PropTypes.func.isRequired,
     attachBank: PropTypes.func
   }
   constructor() {
     super();
     this.myHandleSubmit = this.myHandleSubmit.bind(this);
     this.handleBankSubmit = this.handleBankSubmit.bind(this);
   }

  myHandleSubmit(data) {
    this.props.signup(data);
    this.props.pushState('/login');
  }

  handleBankSubmit() {
    this.props.attachBank({ email: this.refs.bankLogin.value,
                            password: this.refs.bankPassword.value });
  }

  render() {
    return (
      <div className="container">
        <div className = "row">
          <div className="col-md-7">
            <h1>Signup</h1>
            <Helmet title="Signup"/>

            <div className = "panel panel-default">
              <div className = "panel-body">
              <SignupForm onMyFormSubmit={this.myHandleSubmit}/>
              </div>
            </div>

            </div>
          <div className="col-md-5">
            <h2>Attach bank account</h2>

              <div className="form-group">
                <label>Bank login: </label>
                <input className="form-control" ref="bankLogin" required />
              </div>
              <div className="form-group">
                <label>Bank password: </label>
                <input type="password" className="form-control" ref="bankPassword" required />
              </div>
              <button type="button" onClick={this.handleBankSubmit} className="btn btn-warning">Attach</button>

          </div>
        </div>
      </div>
    );
  }
}
