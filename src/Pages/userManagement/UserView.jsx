import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { push } from "connected-react-router";
import { Select, Skeleton } from "antd";
import "antd/dist/antd.css";
import { assignRole, revokeRole } from "../../Redux/listUsers";

const { Option } = Select;

class UserView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      permissions: []
    };
  }

  componentDidMount = () => {
    let roleTemp = [];
    for (let i in this.props.userList.specificUser.roles) {
      if (this.props.userList.specificUser.roles[i] == null) continue;
      roleTemp.push(`${this.props.userList.specificUser.roles[i]}`);
    }
    this.setState({ permissions: roleTemp });
  };

  getChildren = () => {
    let tempChildren = [];
    for (let i in this.props.roles.listRoles) {
      let currRole = this.props.roles.listRoles[i];
      tempChildren.push(
        <Option key={currRole.key} label={currRole.roleName}>
          {currRole.roleName}
        </Option>
      );
    }
    return tempChildren;
  };

  handleChange = value => {
    //check removed
    for (let i in this.state.permissions) {
      if (!value.includes(this.state.permissions[i])) {
        //call remove role
        this.props._revokeRole(
          this.props.user.auth,
          this.state.permissions[i],
          this.props.userList.specificUser.key
        );
      }
    }
    //check added
    for (let i in value) {
      if (!this.state.permissions.includes(value[i])) {
        //call add role
        this.props._assignRole(
          this.props.user.auth,
          value[i],
          this.props.userList.specificUser.key
        );
      }
    }
    this.setState({ permissions: value });
  };

  render() {
    if (this.props.userList.specificUser === null) {
      return <Skeleton active />;
    }
    return (
      <div>
        <h5>
          Name: {this.props.userList.specificUser.firstName}{" "}
          {this.props.userList.specificUser.lastName}
        </h5>
        <h5>
          Email: {this.props.userList.specificUser.email}
        </h5>
        <h5>
          Phone Number: {this.props.userList.specificUser.phone || "N/A"}
        </h5>
        <h5>Roles</h5>
        <Select
          mode="multiple"
          style={{ width: "100%" }}
          placeholder="Select Roles"
          value={this.state.permissions}
          onChange={this.handleChange}
          optionFilterProp="label"
        >
          {this.getChildren()}
        </Select>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  userList: state.userList,
  roles: state.roles,
  user: state.user
});

const mapDispatchToProps = {
  _push: push,
  _assignRole: assignRole,
  _revokeRole: revokeRole
};

export default connect(mapStateToProps, mapDispatchToProps)(
  withRouter(UserView)
);
//replace null with mapStateToProps to connect to the state variables
