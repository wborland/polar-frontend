import React, { Component } from "react";
import { Form, Icon, Input, Button, Checkbox, Divider } from 'antd';
import ForgotPassword from "./ForgotPassword";

class LoginComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showForgotPasswordModal: false
        }
    }

    handleSubmit = e => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                console.log('Form Data: ', values);
                // Send API request
            }
        });
    };

    forgotPass = (e) => {
        e.preventDefault();
        this.setState({ showForgotPasswordModal: !this.state.showForgotPasswordModal }, console.log("test,", this.state.showForgotPasswordModal));
    }


    render() {
        const { getFieldDecorator } = this.props.form;

        return (
            <div>
                <Form onSubmit={this.handleSubmit} className="login-form" style={{ background: "#FFFFFF", padding: "10vh", textAlign: "center" }}>
                    <h1>Login</h1>
                    <Divider />
                    <Form.Item>
                        {getFieldDecorator('username', {
                            rules: [{ required: true, message: 'Please input your username' }],
                        })(
                            <Input
                                prefix={<Icon type="user" />}
                                placeholder="Username"
                            />
                        )}

                    </Form.Item>
                    <Form.Item>
                        {getFieldDecorator('password', {
                            rules: [{ required: true, message: 'Please input your password' }],
                        })(
                            <Input
                                prefix={<Icon type="lock" />}
                                type="password"
                                placeholder="Password"
                            />
                        )}
                    </Form.Item>
                    <Form.Item>
                        {getFieldDecorator('remember', {
                            valuePropName: 'checked',
                            initialValue: true,
                        })(
                            <Checkbox>Remember me</Checkbox>
                        )}
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit" className="login-form-button">Login</Button>
                    </Form.Item>
                    <Form.Item>
                        <a className="login-form-forgot" href="" onClick={this.forgotPass}>Forgot password</a>
                        <Divider type="vertical" />
                        <a href="">Register now</a>
                    </Form.Item>
                </Form>
                <ForgotPassword visible={this.state.showForgotPasswordModal} forgotPass={this.forgotPass}/>
            </div>
        )
    }
}

const LoginForm = Form.create({ name: 'login' })(LoginComponent);


export default LoginForm;