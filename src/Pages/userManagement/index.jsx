import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { push } from "connected-react-router";
import { Layout, Menu, Icon, Collapse } from "antd";
import "antd/dist/antd.css";

const { Panel } = Collapse;

class UserManagement extends Component {
  render() {
    return (
      <div style={{ height: "calc(100vh - 64px)" }}>
        <Collapse>
          <Panel header="Roles">ldkjfalsd</Panel>
          <Panel header="Users">daslkfjl</Panel>
        </Collapse>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  user: state.user
});

const mapDispatchToProps = {
  _push: push
};

export default connect(null, mapDispatchToProps)(withRouter(UserManagement));
//replace null with mapStateToProps to connect to the state variables
