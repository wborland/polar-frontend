import React, { Component } from "react";
import { connect } from "react-redux";
import { push } from "connected-react-router";
import { Form, Button } from 'antd';
import { updateDialog } from "../../Redux/dialog";
import AddTableForm from "./AddTableFormComponent";

class AddTableButton extends Component {
  constructor(props) {
    super(props);
  }

  dialogContent = () => {
    return (
      <div>
        <AddTableForm />
      </div>
    );
  };

  render() {
    return (
      <div>
        <Button
          onClick={() =>
            this.props._updateDialog(true, {
              title: "Add Table",
              content: this.dialogContent()
            })}>
            Add Table
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

export default connect(mapStoreToProps, mapDispatchToProps)(AddTableButton);
//replace null with mapStateToProps to connect to the state variables

