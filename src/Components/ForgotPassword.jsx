import React, { Component } from "react";
import { Icon, Input, Button, Divider, Modal, Typography, message } from 'antd';
import axios from 'axios';

const { Title, Paragraph } = Typography;

class ForgotPassword extends Component {
    constructor(props) {
        super(props);
        this.state = {
            visible: props.visible,
            email: ""
        }
    }

    componentDidUpdate = (prevProps, prevState, snapshot) => {
        if(prevProps.visible != this.props.visible){
            this.setState({visible: this.props.visible});
        }
    }

    onChange = (e) => {
        this.setState({email: e.target.value});
    }

    handleSubmit = (e) => {
        // Send password to email service
        if(this.validateEmail(this.state.email)) {
            axios
                .post("http://localhost:5000/user/forgotPassword", { 
                    email: this.state.email 
                }).then((res) => {
                    console.log("Email sent");
                    message.success("Please check your email to recover your password");
                    this.setState({ email: "", visible: false });
                }).catch(() => {
                    console.log("Unable to reset password");
                    message.error("Unable to reset password");
                    this.setState({ email: "", visible: false });
                })
        }
        // Hide Modal
        this.props.forgotPass(e);
        this.setState({ email: "", visible: false });
    }

    handleCancel = (e) => {
        // Hide Modal
        this.props.forgotPass(e);
        this.setState({ email: "", visible: false });
    }

    validateEmail = (email) => {
        var re = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
        return re.test(String(email).toLowerCase());
    }

    render() {
        return (
            <Modal
                visible={this.state.visible}
                title="Recover Password"
                onCancel={this.handleCancel}
                footer={[
                    <Button key="back" onClick={this.handleCancel}>
                      Back
                    </Button>,
                    <Button key="submit" type="primary" onClick={this.handleSubmit}>
                      Submit
                    </Button>,
                  ]}
            >
                <Title>Recover Password</Title>
                <Divider />
                <Paragraph>Don't worry! We'll email you a recovery link to reset your password.</Paragraph>
                <Input
                    placeholder="Enter your email"
                    prefix={<Icon type="mail"/>}
                    type="email"
                    allowClear={true}
                    value={this.state.email || ''}
                    onChange={this.onChange}
                    onPressEnter={this.handleSubmit}
                />            
                </Modal>
        )
    }
}

export default ForgotPassword;