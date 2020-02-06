import React from "react";
import { Switch, Route } from "react-router";
import logo from "./logo.svg";
import "./App.css";
import BackgroundPage from "./Pages/backgroundPage";
import Login from "./Pages/Login";

function App() {
  return (
    <Switch>
      <Route path="/login" render={() => <Login />}/>
      <Route path="/password" />
      <Route path="/" render={() => <BackgroundPage />} />
    </Switch>
  );
}

export default App;
