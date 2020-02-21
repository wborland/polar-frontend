import React, { Component } from "react";
import { connect } from "react-redux";
import { push } from "connected-react-router";
import { Form, Icon, Input, Button, Checkbox, Divider } from 'antd';


class AddRoleFormComponent extends Component {


    render() {
        return (
            <div>
                <Form onSubmit={this.handleSubmit} className="login-form" style={{ background: "#FFFFFF", padding: "10vh", textAlign: "center" }}>
                    
                </Form>
            </div>
        )
    }
}

const AddRoleForm = Form.create({ name: 'AddRoleForm' })(AddRoleFormComponent);

const mapStoreToProps = state => {
    return {
        user: state.user,
        location: state.router.location
    };
};

const mapDispatchToProps = {
    _push: push
  };
  
export default connect(mapStoreToProps, mapDispatchToProps)(AddRoleForm);
//replace null with mapStateToProps to connect to the state variables

