import React, { Component } from "react";
import { Row, Col, Container } from "reactstrap";
import styled from "styled-components";
import Polar from "../../Assets/polar.png";
import NavigationArea from "./NavigationArea";
import Routing from "./Routing";

const TopBarDiv = styled.div`
  background-color: #608bf6;
  width: 100vw;
  height: 60px;
`;

const LogoImage = styled.img`
  height: 60px;
  padding-left: 15px;
`;

const FullArea = styled(Container)`
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  padding: 0px;
  margin: 0px;
  max-width: none;
`;

const NewRow = styled(Row)`
  margin:0;
`;

class BackgroundPage extends Component {
  render() {
    return (
      <FullArea>
        <NewRow>
          <TopBarDiv>
            <LogoImage src={Polar} alt="Polar Logo" />
          </TopBarDiv>
        </NewRow>
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
