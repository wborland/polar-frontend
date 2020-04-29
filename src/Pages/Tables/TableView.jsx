import React, { Component } from "react";
import {
  Table,
  Button,
  Skeleton,
  Typography,
  Popconfirm,
  Form,
  Input
} from "antd";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { push } from "connected-react-router";
import {
  getIndivTable,
  modifyRow,
  deleteRow,
  getHistoryInfo,
  getTableList,
  getItemHistory,
  downloadTable
} from "../../Redux/tables";
import { updateDialog } from "../../Redux/dialog";
import AddEntry from "./AddEntry";
import ItemHistory from "./ItemHistory";

const { Title } = Typography;

class TableView extends Component {
  constructor(props) {
    super(props);
    if (!props.user.auth) {
      props._push("/login");
    }

    this.state = {
      columns: [],
      tableName: "",
      editingKey: "",
      data: {},
      isExpandable: ""
    };
  }

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

  setValue = (dataIndex, e) => {
    let temp = this.state.data;
    temp[dataIndex] = e.target.value;
    this.setState({ data: temp });
  };

  EditableCell = ({
    editing,
    dataIndex,
    title,
    inputType,
    record,
    index,
    children,
    ...restProps
  }) => {
    return (
      <td {...restProps}>
        {editing
          ? <Input
              value={this.state.data[dataIndex]}
              onChange={e => this.setValue(dataIndex, e)}
            />
          : children}
      </td>
    );
  };

  componentDidMount = () => {
    // TODO: Make API request to get file data
    this.setState({ tableName: this.getUrlVars()["tableName"] });
    this.props._getTableList(this.props.user.auth);
    let url = new URL(window.location.href);
    let params = new URLSearchParams(url.search);
    this.setState({ tableName: params.get("tableName") });
    this.props._getIndivTable(
      this.props.user.auth,
      parseInt(this.getUrlVars()["tableId"])
    );
  };

  saveRecord = () => {
    this.props._modifyRow(
      this.props.user.auth,
      parseInt(this.getUrlVars()["tableId"]),
      this.state.data
    );
    this.setState({ editingKey: "" });
    this.props._getIndivTable(
      this.props.user.auth,
      parseInt(this.getUrlVars()["tableId"])
    );
  };

  edit = record => {
    this.setState({ editingKey: record.id, data: { ...record } });
  };

  cancelEdit = () => {
    for (let i in this.props.tables.tableInfo.data) {
      if (this.props.tables.tableInfo.data[i].id === this.state.editingKey) {
        this.setState({ data: this.props.tables.tableInfo.data[i] }, () =>
          this.setState({
            editingKey: ""
          })
        );
      }
    }
  };

  modifyColumns = () => {
    if (this.props.tables.tableInfo.columns == undefined) {
      return [];
    }
    let columnArr = [...this.props.tables.tableInfo.columns];
    if (this.props.user.permissions.includes(10)) {
      columnArr.push({
        title: "Operations",
        render: (text, record) => {
          const editable = this.isEditing(record);
          if (editable && this.props.user.permissions.includes(10)) {
            return (
              <div>
                <Button
                  onClick={() => this.saveRecord(record.key)}
                  style={{ marginRight: "8px" }}
                >
                  Save
                </Button>
                <Popconfirm
                  title="Sure to cancel? Unsaved changes will be lost"
                  onConfirm={() => this.cancelEdit()}
                >
                  <Button>Cancel</Button>
                </Popconfirm>
              </div>
            );
          } else if (this.props.user.permissions.includes(10)) {
            return (
              <div>
                <Button
                  disabled={this.state.editingKey !== ""}
                  onClick={() => this.edit(record)}
                  style={{ marginRight: "8px" }}
                  type="link"
                >
                  Edit
                </Button>
                <Button
                  disabled={this.state.editingKey !== ""}
                  onClick={() => this.delete(record)}
                  type="danger"
                >
                  Delete
                </Button>
              </div>
            );
          }
        }
      });
    }

    columnArr = columnArr.map(col => {
      if (!col.editable) {
        return col;
      }

      return {
        ...col,
        onCell: record => ({
          record,
          dataIndex: col.dataIndex,
          editing: this.isEditing(record)
        })
      };
    });
    return columnArr;
  };

  delete = record => {
    this.props._deleteRow(
      this.props.user.auth,
      parseInt(this.getUrlVars()["tableId"]),
      parseInt(record.id)
    );
    this.props._getIndivTable(
      this.props.user.auth,
      parseInt(this.getUrlVars()["tableId"])
    );
  };

  isEditing = record => {
    return record.id === this.state.editingKey;
  };

  shouldBeExpandable = () => {
    let returnItem = {
      expandedRowRender: record =>
        record.id == null || record.id == this.state.isExpandable
          ? <ItemHistory record={record} />
          : null,
      onExpand: (expanded, record) => {
        if (expanded == false) {
          this.setState({ isExpandable: null });
          return;
        }
        this.setState({ isExpandable: record.id });
        this.props._getItemHistory(
          this.props.user.auth,
          parseInt(this.getUrlVars()["tableId"]),
          record.id
        );
      }
    };

    let list = this.props.tables.tableList;
    for (let i in list) {
      let curr = list[i];
      if (curr.key == this.getUrlVars()["tableId"]) {
        if (curr.tracking == 1) {
          return returnItem;
        }
      }
    }
  };

  render() {
    if (!this.props.tables.tableInfo) {
      return (
        <div
          style={{
            background: "#FFFFFF",
            height: "calc(100vh - 64px)",
            textAlign: "center",
            paddingTop: "10px"
          }}
        >
          <Title>Table Name</Title>
          <Skeleton active />
        </div>
      );
    }
    return (
      <div
        style={{
          background: "#FFFFFF",
          height: "calc(100vh - 64px)",
          textAlign: "center",
          paddingTop: "10px",
          overflowY: "auto"
        }}
      >
        <Title>
          {this.state.tableName}
        </Title>
        <Table
          components={{ body: { cell: this.EditableCell } }}
          dataSource={this.props.tables.tableInfo.data}
          columns={this.modifyColumns()}
          {...this.shouldBeExpandable()}
        />
        {this.props.user.permissions.includes(10)
          ? <Button
              type="primary"
              style={{ marginRight: "10px" }}
              onClick={() =>
                this.props._updateDialog(true, {
                  title: "Add new row",
                  content: <AddEntry />
                })}
            >
              Add Row
            </Button>
          : null}
        <Button
          type="primary"
          onClick={() =>
            this.props._downloadTable(
              this.props.user.auth,
              parseInt(this.getUrlVars()["tableId"]),
              this.state.tableName
            )}
        >
          Export Table
        </Button>
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
  // TODO: API call to get files
  _push: push,
  _getIndivTable: getIndivTable,
  _modifyRow: modifyRow,
  _deleteRow: deleteRow,
  _updateDialog: updateDialog,
  _getItemHistory: getItemHistory,
  _getTableList: getTableList,
  _downloadTable: downloadTable
};

export default connect(mapStoreToProps, mapDispatchToProps)(
  withRouter(TableView)
);
//replace null with mapStateToProps to connect to the state variables
