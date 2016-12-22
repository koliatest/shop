import React, {Component, PropTypes} from 'react';
import {reduxForm} from 'redux-form';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import signupValidation from './signupValidation';
import * as signupActions from 'redux/modules/signup';

function asyncValidate(data, dispatch, { isValidEmail }) {
  if (!data.email) {
    return Promise.resolve({});
  }
  return isValidEmail(data);
}
@connect((state) => ({ bankRes: state.bankAPI.data,
                       loadingUserId: state.bankAPI.loadingUserId }),
  dispatch => bindActionCreators(signupActions, dispatch)
)
@reduxForm({
  form: 'signup',
  fields: ['firstName', 'lastName', 'phoneNumber', 'address', 'email', 'password', 'bankId'],
  validate: signupValidation,
  asyncValidate,
  asyncBlurFields: ['email']
})
export default class SignupForm extends Component {
  static propTypes = {
    asyncValidating: PropTypes.bool.isRequired,
    fields: PropTypes.object.isRequired,
    handleSubmit: PropTypes.func.isRequired,
    invalid: PropTypes.bool.isRequired,
    pristine: PropTypes.bool.isRequired,
    valid: PropTypes.bool.isRequired,
    bankRes: PropTypes.object,
    onMyFormSubmit: PropTypes.func,
    loadingUserId: PropTypes.bool
  };

  constructor() {
    super();
    this.localHandleSubmit = this.localHandleSubmit.bind(this);
  }

  localHandleSubmit(event) {
    this.props.onMyFormSubmit({ firstName: this.refs.firstName.value,
                                lastName: this.refs.lastName.value,
                                phoneNumber: this.refs.phoneNumber.value,
                                address: this.refs.address.value,
                                email: this.refs.email.value,
                                password: this.refs.password.value,
                                bankId: this.refs.bankId.value });
    event.preventDefault();
  }

  render() {
    const {
      asyncValidating,
      fields: { firstName, lastName, phoneNumber, address, email, password, bankId },
      bankRes
      } = this.props;
    const styles = require('./SignupForm.scss');
    const renderInput = (field, label, placeholder = '', type = 'text', showAsyncValidating) =>
      <div className={'form-group' + (field.error && field.touched ? ' has-error' : '')}>
        <label htmlFor={field.name} className="col-sm-2">{label}</label>
        <div className={'col-sm-8 ' + styles.inputGroup}>
          {showAsyncValidating && asyncValidating && <i className={'fa fa-cog fa-spin ' + styles.cog}/>}
          <input ref={field.name} type={type} className="form-control" id={field.name} {...field} placeholder = {placeholder} required/>
          {field.error && field.touched && <div className="text-danger">{field.error}</div>}
        </div>
      </div>;
    const renderBankId = (field, label, val) =>
      <div className="form-group">
          <label htmlFor={field.name} className="col-sm-2">{label}</label>
          <div className={'col-sm-8 ' + styles.inputGroup}>
            <input ref={field.name} type="text" className="form-control" value={val} id={field.name} {...field} />
          </div>
        </div>;

    return (
      <div>
        <form className="form-horizontal" onSubmit={this.localHandleSubmit}>
          {renderInput(firstName, 'First Name')}
          {renderInput(lastName, 'Last Name')}
          {renderInput(phoneNumber, 'Phone Number', 'for example, 0673429867')}
          {renderInput(address, 'Address', 'for example, lviv bandery 21')}
          {renderInput(email, 'Email', '', 'email', true)}
          {renderInput(password, 'Password', '', 'password')}
          {this.props.loadingUserId && <i className="fa fa-spinner fa-spin fa-3x fa-fw"></i>}
          {bankRes && bankRes.bankResponse === 'BAD' && !this.props.loadingUserId &&
            <label><font color="red">Wrong bank email or password.</font></label>
          }
          {bankRes && bankRes.bankResponse !== 'BAD' && !this.props.loadingUserId &&
            renderBankId(bankId, 'BankID', bankRes.bankResponse)
          }

          <div className="form-group">
            <div className="col-sm-offset-2 col-sm-10">
              <button className="btn btn-success"
                disabled={(!bankRes || (bankRes && bankRes.bankResponse === 'BAD')) ? true : false}>
                <i className="fa fa-paper-plane"/> Create account
              </button>
            </div>
          </div>
        </form>
      </div>
    );
  }
}
