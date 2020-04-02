import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { push } from "connected-react-router";
import { Input, Button } from "antd";
import { updateDialog } from "../../Redux/dialog";
import { addRow } from "../../Redux/tables";

class AddEntry extends Component {
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
    let columnInfo = this.props.tables.tableInfo.columns;
    let inputs = [];
    for (let i in columnInfo) {
      if (i == "id" || i == "key") {
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
    this.props._addRow(
      this.props.user.auth,
      parseInt(this.getUrlVars()["tableId"]),
      this.state.submission
    );
  };

  render() {
    return (
      <div>
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
    tables: state.tables
  };
};

const mapDispatchToProps = {
  _push: push,
  _updateDialog: updateDialog,
  _addRow: addRow
};

export default connect(mapStoreToProps, mapDispatchToProps)(
  withRouter(AddEntry)
);
//replace null with mapStateToProps to connect to the state variables
