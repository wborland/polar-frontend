import React, { Component } from "react";
import { Table, Button } from "antd";
import "antd/dist/antd.css";
import { callGetFiles, deleteFiles, openFile } from "../../Redux/files";
import { connect } from "react-redux";
import { updateDialog } from "../../Redux/dialog";

class Files extends Component {
  columns = [
    {
      title: "File Name",
      dataIndex: "displayName"
    },
    {
      title: "Description",
      dataIndex: "description"
    },
    {
      title: "Uploaded by",
      dataIndex: "uploaderName"
    },
    {
      title: "Actions",
      align: "right",
      dataIndex: "Actions",
      render: (text, record) =>
        <div>
          <Button
            style={{ margin: "5px" }}
            onClick={() =>
              this.props._openFile(
                this.props.user.auth,
                record.storageName,
                record.displayName
              )}
          >
            Open
          </Button>
          <Button
            style={{ margin: "5px" }}
            onClick={() =>
              this.props._updateDialog(true, {
                title: "Delete file",
                content: this.deleteFile(record)
              })}
          >
            Delete
          </Button>
        </div>
    }
  ];

  deleteFile = record => {
    return (
      <div>
        <p>
          Are you sure you want to delete {record.displayName}?
        </p>
        <div>
          <Button
            style={{ margin: "5px" }}
            onClick={() =>
              this.props._deleteFiles(
                this.props.user.auth,
                record.fileId,
                record.storageName
              )}
          >
            Yes
          </Button>
          <Button
            style={{ margin: "5px" }}
            onClick={() => this.props._updateDialog(false, null)}
          >
            No
          </Button>
        </div>
      </div>
    );
  };

  componentDidMount = () => {
    this.props._callGetFiles(this.props.user.auth);
  };

  render() {
    console.log(this.props.files.open);
    return (
      <div style={{ height: "calc(100vh - 64px)" }}>
        <Table dataSource={this.props.files.fileList} columns={this.columns} />
      </div>
    );
  }
}

const mapStateToProps = state => ({
  files: state.files,
  user: state.user
});

const mapDispatchToProps = {
  _callGetFiles: callGetFiles,
  _updateDialog: updateDialog,
  _deleteFiles: deleteFiles,
  _openFile: openFile
};

export default connect(mapStateToProps, mapDispatchToProps)(Files);
