import React, { Component } from "react";
import { Switch, Route } from "react-router";
import { push } from "connected-react-router";
import { connect } from "react-redux";

class BackgroundPage extends Component {
  render() {
    return (
      <Switch>
        <Route path="/files" />
        <Route path="/communication" />
        <Route path="/usermanagement" />
        <Route path="/inventory" />
        <Route
          exact
          path="/"
          render={() => <div style={{ height: "calc(100vh - 60px)" }} />}
        />
        {/* calendar */}
        <Route render={() => this.props._push("/login")} />
      </Switch>
    );
  }
}

const mapDispatchToProps = {
  _push: push
};

export default connect(null, mapDispatchToProps)(BackgroundPage);
