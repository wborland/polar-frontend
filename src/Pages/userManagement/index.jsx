import React, { Component } from "react";
import { Collapse } from "antd";
import "antd/dist/antd.css";
import RoleList from "./RoleList";
import UserList from "./UserList";
import AddRoleButton from '../../Components/Roles/AddRoleButton';
import InviteUserButton from '../../Components/Users/InviteUserButton';

const { Panel } = Collapse;

class UserManagement extends Component {
  constructor (props) {
    super(props);
  }

  render() {
    return (
      <div style={{ height: "calc(100vh - 64px)" }}>
        <Collapse>
          <Panel header="Roles">
            <RoleList />
            <AddRoleButton />
          </Panel>
          <Panel header="Users">
            <UserList />
            <InviteUserButton />
          </Panel>
        </Collapse>
      </div>
    );
  }
}

export default UserManagement;
//replace null with mapStateToProps to connect to the state variables
