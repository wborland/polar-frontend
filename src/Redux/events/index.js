import { GET_ALL_EVENTS, GET_EVENT } from "../action_types";
import axios from "axios";
import { message } from "antd";
import moment from 'moment';

// Action creators
const getEvents = eventsList => ({
  type: GET_ALL_EVENTS,
  eventsList
});

const getEvent = event => ({
  type: GET_EVENT,
  event
});

// Initial dialog state
const initialState = {
  eventsList: [],
  currEvent: null
};

// Action helpers
export const getEventsList = auth => dispatch => {
  //TODO: API Call
  axios.post("/event/all", { auth: auth })
    .then(response => {
      let events = response.data;
      events = events.sort((a,b) => moment(a.date).unix() - moment(b.date).unix());
      dispatch(getEvents(events));
    })
    .catch(err => {
      message.error("Failed to load events");
    }); 
};

export const getEventById = (data) => dispatch => {
  //TODO: API Call
  axios.post("/event/details", data)
    .then(response => {
      console.log("response", response);
      dispatch(getEvent(response.data));
    })
    .catch(err => {
      message.error("Failed to load event");
    }); 
};

const eventsReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_ALL_EVENTS:
      return Object.assign({}, state, { eventsList: action.eventsList });
    case GET_EVENT:
      return Object.assign({}, state, { currEvent: action.event });
    default:
      return state;
  }
};
export default eventsReducer;
