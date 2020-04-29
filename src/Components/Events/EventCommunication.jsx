import React, { Component } from "react";
import { connect } from "react-redux";
import { push } from "connected-react-router";
import { Table, Radio, Input, Button } from "antd";
import { getRsvpList, sendMessages } from "../../Redux/events";
import TextArea from "antd/lib/input/TextArea";
import { updateDialog } from "../../Redux/dialog";

class EventCommunication extends Component {
  constructor(props) {
    super(props);
    this.state = { to: "RSVP", type: "both", subject: "", message: "" };
  }
  componentDidMount = () => {
    if (this.props.events.currEvent == null) return;
    this.props._getRsvpList({
      auth: this.props.user.auth,
      eventId: this.props.events.currEvent.id
    });
  };

  columns = [
    {
      title: "First Name",
      dataIndex: "firstName"
    },
    {
      title: "Last Name",
      dataIndex: "lastName"
    }
  ];

  componentDidUpdate = prevProps => {
    if (this.props.events.currEvent != prevProps.events.currEvent) {
      this.componentDidMount();
    }
  };

  onChange = e => {
    let temp = this.state;
    temp[e.target.name] = e.target.value;
    this.setState({ ...temp });
  };

  render() {
    return (
      <div style={{ marginTop: "0px" }}>
        To:
        <Radio.Group
          name="to"
          onChange={this.onChange}
          defaultValue="RSVP"
          buttonStyle="solid"
          style={{ marginLeft: "10px", marginBottom: "10px" }}
        >
          <Radio.Button value="RSVP">RSVP List</Radio.Button>
          <Radio.Button value="CheckIn">Checked In</Radio.Button>
        </Radio.Group>
        <br />
        Type:
        <Radio.Group
          name="type"
          onChange={this.onChange}
          defaultValue="both"
          buttonStyle="solid"
          style={{ marginLeft: "10px", marginBottom: "10px" }}
        >
          <Radio.Button value="email">Email</Radio.Button>
          <Radio.Button value="text">Text Message</Radio.Button>
          <Radio.Button value="both">Both</Radio.Button>
        </Radio.Group>
        <br />
        {this.state.type != "text"
          ? <Input
              addonBefore="Subject:"
              style={{ marginBottom: "10px" }}
              name="subject"
              onChange={this.onChange}
            />
          : null}
        Message:
        <br />
        <TextArea autoSize name="message" onChange={this.onChange} />
        <Button
          type="primary"
          style={{ marginTop: "10px", marginRight: "10px" }}
          onClick={() =>
            this.props._sendMessages(
              this.props.user.auth,
              this.props.events.currEvent.id,
              this.state
            )}
        >
          Send
        </Button>
        <Button
          onClick={() => this.props._updateDialog(false, null)}
          style={{ marginTop: "10px", marginRight: "10px" }}
        >
          Cancel
        </Button>
      </div>
    );
  }
}

const mapStoreToProps = state => {
  return {
    user: state.user,
    events: state.events
  };
};

const mapDispatchToProps = {
  _push: push,
  _getRsvpList: getRsvpList,
  _updateDialog: updateDialog,
  _sendMessages: sendMessages
};

export default connect(mapStoreToProps, mapDispatchToProps)(EventCommunication);
//replace null with mapStateToProps to connect to the state variables
