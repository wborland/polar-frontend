import React, { Component } from "react";
import { Table, Button, Skeleton, Typography } from 'antd';
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { push } from "connected-react-router";

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
      ]
    }
  }

  componentDidMount = () => {
    // TODO: Make API request to get list of files

  }

  componentDidUpdate = (prevProps) => {
    // TODO: Update files list

  }

  handleEdit = (tableKey) => {
    console.log("Editing Table:", tableKey);
  }

  handleDelete = (tableKey) => {
    console.log("Deleting Table:", tableKey);
  }

  render() {
    if (!this.props.files) {
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
          dataSource={this.props.files}
          columns={this.state.columns}
        />
      </div>
    );
  }
}

const mapStoreToProps = state => {
  return {
    user: state.user,
    // TODO: Add files list
  };
};

const mapDispatchToProps = {
  // TODO: API call to get files
  _push: push
};

export default connect(mapStoreToProps, mapDispatchToProps)(withRouter(TableList));
//replace null with mapStateToProps to connect to the state variables
