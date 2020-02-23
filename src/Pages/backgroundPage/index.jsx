import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { push } from "connected-react-router";
import { Layout, Menu, Icon } from "antd";
import "antd/dist/antd.css";
import Routing from "./Routing";
import TopBar from "./Topbar";
import { getUserInfo } from "../../Redux/user";
import { getPermissions } from "../../Redux/permissions";

const { Header, Content, Sider } = Layout;

class BackgroundPage extends Component {
  constructor(props) {
    super(props);
    if (!props.user.auth) {
      props._push('/login');
    }
    this.state = { menuItems: [] }
  }

  componentDidMount = () => {
    if (!this.props.user.auth) {
      this.props._push('/login');
    } else {
      this.props._getUser(this.props.user.auth);
      // Request All Permissions
      if (Object.entries(this.props.permissions).length === 0) {
        this.props._getPermissions();
      }
    }
  }

  componentDidUpdate = (prevProps) => {
    if (prevProps.user.permissions != this.props.user.permissions) {
      // Show nav options based on user permissions
      let userPerms = this.props.user.permissions;
      let menuItems = this.state.menuItems;
      if (userPerms.includes(8)) {
        menuItems.push(
          <Menu.Item key="inventory">
            <Icon type="table" />
            Inventory
          </Menu.Item>
        );
        this.setState({ "menuItems": menuItems });
      }
      if (userPerms.includes(1)) {
        menuItems.push(
          <Menu.Item key="files">
            <Icon type="file" />
            Files
          </Menu.Item>
        );
        this.setState({ "menuItems": menuItems });
      }
      if (userPerms.includes(7)) {
        menuItems.push(
          <Menu.Item key="communication">
            <Icon type="message" />
            Mass Communication
          </Menu.Item>
        );
        this.setState({ "menuItems": menuItems });
      }
      if (userPerms.includes(11)) {
        menuItems.push(
          <Menu.Item key="usermanagement">
            <Icon type="team" />
            User Management
          </Menu.Item>
        );
      }
      this.setState({ "menuItems": menuItems });
    }

  }

  handleClick = e => {
    if (e.key === "calendar") {
      e.key = "";
    }
    this.props._push(`/${e.key}`);
  };

  getCurrentPage = () => {
    if (window.location.pathname.indexOf("/inventory") === 0) {
      return ["inventory"];
    } else if (window.location.pathname.indexOf("/files") === 0) {
      return ["files"];
    } else if (window.location.pathname.indexOf("/communication") === 0) {
      return ["communication"];
    } else if (window.location.pathname.indexOf("/usermanagement") === 0) {
      return ["usermanagement"];
    } else {
      return ["calendar"];
    }
  };

  render() {

    return (
      <Layout>
        <Header>
          <TopBar />
        </Header>
        <Layout style={{ minHeight: "88vh" }}>
          <Sider breakpoint="lg" collapsedWidth="0">
            <Menu
              theme="dark"
              mode="inline"
              selectedKeys={this.getCurrentPage()}
              onClick={this.handleClick}
            >
              <Menu.Item key="calendar">
                <Icon type="calendar" />
                Calendar
              </Menu.Item>
              {this.state.menuItems ? this.state.menuItems.map((route) => route) : ""}
            </Menu>
          </Sider>
          <Layout>
            <Content>
              <Routing />
            </Content>
          </Layout>
        </Layout>
      </Layout>
    );
  }
}

const mapStateToProps = state => ({
  user: state.user,
  permissions: state.permissions
})

const mapDispatchToProps = {
  _push: push,
  _getUser: getUserInfo,
  _getPermissions: getPermissions
};

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(BackgroundPage));
//replace null with mapStateToProps to connect to the state variables
