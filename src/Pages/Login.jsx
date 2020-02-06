import React, { Component } from "react";
import { Form, Icon, Input, Button, Checkbox, Row, Col, Typography, Layout, Menu} from 'antd';
import Polar from "../Assets/polar.png";
import styled from "styled-components";

const { Title, Paragraph, Text } = Typography;
const { Header, Content, Footer } = Layout;

const MainImage = styled.img`
  max-height: 15vh;
  margin: 15px;
`;
const LogoImage = styled.img`
  height: 60px;
  padding: 5px;
  padding-right: 15px;
`;

class Login extends Component {

    render() {
        return (
            <Layout>
                <Header>
                    <Menu theme="dark" mode="horizontal" defaultSelectedKeys={['1']}>
                        <LogoImage src={Polar} alt="Polar Logo" />

                        <Menu.Item key="1">Home</Menu.Item>
                    </Menu>
                </Header>
                <Content>
                    <div style={{ backgroundColor: "#608bf6", overflow: "hidden", paddingTop: "10vh" }}>
                        <Row type="flex" justify="center" gutter={[{ xs: 8, sm: 16, md: 24, lg: 32 }, 20]} style={{ minHeight: "88vh" }}>
                            <Col span={12}>
                                <Row type="flex" justify="center" alight="middle">
                                    <h1>Welcome to Polar for:</h1>
                                </Row>
                                <Row type="flex" justify="center">
                                    <Title>Will's Favorite Band Organization</Title>
                                </Row>
                                <Row type="flex" justify="center" alight="middle" style={{textAlign: "left"}}>
                                    <h5>We provide an all in one organizational management services for any organization.
                                    <br/>Our current services include:
                                        <ul>
                                            <li>User Management</li>
                                            <li>Inventory Management</li>
                                            <li>Mass Communication Services</li>
                                            <li>File Sharing</li>
                                            <li>Event Management</li>
                                        </ul>
                                    </h5>
                                </Row>
                            </Col>
                            <Col span={10} offset={2}>
                                <Row type="flex" justify="center" align="middle">
                                    <Form onSubmit={this.handleSubmit} className="login-form" style={{ background: "#FFFFFF", padding: "10vh", textAlign: "center", borderRadius: "0.5vw"}}>
                                        <h1>Login</h1>
                                        <Form.Item>
                                            <Input
                                                prefix={<Icon type="user" />}
                                                placeholder="Username"
                                            />
                                        </Form.Item>
                                        <Form.Item>
                                            <Input
                                                prefix={<Icon type="lock" />}
                                                type="password"
                                                placeholder="Password"
                                            />
                                        </Form.Item>
                                        <Form.Item>
                                            <Checkbox>Remember me</Checkbox>
                                        </Form.Item>
                                        <Form.Item>
                                            <a className="login-form-forgot" href="">Forgot password</a>
                                        </Form.Item>
                                        <Form.Item>
                                            <Button type="primary" htmlType="submit" className="login-form-button">Log in</Button>
                                        </Form.Item>
                                        <Form.Item>
                                            Or <a href="">register now!</a>
                                        </Form.Item>
                                    </Form>
                                </Row>


                            </Col>
                        </Row>
                    </div>
                </Content>
                <Footer style={{ textAlign: 'center' }}>Created by Polar ©2020</Footer>
            </Layout>

        )
    }
}

export default Login;