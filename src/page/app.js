import React from "react";
import { hot } from "react-hot-loader";

import BDTab from "./tab";
import BDUser from "./user";
import BDDetail from "./detail";
import BDAbout from "./about";
import BDLogin from "./login";
import BDAddress from "./address";
import BDAddressedit from "./addressedit";
import BDOrder from "./order";
import BDReg from "./reg";
import ChildRegister from './childregister';

import { HashRouter as Router, Route, Link } from "react-router-dom";

const App = () => (
  <Router>
    <div>
      <Route path="/test/:id" component={BDAddressedit} />
      <Route path="/user" component={BDUser} />
      <Route path="/detail" component={BDDetail} />
      <Route path="/about" component={BDAbout} />
      <Route path="/login" component={BDLogin} />
      <Route path="/address" component={BDAddress} />
      <Route path="/addressedit" component={BDAddressedit} />
      <Route path="/order" component={BDOrder} />
      <Route path="/reg" component={BDReg} />
      <Route path="/childregister/:parentid/:company" component={ChildRegister} />
    </div>
  </Router>

  //  <BDTab />
);

export default hot(module)(App);
