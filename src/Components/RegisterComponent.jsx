import React, { Component } from "react";
import { connect } from "react-redux";
import { push } from "connected-react-router";
import { Form, Icon, Input, Button, Checkbox, Divider, Typography } from 'antd';
import userReducer, { userRegister } from "../Redux/user";

const { Title, Paragraph, Text } = Typography;

class RegisterComponent extends Component {
    constructor(props) {
        super(props);
        if(props.user.auth){
            props._push('/');
        }
        this.state = {
            validateStatus: null
        }
    }

    handleSubmit = e => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                // Send API request
                this.props._userRegister(values).then(() => {
                    this.setState({validateStatus: "error"})
                });
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
                    <Title>Registration</Title>
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
                    <Form.Item label="Password" hasFeedback validateStatus={this.state.validateStatus}>
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
                    <Form.Item label="Confirm Password" hasFeedback validateStatus={this.state.validateStatus}>
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
                    <Form.Item label="First Name" validateStatus={this.state.validateStatus}>
                        {getFieldDecorator('firstName', {
                            rules: [{ required: true, message: "Please enter your first name" }],
                        })(<Input />)}
                    </Form.Item>
                    <Form.Item label="Last Name" validateStatus={this.state.validateStatus}>
                        {getFieldDecorator('lastName', {
                            rules: [{ required: true, message: "Please enter your last name" }],
                        })(<Input />)}
                    </Form.Item>
                    <Form.Item label="Phone Number" validateStatus={this.state.validateStatus}>
                        {getFieldDecorator('phone', {
                            rules: [{ required: true, message: "Please enter your phone number" }],
                        })(<Input />)}
                    </Form.Item>
                    <Form.Item style={{ textAlign: "right" }}>
                        <Button type="primary" htmlType="submit" className="login-form-button">Login</Button>
                    </Form.Item>
                </Form>
            </div>
        )
    }
}

const RegisterForm = Form.create({ name: 'register' })(RegisterComponent);

const mapStoreToProps = state => {
    return {user: state.user};
};

const mapDispatchToProps = {
    _userRegister: userRegister,
    _push: push
  };
  

export default connect(mapStoreToProps, mapDispatchToProps)(RegisterForm);
  //replace null with mapStateToProps to connect to the state variables
