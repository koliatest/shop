const LOAD = 'shop-client/orders/LOAD';
const LOAD_SUCCESS = 'shop-client/orders/LOAD_SUCCESS';
const LOAD_FAIL = 'shop-client/orders/LOAD_FAIL';

const SET_DATA = 'shop-client/orders/SET_DATA';

const initialState = {
  loaded: false
};

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case LOAD:
      return {
        ...state,
        loading: true
      };
    case LOAD_SUCCESS:
      return {
        ...state,
        loading: false,
        loaded: true,
        data: action.result,
        error: null
      };
    case LOAD_FAIL:
      return {
        ...state,
        loading: false,
        loaded: false,
        data: null,
        error: action.error
      };
    case SET_DATA:
      return {
        ...state,
        data: action.payload.data
      };
    default:
      return state;
  }
}

export function isLoaded(globalState) {
  return globalState.orders && globalState.orders.loaded;
}

export function load() {
  return {
    types: [LOAD, LOAD_SUCCESS, LOAD_FAIL],
    promise: (client) => client.get('/loadOrders')
  };
}

export function setData(data) {
  return {
    type: SET_DATA,
    payload: { data }
  };
}
