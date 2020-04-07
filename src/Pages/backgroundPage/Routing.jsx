import React, { Component } from "react";
import { Switch, Route } from "react-router";
import { push } from "connected-react-router";
import { connect } from "react-redux";
import UserManagement from "../userManagement";
import Files from "../files";
import Tables from "../Tables/Tables";
import MassCommunication from "../MassCommunication";
import EventsHome from "../Events/EventsHome";

class BackgroundPage extends Component {
  constructor(props) {
    super(props);
    if (!props.user.auth) {
      props._push("/login");
    }
    this.state = { menuItems: [] };
  }

  componentDidMount() {
    // Show nav options based on user permissions
    let userPerms = this.props.user.permissions;
    let menuItems = [];
    if (userPerms.includes(8)) {
      menuItems.push(
        <Route key={0} path="/inventory" render={() => <Tables />} />
      );
      this.setState({
        menuItems: menuItems
      });
    }
    menuItems.push(<Route key={1} path="/files" render={() => <Files />} />);
    this.setState({
      menuItems: menuItems
    });
    if (userPerms.includes(7)) {
      menuItems.push(<Route key={2} path="/communication" render={() => <MassCommunication />}/>);
      this.setState({
        menuItems: menuItems
      });
    }
    if (userPerms.includes(11)) {
      menuItems.push(
        <Route
          key={4}
          path="/usermanagement"
          render={() => <UserManagement />}
        />
      );
    }
    this.setState({
      menuItems: menuItems
    });
  }

  componentDidUpdate = prevProps => {
    if (prevProps.user.permissions != this.props.user.permissions) {
      this.componentDidMount();
    }
  };

  render() {
    return (
      <Switch>
        {this.state.menuItems}
        <Route
          exact
          path="/"
          render={() => <EventsHome />}
        />
        <Route
          path="/events"
          render={() => <EventsHome />}
        />
        {/* calendar */}
        <Route path="/login" render={() => this.props._push("/login")} />
      </Switch>
    );
  }
}

const mapStoreToProps = state => {
  return { user: state.user, permissions: state.permissions };
};
const mapDispatchToProps = {
  _push: push
};

export default connect(mapStoreToProps, mapDispatchToProps)(BackgroundPage);
