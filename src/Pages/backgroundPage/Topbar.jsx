import React, { Component } from "react";
import { Row, Col } from "reactstrap";
import { connect } from "react-redux";
import styled from "styled-components";
import Polar from "../../Assets/polar.png";
import { Button, Dropdown, Menu } from "antd";
import { userLogout } from "../../Redux/user";
import { updateDialog } from "../../Redux/dialog";
import Profile from "../../Components/profile";

const LogoImage = styled.img`
  height: 60px;
  margin-top: -2px;
  padding-left: 0px;
`;

const AccountButton = styled(Button)`
  float: right;
  margin-top: 10px;
`;

class TopBar extends Component {
  menu = (
    <Menu>
      <Menu.Item>
        <div
          onClick={() =>
            this.props._updateDialog(true, {
              title: "Edit Profile",
              content: <Profile />
            })}
        >
          Edit Profile
        </div>
      </Menu.Item>
      <Menu.Item>
        <div onClick={this.props._userLogout}>Logout</div>
      </Menu.Item>
    </Menu>
  );

  render() {
    return (
      <Row>
        <Col className="d-none d-md-block d-sm-block d-lg-block" sm={7}>
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
      </Row>
    );
  }
}

const mapDispatchToProps = {
  _userLogout: userLogout,
  _updateDialog: updateDialog
};

export default connect(null, mapDispatchToProps)(TopBar);
