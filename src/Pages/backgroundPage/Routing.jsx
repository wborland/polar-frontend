import React, { Component } from "react";
import { Switch, Route } from "react-router";
import { push } from "connected-react-router";
import { connect } from "react-redux";
import {getPermissions} from "../../Redux/permissions";

class BackgroundPage extends Component {
  constructor(props) {
    super(props);
    if(!props.user.auth) {
      props._push('/login');
    }
  }

  componentDidMount = () => {
    this.props._getPermissions();
  }

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
          render={() => <div style={{ height: "calc(100vh - 64px)" }} />}
        />
        {/* calendar */}
        <Route render={() => this.props._push("/login")} />
      </Switch>
    );
  }
}

const mapStoreToProps = state => {
  return {user: state.user, permissions: state.permissions};
};
const mapDispatchToProps = {
  _push: push,
  _getPermissions: getPermissions
};

export default connect(mapStoreToProps, mapDispatchToProps)(BackgroundPage);
