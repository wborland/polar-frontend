import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { push } from "connected-react-router";
import TableList from "./TableList";
import TableView from "./TableView";
import { Button, Skeleton, Table } from "antd";
import { updateDialog } from "../../Redux/dialog";
import { getTableHistory, resetTableHistory } from "../../Redux/tables";

class TableHistory extends Component {
  componentDidMount = () => {
    console.log(this.props);
    this.props._getTableHistory(this.props.user.auth, this.props.table.key);
  };

  columns = [
    {
      title: "Event Time",
      dataIndex: "time"
    },
    {
      title: "Event",
      dataIndex: "value"
    }
  ];

  componentWillUnmount = () => {
    this.props._resetTableHistory();
  };

  render() {
    if (this.props.tables.tableHistory == null) {
      return <Skeleton active />;
    }
    return (
      <div>
        <Table
          dataSource={this.props.tables.tableHistory}
          columns={this.columns}
        />
        <Button onClick={() => this.props._updateDialog(false, null)}>
          Close
        </Button>
      </div>
    );
  }
}

const mapStoreToProps = state => {
  return {
    user: state.user,
    router: state.router,
    tables: state.tables
  };
};

const mapDispatchToProps = {
  _push: push,
  _updateDialog: updateDialog,
  _getTableHistory: getTableHistory,
  _resetTableHistory: resetTableHistory
};

export default connect(mapStoreToProps, mapDispatchToProps)(
  withRouter(TableHistory)
);
