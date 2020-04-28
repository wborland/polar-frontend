import {
  GET_ALL_EVENTS,
  GET_EVENT,
  GET_RSVP_LIST,
  GET_CHECKIN_TABLE,
  GET_COL_TYPES
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

const getCols = cols => ({
  type: GET_COL_TYPES,
  cols
});

// Initial dialog state
const initialState = {
  eventsList: [],
  currEvent: null,
  rsvpList: [],
  checkinCell: [],
  checkinHeader: [],
  checkinCols: []
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
        if (i == 1) {
          tempCols.push({
            title: "First Name",
            dataIndex: response.data[0][i]
          });
          continue;
        } else if (i == 2) {
          tempCols.push({
            title: "Last Name",
            dataIndex: response.data[0][i]
          });
          continue;
        } else if (i == 3) {
          tempCols.push({
            title: "Check In",
            dataIndex: response.data[0][i]
          });
          continue;
        }
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

export const getTableCols = (auth, eventId) => dispatch => {
  axios
    .post("/event/colTypes", { auth, eventId })
    .then(response => {
      dispatch(getCols(response.data));
    })
    .catch(err => {
      console.log(err.response);
      message.error("Something went wrong, please try again", 5);
    });
};

export const sendColUpdates = (auth, eventId, cols) => dispatch => {
  let editList = [];
  let addList = [];
  for (let i in cols) {
    let curr = cols[i];
    if (curr.prev === null && curr.next !== "") {
      let obj = {};
      obj["Question"] = curr.next;
      obj["IsRsvp"] = curr.rsvp;
      addList.push(obj);
    }
    if (
      (curr.prev != curr.next || curr.prevRsvp != curr.rsvp) &&
      curr.next !== "" &&
      curr.prev !== null
    ) {
      let obj = {};
      obj["before"] = curr.prev;
      obj["Question"] = curr.next;
      obj["IsRsvp"] = curr.rsvp;
      editList.push(obj);
    }
  }

  if (editList.length > 0) {
    axios
      .post("/event/modifyCol", { auth, eventId, data: editList })
      .then(response => {
        if (response.status == 200) {
          if (addList.length > 0) {
            axios
              .post("/event/insertCol", { auth, eventId, data: addList })
              .then(tresponse => {
                message.success(
                  "Successfully inserted and modified check in columns"
                );
                dispatch(getTableCols(auth, eventId));
                dispatch(updateDialog(false, null));
              });
          } else {
            message.success("Successfully modified the columns requested");
            dispatch(getTableCols(auth, eventId));
            dispatch(updateDialog(false, null));
          }
        }
      })
      .catch(err => {
        console.log(err.response);
        message.error("Something went wrong, please try again", 5);
      });
  } else if (addList.length > 0) {
    axios
      .post("/event/insertCol", { auth, eventId, data: addList })
      .then(tresponse => {
        if (tresponse.status == 200) {
          message.success(
            "Successfully inserted and modified check in columns"
          );
          dispatch(getTableCols(auth, eventId));
          dispatch(updateDialog(false, null));
        }
      })
      .catch(err => {
        console.log(err.response);
        message.error("Something went wrong, please try again", 5);
      });
  } else {
    message.info("No changes needed");
  }
};

export const deleteCol = (auth, eventId, col) => dispatch => {
  axios
    .post("/event/deleteCol", { auth, eventId, data: [col] })
    .then(response => {
      if (response.status == 200) {
        message.success("Successfully deleted column");
        dispatch(getTableCols(auth, eventId));
      }
    })
    .catch(err => {
      console.log(err.response);
      message.error("Something went wrong, please try again", 5);
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
    case GET_COL_TYPES:
      return Object.assign({}, state, { checkinCols: action.cols });
    default:
      return state;
  }
};
export default eventsReducer;
