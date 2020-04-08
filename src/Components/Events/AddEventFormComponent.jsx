import React, { Component } from "react";
import { connect } from "react-redux";
import { push } from "connected-react-router";
import { Form, Input, Button, DatePicker, Icon, Divider, Radio, message } from "antd";
import { updateDialog } from "../../Redux/dialog";

const {RangePicker} = DatePicker;
const { TextArea } = Input;
let id = 0;

class AddEventFormComponent extends Component {
  constructor(props) {
    super(props);
  }

  removeReminders = (e) => {
    const { form } = this.props;
    // can use data-binding to get
    const reminders = form.getFieldValue('reminders');
    // We need at least one passenger
    if (reminders.length === 0) {
      return;
    }

    // can use data-binding to set
    form.setFieldsValue({
      reminders: reminders.filter(reminder => reminder !== e),
    });
  };

  addReminders = () => {
    const { form } = this.props;
    // can use data-binding to get
    const reminders = form.getFieldValue('reminders');
    const nextKeys = reminders.concat(id++);
    // can use data-binding to set
    // important! notify form to detect changes
    form.setFieldsValue({
      reminders: nextKeys,
    });
  };


  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        //TODO: Make API request
        console.log("values", values);
      }
    });
  };

  render() {
    const { getFieldDecorator, getFieldValue } = this.props.form;

    getFieldDecorator('reminders', {initialValue: []});
    const reminders = getFieldValue('reminders');
    const disabledOpt = reminders.length == 0;
    const formItems = reminders.map((k, index) =>(
      <Form.Item
        required={false}
        key={k}
      >
        {getFieldDecorator('remindersArr['+k+']', {
          rules: [
            {
              required: true,
              message: "Please enter a date and time or remove this field"
            }
          ]
        })
        (
          <DatePicker showTime={{ format: 'HH:mm A', use12Hours: true }} format="LLL" />
        )
        }
        <Divider type="vertical"/>
        <Icon
          className="dynamic-delete-button"
          type="minus-circle-o"
          onClick={() => this.removeReminders(k)}
        />
      </Form.Item>
    ));

    return (
      <div>
        <Form
          layout={"vertical"}
          onSubmit={this.handleSubmit}
          className="login-form"
          style={{ background: "#FFFFFF" }}
        >
          <Form.Item label="Name of Event">
            {getFieldDecorator("eventName", {
              rules: [
                {
                  type: "string",
                  pattern: "^[a-zA-Z0-9 ]+$",
                  message: "Please enter letters or numbers only"
                },
                {
                  required: true,
                  message: "Please input a name for the event"
                }
              ]
            })(<Input />)}
          </Form.Item>
          <Form.Item label="Description">
            {getFieldDecorator('description', {
              rules: [
                {
                  type: "string",
                  message: "Please user valid characters for the description"
                },
                {
                  required: true,
                  message: "Please enter a description for the event",
                },
              ],
            })(<TextArea
              autoSize={{ minRows: 2, maxRows: 10 }}
            />)}
          </Form.Item>
          <Form.Item label="Time of Event">
          {getFieldDecorator('eventTime', {
              rules: [
                {
                  required: true,
                  message: "Please enter a time for the event",
                },
              ],
            })(<RangePicker showTime={{ format: 'HH:mm A', use12Hours: true }} format="LLL" />)}
          </Form.Item>
          <Form.Item label="Reminders">
            <Button onClick={this.addReminders}>
              <Icon type="plus" /> Add Reminder
            </Button>
          </Form.Item>
          {formItems}
          <Form.Item label="Reminder Type">
            {getFieldDecorator('reminderType', {rules: [{required: (disabledOpt ? false: true), message: "Please select reminder type"}]})(
              <Radio.Group disabled={disabledOpt}>
                <Radio.Button value="email">Email</Radio.Button>
                <Radio.Button value="text">Text</Radio.Button>
              </Radio.Group>,
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

const AddEventForm = Form.create({ name: "AddRoleForm" })(AddEventFormComponent);

const mapStoreToProps = state => {
  return {
    user: state.user
  };
};

const mapDispatchToProps = {
  _push: push,
  _updateDialog: updateDialog,
};

export default connect(mapStoreToProps, mapDispatchToProps)(AddEventForm);
//replace null with mapStateToProps to connect to the state variables