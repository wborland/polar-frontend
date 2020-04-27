import {
  GET_ALL_EVENTS,
  GET_EVENT,
  GET_RSVP_LIST,
  GET_CHECKIN_TABLE,
  GET_EVENT_USERS
} from "../action_types";
import axios from "axios";
import { message } from "antd";
import moment from "moment";
import { updateDialog } from "../dialog";

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

const getCheckin = checkin => ({
  type: GET_CHECKIN_TABLE,
  checkin
});

const getEventUsers = users => ({
  type: GET_EVENT_USERS,
  users
});

// Initial dialog state
const initialState = {
  eventsList: [],
  currEvent: null,
  rsvpList: [],
  checkinCell: [],
  checkinHeader: []
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
      dispatch(getRsvp(response.data));
    })
    .catch(err => {
      message.error("Failed to load event");
      console.log(err.response.data);
    });
};

export const getCheckinTable = (auth, eventId) => dispatch => {
  axios
    .post("/event/checkInTable", { auth, eventId })
    .then(response => {
      let tempCols = [];
      for (let i in response.data[0]) {
        if (i == 0) continue;
        tempCols.push({
          title: response.data[0][i],
          dataIndex: response.data[0][i],
          editable: true
        });
      }

      let tempData = [];
      for (let i in response.data) {
        if (i == 0) {
          continue;
        }
        let temp = {};
        for (let j in response.data[i]) {
          temp[response.data[0][j]] = response.data[i][j];
        }
        temp["key"] = response.data[i][0];
        tempData.push(temp);
      }

      dispatch(getCheckin({ header: tempCols, data: tempData }));
    })
    .catch(err => {
      console.log(err.response);
      message.error("Something went wrong, please try again", 5);
    });
};

export const modifyCheckinRow = (auth, eventId, contents) => dispatch => {
  let sendArr = Object.values(contents);
  sendArr.pop();
  axios
    .post("/event/modifyRow", { auth, eventId, contents: sendArr })
    .then(response => {
      if (response.status === 200) {
        message.success("Row saved successfully", 3);
        dispatch(getCheckinTable(auth, eventId));
      } else {
        message.error("Saving failed, please try again", 5);
      }
    })
    .catch(err => {
      console.log(err.response);
      message.error("Saving failed, please try again", 5);
    });
};

export const addCheckinRow = (auth, eventId, contents) => dispatch => {
  axios
    .post("/event/addEntry", {
      auth,
      eventId,
      contents: Object.values(contents)
    })
    .then(response => {
      if (response.status === 200) {
        message.success("Person successfully added", 3);
        dispatch(getCheckinTable(auth, eventId));
        dispatch(updateDialog(false, null));
      } else {
        message.error("Error adding person, please try again", 5);
      }
    })
    .catch(err => {
      console.log(err.response);
      message.error("Error adding person, please try again", 5);
    });
};

export const closeEvent = (auth, eventId) => dispatch => {
  axios
    .post("/event/close", { auth, id: eventId })
    .then(response => {
      if (response.status === 200) {
        message.success("Successfully closed event", 3);
        dispatch(getEventById({ auth, id: eventId }));
      }
    })
    .catch(err => {
      console.log(err.response);
      message.error("Something went wrong, please try again", 5);
    });
};

export const getUsers = (auth, eventId) => dispatch => {
  axios
    .post("/message/getUsers", { auth, eventId })
    .then(response => {
      console.log(response.data);
      dispatch(getEventUsers(response.data));
    })
    .catch(err => {
      console.log(err.response);
      message.error("Something went wrong, please try again", 5);
    });
};

export const checkUserIn = (auth, userId, eventId) => dispatch => {
  axios
    .post("/event/checkIn", { auth, userId, eventId })
    .then(response => {
      console.log(response.data);
      message.success("User successfully checked-in");
      dispatch(getCheckinTable(auth, eventId));
    })
    .catch(err => {
      console.log(err.response);
      message.error(
        "Something went wrong while checking the user in, please try again",
        5
      );
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
    case GET_CHECKIN_TABLE:
      return Object.assign({}, state, {
        checkinHeader: action.checkin.header,
        checkinCell: action.checkin.data
      });
    case GET_EVENT_USERS:
      return Object.assign({}, state, { notEventUsers: action.users });
    default:
      return state;
  }
};
export default eventsReducer;
