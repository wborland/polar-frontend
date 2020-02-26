import React, { Component } from "react";
import { Collapse } from "antd";
import "antd/dist/antd.css";
import RoleList from "./RoleList";
import UserList from "./UserList";
import AddRoleButton from "../../Components/Roles/AddRoleButton";
import InviteUserButton from "../../Components/Users/InviteUserButton";

const { Panel } = Collapse;

class UserManagement extends Component {
  render() {
    return (
      <div style={{ height: "calc(100vh - 64px)" }}>
        <Collapse>
          <Panel forceRender header="Roles" extra={<AddRoleButton />}>
            <RoleList />
          </Panel>
          <Panel forceRender header="Users" extra={<InviteUserButton />}>
            <UserList />
          </Panel>
        </Collapse>
      </div>
    );
  }
}

export default UserManagement;
//replace null with mapStateToProps to connect to the state variables
