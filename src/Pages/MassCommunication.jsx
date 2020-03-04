import React, { Component } from "react";
import TextForm from "../Components/TextComponent";
import EmailForm from "../Components/EmailComponent";
import { Radio, Typography } from 'antd';

const {Title} = Typography;

class MassCommunication extends Component {
  constructor(props) {
    super(props);
    this.state = { messageType: "email" }
  }

  handleMessageType = (e) => {
    if (e.target.value === "email") {
      this.setState({
        messageType: "email"
      });
    } else {
      this.setState({
        messageType: "text"
      });
    }
  }

  render() {
    return (
      <div style={{ background: "#FFFFFF", minHeight: "calc(100vh - 64px)", textAlign: "center", paddingTop: "10px" }}>
        <Title>Communication</Title>

        <Radio.Group defaultValue={this.state.messageType} onChange={this.handleMessageType}>
          <Radio.Button value="email">Email</Radio.Button>
          <Radio.Button value="text">Text</Radio.Button>
        </Radio.Group>
        {this.state.messageType === "email" ? <EmailForm /> : <TextForm />}
      </div>
    );
  }
}

export default MassCommunication;
//replace null with mapStateToProps to connect to the state variables
