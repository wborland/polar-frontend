import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { push } from "connected-react-router";
import { Table, Button, Skeleton } from "antd";
import "antd/dist/antd.css";

class UserView extends Component {
  render() {
    console.log(this.props);
    if (this.props.userList.listUsers.length === 0) {
      return <Skeleton active />;
    }
    return <div />;
  }
}

const mapStateToProps = state => ({
  userList: state.userList,
  user: state.user
});

const mapDispatchToProps = {
  _push: push
};

export default connect(mapStateToProps, mapDispatchToProps)(
  withRouter(UserView)
);
//replace null with mapStateToProps to connect to the state variables
