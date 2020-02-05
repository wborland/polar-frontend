import React from "react";
import { Switch, Route } from "react-router";
import "./App.css";
import BackgroundPage from "./Pages/backgroundPage";

function App() {
  return (
    <Switch>
      <Route path="/login" />
      <Route path="/password" />
      <Route path="/" render={() => <BackgroundPage />} />
    </Switch>
  );
}

export default App;
