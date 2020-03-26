import React, { Component } from "react";
import { Table, Button, Skeleton, Typography, Divider } from 'antd';
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { push } from "connected-react-router";
import { getTableList } from "../../Redux/tables";

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
          dataIndex: "tableName"
        },
        {
          title: "Operations",
          align: "right",
          dataIndex: "operation",
          render: (text, record) =>
            <div>
              <Button onClick={() => this.handleEdit(record.key)}> Edit Table Settings </Button>
              <Divider type="vertical"/>
              <Button onClick={() => this.handleDelete(record.key)}> Delete Table </Button>
            </div>
        }
      ]
    }
  }

  componentDidMount = () => {
    this.props._getTableList(this.props.user.auth);
  }

  handleEdit = (tableKey) => {
    console.log("Editing Table:", tableKey);
  }

  handleDelete = (tableKey) => {
    console.log("Deleting Table:", tableKey);
  }

  render() {
    if (!this.props.tables.tableList || this.props.tables.tableList.length === 0) {
      return (
        <div style={{ background: "#FFFFFF", height: "calc(100vh - 64px)", textAlign: "center", paddingTop: "10px" }}>
          <Title>Inventory</Title>
          <Skeleton active />
        </div>
      );
    }
    return (
      <div style={{ background: "#FFFFFF", height: "calc(100vh - 64px)", textAlign: "center", paddingTop: "10px" }}>
        <Title>Inventory</Title>
        <Table
          dataSource={this.props.tables.tableList}
          columns={this.state.columns}
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
  _getTableList: getTableList
};

export default connect(mapStoreToProps, mapDispatchToProps)(withRouter(TableList));
//replace null with mapStateToProps to connect to the state variables
