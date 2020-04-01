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
import { getIndivTable } from "../../Redux/tables";

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
      data: {}
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
    console.log(e.target.value);
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
    console.log(dataIndex);
    return (
      <td {...restProps}>
        {editing
          ? <Input onChange={e => this.setValue(dataIndex, e)} />
          : children}
      </td>
    );
  };

  componentDidMount = () => {
    // TODO: Make API request to get file data
    this.setState({ tableName: this.getUrlVars()["tableName"] });
    this.props._getIndivTable(
      this.props.user.auth,
      parseInt(this.getUrlVars()["tableId"])
    );
  };

  saveRecord = () => {};

  componentDidUpdate = prevProps => {
    // TODO: Update file data
  };

  edit = record => {
    this.setState({ editingKey: record.id, data: record });
  };

  modifyColumns = () => {
    if (this.props.tables.tableInfo.columns == undefined) {
      return [];
    }
    let columnArr = [...this.props.tables.tableInfo.columns];
    columnArr.push({
      title: "Operations",
      render: (text, record) => {
        const editable = this.isEditing(record);
        if (editable) {
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
                onConfirm={() => this.setState({ editingKey: "" })}
              >
                <Button>Cancel</Button>
              </Popconfirm>
            </div>
          );
        } else {
          return (
            <div>
              <Button
                disabled={this.state.editingKey !== ""}
                onClick={() => this.edit(record)}
                style={{ marginRight: "8px" }}
              >
                Edit
              </Button>
              <Button
                disabled={this.state.editingKey !== ""}
                onClick={() => this.delete(record)}
              >
                Delete
              </Button>
            </div>
          );
        }
      }
    });
    columnArr.map(col => {
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

  delete = record => {};

  isEditing = record => {
    return record.id === this.state.editingKey;
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
          paddingTop: "10px"
        }}
      >
        <Title>
          {this.state.tableName}
        </Title>
        <Table
          components={{
            body: {
              cell: this.EditableCell
            }
          }}
          dataSource={this.props.tables.tableInfo.data}
          columns={this.modifyColumns()}
        />
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
  _getIndivTable: getIndivTable
};

export default connect(mapStoreToProps, mapDispatchToProps)(
  withRouter(TableView)
);
//replace null with mapStateToProps to connect to the state variables
