import React, { Component } from "react";
import { Button, Typography, Row, Col, Radio, message, Divider } from "antd";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { push } from "connected-react-router";
import { getEventById } from "../../Redux/events";
import { updateDialog } from "../../Redux/dialog";
import moment from "moment";
import RsvpTable from "./RsvpTable";

const { Title } = Typography;

class EventDetails extends Component {
  constructor(props) {
    super(props);
    console.log("props", props);
    if (!props.user.auth) {
      props._push("/login");
    }
    this.state = {
      time: null,
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
        time: this.props.events.currEvent.time,
        location: this.props.events.currEvent.location,
        description: this.props.events.currEvent.desc
      });
    }
  };

  render() {
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
              ? <Button type="primary" style={{ marginRight: "1vw" }}>
                  Modify Event
                </Button>
              : ""}
            {this.props.user.permissions.includes(5)
              ? <Button type="danger" style={{ marginRight: "1vw" }}>
                  Delete Event
                </Button>
              : ""}
            {this.props.user.permissions.includes(4)
              ? <Button
                  type="primary"
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
          </Col>
          <Col
            sm={24}
            md={12}
            style={{ paddingRight: "2vw", textAlign: "right" }}
          >
            <b>RSVP: </b>
            <Radio.Group defaultValue="not going" buttonStyle="solid">
              <Radio.Button value="not going">Not Going</Radio.Button>
              <Radio.Button value="going">Going</Radio.Button>
            </Radio.Group>
          </Col>
        </Row>
        <Row style={{ marginLeft: "2vw", textAlign: "left" }}>
          {this.state.time ? <b>Date: </b> : ""}
          {this.state.time ? moment(this.state.time).format("LL") : ""}
          <br />
          {this.state.time ? <b>Time: </b> : ""}
          {this.state.time ? moment(this.state.time).format("LT") : ""}
          <br />
          {this.state.location ? <b>Location: </b> : ""}
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
          <br />
          {this.state.description ? <b>Description: </b> : ""}
          {this.state.description ? this.state.description : ""}
        </Row>
        <Row style={{ marginLeft: "2vw", textAlign: "left" }}>
          <RsvpTable />
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
  _updateDialog: updateDialog
};

export default connect(mapStoreToProps, mapDispatchToProps)(
  withRouter(EventDetails)
);
//replace null with mapStateToProps to connect to the state variables
