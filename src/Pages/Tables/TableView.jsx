import React, { Component } from "react";
import { Table, Button, Skeleton, Typography } from 'antd';
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { push } from "connected-react-router";

const { Title } = Typography;

class TableView extends Component {
  constructor(props) {
    super(props);
    if (!props.user.auth) {
      props._push('/login');
    }

    this.state = {
      columns: []
    }
  }

  componentDidMount = () => {
    // TODO: Make API request to get file data

  }

  componentDidUpdate = (prevProps) => {
    // TODO: Update file data

  }

  render() {
    if (!this.props.fileData) {
      return (
        <div style={{ background: "#FFFFFF", height: "calc(100vh - 64px)", textAlign: "center", paddingTop: "10px" }}>
          <Title>Table Name</Title>
          <Skeleton active />
        </div>
      );
    }
    return (
      <div style={{ background: "#FFFFFF", height: "calc(100vh - 64px)", textAlign: "center", paddingTop: "10px" }}>
        <Title>Table Name</Title>
        <Table
          dataSource={this.props.fileData}
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

export default connect(mapStoreToProps, mapDispatchToProps)(withRouter(TableView));
//replace null with mapStateToProps to connect to the state variables
