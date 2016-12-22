import React, {Component, PropTypes} from 'react';
import {reduxForm, change as changeFieldValue} from 'redux-form';
import {connect} from 'react-redux';
import profileValidation from './profileValidation';
import {bindActionCreators} from 'redux';
import * as profileActions from 'redux/modules/profile';

@connect((state) => ({ user: state.auth.user,
                       editInfo: state.profile.editInfo }),
  () => dispatch => bindActionCreators(profileActions, dispatch)
)
@reduxForm({
  form: 'profile',
  fields: ['firstName', 'lastName', 'phoneNumber', 'address', 'email'],
  validate: profileValidation
})
export default class ProfileForm extends Component {
  static propTypes = {
    asyncValidating: PropTypes.bool.isRequired,
    fields: PropTypes.object.isRequired,
    handleSubmit: PropTypes.func.isRequired,
    editInfo: PropTypes.bool,
    user: PropTypes.object,
    showInfo: PropTypes.func,
    update: PropTypes.func,
    values: PropTypes.object,
    dispatch: PropTypes.func
  }

  constructor(props) {
    super(props);
  }

  render() {
    const {
      asyncValidating,
      fields: { firstName, lastName, phoneNumber, address, email},
      handleSubmit, values, update, user
      } = this.props;
    this.props.dispatch(changeFieldValue(firstName, user.firstName));
    const styles = require('./ProfileForm.scss');
    const renderInput = (field, label, placeholder = '', type = 'text', showAsyncValidating) =>
      <div className={'form-group' + (field.error && field.touched ? ' has-error' : '')}>
        <label htmlFor={field.name} className="col-sm-2">{label}</label>
        <div className={'col-sm-8 ' + styles.inputGroup}>
          {showAsyncValidating && asyncValidating && <i className={'fa fa-cog fa-spin ' + styles.cog}/>}
          <input disabled={(field.name === 'email') ? true : !this.props.editInfo} type={type} className="form-control"
                 id = {field.name} placeholder = {placeholder}
                 ref={field.name}
                 {...field} required/>
          {field.error && field.touched && <div className="text-danger">{field.error}</div>}
        </div>
      </div>;

    return (
      <div>
        <form className="form-horizontal" onSubmit={handleSubmit(() => (update(values)))}>
          {renderInput(firstName, 'First Name')}
          {renderInput(lastName, 'Last Name')}
          {renderInput(phoneNumber, 'Phone Number', 'for example, 0673429867')}
          {renderInput(address, 'Address', 'for example, lviv bandery 21')}
          {renderInput(email, 'Email', '', 'email', true)}

          <div className="form-group">
            <div className="col-sm-offset-2 col-sm-10">
              <button type="submit" disabled={!this.props.editInfo} className="btn btn-success"
                      onClick={handleSubmit(() => {update(values); window.location.reload();})}>
                <i className="fa fa-paper-plane"/> Submit
              </button>
              {this.props.editInfo && <button onClick={() => this.props.showInfo()} className="btn btn-danger"
                                              style={{marginLeft: '10px'}}>Cancel</button>}
            </div>
          </div>
        </form>
      </div>
    );
  }
}
