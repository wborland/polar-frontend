import { GET_ALL_EVENTS } from "../action_types";
import axios from "axios";
import { message } from "antd";
import moment from 'moment';

// Action creators
const getEvents = eventsList => ({
  type: GET_ALL_EVENTS,
  eventsList
});

// Initial dialog state
const initialState = {
  eventsList: []
};

// Action helpers
export const getEventsList = auth => dispatch => {
  // Simulate data call
  let events = [
    {id: "1", name: "Old Event 1", date: "2020-4-1 12:00"},
    {id: "2", name: "Event 1", date: "2020-4-20 1:00"},
    {id: "4", name: "Event 3", date: "2020-4-22 11:00"},
    {id: "3", name: "Event 2", date: "2020-4-21 17:00"},
    {id: "5", name: "Event 3", date: "2020-4-22 1:00"},
  ]
  events = events.sort((a,b) => moment(a.date).unix() - moment(b.date).unix())
  dispatch(getEvents(events));

  /* 
  TODO: API Call
  axios.post("/events/all", { auth: auth })
    .then(response => {
        let events = response.data;

        
        dispatch(getEvents(events));
    })
    .catch(err => {
      message.error("Failed to load events");
    }); 
  */
};


const eventsReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_ALL_EVENTS:
      return Object.assign({}, state, { eventsList: action.eventsList });
    default:
      return state;
  }
};
export default eventsReducer;
