import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { push } from "connected-react-router";
import AllEvents from "./AllEvents";
import EventDetails from "../../Components/Events/EventDetails";
import CheckinTable from "../../Components/Events/CheckinTable";

class EventsHome extends Component {
  constructor(props) {
    super(props);
    if (!props.user.auth) {
      props._push("/login");
    }
  }

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
    if (
      Object.entries(this.props.router.location.query).length === 0 &&
      this.props.router.location.query.constructor === Object
    ) {
      return <AllEvents />;
    } else {
      if (this.getUrlVars()["checkin"] === "true") {
        return <CheckinTable />;
      }
      return <EventDetails />;
    }
  }
}

const mapStoreToProps = state => {
  return {
    user: state.user,
    router: state.router
  };
};

const mapDispatchToProps = {
  _push: push
};

export default connect(mapStoreToProps, mapDispatchToProps)(
  withRouter(EventsHome)
);
//replace null with mapStateToProps to connect to the state variables
