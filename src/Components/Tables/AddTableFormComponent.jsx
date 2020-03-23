import React, { Component } from "react";
import { connect } from "react-redux";
import { push } from "connected-react-router";
import { Form, Icon, Input, Button, Checkbox, Divider, Row, Col } from "antd";

class AddTableFormComponent extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount = () => {
    if (this.props.permissions) {
      let checkboxes = this.state.checkboxes;
      for (let key in this.props.permissions) {
        checkboxes.push(
          <Row>
            <Checkbox value={parseInt(key)}>
              {permissionsMapping[key]}
            </Checkbox>
          </Row>
        );
      }
      this.setState({ checkboxes: checkboxes });
    }
  };

  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        values.auth = this.props.user.auth;
        this.props._AddTable(values);
        this.props._gettableList(this.props.user.auth);
      }
    });
  };

  render() {
    const { getFieldDecorator } = this.props.form;

    return (
      <div>
        <Form
          layout={"vertical"}
          onSubmit={this.handleSubmit}
          className="login-form"
          style={{ background: "#FFFFFF" }}
        >
          <Form.Item label="Name of Table">
            {getFieldDecorator("tableName", {
              rules: [
                {
                  type: "string",
                  message: "Please enter alpha-numeric characters"
                },
                {
                  required: true,
                  message: "Please input a name for the table"
                }
              ]
            })(<Input />)}
          </Form.Item>
          <Form.Item label="Select Permissions for New table (some permissions may require others and will be automatically selected)">
            {getFieldDecorator("permissions", {
              valuePropName: "value",
              rules: [
                { required: true, message: "Select at least 1 Permission" }
              ]
            })(
              <Checkbox.Group onChange={this.handleChange}>
                {this.state.checkboxes}
              </Checkbox.Group>
            )}
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              className="login-form-button"
            >
              Submit
            </Button>
          </Form.Item>
        </Form>
      </div>
    );
  }
}

const AddTableForm = Form.create({ name: "AddTableForm" })(AddTableFormComponent);

const mapStoreToProps = state => {
  return {
    user: state.user,
    location: state.router.location,
    permissions: state.permissions
  };
};

const mapDispatchToProps = {
  _push: push,
  _AddTable: AddTable,
  _gettableList: gettableList
};

export default connect(mapStoreToProps, mapDispatchToProps)(AddTableForm);
//replace null with mapStateToProps to connect to the state variables
