import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { push } from "connected-react-router";

class Tables extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return <div />;
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

export default connect(mapStoreToProps, mapDispatchToProps)(withRouter(Tables));
//replace null with mapStateToProps to connect to the state variables
