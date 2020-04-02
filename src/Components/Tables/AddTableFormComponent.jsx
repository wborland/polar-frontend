import React, { Component } from "react";
import { connect } from "react-redux";
import { push } from "connected-react-router";
import { Form, Input, Button, message } from "antd";
import axios from 'axios';
import { updateDialog } from "../../Redux/dialog";
import { getTableList } from "../../Redux/tables";

const { TextArea } = Input;

class AddTableFormComponent extends Component {
  constructor(props) {
    super(props);
  }

  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        let cols  = values.columns.split("\n");
        cols = cols.map((col) => col.trim());
        values.columns =  cols.filter(Boolean);
        values.auth = this.props.user.auth;
        axios.post("/table/create", values)
          .then((response) => {
            this.props._updateDialog(false, null);
            message.success("Table Created");
            this.props._getTableList(this.props.user.auth);
          }).catch((err) => {
            message.error("Failed to create table");
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
          <Form.Item label="Name of Table">
            {getFieldDecorator("tableName", {
              rules: [
                {
                  type: "string",
                  pattern: "^[a-zA-Z0-9 ]+$",
                  message: "Please enter letters or numbers only"
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
                  type: "string",
                  pattern: "^[a-zA-Z0-9()\n\r ]+$",
                  message: "Please enter letters or numbers only"
                },
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
  _updateDialog: updateDialog,
  _getTableList: getTableList,

};

export default connect(mapStoreToProps, mapDispatchToProps)(AddTableForm);
//replace null with mapStateToProps to connect to the state variables