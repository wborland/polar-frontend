import React, { Component } from "react";
import { connect } from "react-redux";
import { updateDialog } from "../../Redux/dialog";
import { Button, Input, Select, Upload, message } from "antd";
import { getRoleList } from "../../Redux/roles";
import { uploadFile } from "../../Redux/files";

const { TextArea } = Input;
const { Option } = Select;

class AddFiles extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      desc: "",
      file: {},
      roles: [],
      fileList: []
    };
  }

  componentDidMount = () => {
    this.props._getRoleList(this.props.user.auth);
  };

  getChildren = () => {
    let tempChildren = [];
    for (let i in this.props.roles.listRoles) {
      let currRole = this.props.roles.listRoles[i];
      tempChildren.push(
        <Option key={currRole.key}>
          {currRole.roleName}
        </Option>
      );
    }
    return tempChildren;
  };

  handleChange = e => {
    this.setState({ roles: e });
  };

  handleFileChange = e => {
    if (e.fileList.length > 1) {
      message.error("Only one file can be uploaded at a time", 5);
      return;
    }
    let tempName = this.state.name;
    if (tempName === "") {
      console.log(e.fileList[0].name);
      tempName = e.fileList[0].name;
    }
    this.setState({
      fileList: e.fileList,
      file: e.fileList[0],
      name: tempName
    });
  };

  handleSubmit = () => {
    if (this.state.fileList.length === 0) {
      message.error("Please add a file to upload", 5);
      return;
    }
    if (this.state.name === "" || this.state.name.trim() === "") {
      message.error("Please enter a file display name", 5);
      return;
    }
    let uploadParam = {
      auth: this.props.user.auth,
      name: this.state.name,
      desc: this.state.desc,
      file: this.state.file,
      roles: this.state.roles
    };
    let formData = new FormData();
    console.log(this.state.fileList[0]);
    formData.append("file", this.state.fileList[0]);
    formData.append("data", JSON.stringify(uploadParam));
    formData.append("auth", this.props.user.auth);
    this.props._uploadFile(formData, this.props.user.auth);
  };

  handleFileBeforeUpload = file => {
    let tempName = this.state.name;
    if (tempName === "") {
      tempName = file.name;
    }
    this.setState({
      fileList: [file],
      name: tempName
    });
    return false;
  };

  handleFileRemove = file => {
    this.setState({ fileList: [] });
    return { fileList: [] };
  };

  render() {
    if (!this.state.roles.includes("1")) {
      this.setState({ roles: ["1", ...this.state.roles] });
    }
    return (
      <div>
        <h6>File Display Name</h6>
        <Input
          value={this.state.name}
          onChange={e => this.setState({ name: e.target.value })}
        />
        <h6 style={{ marginTop: "10px", marginRight: "15px" }}>
          File Description
        </h6>
        <TextArea
          rows={2}
          onChange={e =>
            this.setState({
              desc: e.target.value
            })}
        />
        <h6 style={{ marginTop: "10px", marginRight: "15px" }}>
          Roles that can view the file
        </h6>
        <Select
          mode="multiple"
          style={{ width: "100%" }}
          placeholder="Select Roles"
          value={this.state.roles}
          onChange={this.handleChange}
        >
          {this.getChildren()}
        </Select>
        <Upload
          onRemove={this.handleFileRemove}
          beforeUpload={this.handleFileBeforeUpload}
          fileList={this.state.fileList}
        >
          <Button style={{ marginTop: "10px", marginRight: "15px" }}>
            Upload file
          </Button>
        </Upload>
        <Button
          style={{ marginTop: "10px", marginRight: "15px" }}
          onClick={this.handleSubmit}
        >
          Submit File
        </Button>
        <Button onClick={() => this.props._updateDialog(false, null)}>
          Cancel
        </Button>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  roles: state.roles,
  user: state.user
});

const mapDispatchToProps = {
  _updateDialog: updateDialog,
  _getRoleList: getRoleList,
  _uploadFile: uploadFile
};

export default connect(mapStateToProps, mapDispatchToProps)(AddFiles);
