import { GET_ALL_EVENTS, GET_EVENT, GET_RSVP_LIST } from "../action_types";
import axios from "axios";
import { message } from "antd";
import moment from "moment";

// Action creators
const getEvents = eventsList => ({
  type: GET_ALL_EVENTS,
  eventsList
});

const getEvent = event => ({
  type: GET_EVENT,
  event
});

const getRsvp = rsvpList => ({
  type: GET_RSVP_LIST,
  rsvpList
});

// Initial dialog state
const initialState = {
  eventsList: [],
  currEvent: null,
  rsvpList: []
};

// Action helpers
export const getEventsList = auth => dispatch => {
  //TODO: API Call
  axios
    .post("/event/all", { auth: auth })
    .then(response => {
      let events = response.data;
      events = events.sort(
        (a, b) => moment(a.date).unix() - moment(b.date).unix()
      );
      dispatch(getEvents(events));
    })
    .catch(err => {
      message.error("Failed to load events");
    });
};

export const getEventById = data => dispatch => {
  //TODO: API Call
  axios
    .post("/event/details", data)
    .then(response => {
      console.log("response", response);
      dispatch(getEvent(response.data));
    })
    .catch(err => {
      message.error("Failed to load event");
    });
};

export const getRsvpList = data => dispatch => {
  axios
    .post("/event/rsvpList", data)
    .then(response => {
      console.log("response", response);
      let returnArr = [];
      for (let i in response.data) {
        let curr = response.data[i];
        returnArr.push({
          userId: curr[0],
          firstName: curr[1],
          lastName: curr[2],
          key: i
        });
      }
      dispatch(getRsvp(returnArr));
    })
    .catch(err => {
      console.log(err.response);
      message.error("Failed to load event");
    });
};

const eventsReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_ALL_EVENTS:
      return Object.assign({}, state, { eventsList: action.eventsList });
    case GET_EVENT:
      return Object.assign({}, state, { currEvent: action.event });
    case GET_RSVP_LIST:
      return Object.assign({}, state, { rsvpList: action.rsvpList });
    default:
      return state;
  }
};
export default eventsReducer;
