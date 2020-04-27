import React, { Component } from "react";
import { connect } from "react-redux";
import { push } from "connected-react-router";
import { Table, Skeleton, Input, Button, Popconfirm } from "antd";
import {
  getRsvpList,
  getEventById,
  getCheckinTable,
  modifyCheckinRow,
  checkUserIn
} from "../../Redux/events";
import AddPerson from "./AddPerson";
import { updateDialog } from "../../Redux/dialog";

class CheckinTable extends Component {
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

  componentDidMount = () => {
    this.props._getCheckinTable(
      this.props.user.auth,
      parseInt(this.props.router.location.query.id)
    );
    if (this.props.events.currEvent == null) {
      this.props._getEventById({
        auth: this.props.user.auth,
        id: parseInt(this.props.router.location.query.id)
      });
    }
  };

  setValue = (dataIndex, e) => {
    let temp = this.state.data;
    temp[dataIndex] = e.target.value;
    this.setState({ data: temp });
  };

  saveRecord = () => {
    this.props._modifyCheckinRow(
      this.props.user.auth,
      this.getUrlVars()["id"],
      this.state.data
    );
    this.setState({ editingKey: "" });
  };

  edit = record => {
    this.setState({ editingKey: record.userId, data: { ...record } });
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
        {editing == true
          ? <Input
              value={this.state.data[dataIndex]}
              onChange={e => this.setValue(dataIndex, e)}
            />
          : children}
      </td>
    );
  };

  cancelEdit = () => {
    for (let i in this.props.events.checkinCell) {
      if (this.props.events.checkinCell[i].userId === this.state.editingKey) {
        this.setState({ data: this.props.events.checkinCell[i] }, () =>
          this.setState({
            editingKey: ""
          })
        );
      }
    }
  };

  modifyColumns = () => {
    if (this.props.events.checkinHeader == undefined) {
      return [];
    }
    let columnArr = [...this.props.events.checkinHeader];
    for (let i in columnArr) {
      if (i == 2) {
        columnArr[i].render = (text, record) => {
          if (record.checkedIn == 1) {
            return <Button disabled>Checked In</Button>;
          } else {
            return (
              <Button
                onClick={() =>
                  this.props._checkUserIn(
                    this.props.user.auth,
                    record.userId,
                    this.props.events.currEvent.id
                  )}
              >
                Check In
              </Button>
            );
          }
        };
      }
      if (i < 3) {
        columnArr[i].editable = false;
      }
    }
    if (this.props.user.permissions.includes(4)) {
      columnArr.push({
        title: "Operations",
        render: (text, record) => {
          const editable = this.isEditing(record);
          if (editable && this.props.user.permissions.includes(4)) {
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
          } else if (
            this.props.user.permissions.includes(4) &&
            this.props.events.currEvent != null &&
            this.props.events.currEvent.closed != true
          ) {
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

  isEditing = record => {
    return record.userId === this.state.editingKey;
  };

  componentDidUpdate = prevProps => {
    if (this.props.events.currEvent != prevProps.events.currEvent) {
      this.componentDidMount();
    }
  };

  render() {
    if (this.props.events.currEvent == null) {
      return <Skeleton active />;
    }
    return (
      <div
        style={{
          background: "#FFFFFF",
          minHeight: "calc(100vh - 64px)",
          textAlign: "center",
          paddingTop: "10px"
        }}
      >
        <h4>
          {this.props.events.currEvent.name}
        </h4>
        <Table
          components={{ body: { cell: this.EditableCell } }}
          dataSource={this.props.events.checkinCell}
          columns={this.modifyColumns()}
        />
        {this.props.user.permissions.includes(4)
          ? <Button
              type="primary"
              onClick={() =>
                this.props._updateDialog(true, {
                  title: "Add new person",
                  content: <AddPerson />
                })}
            >
              Add Person
            </Button>
          : null}
      </div>
    );
  }
}

const mapStoreToProps = state => {
  return {
    user: state.user,
    events: state.events,
    router: state.router
  };
};

const mapDispatchToProps = {
  _push: push,
  _getRsvpList: getRsvpList,
  _getEventById: getEventById,
  _getCheckinTable: getCheckinTable,
  _modifyCheckinRow: modifyCheckinRow,
  _updateDialog: updateDialog,
  _checkUserIn: checkUserIn
};

export default connect(mapStoreToProps, mapDispatchToProps)(CheckinTable);
//replace null with mapStateToProps to connect to the state variables
