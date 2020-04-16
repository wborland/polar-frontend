import React, { Component } from "react";
import { connect } from "react-redux";
import { push } from "connected-react-router";
import { Table, Skeleton } from "antd";
import { getRsvpList, getEventById } from "../../Redux/events";

class CheckinTable extends Component {
  componentDidMount = () => {
    console.log("Hello");
    if (this.props.events.currEvent == null) {
      this.props._getEventById({
        auth: this.props.user.auth,
        id: parseInt(this.props.router.location.query.id)
      });
    }
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
    console.log("Bye");
    if (this.props.events.currEvent != prevProps.events.currEvent) {
      this.componentDidMount();
    }
  };

  render() {
    if (this.props.events.currEvent == null) {
      return <Skeleton active />;
    }
    return (
      <div
        style={{
          background: "#FFFFFF",
          minHeight: "calc(100vh - 64px)",
          textAlign: "center",
          paddingTop: "10px"
        }}
      >
        <h4>
          {this.props.events.currEvent.name}
        </h4>
        <Table dataSource={this.props.events.rsvpList} columns={this.columns} />
      </div>
    );
  }
}

const mapStoreToProps = state => {
  return {
    user: state.user,
    events: state.events,
    router: state.router
  };
};

const mapDispatchToProps = {
  _push: push,
  _getRsvpList: getRsvpList,
  _getEventById: getEventById
};

export default connect(mapStoreToProps, mapDispatchToProps)(CheckinTable);
//replace null with mapStateToProps to connect to the state variables
