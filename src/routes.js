import React from 'react';
import {IndexRoute, Route, BrowserHistory} from 'react-router';
import { isLoaded as isAuthLoaded, load as loadAuth } from 'redux/modules/auth';
import {
    App,
    Home,
    About,
    Login,
    Signup,
    LoginSuccess,
    NotFound,
    Profile,
    Cart,
    Checkout,
    Orders,
    VerifyEmail,
    AttachInfo,
    AttachBank
  } from './containers';

export default (store) => {
  const requireLogin = (nextState, replace, cb) => {
    function checkAuth() {
      const { auth: { user }} = store.getState();
      if (!user) {
        // oops, not logged in, so can't be here!
        replace('/');
      }
      cb();
    }

    if (!isAuthLoaded(store.getState())) {
      store.dispatch(loadAuth()).then(checkAuth);
    } else {
      checkAuth();
    }
  };

  /**
   * Please keep routes in alphabetical order
   */
  return (
    <Route history={BrowserHistory} path="/" component={App}>
      { /* Home (main) route */ }
      <IndexRoute component={Home}/>

      { /* Routes requiring login */ }
      <Route onEnter={requireLogin}>
        <Route path="loginSuccess" component={LoginSuccess}/>
        <Route path="/profile" component={Profile} />
        <Route path="/cart" component={Cart} />
        <Route path="/orders" component={Orders} />
        <Route path="checkout" component={Checkout} />
        <Route path="verify/:id" component={VerifyEmail} />
        <Route path="attach-info" component={AttachInfo} />
        <Route path="attach-bank" component={AttachBank} />
      </Route>

      { /* Routes */ }
      <Route path="about" component={About}/>
      <Route path="/login" component={Login}/>
      <Route path="/signup" component={Signup}/>

      { /* Catch all route */ }
      <Route path="*" component={NotFound} status={404} />
    </Route>
  );
};
