import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { push } from "connected-react-router";
import { Input, Button, Select } from "antd";
import { updateDialog } from "../../Redux/dialog";
import { addCheckinRow, getUsers } from "../../Redux/events";

const { Option } = Select;

class AddPerson extends Component {
  constructor(props) {
    super(props);
    this.state = {
      submission: {},
      inputs: []
    };
  }

  setValue = (col, e) => {
    let s = { ...this.state.submission };
    s[col] = e.target.value;
    this.setState({ submission: s });
  };

  componentDidMount = () => {
    this.props._getUsers(
      this.props.user.auth,
      parseInt(this.getUrlVars()["tableId"])
    );

    let columnInfo = this.props.events.checkinHeader;
    let inputs = [];
    for (let i in columnInfo) {
      if (
        columnInfo[i].dataIndex == "id" ||
        columnInfo[i].dataIndex == "key" ||
        columnInfo[i].dataIndex == "firstName" ||
        columnInfo[i].dataIndex == "lastName" ||
        columnInfo[i].dataIndex == "checkedIn"
      ) {
        continue;
      }
      let temp = this.state.submission;
      temp[columnInfo[i].title] = "";
      this.setState({ submission: temp });
      inputs.push(
        <div key={i}>
          {`${columnInfo[i].title}: `}
          <Input
            style={{ marginBottom: "10px" }}
            // value={this.state.submission[columnInfo[i].title]}
            onChange={e => this.setValue(columnInfo[i].title, e)}
          />
        </div>
      );
    }
    this.setState({ inputs: inputs });
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

  submit = () => {
    console.log(this.state.submission);
    // this.props._addCheckinRow(
    //   this.props.user.auth,
    //   parseInt(this.getUrlVars()["tableId"]),
    //   this.state.submission
    // );
  };

  getUserOptions = () => {
    let tempUsers = [];
    for (let i in this.props.events.notEventUsers) {
      let curr = this.props.events.notEventUsers[i];
      tempUsers.push(
        <Option value={curr[0]} key={curr[0]} label={curr[1]}>
          {curr[1]}
        </Option>
      );
    }
    return tempUsers;
  };

  render() {
    return (
      <div>
        User:
        <Select
          showSearch
          placeholder="Select User"
          style={{ width: "100%", marginBottom: "10px" }}
          optionFilterProp="label"
        >
          {this.getUserOptions()}
        </Select>
        {this.state.inputs}
        <div>
          <Button style={{ marginRight: "10px" }} onClick={this.submit}>
            Save
          </Button>
          <Button onClick={() => this.props._updateDialog(false, null)}>
            Cancel
          </Button>
        </div>
      </div>
    );
  }
}

const mapStoreToProps = state => {
  return {
    user: state.user,
    events: state.events
  };
};

const mapDispatchToProps = {
  _push: push,
  _updateDialog: updateDialog,
  _addCheckinRow: addCheckinRow,
  _getUsers: getUsers
};

export default connect(mapStoreToProps, mapDispatchToProps)(
  withRouter(AddPerson)
);
//replace null with mapStateToProps to connect to the state variables
