const ATTACH_BANK = 'shop-client/bankAPI/ATTACH_BANK';
const ATTACH_BANK_SUCCESS = 'shop-client/bankAPI/ATTACH_BANK_SUCCESS';
const ATTACH_BANK_FAIL = 'shop-client/bankAPI/ATTACH_BANK_FAIL';

const GET_CARDS = 'shop-client/bankAPI/GET_CARDS';
const GET_CARDS_SUCCESS = 'shop-client/bankAPI/GET_CARDS_SUCCESS';
const GET_CARDS_FAIL = 'shop-client/bankAPI/GET_CARDS_FAIL';

const initialState = {
  data: null,
  error: null,
  loaded: false,
  loadingCards: false,
  loadingUserId: false
};

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case ATTACH_BANK:
      return {
        ...state,
        loadingUserId: true
      };
    case ATTACH_BANK_SUCCESS:
      return {
        ...state,
        data: action.result,
        loadingUserId: false
      };
    case ATTACH_BANK_FAIL:
      return {
        ...state,
        error: action.error,
        loadingUserId: false
      };
    case GET_CARDS:
      return {
        ...state,
        loadingCards: true
      };
    case GET_CARDS_SUCCESS:
      return {
        ...state,
        cards: action.result,
        error: null,
        loaded: true,
        loadingCards: false
      };
    case GET_CARDS_FAIL:
      return {
        ...state,
        cards: null,
        error: action.error,
        loaded: false,
        loadingCards: false
      };
    default:
      return state;
  }
}

export function attachBank(data) {
  return {
    types: [ATTACH_BANK, ATTACH_BANK_SUCCESS, ATTACH_BANK_FAIL],
    promise: (client) => client.post('/attachBank', {
      data
    })
  };
}

export function isLoaded(globalState) {
  return globalState.bankAPI && globalState.bankAPI.loaded;
}

export function getCards() {
  return {
    types: [GET_CARDS, GET_CARDS_SUCCESS, GET_CARDS_FAIL],
    promise: (client) => client.post('/getUserCards')
  };
}
