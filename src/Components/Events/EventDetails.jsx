import React, { Component } from "react";
import {
  Button,
  Typography,
  Row,
  Col,
  Radio,
  message,
  Divider,
  Popover,
  Skeleton
} from "antd";
import { ClockCircleOutlined, StarOutlined } from "@ant-design/icons";
import ModifyEventForm from "./ModifyEventFormComponent";
import RsvpForm from "./RsvpFormComponent";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { push } from "connected-react-router";
import { getEventById, closeEvent } from "../../Redux/events";
import { updateDialog } from "../../Redux/dialog";
import moment from "moment";
import RsvpTable from "./RsvpTable";
import ChangeCheckinCols from "./ChangeCheckinCols";
import axios from "axios";

const { Title } = Typography;

class EventDetails extends Component {
  constructor(props) {
    super(props);
    if (!props.user.auth) {
      props._push("/login");
    }
    this.state = {
      startTime: null,
      endTime: null,
      rsvp: {
        response: false,
        questions: [],
        answers: []
      },
      location: null,
      description: null
    };
  }

  componentDidMount = () => {
    this.props._getEventById({
      auth: this.props.user.auth,
      id: parseInt(this.props.router.location.query.id)
    });
  };

  componentDidUpdate = prevProps => {
    if (this.props.events.currEvent != prevProps.events.currEvent) {
      this.setState({
        startTime: this.props.events.currEvent.startTime,
        endTime: this.props.events.currEvent.endTime,
        location: this.props.events.currEvent.location,
        description: this.props.events.currEvent.desc,
        rsvp: this.props.events.currEvent.rsvp
      });
    }
  };

  modifyEvent = () => {
    this.props._updateDialog(true, {
      title: "Modify Event",
      content: <ModifyEventForm />
    });
  };

  rsvpDialog = () => {
    this.props._updateDialog(true, {
      title: "RSVP Form",
      content: <RsvpForm />
    });
  };

  handleDelete = () => {
    this.props._updateDialog(true, {
      title: "Delete Event",
      content: (
        <div>
          <p>
            Are you sure you want to delete{" "}
            <b>{this.props.events.currEvent.name}</b>?
          </p>
          <div style={{ textAlign: "right" }}>
            <Button
              style={{ marginRight: "10px" }}
              onClick={() => this.props._updateDialog(false, null)}
            >
              No
            </Button>
            <Button onClick={this.deleteEvent}>Yes</Button>
          </div>
        </div>
      )
    });
  };

  deleteEvent = () => {
    axios
      .post("/event/delete", {
        auth: this.props.user.auth,
        id: this.props.events.currEvent.id
      })
      .then(response => {
        message.success("Deleted " + this.props.events.currEvent.name + "!");
        this.props._updateDialog(false, null);
        this.props._push("/");
      })
      .catch(err => {
        message.error("Failed to delete event. Please try again later!");
      });
  };

