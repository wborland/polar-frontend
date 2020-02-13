import React, { Component } from "react";
import { Row, Col } from "reactstrap";
import { connect } from "react-redux";
import styled from "styled-components";
import Polar from "../../Assets/polar.png";
import { Button, Dropdown, Menu } from "antd";
import { userLogout } from "../../Redux/user";

const LogoImage = styled.img`height: 60px;`;

const NewRow = styled(Row)`
  margin:0;
  background-color: #4680C3;
  width: 100vw;
  height: 60px;
`;

const AccountButton = styled(Button)`
  float: right;
  margin-top: 10px;
`;

class TopBar extends Component {
  menu = (
    <Menu>
      <Menu.Item>
        <div>Edit Profile</div>
      </Menu.Item>
      <Menu.Item>
        <div onClick={this.props._userLogout}>Logout</div>
      </Menu.Item>
    </Menu>
  );

  render() {
    return (
      <NewRow>
        <Col
          className="d-none d-md-block d-sm-block d-lg-block"
          sm={7}
          md={7}
          lg={7}
        >
          <LogoImage src={Polar} alt="Polar Logo" />
        </Col>
        <Col>
          <Dropdown overlay={this.menu}>
            <AccountButton
              size="large"
              type="primary"
              shape="circle"
              icon="user"
            />
          </Dropdown>
        </Col>
      </NewRow>
    );
  }
}

const mapDispatchToProps = {
  _userLogout: userLogout
};

export default connect(null, mapDispatchToProps)(TopBar);
