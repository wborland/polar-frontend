import React, { Component } from "react";
import { Switch, Route } from "react-router";
import { push } from "connected-react-router";
import { connect } from "react-redux";
import UserManagement from "../userManagement";
import MassCommunication from "../MassCommunication";

class BackgroundPage extends Component {
  constructor(props) {
    super(props);
    if (!props.user.auth) {
      props._push("/login");
    }
    this.state = { menuItems: [] };
  }

  componentDidUpdate = prevProps => {
    if (prevProps.user.permissions != this.props.user.permissions) {
      // Show nav options based on user permissions
      let userPerms = this.props.user.permissions;
      let menuItems = [];
      if (userPerms.includes(1)) {
        menuItems.push(
          <Route path="/files" />
        );
      }
      if (userPerms.includes(7)) {
        menuItems.push(
          <Route path="/communication" render={() => <MassCommunication />} />
        );
      }
      if (userPerms.includes(11)) {
        menuItems.push(
          <Route path="/usermanagement" render={() => <UserManagement />} />
        );
      }
      this.setState({ menuItems: menuItems });
    }
  };

  render() {
    return (
      <Switch>
        {this.state.menuItems}
        <Route
          exact
          path="/"
          render={() => <div style={{ height: "calc(100vh - 64px)" }} />}
        />
        {/* calendar */}
        <Route path="/login" render={() => this.props._push("/login")} />
      </Switch>
    );
  }
}

const mapStoreToProps = state => {
  return {user: state.user, permissions: state.permissions};
};
const mapDispatchToProps = {
  _push: push
};

export default connect(mapStoreToProps, mapDispatchToProps)(BackgroundPage);
