import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { AttachBankForm } from 'components';

@connect(
  state => ({ user: state.auth.user }),
  {})
export default class AttachBank extends Component {
  static propTypes = {
    user: PropTypes.object
  };
  render() {
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
          <AttachBankForm />
        </div>
      </div>);
  }
}
