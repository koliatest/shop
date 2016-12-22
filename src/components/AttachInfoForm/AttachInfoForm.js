import React, {Component, PropTypes} from 'react';
import {reduxForm } from 'redux-form';
import {connect} from 'react-redux';
import attachInfoValidation from './attachInfoValidation';
import { push } from 'react-router-redux';
import * as signupActions from 'redux/modules/signup';
import { attachInfo, logout } from 'redux/modules/auth';

function asyncValidate(data, dispatch, { isValidEmail }) {
  if (!data.email) {
    return Promise.resolve({});
  }
  return isValidEmail(data);
}
@connect((state) => ({ user: state.auth.user,
                       attachStatus: state.auth.attachStatus,
                       attaching: state.auth.attaching }),
  { ...signupActions, attachInfo, logout, push }
)
@reduxForm({
  form: 'attachInfo',
  fields: ['bankEmail', 'bankPassword', 'email'],
  validate: attachInfoValidation,
  asyncValidate,
  asyncBlurFields: ['email']
})
export default class AttachInfoForm extends Component {
  static propTypes = {
    asyncValidating: PropTypes.bool.isRequired,
    fields: PropTypes.object.isRequired,
    handleSubmit: PropTypes.func.isRequired,
    user: PropTypes.object,
    values: PropTypes.object,
    dispatch: PropTypes.func,
    attachInfo: PropTypes.func,
    attachStatus: PropTypes.object,
    attaching: PropTypes.bool,
    logout: PropTypes.func,
    push: PropTypes.func
  }

  constructor(props) {
    super(props);
  }

  render() {
    const {
      asyncValidating,
      fields: { bankEmail, bankPassword, email },
      handleSubmit, values
    } = this.props;
    const styles = require('../ProfileForm/ProfileForm.scss');
    const renderInput = (field, label, type = 'text', showAsyncValidating) =>
      <div className={'form-group' + (field.error && field.touched ? ' has-error' : '')}>
        <label htmlFor={field.name} className="col-sm-2">{label}</label>
        <div className={'col-sm-8 ' + styles.inputGroup}>
          {showAsyncValidating && asyncValidating && <i className={'fa fa-cog fa-spin ' + styles.cog}/>}
          <input type={type} className="form-control"
                 id = {field.name}
                 ref={field.name}
                 {...field} required/>
          {field.error && field.touched && <div className="text-danger">{field.error}</div>}
        </div>
      </div>;

    return (
      <div>
        <div className="row">
          <div className="form-group">
            <div className="col-sm-10 col-md-offset-1"
                 style={{paddingLeft: 0, paddingRight: 0, marginTop: '-150px'}}>
              <div className="modal-dialog modal-md" role="document">
                <div className="modal-content">
                  <div className="modal-header">
                    <h4 className="modal-title">Attach information</h4>
                  </div>
                  <div className="modal-body">
                    <form className="form-horizontal">
                      {renderInput(email, 'Email', 'text', true)}
                      {renderInput(bankEmail, 'Bank login')}
                      {renderInput(bankPassword, 'Bank password', 'password')}
                      {this.props.attachStatus && this.props.attachStatus.bankResponse === 'BAD' &&
                      <div className="form-group">
                        <label className="col-sm-10"><font color="red">Wrong bank login or password</font></label>
                      </div>
                      }
                      {this.props.attaching && <i className="fa fa-spinner fa-spin fa-3x fa-fw"></i>}
                    </form>
                  </div>
                  <div className="modal-footer">
                    <button className="btn btn-danger" style={{marginRight: '10px'}}
                            onClick={this.props.logout}>Cancel</button>
                    <button className="btn btn-success"
                            type="button"
                            onClick={handleSubmit(() => {
                              this.props.attachInfo(values)
                                .then(() => {
                                  if (!this.props.attachStatus) {
                                    this.props.push('/profile');
                                    window.location.reload();
                                  }
                                });
                            })}>Attach</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
