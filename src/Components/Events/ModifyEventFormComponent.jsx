import React, { Component } from "react";
import { connect } from "react-redux";
import { push } from "connected-react-router";
import { Form, Input, Button, DatePicker, Icon, Divider, Radio, Switch, message } from "antd";
import { updateDialog } from "../../Redux/dialog";
import moment from "moment";
import axios from "axios";
import { getEventById } from "../../Redux/events";

const { RangePicker } = DatePicker;
const { TextArea } = Input;
let id = 0;

class ModifyEventFormComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showRSVP: this.props.currEvent.rsvp.questions.length !== 0,
    }
    id = this.props.currEvent.rsvp.questions.length;
  }

  removeReminders = (e) => {
    const { form } = this.props;
    // can use data-binding to get
    const reminders = form.getFieldValue('reminders');
    if (reminders.length === 0) {
      return;
    }
   
    // can use data-binding to set
    form.setFieldsValue({
      reminders: [],
    });
  };

  addReminders = () => {
    const { form } = this.props;
    // can use data-binding to get
    const reminders = form.getFieldValue('reminders');
    if(reminders.length < 1) {
      const nextKeys = reminders.concat(0);
      // can use data-binding to set
      // important! notify form to detect changes
      form.setFieldsValue({
        reminders: nextKeys,
      });
    }
  };

  removeRSVP = (e) => {
    const { form } = this.props;
    // can use data-binding to get
    const rsvpQuestions = form.getFieldValue('rsvpQuestions');
    // We need at least one passenger
    if (rsvpQuestions.length === 0) {
      return;
    }
    // can use data-binding to set
    form.setFieldsValue({
      rsvpQuestions: rsvpQuestions.filter(rsvpQuestion => rsvpQuestion !== e),
    });
  };

  addRSVP = () => {
    const { form } = this.props;
    // can use data-binding to get
    const rsvpQuestions = form.getFieldValue('rsvpQuestions');
    const nextKeys = rsvpQuestions.concat(id++);
    // can use data-binding to set
    // important! notify form to detect changes
    form.setFieldsValue({
      rsvpQuestions: nextKeys,
    });
  };

  showRSVPForm = (checked) => {
    this.setState({ showRSVP: checked });
  }

  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log("Test", values);
        let startTime = values.eventTime[0];
        let endTime = values.eventTime[1];
        // Validate start and end
        if(moment(startTime).isBefore(moment()) || moment(endTime).isBefore(moment())) {
          message.error("Please set the start and end dates for the event after the current time");
          return;
        }
        // Validate reminder  time
        let reminderTime = -1;
        if(values.remindersArr && values.remindersArr.length > 0) {
          if(moment(values.remindersArr[0]).isBefore(moment())) {
            message.error("Please set the reminder after the current time!");
            return;
          }
          reminderTime = moment(startTime).diff(moment(values.remindersArr[0]), 'minutes');
          if(reminderTime < 0) {
            message.error("Cannot make a reminder after the event has started!");
            return;
          }
        }
        // Weed out empty keyed stuff in the array
        let questions = [];
        if(values.rsvpQuestionsArr && values.rsvpQuestionsArr.length !== 0) {
          questions = values.rsvpQuestionsArr.filter((val) =>{
            return val != false;
          });
        }
        let json = {
          "auth": this.props.user.auth,
          "id": this.props.currEvent.id,
          "name": values.name,
          "desc": values.desc,
          "startTime": moment(startTime).utc(),
          "endTime": moment(endTime).utc(),
          "location": values.location,
          "reminder": reminderTime === -1 ? 0 : 1,
          "reminderTime": reminderTime,
          "questions": questions
        }
        axios.post('/event/modify', json)
        .then((response) => {
          message.success("Event modified!");
          this.props._updateDialog(false, null);
          this.props._getEventById({ auth: this.props.user.auth, id: this.props.currEvent.id });
        }).catch((error) => {
          message.error("Failed to modify event");
        });
      }
    });
  };

  render() {
    const { getFieldDecorator, getFieldValue } = this.props.form;
    getFieldDecorator('reminders', { initialValue: [] });
    const reminders = getFieldValue('reminders');
    const disabledOpt = reminders.length == 0;
    const formItems = reminders.map((k, index) => (
      <Form.Item
        required={false}
        key={k}
      >
        {getFieldDecorator('remindersArr[' + k + ']', {
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
        <Divider type="vertical" />
        <Icon
          className="dynamic-delete-button"
          type="minus-circle-o"
          onClick={() => this.removeReminders(k)}
        />
      </Form.Item>
    ));
    
    getFieldDecorator('rsvpQuestions', { initialValue: this.props.currEvent.rsvp.questions.length === 0 ? [] : [...Array(this.props.currEvent.rsvp.questions.length).keys()] });
    const rsvp = getFieldValue('rsvpQuestions');
    const rsvpItems = rsvp.map((k, index) => (
      <Form.Item
        required={false}
        key={k}
      >
        {getFieldDecorator('rsvpQuestionsArr[' + k + ']', {
          initialValue: this.props.currEvent.rsvp.questions.length === 0 ? "" : this.props.currEvent.rsvp.questions[index],
          rules: [
            {
              type: "string",
              message: "Please enter valid characters only"
            },
            {
              required: true,
              message: "Please enter a question or remove this field"
            }
          ]
        })
          (
            <Input style={{width: "80%"}} />
          )
        }
        <Divider type="vertical" />
        <Icon
          className="dynamic-delete-button"
          type="minus-circle-o"
          onClick={() => this.removeRSVP(k)}
        />
      </Form.Item>
    ));

    return (
      <div>
        <Form
          layout={"vertical"}
          onSubmit={this.handleSubmit}
          className="login-form"
          style={{ background: "#FFFFFF", marginTop: "10px" }}
        >
          <Form.Item label="Name of Event">
            {getFieldDecorator("name", {
              initialValue: this.props.currEvent.name,
              rules: [
                {
                  type: "string",
                  //pattern: "^[a-zA-Z0-9 ]+$",
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
            {getFieldDecorator('desc', {
              initialValue: this.props.currEvent.desc,
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
              initialValue: [moment(this.props.currEvent.startTime), moment(this.props.currEvent.endTime)],
              rules: [
                {
                  required: true,
                  message: "Please enter a time for the event",
                },
              ],
            })(
              <RangePicker 
              showTime={{ format: 'HH:mm A', use12Hours: true }} 
              format="LLL" 
              />
            )}
          </Form.Item>
          <Form.Item label="Event Location">
            {getFieldDecorator("location", {
              initialValue: this.props.currEvent.location,
              rules: [
                {
                  type: "string",
                  //pattern: "^[a-zA-Z0-9 ]+$",
                  message: "Please enter letters or numbers only"
                },
              ]
            })(<Input />)}
          </Form.Item>
          <Form.Item label="Reminders">
            <Button onClick={this.addReminders}>
              <Icon type="plus" /> Add Reminder
            </Button>
          </Form.Item>
          {formItems}
          <Divider />
          <Form.Item label="Use RSVP Form?">
            <Switch defaultChecked={this.props.currEvent.rsvp.questions.length === 0 ? false : true} onChange={this.showRSVPForm} checkedChildren={"Yes"} unCheckedChildren={"No"} />
          </Form.Item>
          {this.state.showRSVP ? 
            <Form.Item label="RSVP Questions:" extra="Questions will shown in the same order as you create them">
              <Button onClick={this.addRSVP}>
                <Icon type="plus" /> Add Question
              </Button>
            </Form.Item>
            :
            ""
          }
          {this.state.showRSVP ? 
            rsvpItems
            :
            ""
          }
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

const ModifyEventForm = Form.create({ name: "ModifyEventForm" })(ModifyEventFormComponent);

const mapStoreToProps = state => {
  return {
    user: state.user,
    currEvent: state.events.currEvent
  };
};

const mapDispatchToProps = {
  _push: push,
  _updateDialog: updateDialog,
  _getEventById: getEventById,
};

export default connect(mapStoreToProps, mapDispatchToProps)(ModifyEventForm);
//replace null with mapStateToProps to connect to the state variables