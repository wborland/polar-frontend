import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { push } from "connected-react-router";
import { Row, Col, Typography, Layout, Menu, Divider } from 'antd';
import Polar from "../Assets/polar.png";
import styled from "styled-components";
import {organizationName} from "../Assets/Constants";
import ResetPasswordForm from "../Components/ResetPasswordComponent";

const { Title, Paragraph, Text } = Typography;
const { Header, Content, Footer } = Layout;

const LogoImage = styled.img`
  height: 60px;
  padding: 5px;
  padding-right: 10px;
`;

class Register extends Component {

    render() {
        return (
            <Layout>
                <Header>
                    <Menu
                        theme="dark"
                        mode="horizontal"
                    >
                        <LogoImage src={Polar} alt="Polar Logo" />
                    </Menu>
                </Header>
                <Content>
                        <Row type="flex" justify="center" style={{ minHeight: "88vh" }}>
                            <Col span={20} style={{margin: "5vh"}}>
                                <Row type="flex" justify="center" alight="middle" style={{ textAlign: "center" }}>
                                        <h3 style={{ textAlign: "center"}}>Welcome to Polar for {organizationName}!</h3>
                                        <Divider />
                                </Row>
                                <Row type="flex" justify="center" alight="middle" >
                                    <Col span={16}>
                                        <ResetPasswordForm />
                                    </Col>
                                    
                                </Row>
                            </Col>
                        </Row>
                </Content>
                <Footer style={{ textAlign: 'center' }}>Created by Polar ©2020</Footer>
            </Layout>

        )
    }
}

export default Register;