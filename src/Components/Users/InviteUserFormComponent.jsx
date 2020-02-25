import React, { Component } from "react";
import { connect } from "react-redux";
import { push } from "connected-react-router";
import { Form, Icon, Input, Button, Select} from 'antd';
import {inviteUser} from "../../Redux/user/index";
import { getRoleList } from "../../Redux/roles";

const { Option } = Select;

class InviteUserFormComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {roles: []}
    }

    componentDidMount = () => {
        this.props._getRoleList(this.props.user.auth);
    }

    componentDidUpdate = (prevProps) => {
        if (this.props.roles.listRoles != prevProps.roles.listRoles) {
            let rolesArr = this.props.roles.listRoles
            let roles = this.state.roles;
            for(let i in rolesArr) {
                roles.push(<Option value={parseInt(rolesArr[i].key)}>{rolesArr[i].roleName}</Option>)
            }
            this.setState({"roles": roles});
        }
    }


    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                values.auth = this.props.user.auth;
                if(!values.roles) {
                    values.roles = [];
                }
                this.props._inviteUser(values);
            }
        });
    }

    render() {
        const { getFieldDecorator } = this.props.form;
        return (
            <div>
                <Form layout={"vertical"} onSubmit={this.handleSubmit} className="login-form" style={{ background: "#FFFFFF" }}>
                    <Form.Item label="Enter the email of the person you would like to invite">
                        {getFieldDecorator('email', {
                            rules: [
                                {
                                    type: 'email',
                                    message: 'Please enter a valid email',
                                },
                                {
                                    required: true,
                                    message: 'Please input an email',
                                },
                            ],
                        })(<Input />)}
                    </Form.Item>
                    <Form.Item label="Select roles for the new user to be added to">
                        {getFieldDecorator('roles', {
                            rules: [
                                {type: 'array' },
                            ],
                        })(
                            <Select mode="multiple" placeholder="Please select at least 1 role">
                                {this.state.roles}
                            </Select>
                        )}
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" htmlType="submit" className="login-form-button">Invite</Button>
                    </Form.Item>
                </Form>
            </div>
        )
    }
}

const InviteUserForm = Form.create({ name: 'InviteUserForm' })(InviteUserFormComponent);

const mapStoreToProps = state => {
    return {
        user: state.user,
        roles: state.roles
    };
};

const mapDispatchToProps = {
    _push: push,
    _inviteUser: inviteUser,
    _getRoleList: getRoleList
};

export default connect(mapStoreToProps, mapDispatchToProps)(InviteUserForm);
//replace null with mapStateToProps to connect to the state variables

