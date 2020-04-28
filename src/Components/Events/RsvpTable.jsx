import React, { Component } from "react";
import { connect } from "react-redux";
import { push } from "connected-react-router";
import { Table } from "antd";
import { getRsvpList } from "../../Redux/events";

class RsvpTable extends Component {
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

  render() {
    return (
      <div style={{ marginTop: "100px" }}>
        <h4>Currently RSVPed</h4>
        <Table dataSource={this.props.events.rsvpList} columns={this.columns} />
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
  _getRsvpList: getRsvpList
};

export default connect(mapStoreToProps, mapDispatchToProps)(RsvpTable);
//replace null with mapStateToProps to connect to the state variables
