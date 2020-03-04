import React, { Component } from "react";
import { connect } from "react-redux";
import { push } from "connected-react-router";
import { Form, Icon, Input, Button, Radio, Select, Upload, Typography } from 'antd';
import { getRoleList } from "../Redux/roles";
import { getUserList } from "../Redux/listUsers";
import { CloudUploadOutlined } from '@ant-design/icons';

const { Option, OptGroup } = Select;
const { Title } = Typography;
const { TextArea } = Input;

class EmailComponent extends Component {
  constructor(props) {
    super(props);
    if (!props.user.auth) {
      props._push('/login');
    }

    this.state = {
      roles: [],
      users: [],
      fileList: [],
      uploading: false,

    }
  }

  componentDidMount = () => {
    this.props._getRoleList(this.props.user.auth);
    this.props._getUserList(this.props.user.auth);
  }

  componentDidUpdate = (prevProps) => {
    if (this.props.roles.listRoles != prevProps.roles.listRoles) {
      let rolesArr = this.props.roles.listRoles
      let roles = this.state.roles;
      for (let i in rolesArr) {
        roles.push(<Option value={"r" + rolesArr[i].key} label={rolesArr[i].roleName}>{rolesArr[i].roleName}</Option>)
      }
      this.setState({ "roles": roles });
    }
    if (this.props.userList != prevProps.userList) {
      let usersArr = this.props.userList.showUsers
      let users = this.state.users;
      for (let i in usersArr) {
        let display = "";
        if (usersArr[i].firstName && usersArr[i].lastName) {
          display = usersArr[i].firstName + " " + usersArr[i].lastName + " - "
        }
        display += usersArr[i].email
        users.push(<Option value={"u" + usersArr[i].key} label={display}>{display}</Option>)
      }
      this.setState({ "users": users });
    }
  }

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const roles = [];
        const users = [];
        values.To.forEach((key) => {
          if (key.charAt(0) === "r") {
            roles.push(key.substring(1));
          } else {
            users.push(key.substring(1));
          }
        });
        const reqBody = {
          "auth": this.props.user.auth,
          "roles": roles,
          "users": users,
          "subject": values.subject,
          "body": values.body,
        }
        if(this.state.fileList.length !== 0) {
          // TODO: API request with form data
          let formData = new FormData();
          formData.append('file', this.state.fileList[0]);
          formData.append('body', reqBody);
        } else {
          // TODO: API request as normal json
        }
        
      }
    });
  };

  handleFileBeforeUpload = (file) => {
    this.setState({
      fileList: [file]
    });
    return false;
  }

  handleFileRemove = (file) => {
    this.setState({fileList: []});
    return {fileList: []}
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: {
        md: { span: 24 },
        lg: { span: 2 },
      },
      wrapperCol: {
        md: { span: 24 },
        lg: { span: 22 },
      },
    };
    return (
      <div>
        <Form {...formItemLayout} onSubmit={this.handleSubmit} style={{ background: "#FFFFFF", padding: "10vh", textAlign: "center", minHeight: "calc(100vh - 64px)" }}>
          <Form.Item label="To">
            {getFieldDecorator('To', {
              rules: [
                {
                  required: true,
                  message: 'Please enter recipients',
                },
              ],
            })(
              <Select mode="multiple" placeholder="Recipients" optionFilterProp="label">
                <OptGroup label="Roles">
                  {this.state.roles}
                </OptGroup>
                <OptGroup label="Users">
                  {this.state.users}
                </OptGroup>
              </Select>
            )}
          </Form.Item>
          <Form.Item label="Subject">
            {getFieldDecorator('subject', {
              rules: [
                {
                  required: true,
                  message: 'Please enter a subject',
                },
              ],
            })(<Input />)}
          </Form.Item>
          <Form.Item label="Body">
            {getFieldDecorator('body', {
              rules: [
                {
                  required: true,
                  message: 'Please enter a message',
                },
              ],
            })(<TextArea
              autoSize={{ minRows: 4, maxRows: 20 }}
            />)}
          </Form.Item>
          <Form.Item style={{ textAlign: "right" }}>
            <Upload onRemove={this.handleFileRemove} beforeUpload={this.handleFileBeforeUpload} fileList={this.state.fileList}>
              <Button disabled={this.state.fileList.length !== 0}>
                <CloudUploadOutlined /> Click to Upload a File
              </Button>

            </Upload>
          </Form.Item>
          <Form.Item style={{ textAlign: "right" }}>
            <Button type="primary" htmlType="submit" loading={this.state.uploading}>Submit</Button>
          </Form.Item>
        </Form>
      </div>
    )
  }
}

const EmailForm = Form.create({ name: 'Email' })(EmailComponent);

const mapStoreToProps = state => {
  return {
    user: state.user,
    roles: state.roles,
    userList: state.userList
  };
};

const mapDispatchToProps = {
  _getRoleList: getRoleList,
  _getUserList: getUserList,
  _push: push
};

export default connect(mapStoreToProps, mapDispatchToProps)(EmailForm);
//replace null with mapStateToProps to connect to the state variables

