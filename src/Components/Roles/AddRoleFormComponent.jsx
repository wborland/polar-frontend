import React, { Component } from "react";
import { connect } from "react-redux";
import { push } from "connected-react-router";
import { Form, Icon, Input, Button, Checkbox, Divider, Row, Col } from 'antd';
import {addRole} from "../../Redux/roles/index";
import {permissionsMapping} from "../../Assets/Constants";

class AddRoleFormComponent extends Component {
    constructor(props) {
        super(props);
        this.state = { checkboxes: [] }
    }

    componentDidMount = () => {
        if (this.props.permissions) {
            let checkboxes = this.state.checkboxes;
            for (let key in this.props.permissions) {
                checkboxes.push(<Row><Checkbox value={parseInt(key)}>{permissionsMapping[key]}</Checkbox></Row>)
            }
            this.setState({ "checkboxes": checkboxes });
        }
    }

    handleChange = (permissions) => {
        if (permissions.includes(2) && !permissions.includes(1)) {
            permissions.push(1);
            this.props.form.setFieldsValue({ "permissions": permissions })
        }
        if(permissions.includes(9)) {
            if(!permissions.includes(10)) {
                permissions.push(10);
                this.props.form.setFieldsValue({ "permissions": permissions })
            }
            if(!permissions.includes(8)) {
                permissions.push(8);
                this.props.form.setFieldsValue({ "permissions": permissions })
            }
        }
        if(permissions.includes(10)) {
            if(!permissions.includes(8)) {
                permissions.push(8);
                this.props.form.setFieldsValue({ "permissions": permissions })
            }
        }
        if(permissions.includes(3) && !permissions.includes(4)) {
            permissions.push(4);
            this.props.form.setFieldsValue({ "permissions": permissions })
        }
    }

    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                values.auth = this.props.user.auth;
                this.props._addRole(values);
            }
        });
    }

    render() {

        const { getFieldDecorator } = this.props.form;

        return (
            <div>
                <Form layout={"vertical"} onSubmit={this.handleSubmit} className="login-form" style={{ background: "#FFFFFF" }}>
                    <Form.Item label="Name of Role">
                        {getFieldDecorator('roleName', {
                            rules: [
                                {
                                    type: 'string',
                                    message: 'Please enter alpha-numeric characters',
                                },
                                {
                                    required: true,
                                    message: 'Please input a name for the role',
                                },
                            ],
                        })(<Input />)}
                    </Form.Item>
                    <Form.Item label="Select Permissions for New Role (some permissions may require others and will be automatically selected)">
                        {getFieldDecorator('permissions', { valuePropName: "value", rules: [{required: true, message: 'Select at least 1 Permission'}] })(
                            <Checkbox.Group onChange={this.handleChange}>
                                {this.state.checkboxes}
                            </Checkbox.Group>,
                        )}
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" htmlType="submit" className="login-form-button">Submit</Button>
                    </Form.Item>
                </Form>
            </div>
        )
    }
}

const AddRoleForm = Form.create({ name: 'AddRoleForm' })(AddRoleFormComponent);

const mapStoreToProps = state => {
    return {
        user: state.user,
        location: state.router.location,
        permissions: state.permissions
    };
};

const mapDispatchToProps = {
    _push: push,
    _addRole: addRole
};

export default connect(mapStoreToProps, mapDispatchToProps)(AddRoleForm);
//replace null with mapStateToProps to connect to the state variables

