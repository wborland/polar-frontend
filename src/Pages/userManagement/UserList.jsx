import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { push } from "connected-react-router";
import { Table, Button, Skeleton } from "antd";
import "antd/dist/antd.css";
import { getUserList } from "../../Redux/listUsers";

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

  componentDidMount = () => {
    this.props._getUserList(this.props.user.auth);
  };

  render() {
    if (this.props.userList.listUsers.length === 0) {
      return <Skeleton active />;
    }
    return (
      <div>
        <Table
          dataSource={this.props.userList.showUsers}
          columns={this.columns}
        />
      </div>
    );
  }
}

const mapStateToProps = state => ({
  userList: state.userList,
  user: state.user
});

const mapDispatchToProps = {
  _push: push,
  _getUserList: getUserList
};

export default connect(mapStateToProps, mapDispatchToProps)(
  withRouter(UserList)
);
//replace null with mapStateToProps to connect to the state variables
