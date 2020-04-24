import React, { Component } from "react";
import { connect } from "react-redux";
import { push } from "connected-react-router";
import { Input, Button, Row, Col, Typography, List, Tabs, Popconfirm, message } from 'antd';
import { getTableList } from "../../Redux/tables";
import { updateDialog } from "../../Redux/dialog";
import AddColsForm from "./AddColsFormComponent";
import axios from "axios";

const { TabPane } = Tabs;

class TableEdit extends Component {
  constructor(props) {
    super(props);
    if (!props.user.auth) {
      props._push('/login');
    }

    this.state = {
      originalCols: [],
      columns: [],
      tableName: props.table.tableName,
      editing: "",
      newVal: ""
    }
  }

  componentDidMount = () => {
    axios.post("/table/columns", { "auth": this.props.user.auth, "tableId": this.props.table.key })
      .then((response) => {
        this.setState({ columns: response.data });
      }).catch((err) => {
        message.error("Something went wrong, sorry")
      });
  }

  updateCols = () => {
    axios.post("/table/columns", { "auth": this.props.user.auth, "tableId": this.props.table.key })
      .then((response) => {
        this.setState({ columns: response.data });
      }).catch((err) => {
        message.error("Something went wrong, sorry")
      });
  }

  handleDelete = (item) => {
    let reqBody = {
      auth: this.props.user.auth,
      tableId: this.props.table.key,
      columnName: item
    }
    axios.post('/table/deleteColumn', reqBody)
      .then((response) => {
        message.success("Deleted column")
        let cols = this.state.columns.filter((val) => val !== item);
        this.setState({ columns: cols });
      }).catch((error) => {
        message.error("Failed to delete column");
      })
  }

  handleEdit = (item) => {
    this.setState({ editing: item, newVal: item });
  }
  handleCancel = (item) => {
    this.setState({ editing: "", newVal: "" });
  }

  handleSave = (item) => {
    if(this.state.newVal == "" || this.state.columns.includes(this.state.newVal)) {
      message.error("This column name is either already used or blank")
    } else {
      let reqBody = {
        auth: this.props.user.auth,
        tableId: this.props.table.key,
        originalColumn: item,
        newColumn: this.state.newVal
      }
      axios.post('/table/modifyColumn', reqBody)
        .then((response) => {
          message.success("Changed column name");
          let ind = this.state.columns.findIndex((val) => val === item);
          let cols = this.state.columns;
          cols[ind] = this.state.newVal;
          this.setState({ editing: "", newVal: "", columns: cols });
        }).catch((err) => {
          message.error("Failed to rename the column");
        });
    }
  }

  handleChange = (event) => {
    console.log(event.target.value);
    if(/^[a-zA-Z0-9() ]+$/.test(event.target.value) || event.target.value == "") {
      this.setState({newVal: event.target.value});
    } else {
      message.error("Please enter letters or numbers only.")
    }
  }

  handleTableName = (event) => {
    if(/^[a-zA-Z0-9() ]+$/.test(event.target.value) || event.target.value == "") {
      this.setState({tableName: event.target.value});
    } else {
      message.error("Please enter letters or numbers only.")
    }
  }

  handleTableNameSubmit = (tableName) => {
    if(tableName != "") {
      let reqBody = {
        auth: this.props.user.auth,
        tableId: this.props.table.key,
        name: this.state.tableName
      }
      axios.post('/table/modifyTableName', reqBody)
        .then((response) => {
          message.success("Changed table name");
          this.props._getTableList(this.props.user.auth);
        }).catch((err) => {
          message.error("Failed to rename the column");
        });
    } else {
      message.error("Table name cannot be blank")
    }
    
  }

  handleTabChange = (key) => {
    if(key == 2) {
      axios.post("/table/columns", { "auth": this.props.user.auth, "tableId": this.props.table.key })
      .then((response) => {
        this.setState({ columns: response.data });
      }).catch((err) => {
        message.error("Something went wrong, sorry")
      });
    }
  }

  render() {
    return (
      <div>
        <Tabs defaultActiveKey="1" onChange={this.handleTabChange}>
          <TabPane tab="Edit Table Name" key="1">
            <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
              <Col lg={18}>
                <Input placeholder="Table Name" defaultValue={this.state.tableName} value={this.state.tableName} onChange={this.handleTableName}/>
              </Col>
              <Col lg={4}>
                <Button
                  type="primary"
                  onClick={() => this.handleTableNameSubmit(this.state.tableName)}>
                  Save
              </Button>
              </Col>
            </Row>
          </TabPane>
          <TabPane tab="Edit Table Columns" key="2">
            <List
              dataSource={this.state.columns}
              renderItem={item => (
                <List.Item key={item}
                  actions={item==="id" ? [] : [
                    (this.state.editing === item ?
                      <Button type="primary" onClick={() => this.handleSave(item)}>Save</Button>
                      :
                      <Button type="primary" onClick={() => this.handleEdit(item)}>Rename</Button>
                    ),
                    (this.state.editing === item ?
                      <Button type="danger" onClick={() => this.handleCancel(item)}>Cancel</Button>
                      :
                      <Popconfirm
                        title="Are you sure delete this column? It cannot be recovered after this action."
                        onConfirm={() => this.handleDelete(item)}
                        okText="Yes"
                        cancelText="No"
                      >
                        <Button type="danger">Delete</Button>
                      </Popconfirm>
                    )
                  ]}>
                  {this.state.editing === item ? <Input value={this.state.newVal} onChange={this.handleChange}/> : item}
                </List.Item>
              )} />
          </TabPane>
          <TabPane tab="Add Table Columns" key="3">
            <AddColsForm tableId={this.props.table.key} updateCols={this.props.updateCols}/>
          </TabPane>
        </Tabs>
      </div>
    )
  }
}


const mapStoreToProps = state => {
  return {
    user: state.user,
    location: state.router.location
  };
};

const mapDispatchToProps = {
  _updateDialog: updateDialog,
  _getTableList: getTableList,
  _push: push
};

export default connect(mapStoreToProps, mapDispatchToProps)(TableEdit);
//replace null with mapStateToProps to connect to the state variables

