import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import styled from "styled-components";
import { push } from "connected-react-router";
import { Menu } from "antd";
import "antd/dist/antd.css";

const LeftBarDiv = styled.div`
  height: calc(100vh - 60px);
  background-color: #4680c3;
  padding-top: 15px;
`;

class NavigationArea extends Component {
  handleClick = e => {
    if (e.key === " ") {
      e.key = "";
    }
    this.props._push(`/${e.key}`);
  };

  render() {
    const { location } = this.props;
    return (
      <LeftBarDiv>
        <Menu
          onClick={this.handleClick}
          defaultSelectedKeys={`['${location.pathname}']`}
        >
          <Menu.Item key=" ">Calendar</Menu.Item>
          <Menu.Item key="files">Files</Menu.Item>
          <Menu.Item key="communication">Mass Communication</Menu.Item>
          <Menu.Item key="usermanagement">User Management</Menu.Item>
          <Menu.Item key="inventory">Inventory</Menu.Item>
        </Menu>
      </LeftBarDiv>
    );
  }
}

// const mapStateToProps = state => ({
//   user: state.user
// })

const mapDispatchToProps = {
  _push: push
};

export default connect(null, mapDispatchToProps)(withRouter(NavigationArea));
//replace null with mapStateToProps to connect to the state variables
