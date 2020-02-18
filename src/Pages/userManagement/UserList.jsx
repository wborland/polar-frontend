import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { push } from "connected-react-router";
import { Table, Button } from "antd";
import "antd/dist/antd.css";
import { updateFilterList } from "../../Redux/roles";

class UserList extends Component {
  columns = [
    {
      title: "First Name",
      dataIndex: "firstName"
    },
    {
      title: "Last Name",
      dataIndex: "lastName"
    },
    {
      title: "Phone",
      dataIndex: "phone"
    },
    {
      title: "Email",
      dataIndex: "email"
    },
    {
      title: "Operations",
      dataIndex: "operation",
      render: (text, record) =>
        <div>
          <Button onClick={() => console.log(record.email)}>View User</Button>
        </div>
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
  userList: state.userList
});

const mapDispatchToProps = {
  _push: push,
  _updateFilterList: updateFilterList
};

export default connect(mapStateToProps, mapDispatchToProps)(
  withRouter(UserList)
);
//replace null with mapStateToProps to connect to the state variables
