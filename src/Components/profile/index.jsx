import React, { Component } from "react";
import { connect } from "react-redux";
import { Input, Button, Modal, message } from "antd";
import { deleteUser, getUserInfo, setUserInfo } from "../../Redux/user";

class Profile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      firstName: "",
      lastName: "",
      phone: "",
      modal: {
        open: false
      }
    };
  }

  componentDidMount = () => {
    this.props._getUserInfo(this.props.user.auth);
    this.setState({ ...this.props.user });
  };

  saveAction = () => {
    if (
      this.state.email === "" ||
      this.state.firstName === "" ||
      this.state.lastName === ""
    ) {
      message.error("Please fill out first and last name and try again", 10);
    } else if (this.state.phone.length > 15) {
      message.error("Please enter a valid phone number and try again", 10);
    } else {
      this.props._setUserInfo({
        email: this.state.email,
        firstName: this.state.firstName,
        lastName: this.state.lastName,
        phone: this.state.phone,
        auth: this.props.user.auth
      });
    }
  };

  componentDidUpdate = props => {
    if (props.user !== this.props.user) {
      this.setState({ ...this.props.user });
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
          <Button
            type="danger"
            onClick={() => this.props._deleteUser(this.props.user.auth)}
          >
            Delete
          </Button>
        </div>
      )
    };
    this.setState({ modal: tempModal });
  };

  checkPhone = e => {
    if (e.target.value.match(/^[0-9]*$/)) {
      this.setState({ phone: e.target.value });
    }
  };

  render() {
    return (
      <div>
        <Input
          style={{ paddingBottom: "20px" }}
          value={this.state.email}
          addonBefore="Email"
          disabled
        />
        <Input
          style={{ paddingBottom: "20px" }}
          value={this.state.firstName}
          onChange={e => this.setState({ firstName: e.target.value })}
          addonBefore="First Name"
        />
        <Input
          style={{ paddingBottom: "20px" }}
          value={this.state.lastName}
          onChange={e => this.setState({ lastName: e.target.value })}
          addonBefore="Last Name"
        />
        <Input
          style={{ paddingBottom: "20px" }}
          value={this.state.phone}
          onChange={this.checkPhone}
          addonBefore="Phone number"
        />
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
  _deleteUser: deleteUser,
  _getUserInfo: getUserInfo,
  _setUserInfo: setUserInfo
};

export default connect(mapStateToProps, mapDispatchToProps)(Profile);
