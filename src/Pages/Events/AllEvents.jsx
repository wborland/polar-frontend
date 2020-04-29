import React, { Component } from "react";
import { Button, Typography, Radio, Row, Col } from "antd";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { push } from "connected-react-router";
import CalendarView from "../../Components/Events/CalendarView";
import ListView from "../../Components/Events/ListView";
import { updateDialog } from "../../Redux/dialog";
import AddEventForm from "../../Components/Events/AddEventFormComponent";

const { Title } = Typography;

class AllEvents extends Component {
  constructor(props) {
    super(props);
    if (!props.user.auth) {
      props._push("/login");
    }
    this.state = {
      view: "calendar"
    };
  }

  handleViewChange = e => {
    if (e.target.value == "list") {
      this.setState({ view: "list" });
    } else {
      this.setState({ view: "calendar" });
    }
  };

  handleAdd = () => {
    this.props._updateDialog(true, {
      title: "Create an Event",
      content: <AddEventForm />
    });
  };

  render() {
    return (
      <div
        style={{
          background: "#FFFFFF",
          height: "calc(100vh - 64px)",
          textAlign: "center",
          paddingTop: "10px"
        }}
      >
        <Row>
          <Title>
            {this.state.view == "calendar" ? "Events" : "Upcoming Events"}
          </Title>
        </Row>
        <Row>
          <Col span={12} style={{ paddingLeft: "1vw", textAlign: "left" }}>
            {this.props.user.permissions.includes(3)
              ? <Button type="primary" onClick={this.handleAdd}>
                  Add Event
                </Button>
              : ""}
          </Col>
          <Col span={12} style={{ paddingRight: "1vw", textAlign: "right" }}>
            <Radio.Group
              onChange={this.handleViewChange}
              defaultValue="calendar"
            >
              <Radio.Button value="calendar">Calendar</Radio.Button>
              <Radio.Button value="list">List</Radio.Button>
            </Radio.Group>
          </Col>
        </Row>
        <Row>
          {this.state.view == "calendar" ? <CalendarView /> : <ListView />}
        </Row>
      </div>
    );
  }
}

const mapStoreToProps = state => {
  return {
    user: state.user
  };
};

const mapDispatchToProps = {
  _push: push,
  _updateDialog: updateDialog
};

export default connect(mapStoreToProps, mapDispatchToProps)(
  withRouter(AllEvents)
);
//replace null with mapStateToProps to connect to the state variables
