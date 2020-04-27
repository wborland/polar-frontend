import {
  GET_TABLE_LIST,
  GET_INDIV_TABLE,
  GET_TABLE_HISTORY,
  GET_ITEM_HISTORY
} from "../action_types";
import axios from "axios";
import { message } from "antd";
import { updateDialog } from "../dialog";

// Action creators
const saveTableList = list => ({
  type: GET_TABLE_LIST,
  list
});

const saveIndivTable = table => ({
  type: GET_INDIV_TABLE,
  table
});

const getHistoryTable = info => ({
  type: GET_TABLE_HISTORY,
  info
});

const getHistoryItem = info => ({
  type: GET_ITEM_HISTORY,
  info
});

// Initial dialog state
const initialState = {
  tableList: [],
  tableInfo: {
    tableTitle: "",
    tableHeaders: [],
    tableCell: []
  },
  itemHistory: null,
  tableHistory: null
};

// Action helpers
export const getTableList = auth => dispatch => {
  axios
    .post("/table/all", { auth: auth })
    .then(response => {
      let tableList = [];
      if (response.data) {
        for (let key in response.data) {
          tableList.push({
            key: response.data[key][0],
            tableName: response.data[key][1],
            tracking: response.data[key][2]
          });
        }
      }
      dispatch(saveTableList(tableList));
    })
    .catch(err => {
      message.error("Something went wrong, please try again", 5);
    });
};

export const getIndivTable = (auth, tableId) => dispatch => {
  axios
    .post("/table/view", { auth, tableId })
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

      dispatch(saveIndivTable({ columns: tempCols, data: tempData }));
    })
    .catch(err => {
      console.log(err.response);
      message.error("Something went wrong, please try again", 5);
    });
};

export const modifyRow = (auth, tableId, contents) => dispatch => {
  let sendArr = Object.values(contents);
  sendArr.pop();

  axios
    .post("/table/modifyEntry", { auth, tableId, contents: sendArr })
    .then(response => {
      if (response.status === 200) {
        message.success("Row saved successfully", 3);
        dispatch(getIndivTable(auth, tableId));
      } else {
        message.error("Saving failed, please try again", 5);
      }
    })
    .catch(err => {
      message.error("Saving failed, please try again", 5);
    });
};

export const deleteRow = (auth, tableId, id) => dispatch => {
  axios
    .post("/table/removeEntry", { auth, tableId, id })
    .then(response => {
      if (response.status === 200) {
        message.success("Row successfully deleted", 3);
        dispatch(getIndivTable(auth, tableId));
      } else {
        message.error("Error removing row, please try again", 5);
      }
    })
    .catch(err => {
      message.error("Error removing row, please try again", 5);
    });
};

export const addRow = (auth, tableId, contents) => dispatch => {
  axios
    .post("/table/addEntry", {
      auth,
      tableId,
      contents: Object.values(contents)
    })
    .then(response => {
      if (response.status === 200) {
        message.success("Row successfully added", 3);
        dispatch(getIndivTable(auth, tableId));
        dispatch(updateDialog(false, null));
      } else {
        message.error("Error adding row, please try again", 5);
      }
    })
    .catch(err => {
      console.log(err.response);
      message.error("Error adding row, please try again", 5);
    });
};

export const trackHistory = (auth, tableId) => dispatch => {
  axios
    .post("/table/track", { auth, tableId })
    .then(response => {
      if (response.status == 200) {
        console.log(response.data);
        message.success("Successfully started tracking");
        dispatch(getTableList(auth));
      } else {
        message.error("Something went wrong, please try again", 5);
      }
    })
    .catch(err => {
      console.log(err.response);
      message.error("Something went wrong, please try again", 5);
    });
};

export const unTrackHistory = (auth, tableId) => dispatch => {
  axios
    .post("/table/untrack", { auth, tableId })
    .then(response => {
      if (response.status == 200) {
        console.log(response.data);
        message.success("Successfully started tracking");
        dispatch(getTableList(auth));
      } else {
        message.error("Something went wrong, please try again", 5);
      }
    })
    .catch(err => {
      console.log(err.response);
      message.error("Something went wrong, please try again", 5);
    });
};

export const getItemHistory = (auth, tableId, id) => dispatch => {
  axios
    .post("/table/itemHistory", { auth, tableId, id })
    .then(response => {
      if (response.status == 200) {
        dispatch(getHistoryItem(response.data));
      }
    })
    .catch(err => {
      console.log(err);
      message.error("Something went wrong, please try again", 5);
    });
};

export const getTableHistory = (auth, tableId) => dispatch => {
  axios
    .post("/table/tableHistory", { auth, tableId })
    .then(response => {
      if (response.status == 200) {
        console.log("Hello");
        dispatch(getHistoryTable(response.data));
      }
    })
    .catch(err => {
      console.log(err);
      message.error("Something went wrong, please try again", 5);
    });
};

export const resetTableHistory = () => dispatch => {
  dispatch(getHistoryTable(null));
};

const modifyItemHistory = (state, info) => {
  let existCols = state.tableInfo.columns;
  let allItems = [];
  for (let i in info) {
    let curr = info[i];
    let obj = {
      polarTime: curr.time
    };
    switch (curr.type) {
      case 0:
        obj["polarType"] = "Table Name Changed";
        break;
      case 1:
        obj["polarType"] = "Entry Added";
        break;
      case 2:
        obj["polarType"] = "Entry Removed";
        break;
      case 3:
        obj["polarType"] = "Entry Modified";
        break;
      case 4:
        obj["polarType"] = "Column Added";
        break;
      case 5:
        obj["polarType"] = "Column Removed";
        break;
      case 6:
        obj["polarType"] = "Column Renamed";
        break;
      default:
        obj["polarType"] = "Error";
        break;
    }
    let arr = JSON.parse(curr.value.replace(/'/g, '"'));
    for (let j in arr) {
      obj[existCols[j].dataIndex] = arr[j];
    }
    if (obj["key"] == null) obj["key"] = i;
    allItems.push(obj);
  }
  return allItems;
};

const tableListReducer = (state = initialState, action) => {
  console.log(action.type);
  switch (action.type) {
    case GET_TABLE_LIST:
      return Object.assign({}, state, {
        tableList: action.list
      });
    case GET_INDIV_TABLE:
      return Object.assign({}, state, { tableInfo: action.table });
    case GET_ITEM_HISTORY:
      return Object.assign({}, state, {
        itemHistory: modifyItemHistory(state, action.info)
      });
    case GET_TABLE_HISTORY:
      console.log("Bye");
      return Object.assign({}, state, { tableHistory: action.info });
    default:
      return state;
  }
};

export default tableListReducer;
