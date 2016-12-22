const SIGNUP = 'shop-client/signup/SIGNUP';
const SIGNUP_SUCCESS = 'shop-client/signup/SIGNUP_SUCCESS';
const SIGNUP_FAIL = 'shop-client/signup/SIGNUP_FAIL';

const IS_VALID = 'shop-client/signup/IS_VALID';
const IS_VALID_SUCCESS = 'shop-client/signup/IS_VALID_SUCCESS';
const IS_VALID_FAIL = 'shop-client/signup/IS_VALID_FAIL';

const initialState = {
  saveError: null,
};

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case SIGNUP:
    case IS_VALID:
      return state;
    case SIGNUP_SUCCESS:
    case IS_VALID_SUCCESS:
      const data = [...state.data];
      // data[action.result.id - 1] = action.result;
      return {
        ...state,
        data: data,
        saveError: null,
      };
    case SIGNUP_FAIL:
    case IS_VALID_FAIL:
      return typeof action.error === 'string' ? {
        ...state,
        saveError: action.error
      } : state;
    default:
      return state;
  }
}

export function signup(data) {
  return {
    types: [SIGNUP, SIGNUP_SUCCESS, SIGNUP_FAIL],
    promise: (client) => client.post('/signup/signup', {
      data
    })
  };
}

export function isValidEmail(data) {
  return {
    types: [IS_VALID, IS_VALID_SUCCESS, IS_VALID_FAIL],
    promise: (client) => client.post('/signup/isValid', {
      data
    })
  };
}