  handleRSVP = e => {
    if (e.target.value === false && this.state.rsvp.response === true) {
      axios
        .post("/event/unrsvp", {
          auth: this.props.user.auth,
          id: this.props.router.location.query.id
        })
        .then(response => {
          let rsvpRes = this.state.rsvp;
          rsvpRes.response = false;
          rsvpRes.answers = [];
          this.setState({ rsvp: rsvpRes });
          message.success(
            "You have Unrsvp'd from " +
              decodeURI(this.props.router.location.query.name)
          );
        })
        .catch(err => {
          message.error("Failed to unrsvp. Please try again later.");
        });
    } else if (e.target.value === true && this.state.rsvp.response === false) {
      if (this.state.rsvp.questions.length === 0) {
        axios
          .post("/event/rsvp", {
            auth: this.props.user.auth,
            id: this.props.router.location.query.id,
            answers: []
          })
          .then(response => {
            let rsvpRes = this.state.rsvp;
            rsvpRes.response = true;
            rsvpRes.answers = [];
            this.setState({ rsvp: rsvpRes });
            message.success(
              "You have Rsvp'd for " +
                decodeURI(this.props.router.location.query.name)
            );
          })
          .catch(error => {
            message.error("Failed to rsvp. Please try again later.");
          });
      } else {
        this.rsvpDialog();
      }
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
        <Row>
          <Divider>
            <Title>
              {decodeURI(this.props.router.location.query.name)}
            </Title>
          </Divider>
        </Row>
        <Row style={{ marginBottom: "2vw", textAlign: "left" }}>
          <Col
            sm={24}
            md={12}
            style={{ paddingLeft: "2vw", textAlign: "left" }}
          >
            {this.props.user.permissions.includes(3)
              ? <Button
                  type="primary"
                  style={{ marginRight: "1vw" }}
                  onClick={this.modifyEvent}
                >
                  Modify Event
                </Button>
              : ""}
            {this.props.user.permissions.includes(5)
              ? <Button
                  type="danger"
                  style={{ marginRight: "1vw" }}
                  onClick={this.handleDelete}
                >
                  Delete Event
                </Button>
              : ""}
            {this.props.events.currEvent != null &&
            this.props.user.permissions.includes(4) &&
            this.props.events.currEvent.closed == true
              ? <Button
                  type="primary"
                  style={{ marginRight: "1vw", marginBottom: "1vh" }}
                  onClick={() =>
                    this.props._push(
                      window.location.pathname +
                        window.location.search +
                        "&checkin=true"
                    )}
                >
                  View Check in
                </Button>
              : null}
            {this.props.events.currEvent != null &&
            this.props.user.permissions.includes(4) &&
            this.props.events.currEvent.closed != true
              ? <Button
                  type="primary"
                  style={{ marginRight: "1vw", marginBottom: "1vh" }}
                  onClick={() =>
                    this.props._push(
                      window.location.pathname +
                        window.location.search +
                        "&checkin=true"
                    )}
                >
                  Check in
                </Button>
              : null}
            {this.props.events.currEvent != null &&
            this.props.user.permissions.includes(3) &&
            this.props.events.currEvent.closed != true
              ? <Popover
                  content={
                    <p>
                      Closes the event so the check in table is locked and not
                      editable
                    </p>
                  }
                >
                  <Button
                    type="danger"
                    style={{ marginRight: "1vw", marginBottom: "1vh" }}
                    onClick={() =>
                      this.props._closeEvent(
                        this.props.user.auth,
                        parseInt(this.props.router.location.query.id)
                      )}
                  >
                    End Event
                  </Button>
                </Popover>
              : null}
            {this.props.user.permissions.includes(3) &&
            this.props.events.currEvent != null &&
            this.props.events.currEvent.closed != true
              ? <Button
                  type="primary"
                  onClick={() =>
                    this.props._updateDialog(true, {
                      title: "Modify Check In Columns",
                      content: <ChangeCheckinCols />
                    })}
                >
                  Modify Check in Columns
                </Button>
              : null}
          </Col>

          <Col
            xs={0}
            sm={0}
            md={12}
            style={{ paddingRight: "2vw", textAlign: "right" }}
          >
            <b>RSVP: </b>
            <Radio.Group
              value={this.state.rsvp.response}
              onChange={this.handleRSVP}
              buttonStyle="solid"
              {...{ disabled: this.props.events.currEvent.closed }}
            >
              <Radio.Button value={false}>Not Going</Radio.Button>
              <Radio.Button value={true}>Going</Radio.Button>
            </Radio.Group>
          </Col>
        </Row>
        <Divider />
        <Row align="middle" style={{ marginLeft: "2vw", textAlign: "left" }}>
          {this.state.startTime
            ? <ClockCircleOutlined
                style={{ fontSize: 18, marginRight: "1vw" }}
              />
            : ""}
          {this.state.startTime
            ? moment(this.state.startTime).local().format("LLLL")
            : ""}
          {this.state.endTime
            ? " - " + moment(this.state.endTime).local().format("LLLL")
            : ""}
        </Row>
        <Row align="middle" style={{ marginLeft: "2vw", textAlign: "left" }}>
          {this.state.location
            ? <StarOutlined style={{ fontSize: 18, marginRight: "1vw" }} />
            : ""}
          {this.state.location
            ? <a
                href={encodeURI(
                  "https://www.google.com/maps/search/?api=1&query=" +
                    this.state.location
                )}
              >
                {this.state.location}
              </a>
            : ""}
        </Row>
        <Divider />
        <Row style={{ marginLeft: "2vw", textAlign: "left" }}>
          {this.state.description ? <b>Description: </b> : ""}
          {this.state.description ? this.state.description : ""}
        </Row>
        <Row style={{ marginLeft: "2vw", textAlign: "left" }}>
          {this.props.user.permissions.includes(4) ? <RsvpTable /> : null}
        </Row>
      </div>
    );
  }
}

const mapStoreToProps = state => {
  return {
    user: state.user,
    router: state.router,
    events: state.events
  };
};

const mapDispatchToProps = {
  _push: push,
  _getEventById: getEventById,
  _updateDialog: updateDialog,
  _closeEvent: closeEvent
};

export default connect(mapStoreToProps, mapDispatchToProps)(
  withRouter(EventDetails)
);
//replace null with mapStateToProps to connect to the state variables
