import React, { Component } from "react";
import { Button, Input, Switch } from "antd";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { push } from "connected-react-router";
import {
  getEventsList,
  getCheckinTable,
  getTableCols,
  sendColUpdates
} from "../../Redux/events";
import { updateDialog } from "../../Redux/dialog";

class ChangeCheckinCols extends Component {
  constructor(props) {
    super(props);
    if (!props.user.auth) {
      props._push("/login");
    }
    this.state = {
      vals: {}
    };
  }

  handleChange = e => {
    let tempVals = this.state.vals;
    tempVals[e.target.id].next = e.target.value;
    this.setState({ vals: tempVals });
  };

  componentDidMount = () => {
    this.props._getTableCols(
      this.props.user.auth,
      parseInt(this.props.router.location.query.id)
    );
    let i = 0;
    let temp = this.state.vals;
    for (let tex in this.props.events.checkinCols) {
      temp[i] = {
        prev: tex,
        next: tex,
        prevRsvp: this.props.events.checkinCols[tex],
        rsvp: this.props.events.checkinCols[tex]
      };
      i++;
    }
    this.setState({ vals: temp });
  };

  addCol = () => {
    let temp = this.state.vals;
    temp[Object.keys(temp).length] = {
      prev: null,
      next: "",
      prevRsvp: null,
      rsvp: false
    };
    this.setState({ vals: temp });
  };

  componentDidUpdate = prevProps => {
    if (
      this.props.events.checkinCols.length !=
      prevProps.events.checkinCols.length
    ) {
      this.componentDidMount();
    }
  };

  changeRadio = (checked, e) => {
    let a = e.target.className.split(" ")[0].split("_")[1];
    this.state.vals[a].rsvp =
      checked.toString()[0].toUpperCase() + checked.toString().slice(1);
  };

  renderInputs = () => {
    let vals = this.state.vals;
    let tempReturn = [];
    for (let i in vals) {
      tempReturn.push(
        <div key={i} style={{ marginBottom: "10px" }}>
          <Input
            id={i}
            value={vals[i].next}
            style={{ marginBottom: "5px" }}
            onChange={this.handleChange}
          />
          Should be an RSVP Form question?{" "}
          <Switch
            defaultChecked={vals[i].rsvp}
            className={`Polar_${i}`}
            onChange={this.changeRadio}
          />
        </div>
      );
    }
    return tempReturn;
  };

  getUrlVars = () => {
    var vars = {};
    var parts = window.location.href.replace(
      /[?&]+([^=&]+)=([^&]*)/gi,
      function(m, key, value) {
        vars[key] = value;
      }
    );
    return vars;
  };

  render() {
    return (
      <div>
        {this.renderInputs()}
        <Button
          type="link"
          style={{ marginBottom: "30px" }}
          onClick={this.addCol}
        >
          Add new Check in Column
        </Button>
        <br />
        <Button
          style={{ marginRight: "10px" }}
          onClick={() =>
            this.props._sendColUpdates(
              this.props.user.auth,
              this.getUrlVars()["id"],
              this.state.vals
            )}
        >
          Save Updates
        </Button>
        <Button onClick={() => this.props._updateDialog(false, null)}>
          Close
        </Button>
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
  _getEventsList: getEventsList,
  _updateDialog: updateDialog,
  _getCheckinTable: getCheckinTable,
  _getTableCols: getTableCols,
  _sendColUpdates: sendColUpdates
};

export default connect(mapStoreToProps, mapDispatchToProps)(
  withRouter(ChangeCheckinCols)
);
//replace null with mapStateToProps to connect to the state variables
