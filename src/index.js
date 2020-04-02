import React from "react";
import ReactDOM from "react-dom";
import { ConnectedRouter } from "connected-react-router";
import { Provider } from "react-redux";
import "./index.css";
import App from "./App";
import * as serviceWorker from "./serviceWorker";
import configureStore, { history } from "./Redux/store";
import axios from "axios";

axios.defaults.baseURL = "https://api.polarapp.xyz";

const store = configureStore({});

// const path = (/#!(\/.*)$/.exec(history.location.hash) || [])[1];
// if (path) {
//     history.replace(path);
// }

ReactDOM.render(
  <Provider store={store}>
    <ConnectedRouter history={history}>
      <App />
    </ConnectedRouter>
  </Provider>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
