import React, { Component } from "react";
import { Table, List } from 'antd';
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { push } from "connected-react-router";
import { getEventsList } from "../../Redux/events";
import moment from "moment";


class ListView extends Component {
  constructor(props) {
    super(props);
    if (!props.user.auth) {
      props._push('/login');
    }
    this.state = {
      eventsList: props.events.eventsList,
      columns:  [
        {
          title: "Event",
          dataIndex: "name",
          key: "name",
          render: (text, record) => (
            <a href={"/events?id=" + record.id + "&name=" + record.name}>
              <b>{record.name}</b>
            </a>
          )
        },
        {
          title: "Starting Date",
          dataIndex: "startTime",
          key: "startTime",
          render: (text, record) => (
            <p>{moment(record.startTime).local().format("LLL")}</p>
          )
        },
        {
          title: "Ending Date",
          dataIndex: "endTime",
          key: "endTime",
          render: (text, record) => (
            <p>{moment(record.endTime).local().format("LLL")}</p>
          )
        },
      ]
    }
  }

  componentDidMount = () => {
    this.props._getEventsList(this.props.user.auth);
    this.setState({eventsList: this.props.events.eventsList})
  }

  componentDidUpdate = (prevProps) => {
    if (this.props.events != prevProps.events) {
      for (let i in this.props.events.eventsList) {
        let data = this.props.events.eventsList[i];
        data.startTime = moment(data.startTime).local().format("LLL")
        data.endTime = moment(data.endTime).local().format("LLL")
      }
      let today = moment();
      let list = this.props.events.eventsList.filter((data) => {
        return moment(data.startTime).isAfter(today)
      });
      this.setState({eventsList: list});
    }
  }

  render() {
    return (
      <Table columns={this.state.columns} dataSource={this.state.eventsList} rowKey={(record) => record.id}/>
    );
  }
}

const mapStoreToProps = state => {
  return {
    user: state.user,
    events: state.events
  };
};

const mapDispatchToProps = {
  _push: push,
  _getEventsList: getEventsList,
};

export default connect(mapStoreToProps, mapDispatchToProps)(withRouter(ListView));
//replace null with mapStateToProps to connect to the state variables
