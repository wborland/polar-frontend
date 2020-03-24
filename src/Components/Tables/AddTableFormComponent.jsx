import React, { Component } from "react";
import { connect } from "react-redux";
import { push } from "connected-react-router";
import { Form, Icon, Input, Button, Checkbox, Divider, Row, Col } from "antd";

class AddTableFormComponent extends Component {
  constructor(props) {
    super(props);
  }

  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log("Add Table Form Values:", values);
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
          <Form.Item label="Column Names" extra="Enter each column name on a new line">
            {getFieldDecorator('columns', {
              rules: [
                {
                  required: true,
                  message: 'Please enter column names, with each name on a new line',
                },
              ],
            })(<TextArea
              autoSize={{ minRows: 4, maxRows: 20 }}
            />)}
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
  };
};

const mapDispatchToProps = {
  _push: push,
};

export default connect(mapStoreToProps, mapDispatchToProps)(AddTableForm);
//replace null with mapStateToProps to connect to the state variables