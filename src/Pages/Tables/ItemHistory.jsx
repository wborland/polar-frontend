import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { push } from "connected-react-router";
import { Skeleton, Table } from "antd";
import "antd/dist/antd.css";
import { getItemHistory } from "../../Redux/tables";

class ItemHistory extends Component {
  componentDidMount = () => {
    console.log(this.props.tables.tableInfo.columns);
    this.columns.push(...this.props.tables.tableInfo.columns);
    this.columns.push({
      title: "Event Time",
      dataIndex: "polarTime"
    });
    this.columns.push({
      title: "Event Description",
      dataIndex: "polarType"
    });
  };

  columns = [];

  render() {
    if (this.props.tables.ItemHistory != null) {
      return <Skeleton active />;
    }
    return (
      <div>
        <Table
          dataSource={this.props.tables.itemHistory}
          columns={this.columns}
          bordered
        />
      </div>
    );
  }
}

const mapStateToProps = state => ({
  userList: state.userList,
  user: state.user,
  tables: state.tables
});

const mapDispatchToProps = {
  _push: push,
  _getItemHistory: getItemHistory
};

export default connect(mapStateToProps, mapDispatchToProps)(
  withRouter(ItemHistory)
);
//replace null with mapStateToProps to connect to the state variables
