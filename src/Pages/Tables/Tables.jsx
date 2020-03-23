import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { push } from "connected-react-router";
import TableList from "./TableList";
import TableView from "./TableView";

class Tables extends Component {
  constructor(props) {
    super(props);
    if (!props.user.auth) {
      props._push('/login');
    }
  }



  render() {
    if (Object.entries(this.props.router.location.query).length === 0 && this.props.router.location.query.constructor === Object) {
      return <TableList />
    } else {
      return (
        <TableView />
      );
    }
  }
}

const mapStoreToProps = state => {
  return {
    user: state.user,
    router: state.router,
    // TODO: Add files list
  };
};

const mapDispatchToProps = {
  // TODO: API call to get files
  _push: push
};

export default connect(mapStoreToProps, mapDispatchToProps)(withRouter(Tables));
//replace null with mapStateToProps to connect to the state variables
