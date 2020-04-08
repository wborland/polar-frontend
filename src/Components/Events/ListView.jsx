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
          title: "Date",
          dataIndex: "date",
          key: "date",
          render: (text, record) => (
            <p>{moment(record.date).format("LL")}</p>
          )
        },
        {
          title: "Time",
          dataIndex: "date",
          key: "time",
          render: (text, record) => (
            <p>{moment(record.date).format("LT")}</p>
          )
        },
        {
          title: "Event",
          dataIndex: "name",
          key: "name",
          render: (text, record) => (
            <a href={"/events?id=" + record.id + "&name=" + record.name}>
              <b>{record.name}</b>
            </a>
          )
        }
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
        data.date = moment(data.date).format("LLL")
      }
      let today = moment();
      let list = this.props.events.eventsList.filter((data) => {
        console.log("Data.date", data.date,  "today", today.toString(), moment(data.date).isAfter(today) )
        return moment(data.date).isAfter(today)
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
