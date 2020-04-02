import React, { Component } from "react";
import { connect } from "react-redux";
import { push } from "connected-react-router";
import { Form, Input, Button, message } from "antd";
import axios from 'axios';

class AddColsFormComponent extends Component {
  constructor(props) {
    super(props);
  }

  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        let reqBody = {
          auth: this.props.user.auth,
          tableId: this.props.tableId,
          columnName: values.column
        }
        axios.post('/table/addColumn', reqBody)
          .then((response) => {
            message.success("Added column")
          }).catch((err) => {
            message.error("Failed to add:" + values.column);
          });
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
          <Form.Item label="Column Name">
            {getFieldDecorator('column', {
              rules: [
                {
                  type: "string",
                  pattern: "^[a-zA-Z0-9]+$",
                  message: "Please enter letters or numbers only"
                },
                {
                  required: true,
                  message: 'Please enter column names, with each name on a new line',
                },
              ],
            })(<Input
            />)}
          </Form.Item>
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              className="login-form-button"
            >
              Add
            </Button>
          </Form.Item>
        </Form>
      </div>
    );
  }
}

const AddColsForm = Form.create({ name: "AddTableForm" })(AddColsFormComponent);

const mapStoreToProps = state => {
  return {
    user: state.user,
    location: state.router.location,
  };
};

const mapDispatchToProps = {
  _push: push
};

export default connect(mapStoreToProps, mapDispatchToProps)(AddColsForm);
//replace null with mapStateToProps to connect to the state variables