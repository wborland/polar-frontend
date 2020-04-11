import React, { Component } from "react";
import { Calendar } from 'antd';
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { push } from "connected-react-router";
import { getEventsList } from "../../Redux/events";
import { updateDialog } from "../../Redux/dialog";
import moment from "moment";


class CalendarView extends Component {
  constructor(props) {
    super(props);
    if (!props.user.auth) {
      props._push('/login');
    }
    this.state = {
      mode: "month"
    }
  }

  componentDidMount = () => {
    this.props._getEventsList(this.props.user.auth);
  }

  componentDidUpdate = (prevProps) => {
    if(this.props.events != prevProps.events) {
      for(let i in this.props.events.eventsList) {
        let data = this.props.events.eventsList[i];
        data.date = moment(data.date).format("LLL")
      }
    }
  }

  dateCellRender = (val) =>  {
    if(this.props.events.eventsList.length !==  0) {
      let dateEvents = this.props.events.eventsList.filter((data) => moment(moment(data.date).format("LL")).isSame(val.format("LL")));
      let view = dateEvents.map((data) => {
        return (
          <li>
            <a href={"/events?id=" + data.id + "&name=" + data.name}>
              {moment(data.date).format("LT")}: <b>{data.name}</b>
            </a>
          </li>
        )
      });
      return (<ul>{view}</ul>);
    }
  }

  monthCellRender = (val) =>  {
    if(this.props.events.eventsList.length !==  0) {
      let dateEvents = this.props.events.eventsList.filter((data) => moment(moment(data.date).format("LL")).isSame(val.format("LL"), 'month'));
      let view = dateEvents.map((data) => {
        return (
          <li>
            <a href={"/events?id=" + data.id + "&name=" + data.name}>
              {moment(data.date).format("lll")}: <b>{data.name}</b>
            </a>
          </li>
        )
      });
      return (<ul>{view}</ul>);
    }
  }

  onPanelChange = (date, mode) => {
    this.setState({"mode": mode});
  }

  onSelect = (val) => {
    if(this.props.events.eventsList.length !==  0) {
      if(this.state.mode ===  "month") {
        let dateEvents = this.props.events.eventsList.filter((data) => moment(moment(data.date).format("LL")).isSame(val.format("LL")));
        let view = dateEvents.map((data) => {
          return (
            <li>
              <a href={"/events?id=" + data.id + "&name=" + data.name}>
                {moment(data.date).format("LT")}: <b>{data.name}</b>
              </a>
            </li>
          )
        });
        if(view.length !== 0)  {
          this.props._updateDialog(true, {
            title: "Events on " + moment(val).format("LL"),
            content: (<ul>{view}</ul>)
          });
        }
      } else if(this.state.mode === "year") {
        let dateEvents = this.props.events.eventsList.filter((data) => moment(moment(data.date).format("LL")).isSame(val.format("LL"), 'month'));
        let view = dateEvents.map((data) => {
          return (
            <li>
              <a href={"/events?id=" + data.id + "&name=" + data.name}>
                {moment(data.date).format("LT")}: <b>{data.name}</b>
              </a>
            </li>
          )
        });
        if(view.length !== 0)  {
          this.props._updateDialog(true, {
            title: "Events on " + moment(val).format("LL"),
            content: (<ul>{view}</ul>)
          });
        }
      }
      
    }
  }

  render() {
    return (
      <Calendar dateCellRender={this.dateCellRender} monthCellRender={this.monthCellRender} onSelect={this.onSelect} onPanelChange={this.onPanelChange}/>
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
  _updateDialog: updateDialog,

};

export default connect(mapStoreToProps, mapDispatchToProps)(withRouter(CalendarView));
//replace null with mapStateToProps to connect to the state variables
