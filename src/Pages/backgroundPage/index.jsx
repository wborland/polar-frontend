import React, { Component } from "react";
import { Row, Col } from "antd";
import styled from "styled-components";
import { Switch, Route } from "react-router";
import Polar from "./polar.png";

const TopBarDiv = styled.div`
  background-color: #608bf6;
  width: 100vw;
  height: 60px;
`;

const LeftBarDiv = styled.div`
  height: calc(100vh - 60px);
  background-color: #608bf6;
`;

const LogoImage = styled.img`
  height: 60px;
  padding-left: 15px;
`;

const FullArea = styled.div`
  width: 100vw;
  height: 100vh;
  overflow: hidden;
`;

class BackgroundPage extends Component {
  render() {
    return (
      <FullArea>
        <Row>
          <TopBarDiv>
            <LogoImage src={Polar} alt="Polar Logo" />
          </TopBarDiv>
        </Row>
        <Row type="flex">
          <Col xs={0} sm={8} md={8} lg={8} xl={8}>
            <LeftBarDiv />
          </Col>
          <Col xs={24} sm={16} md={16} lg={16} xl={16}>
            <Switch>
              <Route path="/files" />
              <Route path="/communication" />
              <Route path="/usermanagement" />
              <Route path="/inventory" />
              <Route
                path="/"
                render={() => <div style={{ height: "calc(100vh - 60px)" }} />}
              />{" "}
              {/* calendar */}
            </Switch>
          </Col>
        </Row>
      </FullArea>
    );
  }
}

export default BackgroundPage;
