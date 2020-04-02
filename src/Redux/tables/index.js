import { GET_TABLE_LIST, GET_INDIV_TABLE } from "../action_types";
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

// Initial dialog state
const initialState = {
  tableList: [],
  tableInfo: {
    tableTitle: "",
    tableHeaders: [],
    tableCell: []
  }
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
            tableName: response.data[key][1]
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

const tableListReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_TABLE_LIST:
      return Object.assign({}, state, {
        tableList: action.list
      });
    case GET_INDIV_TABLE:
      return Object.assign({}, state, { tableInfo: action.table });
    default:
      return state;
  }
};

export default tableListReducer;
