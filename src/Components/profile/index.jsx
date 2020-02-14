import React, { Component } from "react";
import { push } from "connected-react-router";
import { connect } from "react-redux";
import { Input, Button, Modal } from "antd";
import { deleteUser } from "../../Redux/user";

class Profile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      fname: "",
      lname: "",
      phone: "",
      modal: {
        open: false
      }
    };
  }

  saveAction = () => {
    if (
      this.state.email == "" ||
      this.state.fname == "" ||
      this.state.lname == ""
    ) {
      let tempModal = {
        open: true,
        title: "Save Account Changes",
        content: (
          <div>
            <p>Please fill out first and last name</p>
          </div>
        ),
        footer: (
          <div>
            <Button
              type="primary"
              onClick={() => this.setState({ modal: { open: false } })}
            >
              Okay
            </Button>
          </div>
        )
      };
      this.setState({ modal: tempModal });
    }
  };

  deleteAction = () => {
    let tempModal = {
      open: true,
      title: "Delete Account",
      content: (
        <div>
          <p>
            Are you sure you want to delete your account?<br /> (this action
            cannot be undone)
          </p>
        </div>
      ),
      footer: (
        <div>
          <Button onClick={() => this.setState({ modal: { open: false } })}>
            Cancel
          </Button>
          <Button type="danger" onClick={this.props._deleteUser}>
            Delete
          </Button>
        </div>
      )
    };
    this.setState({ modal: tempModal });
  };

  render() {
    return (
      <div>
        <Input style={{ paddingBottom: "20px" }} addonBefore="Email" disabled />
        <Input style={{ paddingBottom: "20px" }} addonBefore="First Name" />
        <Input style={{ paddingBottom: "20px" }} addonBefore="Last Name" />
        <Input style={{ paddingBottom: "20px" }} addonBefore="Phone number" />
        <Button type="primary" onClick={this.saveAction}>
          Save
        </Button>
        <hr />
        <Button type="danger" onClick={this.deleteAction}>
          Delete Account
        </Button>
        <Modal
          title={this.state.modal.title || null}
          visible={this.state.modal.open}
          onCancel={() => this.setState({ modal: { open: false } })}
          footer={this.state.modal.footer}
        >
          {this.state.modal.content}
        </Modal>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  user: state.user
});

const mapDispatchToProps = {
  _push: push,
  _deleteUser: deleteUser
};

export default connect(mapStateToProps, mapDispatchToProps)(Profile);
