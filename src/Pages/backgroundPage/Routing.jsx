import React, { Component } from "react";
import { Switch, Route } from "react-router";
import { push } from "connected-react-router";
import { connect } from "react-redux";
import UserManagement from "../userManagement";

class BackgroundPage extends Component {
  constructor(props) {
    super(props);
    if (!props.user.auth) {
      props._push("/login");
    }
  }

  render() {
    return (
      <Switch>
        <Route path="/files" />
        <Route path="/communication" />
        <Route path="/usermanagement" render={() => <UserManagement />} />
        <Route path="/inventory" />
        <Route
          exact
          path="/"
          render={() => <div style={{ height: "calc(100vh - 64px)" }} />}
        />
        {/* calendar */}
        <Route render={() => this.props._push("/login")} />
      </Switch>
    );
  }
}

const mapStoreToProps = state => {
  return { user: state.user };
};
const mapDispatchToProps = {
  _push: push
};

export default connect(mapStoreToProps, mapDispatchToProps)(BackgroundPage);
