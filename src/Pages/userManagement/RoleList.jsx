import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { push } from "connected-react-router";
import { Table, Button } from "antd";
import "antd/dist/antd.css";
import { updateFilterList } from "../../Redux/roles";

class RoleList extends Component {
  columns = [
    {
      title: "Role name",
      dataIndex: "rolename"
    },
    {
      title: "Permissions",
      dataIndex: "permissions"
    },
    {
      title: "Operations",
      dataIndex: "operations",
      render: (text, record) =>
        <Button onClick={() => console.log(record)}>Delete</Button>
    }
  ];

  rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      console.log(
        `selectedRowKeys: ${selectedRowKeys}`,
        "selectedRows: ",
        selectedRows
      );
      this.props._updateFilterList(selectedRows);
    }
  };

  render() {
    return (
      <div>
        <Table
          rowSelection={this.rowSelection}
          dataSource={this.props.roles.listRoles}
          columns={this.columns}
        />
      </div>
    );
  }
}

const mapStateToProps = state => ({
  roles: state.roles
});

const mapDispatchToProps = {
  _push: push,
  _updateFilterList: updateFilterList
};

export default connect(mapStateToProps, mapDispatchToProps)(
  withRouter(RoleList)
);
//replace null with mapStateToProps to connect to the state variables
