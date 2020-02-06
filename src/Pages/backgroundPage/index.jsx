import React, { Component } from "react";
import { Row, Col, Container } from "reactstrap";
import styled from "styled-components";
import NavigationArea from "./NavigationArea";
import Routing from "./Routing";
import TopBar from "./Topbar";

const FullArea = styled(Container)`
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  padding: 0px;
  margin: 0px;
  max-width: none;
`;

class BackgroundPage extends Component {
  render() {
    return (
      <FullArea>
        <TopBar />
        <Row>
          <Col
            className="d-none d-md-block d-sm-block d-lg-block"
            sm={4}
            md={4}
            lg={4}
            xl={3}
            xxl={2}
          >
            <NavigationArea />
          </Col>
          <Col xs={12} sm={8} xl={9} xxl={10}>
            <Routing />
          </Col>
        </Row>
      </FullArea>
    );
  }
}

export default BackgroundPage;
