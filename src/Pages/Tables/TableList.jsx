import React, { Component } from "react";
import { Table, Button, Skeleton, Typography, Divider, message } from 'antd';
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { push } from "connected-react-router";
import { getTableList } from "../../Redux/tables";
import { updateDialog } from "../../Redux/dialog";
import AddTableButton from "../../Components/Tables/AddTableButton";
import TableEdit from "../../Components/Tables/TableEdit";
import axios from "axios";

const { Title } = Typography;

class TableList extends Component {
  constructor(props) {
    super(props);
    if (!props.user.auth) {
      props._push('/login');
    }

    this.state = {
      columns: [
        {
          title: "Tables",
          dataIndex: "tableName",
          render: (text, record) => <a href={"/inventory?tableId=" + record.key + "&tableName=" + record.tableName}>{text}</a>,
        }
      ]
    }
  }

  componentDidMount = () => {
    this.props._getTableList(this.props.user.auth);
    if (this.props.user.permissions.includes(9)) {
      let cols = this.state.columns;
      cols.push({
        title: "",
        align: "right",
        dataIndex: "operation",
        render: (text, record) =>
          <div>
            <Button type="primary" onClick={() => this.handleEdit(record)}> Edit Table Settings </Button>
            <Divider type="vertical" />
            <Button type="danger" onClick={() => this.handleDelete(record)}> Delete Table </Button>
          </div>
      });
      this.setState({ columns: cols });
    }
  }

  handleEdit = (row) => {
    this.props._updateDialog(true, {
      title: "Edit Table",
      content: (<TableEdit table={row} />)
    });
  }

  handleDelete = (row) => {
    this.props._updateDialog(true, {
      title: "Delete Table",
      content: this.dialogContentDelete(row)
    });
  }

  dialogContentDelete = tableInfo => {
    return (
      <div>
        <p>
          Are you sure you want to delete <b>{tableInfo.tableName}</b>?
        </p>
        <div style={{ textAlign: "right" }}>
          <Button style={{ marginRight: "10px" }} onClick={() => this.props._updateDialog(false, null)}>
            No
          </Button>
          <Button onClick={() => this.deleteTable(tableInfo.key)}>
            Yes
          </Button>
        </div>

      </div>
    );
  };


  deleteTable = (tableId) => {
    let reqBody = { "tableId": tableId, "auth": this.props.user.auth }
    axios.post("/table/delete", reqBody)
      .then((response) => {
        this.props._updateDialog(false, null)
        message.success("Table Deleted");
        this.props._getTableList(this.props.user.auth);
      }).catch((err) => {
        message.error("Failed to deleted table");
      });
  }

  render() {
    if (!this.props.tables.tableList || this.props.tables.tableList.length === 0) {
      return (
        <div style={{ background: "#FFFFFF", height: "calc(100vh - 64px)", maxHeight: "calc(100vh - 64px)", textAlign: "center", paddingTop: "10px" }}>
          <Title>Inventory</Title>
          <Skeleton active />
        </div>
      );
    }
    return (
      <div style={{ background: "#FFFFFF", minHeight: "calc(100vh - 64px)", textAlign: "center", paddingTop: "10px" }}>
        <Title>Inventory</Title>
        <Table
          dataSource={this.props.tables.tableList}
          columns={this.state.columns}
          pagination={{ responsive: true, defaultPageSize: 10, showSizeChanger: true, pageSizeOptions: ['5', '10', '15', '20', '25', '50'] }}
          footer={() => this.props.user.permissions.includes(9) ? <AddTableButton /> : ""}
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
  _push: push,
  _getTableList: getTableList,
  _updateDialog: updateDialog
};

export default connect(mapStoreToProps, mapDispatchToProps)(withRouter(TableList));
//replace null with mapStateToProps to connect to the state variables
