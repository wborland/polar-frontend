import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { push } from "connected-react-router";
import { Layout, Menu, Icon } from 'antd';
import "antd/dist/antd.css";
import Routing from "./Routing";
import TopBar from "./Topbar";

const { Header, Content, Footer, Sider } = Layout;

class BackgroundPage extends Component {
  
  render() {
    const { location } = this.props;

    return (
      <Layout>
        <Header>
          <TopBar />
        </Header>
        <Layout style={{ minHeight: "88vh" }}>
          <Sider breakpoint="lg" collapsedWidth="0">
            <Menu theme="dark" mode="inline" defaultSelectedKeys={['calendar']}>
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
              <Menu.Item key="usermanagement" >
                <Icon type="team" />
                User Management
              </Menu.Item>
              <Menu.Item key="account">
                <Icon type="user" />
                Account
              </Menu.Item>
            </Menu>
          </Sider>
          <Layout>
            <Content>
              <Routing />
            </Content>
            <Footer style={{ textAlign: 'center' }}>
              Created by Polar ©2020
        </Footer>
          </Layout>

        </Layout>


      </Layout>
    );
  }
}

// const mapStateToProps = state => ({
//   user: state.user
// })

const mapDispatchToProps = {
  _push: push
};

export default connect(null, mapDispatchToProps)(withRouter(BackgroundPage));
//replace null with mapStateToProps to connect to the state variables
