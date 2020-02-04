import React, { Component } from "react";
import { Row, Col } from "antd";
import styled from "styled-components";

const TopBarDiv = styled.div`
  background-color: #608bf6;
  width: 100vw;
  height: 60px;
`;

const LeftBarDiv = styled.div`
  height: calc(100vh - 60px);
  background-color: #608bf6;
`;

class BackgroundPage extends Component {
  render() {
    return (
      <div>
        <Row>
          <TopBarDiv />
        </Row>
        <Row>
          <Col span={8}>
            <LeftBarDiv />
          </Col>
          <Col span={16} />
        </Row>
      </div>
    );
  }
}

export default BackgroundPage;
