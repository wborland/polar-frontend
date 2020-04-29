import React, { Component } from "react";
import { connect } from "react-redux";
import { updateDialog } from "../../Redux/dialog";
import EmailForm from "./EmailComponent";
import EmailTemplate1Form from "./EmailTemplate1";
import EmailTemplate2Form from "./EmailTemplate2";
import EmailTemplate3Form from "./EmailTemplate3";
import { Carousel, Radio, Typography } from 'antd';
import template1 from "../../Assets/template1.png"
import template2 from "../../Assets/template2.png"
import template3 from "../../Assets/template3.png"


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

  handlePreview = (e) => {
    console.log("e", e)
    e.preventDefault();
    this.props._updateDialog(true, {
      title: "Preview Email Templates",
      content: (
        <Carousel autoplay style={{textAlign: "center"}}>
          <div>
            <img src={template1} alt="Template 1"/>
            <h5>Email Template 1</h5>
            <br/>
          </div>
          <div>
            <img src={template2} alt="Template 2" />
            <h5>Email Template 2</h5>
            <br/>
          </div>
          <div>
            <img src={template3} alt="Template 3" />
            <h5>Email Template 3</h5>
            <br/>
          </div>
        </Carousel>
      )
    });
  }

  render() {
    return (
      <div style={{ background: "#FFFFFF", minHeight: "calc(100vh - 64px)", textAlign: "center", paddingTop: "10px" }}>
        <Radio.Group defaultValue={0} onChange={this.handleTemplateSelector}>
          <Radio.Button value={0}>Basic Email</Radio.Button>
          <Radio.Button value={1}>Template 1</Radio.Button>
          <Radio.Button value={2}>Template 2</Radio.Button>
          <Radio.Button value={3}>Template 3</Radio.Button>
        </Radio.Group>
        <br/>
        <a href="#" onClick={this.handlePreview}>Preview Templates</a>
        {this.state.template}
      </div>
    );
  }
}

const mapDispatchToProps = {
  _updateDialog: updateDialog
};

export default connect(null, mapDispatchToProps)(EmailSelector);
//replace null with mapStateToProps to connect to the state variables
