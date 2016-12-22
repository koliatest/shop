const LOAD = 'shop-client/cart/LOAD';
const LOAD_SUCCESS = 'shop-client/cart/LOAD_SUCCESS';
const LOAD_FAIL = 'shop-client/cart/LOAD_FAIL';

const DELETE = 'shop-client/cart/DELETE';
const DELETE_SUCCESS = 'shop-client/cart/DELETE_SUCCESS';
const DELETE_FAIL = 'shop-client/cart/DELETE_FAIL';

const UPDATE_QUANTITY = 'shop-client/cart/UPDATE_QUANTITY';
const UPDATE_QUANTITY_SUCCESS = 'shop-client/cart/UPDATE_QUANTITY_SUCCESS';
const UPDATE_QUANTITY_FAIL = 'shop-client/cart/UPDATE_QUANTITY_FAIL';

const CHECK_QUANTITY = 'shop-client/cart/CHECK_QUANTITY';
const CHECK_QUANTITY_SUCCESS = 'shop-client/cart/CHECK_QUANTITY_SUCCESS';
const CHECK_QUANTITY_FAIL = 'shop-client/cart/CHECK_QUANTITY_FAIL';

const PAY = 'shop-client/cart/PAY';
const PAY_SUCCESS = 'shop-client/cart/PAY_SUCCESS';
const PAY_FAIL = 'shop-client/cart/PAY_FAIL';

const ADD_PRODUCT_TO_CART = 'shop-client/cart/ADD_PRODUCT_TO_CART';
const ADD_PRODUCT_TO_CART_SUCCESS = 'shop-client/cart/ADD_PRODUCT_TO_CART_SUCCESS';
const ADD_PRODUCT_TO_CART_FAIL = 'shop-client/cart/ADD_PRODUCT_TO_CART_FAIL';

const SET_PAY_STATUS = 'shop-client/cart/SET_PAY_STATUS';
const SET_VALID_QUANTITY = 'shop-client/cart/SET_VALID_QUANTITY';

const initialState = {
  loaded: false,
  validQuantity: null,
  payStatus: null,
  prevPath: null
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
    case DELETE:
      return {
        ...state
      };
    case DELETE_SUCCESS:
      return {
        ...state,
        data: action.result,
        error: null
      };
    case DELETE_FAIL:
      return {
        ...state,
        error: action.error
      };
    case UPDATE_QUANTITY:
      return {
        ...state
      };
    case UPDATE_QUANTITY_SUCCESS:
      return {
        ...state,
        data: action.result,
        error: null
      };
    case UPDATE_QUANTITY_FAIL:
      return {
        ...state,
        error: action.error
      };
    case CHECK_QUANTITY:
      return {
        ...state
      };
    case CHECK_QUANTITY_SUCCESS:
      return {
        ...state,
        validQuantity: action.result,
        error: null
      };
    case CHECK_QUANTITY_FAIL:
      return {
        ...state,
        validQuantity: action.error
      };
    case PAY:
      return {
        ...state
      };
    case PAY_SUCCESS:
      return {
        ...state,
        payStatus: action.result,
        data: null
      };
    case PAY_FAIL:
      return {
        ...state,
        payStatus: action.error
      };
    case ADD_PRODUCT_TO_CART:
      return state;
    case ADD_PRODUCT_TO_CART_SUCCESS:
      return {
        ...state,
        data: action.result,
        error: null,
      };
    case ADD_PRODUCT_TO_CART_FAIL:
      return {
        ...state,
        error: action.error
      };
    case SET_PAY_STATUS: {
      return {
        ...state,
        payStatus: action.payload.status
      };
    }
    case SET_VALID_QUANTITY: {
      return {
        ...state,
        validQuantity: action.payload.value
      };
    }
    default:
      return state;
  }
}

export function isLoaded(globalState) {
  return globalState.cart && globalState.cart.loaded;
}

export function load() {
  return {
    types: [LOAD, LOAD_SUCCESS, LOAD_FAIL],
    promise: (client) => client.get('/cart/load')
  };
}

export function deleteProduct(data) {
  return {
    types: [DELETE, DELETE_SUCCESS, DELETE_FAIL],
    promise: (client) => client.post('/cart/deleteProduct', {
      data
    })
  };
}

export function updateQuantity(data) {
  return {
    types: [UPDATE_QUANTITY, UPDATE_QUANTITY_SUCCESS, UPDATE_QUANTITY_FAIL],
    promise: (client) => client.post('/cart/updateQuantity', {
      data
    })
  };
}

export function checkQuantity(data) {
  return {
    types: [CHECK_QUANTITY, CHECK_QUANTITY_SUCCESS, CHECK_QUANTITY_FAIL],
    promise: (client) => client.post('/cart/checkQuantity', {
      data
    })
  };
}

export function pay(data) {
  return {
    types: [PAY, PAY_SUCCESS, PAY_FAIL],
    promise: (client) => client.post('/cart/pay', { data })
  };
}

export function addProductToCart(data) {
  return {
    types: [ADD_PRODUCT_TO_CART, ADD_PRODUCT_TO_CART_SUCCESS, ADD_PRODUCT_TO_CART_FAIL],
    promise: (client) => client.post('/cart/addProduct', {
      data
    })
  };
}

export function setPayStatus(status) {
  return {
    type: SET_PAY_STATUS,
    payload: { status }
  };
}

export function setValidQuantity(value) {
  return {
    type: SET_VALID_QUANTITY,
    payload: { value }
  };
}
