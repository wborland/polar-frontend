import React, { Component } from "react";
import { connect } from "react-redux";
import { push } from "connected-react-router";
import { Form, Icon, Input, Button, Checkbox, Divider, Typography } from 'antd';
import axios from 'axios';
import { resetPassword } from "../Redux/user";

const { Title, Paragraph, Text } = Typography;

class ResetPasswordComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            validateStatus: null
        }
    }

    handleSubmit = e => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                console.log("token", this.props.location.query.token);
                let requestBody = {
                    "token": this.props.location.query.token,
                    "email": values.email,
                    "newPassword": values.password
                }
                this.props._resetPassword(requestBody);
            }
        });
    };

    handleConfirmBlur = e => {
        const { value } = e.target;
        this.setState({ confirmDirty: this.state.confirmDirty || !!value });
    };

    compareToFirstPassword = (rule, value, callback) => {
        const { form } = this.props;
        if (value && value !== form.getFieldValue('password')) {
            callback('Passwords do not match');
        } else {
            callback();
        }
    };

    validateToNextPassword = (rule, value, callback) => {
        const { form } = this.props;
        if (value && this.state.confirmDirty) {
            form.validateFields(['confirm'], { force: true });
        }
        callback();
    };



    render() {
        const formItemLayout = {
            labelCol: {
                md: { span: 24 },
                lg: { span: 8 },
            },
            wrapperCol: {
                md: { span: 24 },
                lg: { span: 16 },
            },
        };
        const { getFieldDecorator } = this.props.form;

        return (
            <div style={{textAlign: "center"}}>

                <Form {...formItemLayout} onSubmit={this.handleSubmit} className="login-form" style={{ background: "#FFFFFF",  padding:"5vh", borderRadius: "5px"}}>
                    <Title>Reset Password</Title>
                    <Divider />
                    <Form.Item label="Email" validateStatus={this.state.validateStatus}>
                        {getFieldDecorator('email', {
                            rules: [
                                {
                                    type: 'email',
                                    message: 'Please enter a valid email',
                                },
                                {
                                    required: true,
                                    message: 'Please enter your email!',
                                },
                            ],
                        })(<Input />)}
                    </Form.Item>
                    <Form.Item label="New Password" hasFeedback validateStatus={this.state.validateStatus}>
                        {getFieldDecorator('password', {
                            rules: [
                                {
                                    required: true,
                                    message: 'Please enter a password',
                                },
                                {
                                    validator: this.validateToNextPassword,
                                },
                            ],
                        })(<Input.Password />)}
                    </Form.Item>
                    <Form.Item label="Confirm New Password" hasFeedback validateStatus={this.state.validateStatus}>
                        {getFieldDecorator('confirm', {
                            rules: [
                                {
                                    required: true,
                                    message: 'Please confirm your password',
                                },
                                {
                                    validator: this.compareToFirstPassword,
                                },
                            ],
                        })(<Input.Password onBlur={this.handleConfirmBlur} />)}
                    </Form.Item>
                    <Form.Item style={{ textAlign: "right" }}>
                        <Button type="primary" htmlType="submit" className="login-form-button">Submit</Button>
                    </Form.Item>
                </Form>
            </div>
        )
    }
}

const ResetPasswordForm = Form.create({ name: 'register' })(ResetPasswordComponent);

const mapStoreToProps = state => {
    return {
        location: state.router.location
    };
};

const mapDispatchToProps = {
    _push: push,
    _resetPassword: resetPassword
};
  

export default connect(mapStoreToProps, mapDispatchToProps)(ResetPasswordForm);