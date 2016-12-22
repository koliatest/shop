import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import config from '../../config';
import { confirmEmail } from 'redux/modules/profile';
import { load as loadAuth } from 'redux/modules/auth';

@connect(
  state => ({ user: state.auth.user }),
  { confirmEmail, loadAuth })
export default
class VerifyEmail extends Component {
  static propTypes = {
    user: PropTypes.object,
    params: PropTypes.object,
    confirmEmail: PropTypes.func,
    loadAuth: PropTypes.func
  }

  componentWillMount() {
    if (this.props.params.id === config.verifyEmailId) {
      this.props.confirmEmail()
        .then(this.props.loadAuth());
    }
  }


  render() {
    return (
      <div className="container">
        <h1>Email has been verified.</h1>
      </div>
    );
  }
}
