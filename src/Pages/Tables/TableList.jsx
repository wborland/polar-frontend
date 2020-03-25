import React, { Component } from "react";
import { Table, Button, Skeleton, Typography, message } from 'antd';
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { push } from "connected-react-router";
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
          dataIndex: "tableName"
        },
        {
          title: "Operations",
          dataIndex: "operation",
          render: (text, record) =>
            <div>
              <Button onClick={this.handleEdit(record.key)}> Edit Table Settings </Button>
              <Button danger onClick={this.handleDelete(record.key)}> Delete Table </Button>
            </div>
        }
      ],
      tableList: []
    }
  }

  componentDidMount = () => {
    // TODO: Make API request to get list of files
    axios.post('/table/all', { "auth": this.props.user.auth })
      .then((response) => {
        console.log("response", response);
      }).catch((err) => {
        message.error("Failed to retrieve table")
      });
  }

  componentDidUpdate = (prevState) => {
    // TODO: Update files list

  }

  handleEdit = (tableKey) => {
    console.log("Editing Table:", tableKey);
  }

  handleDelete = (tableKey) => {
    console.log("Deleting Table:", tableKey);
  }

  render() {
    if (!this.state.tableList || this.state.tableList.length === 0) {
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
          dataSource={this.state.tableList}
          columns={this.state.columns}
        />
      </div>
    );
  }
}

const mapStoreToProps = state => {
  return {
    user: state.user,
  };
};

const mapDispatchToProps = {
  _push: push
};

export default connect(mapStoreToProps, mapDispatchToProps)(withRouter(TableList));
//replace null with mapStateToProps to connect to the state variables
