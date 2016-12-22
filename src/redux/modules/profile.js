const SHOW_INFO = 'shop-client/profile/SHOW_INFO';
const SHOW_EDIT_INFO = 'shop-client/profile/SHOW_EDIT_INFO';
const SHOW_CHANGE_PASSWORD = 'shop-client/profile/SHOW_CHANGE_PASSWORD';
const SHOW_CHANGE_BANK_ID = 'shop-client/profile/SHOW_CHANGE_BANK_ID';
const CONFIRM_EMAIL_MESSAGE = 'shop-client/profile/CONFIRM_EMAIL_MESSAGE';

const UPDATE = 'shop-client/profile/UPDATE';
const UPDATE_SUCCESS = 'shop-client/profile/UPDATE_SUCCESS';
const UPDATE_FAIL = 'shop-client/profile/UPDATE_FAIL';

const CHANGE_PASSWORD = 'shop-client/profile/CHANGE_PASSWORD';
const CHANGE_PASSWORD_SUCCESS = 'shop-client/profile/CHANGE_PASSWORD_SUCCESS';
const CHANGE_PASSWORD_FAIL = 'shop-client/profile/CHANGE_PASSWORD_FAIL';

const CHANGE_BANK_ACCOUNT = 'shop-client/profile/CHANGE_BANK_ACCOUNT';
const CHANGE_BANK_ACCOUNT_SUCCESS = 'shop-client/profile/CHANGE_BANK_ACCOUNT_SUCCESS';
const CHANGE_BANK_ACCOUNT_FAIL = 'shop-client/profile/CHANGE_BANK_ACCOUNT_FAIL';

const SEND_EMAIL_CONFIRMATION = 'shop-client/profile/SEND_EMAIL_CONFIRMATION';
const SEND_EMAIL_CONFIRMATION_SUCCESS = 'shop-client/profile/SEND_EMAIL_CONFIRMATION_SUCCESS';
const SEND_EMAIL_CONFIRMATION_FAIL = 'shop-client/profile/SEND_EMAIL_CONFIRMATION_FAIL';

const CONFIRM_EMAIL = 'shop-client/profile/CONFIRM_EMAIL';
const CONFIRM_EMAIL_SUCCESS = 'shop-client/profile/CONFIRM_EMAIL_SUCCESS';
const CONFIRM_EMAIL_FAIL = 'shop-client/profile/CONFIRM_EMAIL_FAIL';


const initialState = {
  info: true,
  editInfo: false,
  changePassword: false,
  changeBankId: false
};

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case SHOW_INFO:
      return {
        ...state,
        info: true,
        editInfo: false,
        changePassword: false,
        changeBankId: false,
        changePasswordStatus: null,
        changeBankIdStatus: null
      };
    case SHOW_EDIT_INFO:
      return {
        ...state,
        info: false,
        editInfo: true,
        changePassword: false,
        changeBankId: false,
        changePasswordStatus: null,
        changeBankIdStatus: null,
        confirmEmailStatus: false
      };
    case SHOW_CHANGE_PASSWORD:
      return {
        ...state,
        info: false,
        editInfo: false,
        changePassword: true,
        changeBankId: false,
        changePasswordStatus: null,
        changeBankIdStatus: null,
        confirmEmailStatus: false
      };
    case SHOW_CHANGE_BANK_ID:
      return {
        ...state,
        info: false,
        editInfo: false,
        changePassword: false,
        changeBankId: true,
        changePasswordStatus: null,
        changeBankIdStatus: null,
        confirmEmailStatus: false
      };
    case UPDATE:
      return {
        ...state,
        info: true,
        editInfo: false,
        changePassword: false,
        changeBankId: false
      };
    case UPDATE_SUCCESS:
      return {
        ...state,
        info: true,
        editInfo: false,
        changePassword: false,
        changeBankId: false
      };
    case UPDATE_FAIL:
      return {
        ...state
      };
    case CHANGE_PASSWORD:
      return {
        ...state
      };
    case CHANGE_PASSWORD_SUCCESS:
      return {
        ...state,
        info: true,
        editInfo: false,
        changePassword: false,
        changeBankId: false,
        changePasswordStatus: action.result,
        changeBankIdStatus: null
      };
    case CHANGE_PASSWORD_FAIL:
      return {
        ...state,
        info: false,
        editInfo: false,
        changePassword: true,
        changeBankId: false,
        changePasswordStatus: action.error,
        changeBankIdStatus: null
      };
    case CHANGE_BANK_ACCOUNT:
      return {
        ...state
      };
    case CHANGE_BANK_ACCOUNT_SUCCESS:
      return {
        ...state,
        info: true,
        editInfo: false,
        changePassword: false,
        changeBankId: false,
        changeBankIdStatus: action.result,
        changePasswordStatus: null
      };
    case CHANGE_BANK_ACCOUNT_FAIL:
      return {
        ...state,
        info: false,
        editInfo: false,
        changePassword: false,
        changeBankId: true,
        changeBankIdStatus: action.error,
        changePasswordStatus: null
      };
    case CONFIRM_EMAIL_MESSAGE:
      return {
        ...state,
        confirmEmailStatus: true,
        info: true,
        editInfo: false,
        changePassword: false,
        changeBankId: false,
        changeBankIdStatus: null,
        changePasswordStatus: null
      };
    case SEND_EMAIL_CONFIRMATION:
      return {
        ...state
      };
    case SEND_EMAIL_CONFIRMATION_SUCCESS:
      return {
        ...state
      };
    case SEND_EMAIL_CONFIRMATION_FAIL:
      return {
        ...state
      };
    case CONFIRM_EMAIL:
    case CONFIRM_EMAIL_SUCCESS:
    case CONFIRM_EMAIL_FAIL:
      return {
        ...state
      };
    default:
      return state;
  }
}

export function showInfo() {
  return {
    type: SHOW_INFO
  };
}

export function showEditInfo() {
  return {
    type: SHOW_EDIT_INFO
  };
}

export function showChangePassword() {
  return {
    type: SHOW_CHANGE_PASSWORD
  };
}

export function showChangeBankId() {
  return {
    type: SHOW_CHANGE_BANK_ID
  };
}

export function showConfirmEmailMessage() {
  return {
    type: CONFIRM_EMAIL_MESSAGE
  };
}

export function update(data) {
  return {
    types: [UPDATE, UPDATE_SUCCESS, UPDATE_FAIL],
    promise: (client) => client.post('/profile/update', { data })
  };
}

export function changePasswordReq(data) {
  return {
    types: [CHANGE_PASSWORD, CHANGE_PASSWORD_SUCCESS, CHANGE_PASSWORD_FAIL],
    promise: (client) => client.post('/profile/changePassword', { data })
  };
}

export function changeBankAccount(data) {
  return {
    types: [CHANGE_BANK_ACCOUNT, CHANGE_BANK_ACCOUNT_SUCCESS, CHANGE_BANK_ACCOUNT_FAIL],
    promise: (client) => client.post('/profile/changeBankAccount', { data })
  };
}

export function sendConfirmationEmail() {
  return {
    types: [SEND_EMAIL_CONFIRMATION, SEND_EMAIL_CONFIRMATION_SUCCESS, SEND_EMAIL_CONFIRMATION_FAIL],
    promise: (client) => client.post('/profile/sendConfirmationEmail')
  };
}

export function confirmEmail() {
  return {
    types: [CONFIRM_EMAIL, CONFIRM_EMAIL_SUCCESS, CONFIRM_EMAIL_FAIL],
    promise: (client) => client.post('/profile/confirmEmail')
  };
}
