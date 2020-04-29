import React, { Component } from "react";
import { connect } from "react-redux";
import { push } from "connected-react-router";
import { Form, Input, Button, message } from "antd";
import { updateDialog } from "../../Redux/dialog";
import axios from "axios";
import { getEventById } from "../../Redux/events";


class RsvpFormComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showRSVP: false
    }
  } 

  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        axios.post("/event/rsvp", { auth: this.props.user.auth, id: this.props.currEvent.id, answers: values.answers })
          .then((response) => {
            message.success("You have Rsvp'd for " + decodeURI(this.props.currEvent.name))
            this.props._updateDialog(false, null);
            this.props._getEventById({ auth: this.props.user.auth, id: parseInt(this.props.currEvent.id) });
          }).catch((error) => {
            message.error("Failed to rsvp. Please try again later.");
          })
      }
    });
  };

  render() {
    let formItems = [];
    if(this.props.currEvent.rsvp.questions && this.props.currEvent.rsvp.questions.length !== 0) {
      const { getFieldDecorator } = this.props.form;
      formItems = this.props.currEvent.rsvp.questions.map((val, index) => (
        <Form.Item
          required={false}
          key={index}
          label={val}
        >
          {getFieldDecorator('answers[' + index + ']', {
            initialValue:  this.props.currEvent.rsvp.answers && this.props.currEvent.rsvp.answers[index] ? this.props.currEvent.rsvp.answers[index]  : "",
            rules: [
              {
                required: true,
                message: "Please response to the question"
              }
            ]
          })
            (
              <Input />
            )
          }
        </Form.Item>
      ));
    }
    
    return (
      <div>
        <Form
          layout={"vertical"}
          onSubmit={this.handleSubmit}
          className="login-form"
          style={{ background: "#FFFFFF", marginTop: "10px" }}
        >
          {formItems}
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

const RsvpForm = Form.create({ name: "RsvpForm" })(RsvpFormComponent);

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

export default connect(mapStoreToProps, mapDispatchToProps)(RsvpForm);
//replace null with mapStateToProps to connect to the state variables