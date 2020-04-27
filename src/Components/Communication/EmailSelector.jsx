import React, { Component } from "react";
import EmailForm from "./EmailComponent";
import EmailTemplate1Form from "./EmailTemplate1";
import EmailTemplate2Form from "./EmailTemplate2";
import EmailTemplate3Form from "./EmailTemplate3";
import { Radio, Typography } from 'antd';

const {Title} = Typography;

class EmailSelector extends Component {
  constructor(props) {
    super(props);
    this.state = { template: <EmailForm /> }
  }

  handleTemplateSelector = (e) => {
    if (e.target.value === 1) {
      this.setState({
        template: <EmailTemplate1Form />
      });
    } else if (e.target.value === 2) {
      this.setState({
        template: <EmailTemplate2Form />
      });
    } else if (e.target.value === 3) {
      this.setState({
        template: <EmailTemplate3Form />
      });
    } else {
      this.setState({
        template: <EmailForm />
      });
    }
  }

  render() {
    return (
      <div style={{ background: "#FFFFFF", minHeight: "calc(100vh - 64px)", textAlign: "center", paddingTop: "5px" }}>
        <Radio.Group defaultValue={0} onChange={this.handleTemplateSelector}>
          <Radio.Button value={0}>Basic Email</Radio.Button>
          <Radio.Button value={1}>Template 1</Radio.Button>
          <Radio.Button value={2}>Template 2</Radio.Button>
          <Radio.Button value={3}>Template 3</Radio.Button>
        </Radio.Group>
        {this.state.template}
      </div>
    );
  }
}

export default EmailSelector;
//replace null with mapStateToProps to connect to the state variables
