import React, { Component } from "react";
import { connect } from "react-redux";
import { push } from "connected-react-router";
import { Form, Icon, Input, Button, Checkbox, Divider } from 'antd';
import ForgotPassword from "./ForgotPassword";
import userReducer, {userLogin} from "../Redux/user";
import StoreTable from "antd/lib/table/Table";

class LoginComponent extends Component {
    constructor(props) {
        super(props); 
        if(props.user.auth){
            props._push('/');
        }
        this.state = {
            showForgotPasswordModal: false,
            validateStatus: null
        }
    }


    handleSubmit = async (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                this.props._userLogin(values).then(() => {
                    this.setState({validateStatus: "error"});
                });     

            }
        });
    };

    forgotPass = (e) => {
        e.preventDefault();
        this.setState({ showForgotPasswordModal: !this.state.showForgotPasswordModal });
    }


    render() {
        const { getFieldDecorator } = this.props.form;

        return (
            <div>
                <Form onSubmit={this.handleSubmit} className="login-form" style={{ background: "#FFFFFF", padding: "10vh", textAlign: "center" }}>
                    <h1>Login</h1>
                    <Divider />
                    <Form.Item validateStatus={this.state.validateStatus}>
                        {getFieldDecorator('email', {
                            rules: [{ required: true, message: 'Please input your email' }, {type: "email", message: "Please enter an email"}],
                        })(
                            <Input
                                prefix={<Icon type="user" />}
                                placeholder="Username"
                            />
                        )}

                    </Form.Item>
                    <Form.Item validateStatus={this.state.validateStatus}>
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

const mapStoreToProps = state => {
    return {user: state.user};
};

const mapDispatchToProps = {
    _userLogin: userLogin,
    _push: push
  };
  
export default connect(mapStoreToProps, mapDispatchToProps)(LoginForm);
//replace null with mapStateToProps to connect to the state variables

