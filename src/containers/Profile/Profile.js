import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { ProfileForm } from 'components';
import * as profileActions from 'redux/modules/profile';

@connect(
    state => ({ user: state.auth.user,
                info: state.profile.info,
                editInfo: state.profile.editInfo,
                changePassword: state.profile.changePassword,
                changeBankId: state.profile.changeBankId,
                changePasswordStatus: state.profile.changePasswordStatus,
                bankRes: state.bankAPI.data,
                changeBankIdStatus: state.profile.changeBankIdStatus,
                confirmEmailStatus: state.profile.confirmEmailStatus }),
    { ...profileActions })
export default class Profile extends Component {
  static propTypes = {
    showEditInfo: PropTypes.func,
    showChangePassword: PropTypes.func,
    update: PropTypes.func,
    info: PropTypes.bool,
    editInfo: PropTypes.bool,
    changePassword: PropTypes.bool,
    changeBankId: PropTypes.bool,
    showChangeBankId: PropTypes.func,
    showInfo: PropTypes.func,
    changePasswordReq: PropTypes.func,
    changePasswordStatus: PropTypes.bool,
    bankRes: PropTypes.object,
    changeBankAccount: PropTypes.func,
    changeBankIdStatus: PropTypes.object,
    user: PropTypes.object,
    confirmEmailStatus: PropTypes.bool,
    showConfirmEmailMessage: PropTypes.func,
    sendConfirmationEmail: PropTypes.func
  }

  constructor(props) {
    super(props);
    this.props.showInfo();
    this.handleChangePass = this.handleChangePass.bind(this);
    this.handleShowChangePass = this.handleShowChangePass.bind(this);
    this.handleShowEditInfo = this.handleShowEditInfo.bind(this);
    this.handleShowChangeBankId = this.handleShowChangeBankId.bind(this);
    this.handleChangeBankId = this.handleChangeBankId.bind(this);
    this.handleEmailConfirm = this.handleEmailConfirm.bind(this);
  }

  handleChangeBankId() {
    this.props.changeBankAccount({ email: this.refs.bankLogin.value,
                                   password: this.refs.bankPassword.value });
  }


  handleChangePass() {
    this.props.changePasswordReq({ oldPassword: this.refs.oldPassword.value,
                                   newPassword: this.refs.newPassword.value,
                                   newPasswordConfirmed: this.refs.newPasswordConfirmed.value });
  }

  handleShowChangeBankId(event) {
    event.preventDefault();
    this.props.showChangeBankId();
  }

  handleShowChangePass(event) {
    event.preventDefault();
    this.props.showChangePassword();
  }

  handleShowEditInfo(event) {
    event.preventDefault();
    this.props.showEditInfo();
  }

  handleEmailConfirm() {
    this.props.sendConfirmationEmail();
    this.props.showConfirmEmailMessage();
  }

  render() {
    const styles = require('./Profile.scss');
    const { info, editInfo, user, changePassword, changePasswordStatus, changeBankIdStatus, changeBankId,
            confirmEmailStatus } = this.props;
    const myInitialValues = {
      initialValues: {
        firstName: user.firstName,
        lastName: user.lastName,
        address: user.address,
        phoneNumber: user.phoneNumber,
        email: user.email
      }
    };
    return (
      <div className="container">
        <div className="row">

          <div className="col-md-8">
            {(info || editInfo) &&
              <h1>Personal information</h1>
            }
            {changePassword &&
              <h1>Changing password</h1>
            }
            {changeBankId &&
              <h1>Changing bank account</h1>
            }
            {info && !user.isEmailVerified && confirmEmailStatus &&
            <div className = {styles.panelConfirmSent + ' panel panel-default'}>
              <div className = "panel-body">
                <font size="3">
                  You have been sent a confirmation email
                </font>
              </div>
            </div>
            }
            {info && !user.isEmailVerified &&
            <div className = {styles.panelEmailNotConfirmed + ' panel panel-default'}>
              <div className = "panel-body">
                <font size="3">
                  Email is not confirmed: <br/>
                  <strong>{user.email}</strong> <br/>
                  <button type="button" onClick={this.handleEmailConfirm} className="btn btn-success">Confirm</button>
                </font>
              </div>
            </div>
            }
            <div className = "panel panel-default">
              <div className = "panel-body">
                {(info || editInfo) &&
                <ProfileForm {...myInitialValues} />
                }
                {changePasswordStatus && changePasswordStatus.message === 'OK' &&
                  <label><font color="green">Password has been changed.</font></label>
                }
                {changePasswordStatus && changePasswordStatus.message !== 'OK' &&
                  <label><font color="red">{changePasswordStatus.message}</font></label>
                }
                {changeBankIdStatus && changeBankIdStatus.message === 'OK' &&
                  <label><font color="green">Bank account has been changed.</font></label>
                }
                {changeBankIdStatus && changeBankIdStatus.message !== 'OK' &&
                  <label><font color="red">Wrong bank login or password</font></label>
                }
                {changePassword &&
                  <div className="form-horizontal">
                      <div className="form-group">
                        <label className="col-sm-2">Old password</label>
                        <div className="col-sm-8">
                          <input type="password" className="form-control" ref="oldPassword" required />
                        </div>
                      </div>
                      <br/> <br/>
                      <div className="form-group">
                        <label className="col-sm-2">New password</label>
                        <div className={'col-sm-8 ' + styles.inputGroup}>
                          <input type="password" className="form-control" ref="newPassword" required />
                        </div>
                      </div>
                      <div className="form-group">
                        <label className="col-sm-2">Confirm new password</label>
                        <div className={'col-sm-8 ' + styles.inputGroup}>
                          <input type="password" className="form-control" ref="newPasswordConfirmed" required />
                        </div>
                      </div>
                      <div className="form-group">
                        <div className="col-sm-offset-2 col-sm-10">
                          <button type="submit" className="btn btn-success"
                                  onClick={this.handleChangePass}>
                            <i className="fa fa-paper-plane"/> Submit
                          </button>
                          <button onClick={() => this.props.showInfo()} className="btn btn-danger"
                                  style={{marginLeft: '10px'}}>Cancel</button>
                        </div>
                      </div>
                  </div>
                }
                {changeBankId &&
                <div className="form-horizontal">
                  <div className="form-group">
                    <label className="col-sm-2">Login</label>
                    <div className="col-sm-8">
                      <input type="text" className="form-control" ref="bankLogin" required />
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="col-sm-2">Password</label>
                    <div className={'col-sm-8 ' + styles.inputGroup}>
                      <input type="password" className="form-control" ref="bankPassword" required />
                    </div>
                  </div>
                  <div className="form-group">
                    <div className="col-sm-offset-2 col-sm-10">
                      <button type="submit" className="btn btn-success"
                              onClick={this.handleChangeBankId}>
                        <i className="fa fa-paper-plane"/> Submit
                      </button>
                      <button onClick={() => this.props.showInfo()} className="btn btn-danger"
                              style={{marginLeft: '10px'}}>Cancel</button>
                    </div>
                  </div>
                </div>
                }
              </div>
            </div>
          </div>

          <div className="col-md-4">
            <div className={styles.links}>
              <p><a href="#" onClick={this.handleShowEditInfo}><font size="3">Edit personal information</font></a></p>
              <p><a href="#" onClick={this.handleShowChangePass}><font size="3">Change password</font></a></p>
              <p><a href="#" onClick={this.handleShowChangeBankId}><font size="3">Change bank account</font></a></p>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
