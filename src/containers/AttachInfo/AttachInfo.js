import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import * as authActions from 'redux/modules/auth';
import { push } from 'react-router-redux';
import { AttachInfoForm } from 'components';

@connect(
  state => ({ user: state.auth.user,
              attachStatus: state.auth.attachStatus,
              attaching: state.auth.attaching }),
  { ...authActions, pushState: push })
export default
class AttachInfo extends Component {
  static propTypes = {
    user: PropTypes.object,
    attachInfo: PropTypes.func,
    pushState: PropTypes.func,
    attachStatus: PropTypes.object,
    attaching: PropTypes.bool,
    logout: PropTypes.func
  };

  constructor(props) {
    super(props);
    if (this.props.user.bankId !== '') {
      this.props.pushState('/profile');
    }
  }

  render() {
    // const { user } = this.props;
    return (
      <div className="container" id="overlay" style={{
        position: 'absolute',
        marginTop: '-50px',
        height: '100%',
        width: '100%',
        opacity: '.6',
        zIndex: 999999,
        backgroundColor: 'black'}}>
        <h1>Attach</h1>
        <div style={{
          padding: '200px 40px 200px 40px',
          opacity: 1,
          marginTop: '-10px'}}>
          <AttachInfoForm />
        </div>
      </div>
    );
  }
}
