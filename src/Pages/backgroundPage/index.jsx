import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { push } from "connected-react-router";
import { Layout, Menu, Icon } from "antd";
import "antd/dist/antd.css";
import Routing from "./Routing";
import TopBar from "./Topbar";
import { getUserInfo } from "../../Redux/user";

const { Header, Content, Sider } = Layout;

class BackgroundPage extends Component {
  constructor(props) {
    super(props); 
    if(!props.user.auth){
        props._push('/login');
    }
  }

  componentDidMount = () => {
    if(!this.props.user.auth) {
      this.props._push('/login');
    } else {
      this.props._getUser(this.props.user.auth);
    }
  }

  componentDidUpdate = (prevProps) => {
    console.log(this.props);
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
              <Menu.Item key="inventory">
                <Icon type="table" />
                Inventory
              </Menu.Item>
              <Menu.Item key="files">
                <Icon type="file" />
                Files
              </Menu.Item>
              <Menu.Item key="communication">
                <Icon type="message" />
                Mass Communication
              </Menu.Item>
              <Menu.Item key="usermanagement">
                <Icon type="team" />
                User Management
              </Menu.Item>
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
  user: state.user
})

const mapDispatchToProps = {
  _push: push,
  _getUser: getUserInfo
};

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(BackgroundPage));
//replace null with mapStateToProps to connect to the state variables
