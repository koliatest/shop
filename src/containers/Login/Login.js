import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import AsyncButton from 'react-async-button';

import * as authActions from 'redux/modules/auth';

@connect(
  state => ({ user: state.auth.user,
              loginError: state.auth.loginError,
              loggingIn: state.auth.loggingIn }),
  authActions)
export default class Login extends Component {
  static propTypes = {
    user: PropTypes.object,
    login: PropTypes.func,
    loginError: PropTypes.object,
    loggingIn: PropTypes.bool
  }

  handleSubmit = () => {
    const email = this.refs.email;
    const password = this.refs.password;
    if (email.value && password.value) {
      event.preventDefault();
      const emailValue = email.value;
      const passwordValue = password.value;
      email.value = '';
      password.value = '';
      return this.props.login({ email: emailValue, password: passwordValue });
    }
  };

  render() {
    const { user, loginError } = this.props;
    const styles = require('./Login.scss');

    return (
      <div className={styles.loginPage + ' container'}>
        {this.props.loggingIn &&
          <div className="container" id="overlay" style={{
            position: 'absolute',
            marginTop: '-50px',
            height: '100%',
            width: '100%',
            opacity: '.6',
            zIndex: 999999,
            marginLeft: '-115px',
            backgroundColor: 'black'}}>
            <div style={{
              boxSizing: 'bordered-box',
              textAlign: 'center',
              margin: '100px'
            }}>
              <i className={' fa fa-refresh fa-spin fa-3x fa-fw'} style={{
                color: 'white',
                marginTop: '10%'
              }}></i>
            </div>
          </div>
        }
        <div>

          <div className="row">
            <div className="col-md-4">
            </div>
            <div className="col-md-4">
              <h3>Login</h3>
              <div className={styles.blockMedia + ' row'}>
                <div>
                  <a href="/api/login/facebook/" className={styles.btnFacebook + ' btn btn-lg btn-block'}>
                    <i className="fa fa-facebook visible-xs"></i>
                    <span className="hidden-xs"><font color="white">Facebook</font></span>
                  </a>
                </div>
              </div>

              <div className="row">
                <div>
                  <hr />
                  <span className="omb_spanOr">or</span>
                </div>
              </div>
              <br />
              <form className="form-signin" onSubmit={this.handleSubmit}>
                <div className="input-group" style={{marginBottom: '20px'}}>
                  <span className="input-group-addon"><i className="fa fa-user"></i></span>
                  <input ref="email" type="email" className="form-control" placeholder="Email address" required />
                </div>
                <div className="input-group" style={{marginBottom: '20px'}}>
                  <span className="input-group-addon"><i className="fa fa-lock"></i></span>
                  <input ref="password" type="password" className="form-control" placeholder="Password" required />
                </div>
                {!user && loginError &&
                  <label className="help-block"><font color="red">{loginError.message}</font></label>
                }
                <AsyncButton className="btn btn-lg btn-primary btn-block"
                             text="Login"
                             pendingText="Logining"
                             fulFilledText="Logged in"
                             onClick={this.handleSubmit} />
              </form>
            <div className="col-md-4">
            </div>
          </div>
            </div>
          </div>
        </div>
        );
  }
}
