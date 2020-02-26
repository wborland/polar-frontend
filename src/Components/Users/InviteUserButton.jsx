import React, { Component } from "react";
import { connect } from "react-redux";
import { push } from "connected-react-router";
import { Form, Button } from 'antd';
import { updateDialog } from "../../Redux/dialog";
import InviteUserForm from "./InviteUserFormComponent";

class InviteUserButton extends Component {
  constructor(props) {
    super(props);
  }

  dialogContent = () => {
    return (
      <div>
        <InviteUserForm />
      </div>
    );
  };

  render() {
    return (
      <div>
        <Button
          onClick={() =>
            this.props._updateDialog(true, {
              title: "Invite New User",
              content: this.dialogContent()
            })}>
            Invite User
        </Button>
      </div>
    )
  }
}


const mapStoreToProps = state => {
  return {
    user: state.user,
    location: state.router.location
  };
};

const mapDispatchToProps = {
  _updateDialog: updateDialog,
  _push: push
};

export default connect(mapStoreToProps, mapDispatchToProps)(InviteUserButton);
//replace null with mapStateToProps to connect to the state variables

