import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { push } from "connected-react-router";
import { Table, Button, Skeleton } from "antd";
import "antd/dist/antd.css";
import { updateFilterList, deleteRole, getRoleList } from "../../Redux/roles";
import { updateDialog } from "../../Redux/dialog";
import { getUserList } from "../../Redux/listUsers";

class RoleList extends Component {
  constructor(props) {
    super(props);
    this.state = {roleData: []}
  }

  columns = [
    {
      title: "Role name",
      dataIndex: "roleName"
    },
    {
      title: "Permissions",
      dataIndex: "permissions"
    },
    {
      title: "Operations",
      dataIndex: "operations",
      render: (text, record) =>
        <Button
          onClick={() =>
            this.props._updateDialog(true, {
              title: "Delete Role",
              content: this.dialogContent(record)
            })}
        >
          Delete
        </Button>
    }
  ];

  componentDidMount = () => {
    this.props._getRoleList(this.props.user.auth);
    this.setState({"roleData": this.props.roles.listRoles});
  };

  componentDidUpdate = (prevProps) => {
    if(this.props.roles.listRoles != prevProps.roles.listRoles) {
      this.setState({"roleData": this.props.roles.listRoles});
    }
  }

  dialogContent = role => {
    return (
      <div>
        <p>
          Are you sure you want to delete {role.roleName}?
        </p>
        <Button
          style={{ marginRight: "15px" }}
          onClick={() => this.props._updateDialog(false, null)}
        >
          No
        </Button>
        <Button onClick={() => this.props._deleteRole({auth: this.props.user.auth, roleId: role.key})}>Yes</Button>
      </div>
    );
  };

  rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      this.props._updateFilterList(selectedRows);
    }
  };

  render() {
    if (this.props.roles.listRoles.length === 0) {
      return <Skeleton active />;
    }
    return (
      <div>
        <Table
          rowSelection={this.rowSelection}
          dataSource={this.state.roleData}
          columns={this.columns}
        />
      </div>
    );
  }
}

const mapStateToProps = state => ({
  roles: state.roles,
  user: state.user
});

const mapDispatchToProps = {
  _push: push,
  _updateFilterList: updateFilterList,
  _updateDialog: updateDialog,
  _deleteRole: deleteRole,
  _getRoleList: getRoleList,
  _getUserList: getUserList
};

export default connect(mapStateToProps, mapDispatchToProps)(
  withRouter(RoleList)
);
//replace null with mapStateToProps to connect to the state variables
