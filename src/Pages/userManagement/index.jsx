import React, { Component } from "react";
import { Collapse } from "antd";
import "antd/dist/antd.css";
import RoleList from "./RoleList";
import UserList from "./UserList";

const { Panel } = Collapse;

class UserManagement extends Component {
  render() {
    return (
      <div style={{ height: "calc(100vh - 64px)" }}>
        <Collapse>
          <Panel header="Roles">
            <RoleList />
          </Panel>
          <Panel header="Users">
            <UserList />
          </Panel>
        </Collapse>
      </div>
    );
  }
}

export default UserManagement;
//replace null with mapStateToProps to connect to the state variables
