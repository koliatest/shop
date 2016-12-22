import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';
import {reducer as reduxAsyncConnect} from 'redux-async-connect';

import auth from './auth';
import {reducer as form} from 'redux-form';
import userSignup from './signup';
import cart from './cart';
import orders from './orders';
import bankAPI from './bankAPI';
import profile from './profile';

export default combineReducers({
  routing: routerReducer,
  reduxAsyncConnect,
  auth,
  form,
  userSignup,
  cart,
  orders,
  bankAPI,
  profile
});
